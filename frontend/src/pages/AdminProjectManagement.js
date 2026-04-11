import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaExclamationTriangle, FaCheckCircle, FaEdit } from 'react-icons/fa';
import './AdminProjectManagement.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminProjectManagement() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      const projectData = response.data;
      
      // Auto-fill PayPal payer email if not set
      if (!projectData.paypal_payer_email && projectData.user_email) {
        projectData.paypal_payer_email = projectData.user_email;
      }
      
      // Auto-fill payment status based on project status
      if (!projectData.paypal_payment_status && projectData.status === 'completed') {
        projectData.paypal_payment_status = 'COMPLETED';
      }
      
      setProject(projectData);
      setEditedData(projectData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveField = async (field) => {
    setSaving(true);
    try {
      await axios.patch(`${API}/admin/projects/${projectId}`, {
        [field]: editedData[field]
      });
      setProject(prev => ({
        ...prev,
        [field]: editedData[field]
      }));
      toggleEditMode(field);
      alert('Saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  // Check if field has value
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '';
  };

  // Open document in modal
  const openDocument = (documentType, stepKey) => {
    const docContent = generateDocumentContent(documentType, stepKey);
    setSelectedDocument({
      type: documentType,
      content: docContent
    });
    setShowDocumentModal(true);
  };

  // Generate document content based on type
  const generateDocumentContent = (docType, stepKey) => {
    // This would generate the actual document content
    // For now, return a placeholder
    return `Document: ${docType}\n\nThis document would show detailed information for step: ${stepKey}\n\nProject: ${project?.project_number}\nClient: ${project?.user_name || 'Client'}\nAmount: $${project?.quote_amount}`;
  };

  // Print operational chain - improved version
  const handlePrint = () => {
    console.log('Print button clicked');
    
    // Check if print is available
    if (typeof window.print === 'function') {
      try {
        // Add print-friendly class
        document.body.classList.add('printing');
        
        // Small delay to ensure styles apply
        setTimeout(() => {
          window.print();
          document.body.classList.remove('printing');
        }, 100);
      } catch (error) {
        console.error('Print error:', error);
        alert('Unable to print. Please use Ctrl+P or File > Print in your browser menu.');
      }
    } else {
      alert('Print function not available. Use Ctrl+P or browser menu.');
    }
  };

  // Export as PDF - improved version
  const handleExportPDF = () => {
    console.log('Export PDF button clicked');
    
    // Create a printable version
    const printContent = document.getElementById('operational-chain-content');
    
    if (printContent) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Project ${project?.project_number} - Operational Chain</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #0369a1; }
              .step { margin-bottom: 20px; padding: 15px; border-left: 4px solid #0ea5e9; background: #f0f9ff; }
              .step-title { font-weight: bold; font-size: 18px; margin-bottom: 10px; }
              .field { margin: 5px 0; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('Content not available for export');
    }
  };

  // Map step keys to document types
  const getDocumentForStep = (stepKey) => {
    const docMap = {
      'submitted': 'Quote Request',
      'quote_sent': 'Quote Document',
      'quote_accepted': 'Acceptance Confirmation',
      'production_started': 'Production Order',
      'delivered': 'Invoice',
      'payment_received': 'Receipt',
      'project_completed': 'Certificate'
    };
    return docMap[stepKey];
  };

  // Operational chain steps
  const operationalSteps = [
    { 
      key: 'submitted', 
      label: 'Submitted', 
      dateField: 'created_at',
      description: 'Initial request received',
      required: true
    },
    { 
      key: 'quote_sent', 
      label: 'Quote Sent', 
      dateField: 'quote_sent_at',
      valueField: 'quote_amount',
      description: 'Quote provided to client',
      required: true
    },
    { 
      key: 'quote_accepted', 
      label: 'Quote Accepted', 
      dateField: 'quote_accepted_at',
      description: 'Client confirmed terms',
      required: true
    },
    { 
      key: 'production_started', 
      label: 'Production Started', 
      dateField: 'production_started_at',
      description: 'Work in progress',
      required: true
    },
    { 
      key: 'delivered', 
      label: 'Delivered', 
      dateField: 'delivered_at',
      description: 'Files available for download',
      documentType: 'Invoice',
      required: true
    },
    { 
      key: 'payment_received', 
      label: 'Payment Received', 
      dateField: 'completed_at',
      paypalFields: ['paypal_transaction_id', 'paypal_payer_email', 'paypal_payment_status'],
      description: 'PayPal payment confirmed',
      documentType: 'Receipt',
      required: true
    },
    { 
      key: 'project_completed', 
      label: 'Project Completed', 
      dateField: 'completed_at',
      description: 'Client approved',
      documentType: 'Certificate',
      required: true
    }
  ];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-sky-600">Loading...</div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2><Link to="/admin/dashboard" className="btn-ocean">Back to Dashboard</Link></div></div>;
  }

  return (
    <div className="admin-project-management py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin/dashboard" className="text-sky-600 hover:text-sky-700 font-semibold mb-6 inline-block">← Back to Admin Dashboard</Link>
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
            <span className={`status-badge status-${project.status} text-lg px-4 py-2`}>
              {project.status.replace('_', ' ')}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Project:</span> {project.project_number}</div>
            <div><span className="font-semibold">Client:</span> {project.user_name || 'N/A'}</div>
            <div><span className="font-semibold">Title:</span> {project.project_title}</div>
            <div><span className="font-semibold">Amount:</span> ${project.quote_amount}</div>
          </div>
        </div>

        {/* Operational Chain Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6" id="operational-chain-content">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>Operational Chain</span>
            <span className="text-sm font-normal text-gray-500">(All Key Parameters)</span>
          </h2>
          
          <div className="space-y-6">
            {operationalSteps.map((step, index) => {
              const dateValue = project[step.dateField];
              const hasDate = hasValue(dateValue);
              const isEditing = editMode[step.dateField];
              
              // Check PayPal fields if applicable
              let missingPayPalFields = [];
              if (step.paypalFields) {
                missingPayPalFields = step.paypalFields.filter(field => !hasValue(project[field]));
              }
              
              const hasIssues = !hasDate || missingPayPalFields.length > 0;

              return (
                <div key={step.key} className={`border-l-4 ${hasIssues ? 'border-orange-500 bg-orange-50' : 'border-green-500 bg-green-50'} rounded-r-lg p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-lg text-gray-900">{index + 1}. {step.label}</span>
                        {hasIssues ? (
                          <FaExclamationTriangle className="text-orange-500" title="Требует внимания" />
                        ) : (
                          <FaCheckCircle className="text-green-600" title="Заполнено" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                      
                      {/* Date Field */}
                      <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <label className="text-xs font-semibold text-gray-700 block mb-1 text-left">Date:</label>
                            {isEditing ? (
                              <input
                                type="datetime-local"
                                value={editedData[step.dateField] ? new Date(editedData[step.dateField]).toISOString().slice(0, 16) : ''}
                                onChange={(e) => handleFieldChange(step.dateField, e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm w-full text-left"
                              />
                            ) : (
                              <span className={`text-sm block text-left ${hasDate ? 'text-gray-900' : 'text-red-500 font-semibold'}`}>
                                {hasDate ? (() => {
                                  const d = new Date(dateValue);
                                  const month = String(d.getMonth() + 1).padStart(2, '0');
                                  const day = String(d.getDate()).padStart(2, '0');
                                  const year = d.getFullYear();
                                  let hours = d.getHours();
                                  const minutes = String(d.getMinutes()).padStart(2, '0');
                                  const seconds = String(d.getSeconds()).padStart(2, '0');
                                  const ampm = hours >= 12 ? 'PM' : 'AM';
                                  hours = hours % 12 || 12;
                                  return `${month}/${day}/${year}, ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
                                })() : '⚠ NOT FILLED'}
                              </span>
                            )}
                          </div>
                          <div className="ml-3 flex gap-2">
                            {isEditing ? (
                              <button 
                                onClick={() => saveField(step.dateField)}
                                disabled={saving}
                                className="btn-ocean text-xs px-3 py-1"
                              >
                                <FaSave className="inline mr-1" />Save
                              </button>
                            ) : (
                              <button 
                                onClick={() => toggleEditMode(step.dateField)}
                                className="text-sky-600 hover:text-sky-700"
                              >
                                <FaEdit />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Amount field (for quote_sent step) */}
                      {step.valueField && (
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <label className="text-xs font-semibold text-gray-700 block mb-1 text-left">Amount:</label>
                              {editMode[step.valueField] ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedData[step.valueField] || ''}
                                  onChange={(e) => handleFieldChange(step.valueField, parseFloat(e.target.value))}
                                  className="border border-gray-300 rounded px-3 py-1 text-sm w-full text-left"
                                />
                              ) : (
                                <span className="text-sm text-gray-900 block text-left">
                                  ${project[step.valueField] || '0.00'}
                                </span>
                              )}
                            </div>
                            <div className="ml-3 flex gap-2">
                              {editMode[step.valueField] ? (
                                <button 
                                  onClick={() => saveField(step.valueField)}
                                  disabled={saving}
                                  className="btn-ocean text-xs px-3 py-1"
                                >
                                  <FaSave className="inline mr-1" />Сохранить
                                </button>
                              ) : (
                                <button 
                                  onClick={() => toggleEditMode(step.valueField)}
                                  className="text-sky-600 hover:text-sky-700"
                                >
                                  <FaEdit />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* PayPal Transaction Fields */}
                      {step.paypalFields && (
                        <div className="bg-white rounded-lg p-3 mb-3">
                          <label className="text-xs font-semibold text-gray-700 block mb-2">PayPal Transaction Data:</label>
                          
                          {/* Transaction ID */}
                          <div className="mb-2">
                            <label className="text-xs text-gray-600 block mb-1">Transaction ID:</label>
                            {editMode['paypal_transaction_id'] ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={editedData['paypal_transaction_id'] || ''}
                                  onChange={(e) => handleFieldChange('paypal_transaction_id', e.target.value)}
                                  placeholder="PAYPAL-VAPP6-13MAR2026"
                                  className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                                />
                                <button 
                                  onClick={() => saveField('paypal_transaction_id')}
                                  className="btn-ocean text-xs px-3 py-1"
                                >
                                  <FaSave />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${hasValue(project['paypal_transaction_id']) ? 'text-gray-900' : 'text-red-500 font-semibold'}`}>
                                  {project['paypal_transaction_id'] || '⚠ NOT FILLED'}
                                </span>
                                <button 
                                  onClick={() => toggleEditMode('paypal_transaction_id')}
                                  className="text-sky-600 hover:text-sky-700"
                                >
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Payer Email */}
                          <div className="mb-2">
                            <label className="text-xs text-gray-600 block mb-1">Payer Email:</label>
                            {editMode['paypal_payer_email'] ? (
                              <div className="flex gap-2">
                                <input
                                  type="email"
                                  value={editedData['paypal_payer_email'] || ''}
                                  onChange={(e) => handleFieldChange('paypal_payer_email', e.target.value)}
                                  placeholder="client@example.com"
                                  className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                                />
                                <button 
                                  onClick={() => saveField('paypal_payer_email')}
                                  className="btn-ocean text-xs px-3 py-1"
                                >
                                  <FaSave />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${hasValue(project['paypal_payer_email']) ? 'text-gray-900' : 'text-red-500 font-semibold'}`}>
                                  {project['paypal_payer_email'] || '⚠ NOT FILLED'}
                                </span>
                                <button 
                                  onClick={() => toggleEditMode('paypal_payer_email')}
                                  className="text-sky-600 hover:text-sky-700"
                                >
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Payment Status */}
                          <div>
                            <label className="text-xs text-gray-600 block mb-1">Payment Status:</label>
                            {editMode['paypal_payment_status'] ? (
                              <div className="flex gap-2">
                                <select
                                  value={editedData['paypal_payment_status'] || ''}
                                  onChange={(e) => handleFieldChange('paypal_payment_status', e.target.value)}
                                  className="border border-gray-300 rounded px-3 py-1 text-sm flex-1"
                                >
                                  <option value="">Select status</option>
                                  <option value="COMPLETED">COMPLETED</option>
                                  <option value="PENDING">PENDING</option>
                                  <option value="REFUNDED">REFUNDED</option>
                                </select>
                                <button 
                                  onClick={() => saveField('paypal_payment_status')}
                                  className="btn-ocean text-xs px-3 py-1"
                                >
                                  <FaSave />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <span className={`text-sm ${hasValue(project['paypal_payment_status']) ? 'text-gray-900' : 'text-red-500 font-semibold'}`}>
                                  {project['paypal_payment_status'] || '⚠ NOT FILLED'}
                                </span>
                                <button 
                                  onClick={() => toggleEditMode('paypal_payment_status')}
                                  className="text-sky-600 hover:text-sky-700"
                                >
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Document for every step */}
                      <div className="bg-sky-50 rounded-lg p-3 border border-sky-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-sky-700">📄 Document:</span>
                            <span className="text-sm text-gray-900">{getDocumentForStep(step.key)}</span>
                            <span className="text-xs text-gray-500">({step.documentType ? 'auto-generated' : 'system record'})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => openDocument(getDocumentForStep(step.key), step.key)}
                            className="text-xs text-sky-600 hover:text-sky-700 underline cursor-pointer"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex gap-3 flex-wrap">
            <Link to={`/projects/${projectId}`} className="btn-ocean">
              📊 View as Client
            </Link>
            <button 
              type="button"
              onClick={handlePrint} 
              className="btn-ocean"
            >
              🖨️ Print Log
            </button>
            <button 
              type="button"
              onClick={handleExportPDF} 
              className="btn-ocean"
            >
              📄 Export PDF
            </button>
            <button 
              type="button"
              className="btn-ocean-outline"
              onClick={() => alert('Download All Documents feature coming soon!')}
            >
              💾 Download All Documents
            </button>
          </div>
        </div>
      </div>

      {/* Document View Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                📄 {selectedDocument.type}
              </h3>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded">
                {selectedDocument.content}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDocumentModal(false)}
                className="btn-ocean-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedDocument.content);
                  alert('Document content copied to clipboard!');
                }}
                className="btn-ocean"
              >
                📋 Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjectManagement;
