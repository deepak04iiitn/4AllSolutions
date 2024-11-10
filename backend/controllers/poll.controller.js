import Poll from '../models/poll.model.js';

export const createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = new Poll({
      user: req.user.id,
      question,
      options
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Error creating poll' });
  }
};

export const getPublicPolls = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls' });
  }
};

export const getMyPolls = async (req, res) => {
  try {
    const polls = await Poll.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your polls' });
  }
};

export const deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    if (poll.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this poll' });
    }
    await poll.deleteOne();
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting poll' });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { option } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    const existingVote = poll.votes.find(vote => vote.user.toString() === req.user.id);
    if (existingVote) {
      existingVote.option = option;
    } else {
      poll.votes.push({ user: req.user.id, option });
    }
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: 'Error voting on poll' });
  }
};