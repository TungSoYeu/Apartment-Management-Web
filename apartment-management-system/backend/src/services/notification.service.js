const Notification = require('../models/Notification');

const createNotification = async (notificationBody) => {
  const notification = await Notification.create(notificationBody);
  return notification;
};

const getNotifications = async () => {
  const notifications = await Notification.find();
  return notifications;
};

const deleteNotification = async (id) => {
  const notification = await Notification.findByIdAndDelete(id);
  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  deleteNotification,
};