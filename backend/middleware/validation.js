const validatePatient = (req, res, next) => {
  const { name, phone, consultation_date, follow_up_date } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Patient name is required'
    });
  }

  if (!phone || phone.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Phone number is required'
    });
  }

  if (!consultation_date || consultation_date.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Consultation date is required'
    });
  }

  if (!follow_up_date || follow_up_date.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Follow-up date is required'
    });
  }

  next();
};

module.exports = { validatePatient };
