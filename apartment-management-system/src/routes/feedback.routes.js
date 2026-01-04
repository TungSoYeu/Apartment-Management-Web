const express = require('express');
const feedbackController = require('../controllers/feedback.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware.protect, feedbackController.createFeedback);
router.get('/', authMiddleware.protect, feedbackController.getFeedback);
router.delete('/:id', authMiddleware.protect, authMiddleware.authorize('ADMIN'), feedbackController.deleteFeedback);
router.put('/:id', authMiddleware.protect, feedbackController.updateFeedback);

module.exports = router;
