const db = require('../config/database');
const { generateAIMessage } = require('../services/aiService');

// Generate AI message for a patient
const generateMessage = async (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  // Get patient details
  db.get('SELECT * FROM patients WHERE id = ?', [id], async (err, patient) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving patient',
        error: err.message
      });
    }

    if (!patient) {
      const error = new Error('Patient not found');
      return next(error);
    }

    try {
      // Generate AI message
      const message = await generateAIMessage(patient);

      // Check if draft already exists
      db.get('SELECT * FROM message_drafts WHERE patient_id = ?', [id], (err, existingDraft) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error checking existing draft',
            error: err.message
          });
        }

        if (existingDraft) {
          // Update existing draft
          const updateQuery = `
            UPDATE message_drafts
            SET message = ?, status = 'Generated', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `;

          db.run(updateQuery, [message, existingDraft.id], function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Error updating draft',
                error: err.message
              });
            }

            res.json({
              success: true,
              message: 'AI message generated successfully',
              data: {
                id: existingDraft.id,
                patient_id: id,
                message,
                status: 'Generated'
              }
            });
          });
        } else {
          // Create new draft
          const insertQuery = `
            INSERT INTO message_drafts (patient_id, message, status)
            VALUES (?, ?, 'Generated')
          `;

          db.run(insertQuery, [id, message], function(err) {
            if (err) {
              return res.status(500).json({
                success: false,
                message: 'Error creating draft',
                error: err.message
              });
            }

            res.json({
              success: true,
              message: 'AI message generated successfully',
              data: {
                id: this.lastID,
                patient_id: id,
                message,
                status: 'Generated'
              }
            });
          });
        }
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error generating AI message',
        error: error.message
      });
    }
  });
};

// Get draft by patient ID
const getDraftByPatientId = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  db.get('SELECT * FROM message_drafts WHERE patient_id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving draft',
        error: err.message
      });
    }

    if (!row) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: row
    });
  });
};

// Update draft message
const updateDraft = (req, res, next) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  const query = `
    UPDATE message_drafts
    SET message = ?, updated_at = CURRENT_TIMESTAMP
    WHERE patient_id = ?
  `;

  db.run(query, [message, id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error updating draft',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.json({
        success: true,
        message: 'No draft found to update'
      });
    }

    res.json({
      success: true,
      message: 'Draft updated successfully'
    });
  });
};

// Approve draft
const approveDraft = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  const query = `
    UPDATE message_drafts
    SET status = 'Approved', updated_at = CURRENT_TIMESTAMP
    WHERE patient_id = ?
  `;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error approving draft',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.json({
        success: true,
        message: 'No draft found to approve'
      });
    }

    res.json({
      success: true,
      message: 'Draft approved successfully'
    });
  });
};

// Reject draft
const rejectDraft = (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid patient ID');
    return next(error);
  }

  const query = `
    UPDATE message_drafts
    SET status = 'Rejected', updated_at = CURRENT_TIMESTAMP
    WHERE patient_id = ?
  `;

  db.run(query, [id], function(err) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error rejecting draft',
        error: err.message
      });
    }

    if (this.changes === 0) {
      return res.json({
        success: true,
        message: 'No draft found to reject'
      });
    }

    res.json({
      success: true,
      message: 'Draft rejected successfully'
    });
  });
};

module.exports = {
  generateMessage,
  getDraftByPatientId,
  updateDraft,
  approveDraft,
  rejectDraft
};
