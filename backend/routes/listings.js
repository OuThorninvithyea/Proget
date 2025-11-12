const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Listing = require("../models/Listing");
const Ticket = require("../models/Ticket");
const { protect, checkOwnership } = require("../middleware/auth");
const {
  validateCreateListing,
  validateUpdateListing,
  validateMongoId,
  validatePagination,
} = require("../middleware/validators");

// @route   GET /api/listings
// @desc    Get all listings
// @access  Public
router.get("/", validatePagination, async (req, res) => {
  try {
    const {
      status,
      listingType,
      eventId,
      sellerId,
      page = 1,
      limit = 10,
    } = req.query;

    // Build query
    let query = {};
    if (status) query.status = status;
    else query.status = "active"; // Default to active listings
    if (listingType) query.listingType = listingType;
    if (eventId) query.eventId = eventId;
    if (sellerId) query.sellerId = sellerId;

    // Remove expired listings
    query.expiresAt = { $gt: new Date() };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
      .populate("sellerId", "name avatar")
      .populate("eventId", "name artist date venue image")
      .populate("ticketId", "seatIds quantity")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: listings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching listings",
    });
  }
});

// @route   GET /api/listings/:id
// @desc    Get single listing
// @access  Public
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("sellerId", "name email phone avatar")
      .populate("eventId")
      .populate("ticketId")
      .populate(
        "tradePreferences.preferredEvents",
        "name artist date venue image"
      );

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check if listing is expired
    if (listing.expiresAt < new Date() && listing.status === "active") {
      listing.status = "expired";
      await listing.save();
    }

    // Increment views (not for the seller viewing their own listing)
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching listing",
    });
  }
});

// @route   POST /api/listings
// @desc    Create new listing
// @access  Private
router.post("/", protect, validateCreateListing, async (req, res) => {
  try {
    const { sellerId, ticketId } = req.body;

    // Verify user is creating listing for themselves
    if (sellerId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Cannot create listing for another user",
      });
    }

    // Verify ticket exists and belongs to user
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    if (ticket.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You do not own this ticket",
      });
    }

    if (ticket.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Only active tickets can be listed",
      });
    }

    // Check if ticket is already listed
    const existingListing = await Listing.findOne({
      ticketId,
      status: { $in: ["active", "pending"] },
    });
    if (existingListing) {
      return res.status(400).json({
        success: false,
        message: "This ticket is already listed",
      });
    }

    const listing = await Listing.create(req.body);

    await listing.populate([
      { path: "sellerId", select: "name avatar" },
      { path: "eventId", select: "name artist date venue image" },
      { path: "ticketId", select: "seatIds quantity" },
    ]);

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating listing",
    });
  }
});

// @route   PUT /api/listings/:id
// @desc    Update listing
// @access  Private
router.put(
  "/:id",
  protect,
  validateMongoId,
  validateUpdateListing,
  async (req, res) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }

      // Check ownership
      if (listing.sellerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this listing",
        });
      }

      // Update listing
      Object.assign(listing, req.body);
      await listing.save();

      await listing.populate([
        { path: "sellerId", select: "name avatar" },
        { path: "eventId", select: "name artist date venue image" },
        { path: "ticketId", select: "seatIds quantity" },
      ]);

      res.status(200).json({
        success: true,
        message: "Listing updated successfully",
        data: listing,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating listing",
      });
    }
  }
);

// @route   DELETE /api/listings/:id
// @desc    Delete listing (cancel)
// @access  Private
router.delete("/:id", protect, validateMongoId, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Check ownership
    if (listing.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this listing",
      });
    }

    listing.status = "cancelled";
    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cancelling listing",
    });
  }
});

// @route   POST /api/listings/:id/purchase
// @desc    Purchase a listing and transfer ticket ownership
// @access  Private
router.post("/:id/purchase", protect, validateMongoId, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const buyerId = req.user._id;

    const listing = await Listing.findById(req.params.id)
      .populate("ticketId")
      .session(session);

    if (!listing) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    // Cannot buy your own listing
    if (listing.sellerId.toString() === buyerId.toString()) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cannot purchase your own listing",
      });
    }

    if (listing.status !== "active") {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Listing is not available",
      });
    }

    // Check if listing is expired
    if (listing.expiresAt < new Date()) {
      listing.status = "expired";
      await listing.save({ session });
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Listing has expired",
      });
    }

    // TODO: Process payment here with payment gateway
    // For now, we'll assume payment is successful

    // Get the ticket
    const ticket = await Ticket.findById(listing.ticketId).session(session);
    if (!ticket) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    // Transfer ticket ownership
    ticket.userId = buyerId;
    ticket.transferredTo = buyerId;
    ticket.transferredAt = new Date();
    ticket.transferStatus = "completed";
    await ticket.save({ session });

    // Update listing status
    listing.status = "sold";
    listing.soldTo = buyerId;
    listing.soldAt = new Date();
    await listing.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Purchase successful - ticket ownership transferred",
      data: {
        listing,
        ticket,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "Error processing purchase",
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
