const express = require('express');
const router = express.Router();
const { getPageBySlug, getAllPages, upsertPage } = require('../controllers/page.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/', getPageBySlug); // This will map to get all if we change logic
// Actually let's do:
router.get('/all', getAllPages);
router.get('/:slug', getPageBySlug);
router.put('/:slug', authenticate, authorize('ADMIN'), upsertPage);

module.exports = router;
