import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Check, X, Edit, User, Calendar, Phone, Clock } from 'lucide-react';
import { patientAPI, messageDraftAPI } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

const AIAutomation = () => {
  const { addToast } = useToastContext();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getDueToday();
      if (response.data.success) {
        setPatients(response.data.data);
        // Fetch drafts for each patient
        response.data.data.forEach(patient => {
          fetchDraft(patient.id);
        });
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      addToast('Failed to load patients due today', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDraft = async (patientId) => {
    try {
      const response = await messageDraftAPI.getByPatientId(patientId);
      if (response.data.success) {
        setDrafts(prev => ({
          ...prev,
          [patientId]: response.data.data
        }));
      }
    } catch (error) {
      console.error('Error fetching draft:', error);
    }
  };

  const handleGenerate = async (patientId) => {
    try {
      setGenerating(patientId);
      const response = await messageDraftAPI.generate(patientId);
      if (response.data.success) {
        setDrafts(prev => ({
          ...prev,
          [patientId]: response.data.data
        }));
        addToast('AI message generated successfully', 'success');
      }
    } catch (error) {
      console.error('Error generating message:', error);
      addToast('Failed to generate AI message', 'error');
    } finally {
      setGenerating(null);
    }
  };

  const handleRegenerate = async (patientId) => {
    await handleGenerate(patientId);
  };

  const handleUpdateMessage = async (patientId, message) => {
    try {
      await messageDraftAPI.update(patientId, { message });
      setDrafts(prev => ({
        ...prev,
        [patientId]: { ...prev[patientId], message }
      }));
      setEditingMessage(null);
      addToast('Message updated successfully', 'success');
    } catch (error) {
      console.error('Error updating message:', error);
      addToast('Failed to update message', 'error');
    }
  };

  const handleApprove = async (patientId) => {
    try {
      await messageDraftAPI.approve(patientId);
      setDrafts(prev => ({
        ...prev,
        [patientId]: { ...prev[patientId], status: 'Approved' }
      }));
      addToast('Draft approved successfully', 'success');
    } catch (error) {
      console.error('Error approving draft:', error);
      addToast('Failed to approve draft', 'error');
    }
  };

  const handleReject = async (patientId) => {
    try {
      await messageDraftAPI.reject(patientId);
      setDrafts(prev => ({
        ...prev,
        [patientId]: { ...prev[patientId], status: 'Rejected' }
      }));
      addToast('Draft rejected', 'info');
    } catch (error) {
      console.error('Error rejecting draft:', error);
      addToast('Failed to reject draft', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Not Generated': 'bg-gray-100 text-gray-700',
      'Generated': 'bg-blue-100 text-blue-700',
      'Approved': 'bg-green-100 text-green-700',
      'Rejected': 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Follow-up Automation</h1>
        <p className="text-gray-500 mt-1">Generate and manage AI-powered follow-up messages for patients due today</p>
      </div>

      {patients.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
          <Sparkles className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patients Due Today</h3>
          <p className="text-gray-500 mb-6">There are no patients with pending follow-ups scheduled for today.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {patients.map((patient) => {
            const draft = drafts[patient.id];
            const isEditing = editingMessage === patient.id;

            return (
              <div key={patient.id} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {/* Patient Info */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-teal-50 rounded-lg">
                        <User className="text-teal-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">Patient ID: #{patient.id}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(draft?.status || 'Not Generated')}`}>
                      {draft?.status || 'Not Generated'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={16} />
                      {patient.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      Consultation: {formatDate(patient.consultation_date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      Follow-up: {formatDate(patient.follow_up_date)}
                    </div>
                  </div>
                </div>

                {/* Message Section */}
                <div className="p-6 bg-gray-50">
                  {!draft || !draft.message ? (
                    <div className="text-center">
                      <button
                        onClick={() => handleGenerate(patient.id)}
                        disabled={generating === patient.id}
                        className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generating === patient.id ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles size={20} />
                            Generate AI Message
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Generated Message</h4>
                        <button
                          onClick={() => handleRegenerate(patient.id)}
                          disabled={generating === patient.id}
                          className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 disabled:opacity-50"
                        >
                          <RefreshCw size={16} className={generating === patient.id ? 'animate-spin' : ''} />
                          Regenerate
                        </button>
                      </div>

                      {isEditing ? (
                        <div className="space-y-3">
                          <textarea
                            value={draft.message}
                            onChange={(e) => {
                              setDrafts(prev => ({
                                ...prev,
                                [patient.id]: { ...prev[patient.id], message: e.target.value }
                              }));
                            }}
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateMessage(patient.id, drafts[patient.id].message)}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => setEditingMessage(null)}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <p className="text-gray-700 whitespace-pre-wrap">{draft.message}</p>
                          </div>
                          <button
                            onClick={() => setEditingMessage(patient.id)}
                            className="absolute top-2 right-2 p-2 text-gray-400 hover:text-teal-600 transition-colors"
                            title="Edit message"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {draft.status !== 'Approved' && draft.status !== 'Rejected' && (
                        <div className="flex gap-3 pt-2">
                          <button
                            onClick={() => handleApprove(patient.id)}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <Check size={20} />
                            Approve Draft
                          </button>
                          <button
                            onClick={() => handleReject(patient.id)}
                            className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                          >
                            <X size={20} />
                            Reject Draft
                          </button>
                        </div>
                      )}

                      {draft.status === 'Approved' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                          <p className="text-green-700 font-medium">✓ This draft has been approved by staff</p>
                        </div>
                      )}

                      {draft.status === 'Rejected' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-700 font-medium">✗ This draft has been rejected</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AIAutomation;
