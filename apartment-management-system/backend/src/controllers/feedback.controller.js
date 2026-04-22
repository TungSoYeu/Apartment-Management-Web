const feedbackService = require('../services/feedback.service');

const createFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.createFeedback({
      ...req.body,
      user: req.user.id, 
    });
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedback(req.user.id, req.user.role);
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.deleteFeedback(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.updateFeedback(req.params.id, req.body);
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedback,
  deleteFeedback,
  updateFeedback,
};
