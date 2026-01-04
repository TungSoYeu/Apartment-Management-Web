const express = require('express');
const notificationController = require('../controllers/notification.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', authMiddleware.protect, authMiddleware.authorize('ADMIN'), notificationController.createNotification);
router.get('/', authMiddleware.protect, notificationController.getNotifications);

router.delete('/:id', authMiddleware.protect, authMiddleware.authorize('ADMIN'), notificationController.deleteNotification);

module.exports = router;
