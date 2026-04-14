import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaPlay } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDeliverables({ project }) {
  const [deliverables, setDeliverables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliverables = async () => {
      if (!project?.id) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${API}/projects/${project.id}/deliverables`);
        setDeliverables(response.data);
      } catch (error) {
        console.error('Error fetching deliverables:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeliverables();
  }, [project?.id]);

  if (loading) return null;
  if (!deliverables || deliverables.length === 0) return null;

  return (
    <div className="mt-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
          <span className="text-2xl">🎬</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-emerald-900">Your Video Deliverables</h3>
          <p className="text-sm text-emerald-700">Final video files ready for download</p>
        </div>
      </div>

      <div className="space-y-3">
        {deliverables.map((file, index) => (
          <div 
            key={file.id || index} 
            className="bg-white border border-emerald-200 rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FaPlay className="text-emerald-600" />
                  <h4 className="font-bold text-gray-900">{file.file_name || `Video ${index + 1}`}</h4>
                </div>
                <p className="text-sm text-gray-600">{file.description || 'No description'}</p>
                {file.uploaded_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    Uploaded: {new Date(file.uploaded_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <a 
                href={file.file_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-ocean inline-flex items-center gap-2 ml-4"
              >
                <FaDownload /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-emerald-100 border border-emerald-300 rounded-lg p-4">
        <p className="text-sm text-emerald-900">
          <strong>📥 Download Tips:</strong> Right-click and "Save As" to download. Files are available for 90 days after project completion.
        </p>
      </div>
    </div>
  );
}

export default ProjectDeliverables;
