class NotificationService {
  sendNotification(user, message) {
    console.log(`Sending notification to ${user.email}: ${message}`);
  }
}

module.exports = new NotificationService();
