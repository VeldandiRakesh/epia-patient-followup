const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { validatePatient } = require('../middleware/validation');

router.get('/stats', patientController.getDashboardStats);
router.get('/due-today', patientController.getPatientsDueToday);
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', validatePatient, patientController.addPatient);
router.put('/:id', validatePatient, patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);
router.patch('/:id/complete', patientController.completeFollowUp);

module.exports = router;
