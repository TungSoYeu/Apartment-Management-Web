const Feedback = require('../models/Feedback');

const createFeedback = async (feedbackBody) => {
  const feedback = await Feedback.create(feedbackBody);
  return feedback;
};

const getFeedback = async (userId, role) => {
  let feedback;
  if (role === 'ADMIN') {
    feedback = await Feedback.find().populate('user', 'fullname email');
  } else {
    feedback = await Feedback.find({ user: userId }).populate('user', 'fullname email');
  }
  return feedback;
};

const deleteFeedback = async (id) => {
  const feedback = await Feedback.findByIdAndDelete(id);
  return feedback;
};

const updateFeedback = async (id, feedbackBody) => {
  const feedback = await Feedback.findByIdAndUpdate(id, feedbackBody, { new: true });
  return feedback;
};

module.exports = {
  createFeedback,
  getFeedback,
  deleteFeedback,
  updateFeedback,
};