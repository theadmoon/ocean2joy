import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaFileAlt } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDocuments({ project, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [documentNames, setDocumentNames] = useState({});
  const [tempNames, setTempNames] = useState({});

  useEffect(() => {
    // Initialize document names from project or use defaults
    const defaults = {
      quote_request: 'Quote Request',
      quote: 'Quote Document',
      invoice: 'Invoice',
      receipt: 'Receipt',
      certificate: 'Certificate of Delivery',
      payment_confirmation: 'Payment Confirmation'
    };

    const currentNames = project.document_names || defaults;
    setDocumentNames(currentNames);
    setTempNames(currentNames);
  }, [project]);

  const handleSave = async () => {
    try {
      await axios.patch(`${API}/admin/projects/${project.id}/document-names`, tempNames);
      setDocumentNames(tempNames);
      setEditing(false);
      alert('Document names updated successfully!');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating document names:', error);
      alert('Failed to update document names');
    }
  };

  const handleCancel = () => {
    setTempNames(documentNames);
    setEditing(false);
  };

  const getDocumentStatus = (docType) => {
    switch(docType) {
      case 'quote_request':
        return project.status !== 'submitted' ? 'generated' : 'pending';
      case 'quote':
        return project.quote_sent_at ? 'generated' : 'pending';
      case 'invoice':
        return project.payment_confirmed_by_admin ? 'generated' : 'pending';
      case 'receipt':
        return project.payment_confirmed_by_admin ? 'generated' : 'pending';
      case 'certificate':
        return project.delivered_at ? 'generated' : 'pending';
      case 'payment_confirmation':
        return project.payment_marked_by_client_at ? 'generated' : 'pending';
      default:
        return 'pending';
    }
  };

  const documents = [
    { key: 'quote_request', icon: '📄', description: 'Initial client request' },
    { key: 'quote', icon: '💰', description: 'Project quote with pricing' },
    { key: 'invoice', icon: '📃', description: 'Invoice for payment' },
    { key: 'receipt', icon: '🧾', description: 'Payment receipt' },
    { key: 'certificate', icon: '📜', description: 'Delivery certificate' },
    { key: 'payment_confirmation', icon: '✅', description: 'Payment confirmation' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Project Documents</h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage all document names used in this project
          </p>
        </div>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="btn-ocean inline-flex items-center gap-2"
          >
            <FaEdit /> Edit Names
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="btn-ocean-outline inline-flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-ocean inline-flex items-center gap-2"
            >
              <FaSave /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const status = getDocumentStatus(doc.key);
          return (
            <div
              key={doc.key}
              className={`border-2 rounded-lg p-4 transition ${
                status === 'generated'
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{doc.icon}</div>
                <div className="flex-1">
                  {editing ? (
                    <input
                      type="text"
                      value={tempNames[doc.key] || ''}
                      onChange={(e) =>
                        setTempNames({ ...tempNames, [doc.key]: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 mb-2 font-semibold"
                      placeholder={doc.key.replace('_', ' ')}
                    />
                  ) : (
                    <h4 className="font-bold text-gray-900 mb-1">
                      {documentNames[doc.key] || doc.key}
                    </h4>
                  )}
                  <p className="text-xs text-gray-600 mb-2">{doc.description}</p>
                  <div className="flex items-center gap-2">
                    {status === 'generated' ? (
                      <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                        ✓ Generated
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-400 text-white px-2 py-1 rounded">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>💡 Note:</strong> Changing document names here will update how they appear in all transaction
          documents (Quote, Invoice, Receipt, Certificate). The actual document content will reference the
          new names automatically.
        </p>
      </div>
    </div>
  );
}

export default ProjectDocuments;
