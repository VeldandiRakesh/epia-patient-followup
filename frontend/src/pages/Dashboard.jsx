import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { patientAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useToastContext } from '../contexts/ToastContext';

const StatCard = ({ icon: Icon, label, value, color, link }) => {
  const Card = link ? Link : 'div';
  const props = link ? { to: link } : {};

  return (
    <Card
      {...props}
      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
      {link && (
        <div className="mt-4 flex items-center text-sm text-teal-600 font-medium">
          View details <ArrowRight size={16} className="ml-1" />
        </div>
      )}
    </Card>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await patientAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      addToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats ? [
    { name: 'Completed', value: stats.completed, color: '#14b8a6' },
    { name: 'Pending', value: stats.pending, color: '#0ea5e9' },
  ] : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of patient follow-up management</p>
        </div>
        <Link
          to="/patients/add"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition-colors"
        >
          <Plus size={20} />
          Add Patient
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          label="Total Patients"
          value={stats?.totalPatients || 0}
          color="bg-primary-500"
        />
        <StatCard
          icon={Calendar}
          label="Follow-ups Due Today"
          value={stats?.dueToday || 0}
          color="bg-teal-500"
          link="/ai-automation"
        />
        <StatCard
          icon={CheckCircle}
          label="Completed Follow-ups"
          value={stats?.completed || 0}
          color="bg-green-500"
        />
        <StatCard
          icon={Clock}
          label="Pending Follow-ups"
          value={stats?.pending || 0}
          color="bg-orange-500"
          link="/patients"
        />
        <StatCard
          icon={TrendingUp}
          label="Upcoming Follow-ups"
          value={stats?.upcoming || 0}
          color="bg-purple-500"
          link="/patients"
        />
      </div>

      {/* Follow-up Status Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Status</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-teal-500 to-primary-500 rounded-xl p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <p className="text-teal-100 mb-4">Manage your patient follow-ups efficiently</p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/patients/add"
            className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium hover:bg-teal-50 transition-colors"
          >
            Add New Patient
          </Link>
          <Link
            to="/ai-automation"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors border border-white/30"
          >
            AI Follow-up Automation
          </Link>
          <Link
            to="/patients"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors border border-white/30"
          >
            View All Patients
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
