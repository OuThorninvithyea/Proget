const { body, param, query, validationResult } = require("express-validator");

/**
 * Middleware to handle validation errors
 */
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth Validators
exports.validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Please provide a valid phone number"),
  exports.handleValidationErrors,
];

exports.validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  exports.handleValidationErrors,
];

exports.validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  exports.handleValidationErrors,
];

exports.validateResetPassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  exports.handleValidationErrors,
];

// Order Validators
exports.validateCreateOrder = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isMongoId()
    .withMessage("Invalid event ID"),
  body("seatIds")
    .isArray({ min: 1 })
    .withMessage("At least one seat must be selected")
    .custom((value) => {
      if (!value.every((seat) => typeof seat === "string")) {
        throw new Error("All seat IDs must be strings");
      }
      return true;
    }),
  body("paymentMethod.type")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["card", "paypal", "bank_transfer", "cash"])
    .withMessage("Invalid payment method"),
  exports.handleValidationErrors,
];

// Event Validators
exports.validateCreateEvent = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Event name is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Event name must be between 3 and 200 characters"),
  body("artist").trim().notEmpty().withMessage("Artist name is required"),
  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Please provide a valid date in ISO format"),
  body("time").notEmpty().withMessage("Event time is required"),
  body("venue").trim().notEmpty().withMessage("Venue is required"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("image")
    .notEmpty()
    .withMessage("Image URL is required")
    .isURL()
    .withMessage("Please provide a valid image URL"),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn(["concert", "festival", "sports", "theater", "comedy", "other"])
    .withMessage("Invalid category"),
  body("totalSeats")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total seats must be at least 1"),
  exports.handleValidationErrors,
];

exports.validateUpdateEvent = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage("Event name must be between 3 and 200 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("category")
    .optional()
    .isIn(["concert", "festival", "sports", "theater", "comedy", "other"])
    .withMessage("Invalid category"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Please provide a valid date in ISO format"),
  exports.handleValidationErrors,
];

exports.validateBookSeats = [
  body("seatIds")
    .isArray({ min: 1 })
    .withMessage("At least one seat must be selected")
    .custom((value) => {
      if (!value.every((seat) => typeof seat === "string")) {
        throw new Error("All seat IDs must be strings");
      }
      return true;
    }),
  exports.handleValidationErrors,
];

// Listing Validators
exports.validateCreateListing = [
  body("sellerId")
    .notEmpty()
    .withMessage("Seller ID is required")
    .isMongoId()
    .withMessage("Invalid seller ID"),
  body("ticketId")
    .notEmpty()
    .withMessage("Ticket ID is required")
    .isMongoId()
    .withMessage("Invalid ticket ID"),
  body("eventId")
    .notEmpty()
    .withMessage("Event ID is required")
    .isMongoId()
    .withMessage("Invalid event ID"),
  body("listingType")
    .notEmpty()
    .withMessage("Listing type is required")
    .isIn(["sale", "trade", "both"])
    .withMessage("Invalid listing type"),
  body("price")
    .if(body("listingType").isIn(["sale", "both"]))
    .notEmpty()
    .withMessage("Price is required for sale listings")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  exports.handleValidationErrors,
];

exports.validateUpdateListing = [
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("status")
    .optional()
    .isIn(["active", "pending", "sold", "traded", "cancelled", "expired"])
    .withMessage("Invalid status"),
  exports.handleValidationErrors,
];

// Ticket Validators
exports.validateTransferTicket = [
  body("transferredTo")
    .notEmpty()
    .withMessage("Recipient user ID is required")
    .isMongoId()
    .withMessage("Invalid recipient user ID"),
  exports.handleValidationErrors,
];

// User Validators
exports.validateUpdateUser = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("phone")
    .optional()
    .trim()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage("Please provide a valid phone number"),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters"),
  exports.handleValidationErrors,
];

exports.validateUpdateSettings = [
  body("language")
    .optional()
    .isIn(["en", "km"])
    .withMessage("Invalid language"),
  body("theme")
    .optional()
    .isIn(["light", "dark", "system"])
    .withMessage("Invalid theme"),
  exports.handleValidationErrors,
];

// Param Validators
exports.validateMongoId = [
  param("id").isMongoId().withMessage("Invalid ID format"),
  exports.handleValidationErrors,
];

// Query Validators
exports.validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  exports.handleValidationErrors,
];
