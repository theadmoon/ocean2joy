import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEye } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API}/admin/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-sky-600">Loading...</div></div>;
  }

  return (
    <div className="admin-dashboard py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        <div className="card-ocean p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">All Projects</h2>
          <p className="text-gray-600">Total: {projects.length} projects</p>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="card-ocean p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.project_title}</h3>
                  <div className="flex gap-3 text-sm text-gray-600 mb-2">
                    <span className={`status-badge status-${project.status}`}>{project.status.replace('_', ' ')}</span>
                    <span>Client: {project.user_name}</span>
                    <span>•</span>
                    <span>{project.project_number}</span>
                  </div>
                  <p className="text-gray-700">{project.detailed_brief.substring(0, 150)}...</p>
                </div>
                <Link to={`/projects/${project.id}`} className="btn-ocean-outline"><FaEye className="inline mr-2" />View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
