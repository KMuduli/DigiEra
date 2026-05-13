// DigitalEra - Tag Routes
const express = require('express');
const router = express.Router();
const { getTags, createTag, deleteTag } = require('../controllers/tag.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { tagSchema } = require('../utils/schemas');

/**
 * @swagger
 * /api/tags:
 *   get:
 *     summary: Get all tags
 *     tags: [Tags]
 *     responses:
 *       200: { description: Tags list }
 */
router.get('/', getTags);

router.post('/', authenticate, validate(tagSchema), createTag);
router.delete('/:id', authenticate, deleteTag);

module.exports = router;
