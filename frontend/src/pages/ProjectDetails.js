import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaCheckCircle, FaComments } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchMessages();
      fetchDeliverables();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      setProject(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchDeliverables = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}/deliverables`);
      setDeliverables(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleApprove = async () => {
    try {
      await axios.patch(`${API}/projects/${projectId}/approve`);
      fetchProjectDetails();
      alert('Project approved successfully!');
    } catch (error) {
      alert('Failed to approve project');
    }
  };

  const handleAcceptQuote = async () => {
    try {
      await axios.patch(`${API}/projects/${projectId}/accept-quote`);
      fetchProjectDetails();
      alert('Quote accepted! Production will begin soon.');
    } catch (error) {
      alert('Failed to accept quote');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-sky-600">Loading...</div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2><Link to="/dashboard" className="btn-ocean">Back to Dashboard</Link></div></div>;
  }

  return (
    <div className="project-details-page py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="text-sky-600 hover:text-sky-700 font-semibold mb-6 inline-block">← Back to Dashboard</Link>
        
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 text-left">{project.project_title}</h1>
            <span className={`status-badge status-${project.status}`}>{project.status.replace('_', ' ')}</span>
          </div>
          <p className="text-gray-600 text-left">Project #{project.project_number}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-ocean p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Project Details</h2>
              <div className="space-y-3 text-left">
                <div className="text-left"><span className="font-semibold">Service:</span> {project.service_type}</div>
                <div className="text-left"><span className="font-semibold">Brief:</span> <p className="mt-1 text-left">{project.detailed_brief}</p></div>
                <div className="text-left"><span className="font-semibold">Objectives:</span> <p className="mt-1 text-left">{project.objectives}</p></div>
                {project.special_instructions && <div className="text-left"><span className="font-semibold">Special Instructions:</span> <p className="mt-1 text-left">{project.special_instructions}</p></div>}
              </div>
            </div>

            {project.quote_amount && (
              <div className="card-ocean p-6 bg-gradient-to-br from-sky-50 to-teal-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Quote</h3>
                <div className="text-3xl font-bold text-sky-600 mb-2 text-left">${project.quote_amount}</div>
                <p className="text-gray-700 mb-4 text-left">{project.quote_details}</p>
                {project.status === 'quoted' && (
                  <button onClick={handleAcceptQuote} className="btn-ocean">Accept Quote & Start Production</button>
                )}
              </div>
            )}

            {deliverables.length > 0 && (
              <div className="card-ocean p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Deliverables</h3>
                <div className="space-y-3">
                  {deliverables.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="text-left">
                        <p className="font-semibold text-left">{file.file_name}</p>
                        <p className="text-sm text-gray-600 text-left">{file.description}</p>
                      </div>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-ocean-outline">
                        <FaDownload className="inline mr-2" />Download
                      </a>
                    </div>
                  ))}
                </div>
                {project.status === 'delivered' && (
                  <button onClick={handleApprove} className="btn-ocean mt-4 w-full"><FaCheckCircle className="inline mr-2" />Approve & Complete Project</button>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card-ocean p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Project Status</h3>
              <div className="space-y-2 text-sm text-left">
                <div className="flex justify-between"><span>Created:</span><span>{new Date(project.created_at).toLocaleDateString()}</span></div>
                {project.quote_sent_at && <div className="flex justify-between"><span>Quote Sent:</span><span>{new Date(project.quote_sent_at).toLocaleDateString()}</span></div>}
                {project.production_started_at && <div className="flex justify-between"><span>Production Started:</span><span>{new Date(project.production_started_at).toLocaleDateString()}</span></div>}
                {project.delivered_at && <div className="flex justify-between"><span>Delivered:</span><span>{new Date(project.delivered_at).toLocaleDateString()}</span></div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
