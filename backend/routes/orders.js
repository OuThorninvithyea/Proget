const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const { protect, checkOwnership } = require("../middleware/auth");
const {
  validateCreateOrder,
  validateMongoId,
  validatePagination,
} = require("../middleware/validators");

// @route   GET /api/orders
// @desc    Get all orders (with filters)
// @access  Private
router.get("/", protect, validatePagination, async (req, res) => {
  try {
    const { userId, status, page = 1, limit = 10 } = req.query;

    // Build query - users can only see their own orders unless admin
    let query = {};
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    } else if (userId) {
      query.userId = userId;
    }
    if (status) query.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate("eventId", "name artist date venue image")
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get("/:id", protect, validateMongoId, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("eventId")
      .populate("userId", "name email phone");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns this order or is admin
    if (
      order.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order",
    });
  }
});

// @route   POST /api/orders
// @desc    Create new order and ticket
// @access  Private
router.post("/", protect, validateCreateOrder, async (req, res) => {
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, eventId, seatIds, paymentMethod } = req.body;

    // Verify user is creating order for themselves
    if (userId !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Cannot create order for another user",
      });
    }

    // Get event with session lock to prevent race conditions
    const event = await Event.findById(eventId).session(session);
    if (!event) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check seat availability
    const unavailableSeats = seatIds.filter((seat) =>
      event.takenSeats.includes(seat)
    );
    if (unavailableSeats.length > 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Some seats are already taken",
        unavailableSeats,
      });
    }

    // Check if enough seats available
    if (event.availableSeats < seatIds.length) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
      });
    }

    // Calculate totals
    const quantity = seatIds.length;
    const subtotal = event.price * quantity;
    const serviceFee = subtotal * 0.05; // 5% service fee
    const processingFee = 2.5; // Fixed processing fee
    const total = subtotal + serviceFee + processingFee;

    // TODO: Integrate with payment gateway here
    // For now, we'll set to pending and require payment confirmation
    const paymentStatus = "pending"; // Should be 'pending' until payment verified

    // Create order within transaction
    const [order] = await Order.create(
      [
        {
          userId,
          eventId,
          seatIds,
          quantity,
          subtotal,
          fees: {
            serviceFee,
            processingFee,
          },
          total,
          paymentMethod,
          paymentStatus,
          status: paymentStatus === "completed" ? "confirmed" : "pending",
          paidAt: paymentStatus === "completed" ? new Date() : undefined,
        },
      ],
      { session }
    );

    // Create ticket within transaction
    const [ticket] = await Ticket.create(
      [
        {
          userId,
          eventId,
          orderId: order._id,
          seatIds,
          quantity,
          price: event.price,
          total,
          purchasedAt: new Date(),
        },
      ],
      { session }
    );

    // Update event seats atomically
    event.takenSeats.push(...seatIds);
    event.availableSeats -= quantity;
    await event.save({ session });

    // Commit the transaction
    await session.commitTransaction();

    // Populate order with event data
    await order.populate("eventId", "name artist date venue image");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
        ticket,
      },
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error creating order",
    });
  } finally {
    // End session
    session.endSession();
  }
});

// @route   PUT /api/orders/:id/cancel
// @desc    Cancel order and process refund
// @access  Private
router.put("/:id/cancel", protect, validateMongoId, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(req.params.id).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check ownership
    if (
      order.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      await session.abortTransaction();
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this order",
      });
    }

    if (order.status === "cancelled" || order.status === "refunded") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Order already cancelled or refunded",
      });
    }

    // Process refund if order was paid
    if (order.paymentStatus === "completed") {
      // TODO: Integrate with payment gateway to process refund
      order.paymentStatus = "refunded";
      order.refundedAt = new Date();
      order.status = "refunded";
    } else {
      order.status = "cancelled";
    }

    await order.save({ session });

    // Update ticket status
    await Ticket.updateOne(
      { orderId: order._id },
      { status: "cancelled" },
      { session }
    );

    // Release seats
    const event = await Event.findById(order.eventId).session(session);
    if (event) {
      event.takenSeats = event.takenSeats.filter(
        (seat) => !order.seatIds.includes(seat)
      );
      event.availableSeats += order.quantity;
      await event.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message:
        order.status === "refunded"
          ? "Order cancelled and refund processed"
          : "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
