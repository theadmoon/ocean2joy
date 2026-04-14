import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaPlus, FaEye } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ClientDashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'status-submitted',
      quoted: 'status-quoted',
      quote_accepted: 'status-quote_accepted',
      in_production: 'status-in_production',
      in_review: 'status-in_review',
      delivered: 'status-delivered',
      completed: 'status-completed',
      revision_requested: 'status-revision_requested',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-sky-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="client-dashboard py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your video projects and track progress</p>
        </div>

        <div className="mb-8">
          <Link to="/request" className="btn-ocean inline-flex items-center">
            <FaPlus className="mr-2" />
            Start New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="card-ocean p-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects yet</h3>
            <p className="text-gray-600 mb-6">Start your first video project today!</p>
            <Link to="/request" className="btn-ocean">
              Create Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="card-ocean p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {project.title || project.project_title || project.detailed_brief?.substring(0, 50) + '...'}
                      </h3>
                      <span className={`status-badge ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      Project #: {project.project_number}
                    </p>
                    <p className="text-gray-700 line-clamp-2 mb-4">
                      {project.detailed_brief}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>Service: {project.service_type}</span>
                      <span>•</span>
                      <span>Created: {new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="btn-ocean-outline inline-flex items-center"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
