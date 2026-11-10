const express = require('express');
const router = express.Router();
const messageDraftController = require('../controllers/messageDraftController');

router.post('/:id/generate', messageDraftController.generateMessage);
router.get('/:id', messageDraftController.getDraftByPatientId);
router.put('/:id', messageDraftController.updateDraft);
router.post('/:id/approve', messageDraftController.approveDraft);
router.post('/:id/reject', messageDraftController.rejectDraft);

module.exports = router;
