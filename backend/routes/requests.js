const express = require('express');
const router = express.Router();
const Request = require('../models/Request');

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});   //retrieves requests from mongodb, returns as json

router.post('/', async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    res.status(201).json(request);
  } catch {
    res.status(400).json({ message: 'Bad request' });
  }
});   //accepts new request data in req body, saves to database, and returns saved request

router.put('/:id/accept', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const newStatus = request.status === 'accepted' ? 'pending' : 'accepted';

    const updated = await Request.findByIdAndUpdate(
      req.params.id,
      { status: newStatus },
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});   //toggles request status between 'pending' and 'accepted'

router.delete('/all', async (req, res) => {
  try {
    await Request.deleteMany({});
    res.json({ message: 'All deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});   //deletes all requests from database

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Request.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Request not found' });
    }
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});   //deletes specific request by id

module.exports = router;
