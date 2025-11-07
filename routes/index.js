const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getProtectedData } = require("../controllers/authController");
const {
  createThread,
  sendMessage,
  streamResponse,
} = require("../controllers/threadController");
const {
  createAssistant,
  listAssistants,
} = require("../controllers/assistantController");

// Auth routes
router.get("/api/protected", authMiddleware, getProtectedData);

// Thread routes
router.post("/api/createthread", authMiddleware, createThread);
router.post("/api/sendmessage", authMiddleware, sendMessage);
router.get("/api/stream", authMiddleware, streamResponse);

// Assistant routes
router.post("/api/createassistant", authMiddleware, createAssistant);
router.get("/api/listassistants", listAssistants);

module.exports = router;
