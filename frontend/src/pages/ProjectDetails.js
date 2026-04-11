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

            {/* Client Materials Upload Section */}
            {(project.status === 'submitted' || project.status === 'quoted' || project.status === 'quote_accepted' || project.status === 'in_production') && (
              <div className="card-ocean p-6 bg-gradient-to-br from-teal-50 to-sky-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Upload Materials</h3>
                <p className="text-gray-700 mb-4 text-left">
                  Upload your script, reference materials, or any files needed for production.
                </p>
                <div className="border-2 border-dashed border-sky-300 rounded-lg p-8 text-center bg-white">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-sky-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <label htmlFor="file-upload" className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer">
                      Click to upload
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, ZIP up to 100MB</p>
                  <input id="file-upload" name="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.zip" />
                </div>
                {project.reference_materials && project.reference_materials.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2 text-left">Uploaded Files:</p>
                    <div className="space-y-2">
                      {project.reference_materials.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 bg-white p-2 rounded">
                          <svg className="w-4 h-4 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span>{file}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Project Status Timeline</h3>
              <div className="space-y-3 text-sm text-left">
                {/* Submitted */}
                <div className="border-l-4 border-sky-500 pl-3 py-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Submitted</span>
                    <span className="text-gray-700">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Initial request received</p>
                </div>

                {/* Quote Sent */}
                {project.quote_sent_at && (
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Quote Sent</span>
                      <span className="text-gray-700">{new Date(project.quote_sent_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">${project.quote_amount} USD</p>
                  </div>
                )}

                {/* Quote Accepted */}
                {project.quote_accepted_at && (
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Quote Accepted</span>
                      <span className="text-gray-700">{new Date(project.quote_accepted_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Client confirmed terms</p>
                  </div>
                )}

                {/* Production Started */}
                {project.production_started_at && (
                  <div className="border-l-4 border-orange-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Production Started</span>
                      <span className="text-gray-700">{new Date(project.production_started_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Work in progress</p>
                  </div>
                )}

                {/* Delivered */}
                {project.delivered_at && (
                  <div className="border-l-4 border-teal-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Delivered</span>
                      <span className="text-gray-700">{new Date(project.delivered_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Files available for download</p>
                  </div>
                )}

                {/* Payment & Completion */}
                {project.completed_at && (
                  <>
                    <div className="border-l-4 border-emerald-600 pl-3 py-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Payment Received</span>
                        <span className="text-gray-700">{new Date(project.completed_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PayPal payment confirmed</p>
                    </div>
                    <div className="border-l-4 border-emerald-700 pl-3 py-1 bg-emerald-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-emerald-900">Project Completed</span>
                        <span className="text-emerald-700">{new Date(project.completed_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1">
                        {project.acceptance_status === 'approved' ? 'Client approved ✓' : 'Work accepted'}
                      </p>
                    </div>
                  </>
                )}

                {/* Production Timeline Info */}
                {project.production_started_at && project.delivered_at && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold">Production Time:</span>
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {Math.ceil((new Date(project.delivered_at) - new Date(project.production_started_at)) / (1000 * 60 * 60 * 24))} days
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      From production start to delivery
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
