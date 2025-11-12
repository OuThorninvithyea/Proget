const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const { protect } = require("../middleware/auth");
const {
  validateTransferTicket,
  validateMongoId,
  validatePagination,
} = require("../middleware/validators");

// @route   GET /api/tickets
// @desc    Get all tickets (with filters)
// @access  Private
router.get("/", protect, validatePagination, async (req, res) => {
  try {
    const { userId, eventId, status, page = 1, limit = 10 } = req.query;

    // Build query - users can only see their own tickets unless admin
    let query = {};
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    } else if (userId) {
      query.userId = userId;
    }
    if (eventId) query.eventId = eventId;
    if (status) query.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Ticket.countDocuments(query);

    const tickets = await Ticket.find(query)
      .populate("eventId", "name artist date venue image")
      .populate("userId", "name email")
      .sort({ purchasedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: tickets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tickets",
    });
  }
});

// @route   GET /api/tickets/:id
// @desc    Get single ticket
// @access  Private
router.get("/:id", protect, validateMongoId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("eventId", "name artist date venue image price")
      .populate("userId", "name email phone")
      .populate("orderId");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Check ownership
    if (
      ticket.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this ticket",
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching ticket",
    });
  }
});

// @route   POST /api/tickets
// @desc    Create new ticket (after successful order) - Internal use only
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    // This route should typically only be called internally by the order creation
    // or by admins
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized - tickets are created through orders",
      });
    }

    const ticket = await Ticket.create(req.body);

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating ticket",
    });
  }
});

// @route   PUT /api/tickets/:id/transfer
// @desc    Transfer ticket to another user
// @access  Private
router.put(
  "/:id/transfer",
  protect,
  validateMongoId,
  validateTransferTicket,
  async (req, res) => {
    try {
      const { transferredTo } = req.body;

      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({
          success: false,
          message: "Ticket not found",
        });
      }

      // Check ownership
      if (ticket.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to transfer this ticket",
        });
      }

      // Cannot transfer to yourself
      if (transferredTo === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: "Cannot transfer ticket to yourself",
        });
      }

      if (ticket.status !== "active") {
        return res.status(400).json({
          success: false,
          message: "Only active tickets can be transferred",
        });
      }

      // Update ticket ownership
      ticket.userId = transferredTo;
      ticket.transferredTo = transferredTo;
      ticket.transferredAt = new Date();
      ticket.transferStatus = "completed";
      await ticket.save();

      res.status(200).json({
        success: true,
        message: "Ticket transferred successfully",
        data: ticket,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error transferring ticket",
      });
    }
  }
);

// @route   PUT /api/tickets/:id/use
// @desc    Mark ticket as used (typically by venue staff or admin)
// @access  Private
router.put("/:id/use", protect, validateMongoId, async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Only owner or admin can mark as used
    if (
      ticket.userId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to use this ticket",
      });
    }

    if (ticket.status === "used") {
      return res.status(400).json({
        success: false,
        message: "Ticket already used",
      });
    }

    if (ticket.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Only active tickets can be used",
      });
    }

    ticket.status = "used";
    ticket.usedAt = new Date();
    await ticket.save();

    res.status(200).json({
      success: true,
      message: "Ticket marked as used",
      data: ticket,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error using ticket",
    });
  }
});

module.exports = router;
