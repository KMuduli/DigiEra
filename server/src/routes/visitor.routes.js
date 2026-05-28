const express = require('express');
const router = express.Router();
const { getVisitors, getVisitorStats } = require('../controllers/visitor.controller');
const { authenticate, authorize } = require('../middleware/auth');

// All visitor routes are admin only
router.use(authenticate, authorize('ADMIN'));

router.get('/', getVisitors);
router.get('/stats', getVisitorStats);

module.exports = router;
