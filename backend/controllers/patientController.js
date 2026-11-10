const db = require('../config/database');

// Get all patients
const getAllPatients = (req, res) => {
  const { search, status } = req.query;
  let query = 'SELECT * FROM patients ORDER BY created_at DESC';
  let params = [];

  if (search) {
    query = 'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ? ORDER BY created_at DESC';
    params = [`%${search}%`, `%${search}%`];
  }

  if (status) {
    query = 'SELECT * FROM patients WHERE status = ? ORDER BY created_at DESC';
    params = [status];
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving patients',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
};

// Get patient by ID
const getPatientById = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving patient',
        error: err.message
      });
    }

    if (!row) {
      const error = new Error('Patient not found');
      return next(error);
    }

    res.json({
      success: true,
      data: row
    });
  });
};

// Add new patient
const addPatient = (req, res) => {
  const { name, phone, consultation_date, follow_up_date } = req.body;

  const query = `
    INSERT INTO patients (name, phone, consultation_date, follow_up_date, status)
    VALUES (?, ?, ?, ?, 'Pending')
  `;

  db.run(query, [name, phone, consultation_date, follow_up_date], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error adding patient',
        error: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Patient added successfully',
      data: {
        id: this.lastID,
        name,
        phone,
        consultation_date,
        follow_up_date,
        status: 'Pending'
      }
    });
  });
};

// Update patient
const updatePatient = (req, res, next) => {
  const { id } = req.params;
  const { name, phone, consultation_date, follow_up_date, status } = req.body;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  const query = `
    UPDATE patients
    SET name = ?, phone = ?, consultation_date = ?, follow_up_date = ?, status = ?
    WHERE id = ?
  `;

  db.run(query, [name, phone, consultation_date, follow_up_date, status, id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating patient',
        error: err.message
      });
    }

    if (this.changes === 0) {
      const error = new Error('Patient not found');
      return next(error);
    }

    res.json({
      success: true,
      message: 'Patient updated successfully'
    });
  });
};

// Delete patient
const deletePatient = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  db.run('DELETE FROM patients WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting patient',
        error: err.message
      });
    }

    if (this.changes === 0) {
      const error = new Error('Patient not found');
      return next(error);
    }

    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  });
};

// Complete follow-up
const completeFollowUp = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  db.run('UPDATE patients SET status = ? WHERE id = ?', ['Completed', id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error completing follow-up',
        error: err.message
      });
    }

    if (this.changes === 0) {
      const error = new Error('Patient not found');
      return next(error);
    }

    res.json({
      success: true,
      message: 'Follow-up completed successfully'
    });
  });
};

// Get patients due today
const getPatientsDueToday = (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const query = `
    SELECT * FROM patients
    WHERE follow_up_date = ? AND status = 'Pending'
    ORDER BY follow_up_date ASC
  `;

  db.all(query, [today], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving patients due today',
        error: err.message
      });
    }

    res.json({
      success: true,
      data: rows
    });
  });
};

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  const today = new Date().toISOString().split('T')[0];

  const queries = {
    totalPatients: 'SELECT COUNT(*) as count FROM patients',
    dueToday: `SELECT COUNT(*) as count FROM patients WHERE follow_up_date = '${today}' AND status = 'Pending'`,
    completed: "SELECT COUNT(*) as count FROM patients WHERE status = 'Completed'",
    pending: "SELECT COUNT(*) as count FROM patients WHERE status = 'Pending'",
    upcoming: `SELECT COUNT(*) as count FROM patients WHERE follow_up_date > '${today}' AND status = 'Pending'`
  };

  const stats = {};

  db.get(queries.totalPatients, [], (err, row) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    stats.totalPatients = row.count;

    db.get(queries.dueToday, [], (err, row) => {
      if (err) return res.status(500).json({ success: false, error: err.message });
      stats.dueToday = row.count;

      db.get(queries.completed, [], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        stats.completed = row.count;

        db.get(queries.pending, [], (err, row) => {
          if (err) return res.status(500).json({ success: false, error: err.message });
          stats.pending = row.count;

          db.get(queries.upcoming, [], (err, row) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            stats.upcoming = row.count;

            res.json({
              success: true,
              data: stats
            });
          });
        });
      });
    });
  });
};

module.exports = {
  getAllPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
  completeFollowUp,
  getPatientsDueToday,
  getDashboardStats
};
