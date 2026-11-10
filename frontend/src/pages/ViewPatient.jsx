import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calendar, Phone, User, CheckCircle, Clock } from 'lucide-react';
import { patientAPI } from '../services/api';
import { useToastContext } from '../contexts/ToastContext';

const ViewPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToastContext();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const response = await patientAPI.getById(id);
      if (response.data.success) {
        setPatient(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patient:', error);
      addToast('Failed to load patient details', 'error');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteFollowUp = async () => {
    try {
      await patientAPI.completeFollowUp(id);
      setPatient({ ...patient, status: 'Completed' });
      addToast('Follow-up completed successfully', 'success');
    } catch (error) {
      console.error('Error completing follow-up:', error);
      addToast('Failed to complete follow-up', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Patient not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          to="/patients"
          className="inline-flex items-center text-gray-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Patients
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-primary-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{patient.name}</h1>
              <p className="text-teal-100 mt-1">Patient ID: #{patient.id}</p>
            </div>
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                patient.status === 'Completed'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              {patient.status === 'Completed' ? (
                <CheckCircle size={18} />
              ) : (
                <Clock size={18} />
              )}
              {patient.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <User className="text-teal-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="text-lg font-semibold text-gray-900">{patient.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Phone className="text-teal-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Calendar className="text-teal-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Consultation Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(patient.consultation_date)}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Calendar className="text-teal-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Follow-up Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(patient.follow_up_date)}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-500">Registered On</p>
            <p className="text-gray-900">{formatDate(patient.created_at)}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              to={`/patients/${patient.id}/edit`}
              className="flex-1 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={20} />
              Edit Patient
            </Link>
            {patient.status === 'Pending' && (
              <button
                onClick={handleCompleteFollowUp}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                Complete Follow-up
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
