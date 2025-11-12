const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");
const {
  validateCreateEvent,
  validateUpdateEvent,
  validateBookSeats,
  validateMongoId,
  validatePagination,
} = require("../middleware/validators");

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get("/", validatePagination, async (req, res) => {
  try {
    const {
      status,
      category,
      search,
      featured,
      page = 1,
      limit = 20,
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (status) query.status = status;
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { artist: { $regex: search, $options: "i" } },
        { venue: { $regex: search, $options: "i" } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Event.countDocuments(query);

    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching events",
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get("/:id", validateMongoId, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isActive) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching event",
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin)
router.post(
  "/",
  protect,
  authorize("admin"),
  validateCreateEvent,
  async (req, res) => {
    try {
      const event = await Event.create(req.body);

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error creating event",
      });
    }
  }
);

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin)
router.put(
  "/:id",
  protect,
  authorize("admin"),
  validateMongoId,
  validateUpdateEvent,
  async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating event",
      });
    }
  }
);

// @route   DELETE /api/events/:id
// @desc    Delete event (soft delete)
// @access  Private (Admin)
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  validateMongoId,
  async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting event",
      });
    }
  }
);

// @route   POST /api/events/:id/book-seats
// @desc    Book seats for an event
// @access  Private
router.post("/:id/book-seats", async (req, res) => {
  try {
    const { seatIds } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if seats are available
    const unavailableSeats = seatIds.filter((seat) =>
      event.takenSeats.includes(seat)
    );
    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already taken",
        unavailableSeats,
      });
    }

    // Add seats to taken seats
    event.takenSeats.push(...seatIds);
    event.availableSeats -= seatIds.length;
    await event.save();

    res.status(200).json({
      success: true,
      message: "Seats booked successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
