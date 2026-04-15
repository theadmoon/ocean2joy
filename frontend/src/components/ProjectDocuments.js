import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaSave, FaTimes, FaFileAlt, FaEye, FaDownload, FaPlay } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDocuments({ project, onUpdate, isClientView = false }) {
  const [editing, setEditing] = useState(false);
  const [documentNames, setDocumentNames] = useState({});
  const [tempNames, setTempNames] = useState({});
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocumentContent, setSelectedDocumentContent] = useState('');
  const [selectedDocumentTitle, setSelectedDocumentTitle] = useState('');
  
  // Invoice signature upload states
  const [uploadingInvoiceSignature, setUploadingInvoiceSignature] = useState(false);
  const [invoiceSignatureFile, setInvoiceSignatureFile] = useState(null);

  useEffect(() => {
    // Initialize document names from project or use defaults
    const defaults = {
      quote_request: 'Quote Request',
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

  const handleInvoiceSignatureUpload = async () => {
    if (!invoiceSignatureFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    setUploadingInvoiceSignature(true);
    try {
      const formData = new FormData();
      formData.append('file', invoiceSignatureFile);

      await axios.post(
        `${API}/projects/${project.id}/upload-confirmation/invoice`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Signed invoice uploaded successfully!');
      setInvoiceSignatureFile(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading signed invoice:', error);
      alert('Failed to upload signed invoice. Please try again.');
    } finally {
      setUploadingInvoiceSignature(false);
    }
  };


  // Define sub-steps for each document
  const getSubSteps = (docType) => {
    const subSteps = {
      quote_request: [
        { key: 'awaiting_activation', label: 'Awaiting Order Activation', condition: () => !project.order_activated_at },
        { key: 'activated', label: 'Order Activated by Client', condition: () => project.order_activated_at },
        { key: 'manager_reviewing', label: 'Manager Reviewing', condition: () => project.order_activated_at && !project.quote_request_created_at },
        { key: 'comments_added', label: 'Manager Added Comments', condition: () => project.quote_request_created_at }
      ],
      invoice: [
        { key: 'pending', label: 'Pending', condition: () => !project.invoice_sent_at },
        { key: 'sent', label: 'Invoice Sent to Client', condition: () => project.invoice_sent_at },
        { key: 'awaiting_signature', label: 'Awaiting Client Signature', condition: () => project.invoice_sent_at && !project.invoice_signed_at },
        { key: 'signed', label: 'Signed by Client', condition: () => project.invoice_signed_at }
      ],
      payment_confirmation: [
        { key: 'awaiting', label: 'Awaiting Payment', condition: () => !project.payment_marked_by_client_at },
        { key: 'marked', label: 'Payment Marked by Client', condition: () => project.payment_marked_by_client_at },
        { key: 'confirmed', label: 'Confirmed by Manager', condition: () => project.payment_confirmed_by_admin }
      ],
      receipt: [
        { key: 'pending', label: 'Pending', condition: () => !project.payment_confirmed_by_admin },
        { key: 'generated', label: 'Generated', condition: () => project.payment_confirmed_by_admin }
      ],
      certificate: [
        { key: 'pending', label: 'Pending', condition: () => !project.delivered_at },
        { key: 'work_completed', label: 'Work Completed', condition: () => project.delivered_at && !project.completed_at },
        { key: 'issued', label: 'Certificate Issued', condition: () => project.completed_at }
      ]
    };
    return subSteps[docType] || [];
  };

  const getCurrentSubStep = (docType) => {
    const subSteps = getSubSteps(docType);
    // Find last completed sub-step
    for (let i = subSteps.length - 1; i >= 0; i--) {
      if (subSteps[i].condition()) {
        return i;
      }
    }
    return -1; // No steps completed
  };

  const getDocumentStatus = (docType) => {
    const currentStep = getCurrentSubStep(docType);
    const subSteps = getSubSteps(docType);
    
    if (currentStep === subSteps.length - 1) {
      return 'completed'; // All steps done
    } else if (currentStep >= 0) {
      return 'in_progress'; // Some steps done
    } else {
      return 'pending'; // No steps done
    }
  };

  const documents = [
    { key: 'quote_request', icon: '📄', description: 'Initial client request', step: 1 },
    { key: 'invoice', icon: '📃', description: 'Invoice for payment', step: 2 },
    { key: 'payment_confirmation', icon: '✅', description: 'Payment confirmation', step: 3 },
    { key: 'receipt', icon: '🧾', description: 'Payment receipt', step: 4 },
    { key: 'certificate', icon: '📜', description: 'Delivery certificate', step: 5 }
  ];

  const viewDocument = (docType) => {
    // Generate document content based on type
    let content = '';
    let title = documentNames[docType] || docType;

    switch(docType) {
      case 'quote_request':
        content = `QUOTE REQUEST
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Client: ${project.user_name}
Email: ${project.user_email}
Date Submitted: ${project.created_at ? new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
${project.order_activated_at ? `Order Activated: ${new Date(project.order_activated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}

═══════════════════════════════════════════════

PROJECT DETAILS:

Service Type: ${project.service_type || 'N/A'}

${project.order_activation_payment_method ? `Payment Method: ${
  project.order_activation_payment_method === 'paypal' ? '💳 PayPal' :
  project.order_activation_payment_method === 'swift' ? '🏦 SWIFT Transfer (USD)' :
  project.order_activation_payment_method === 'qr_code' ? '📱 QR Code (GEL)' : 
  project.order_activation_payment_method
}` : ''}

Brief:
${project.detailed_brief || 'No description provided'}

Objectives:
${project.objectives || 'Not specified'}

${project.special_instructions ? `Special Instructions:\n${project.special_instructions}` : ''}

═══════════════════════════════════════════════

ATTACHED MATERIALS (Script & References):

${project.reference_materials && project.reference_materials.length > 0 ? 
  project.reference_materials.map((file, idx) => `${idx + 1}. ${file}`).join('\n') : 
  'No materials uploaded yet'}

═══════════════════════════════════════════════

${project.quote_request_manager_comments ? `MANAGER'S NOTES:\n\n${project.quote_request_manager_comments}\n\n═══════════════════════════════════════════════\n\n` : ''}

STATUS: ${project.order_activated_at ? 'Order Activated - Ready for Review' : 'Awaiting Order Activation'}

This quote request ${project.order_activated_at ? 'has been activated and is' : 'will be'} reviewed by our production team.`;
        break;

      case 'quote':
        content = `QUOTE / PROPOSAL
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Client: ${project.user_name}
Date: ${project.quote_sent_at ? new Date(project.quote_sent_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

PROJECT SPECIFICATIONS:

Title: ${project.project_title}
Type: ${project.service_type}

${project.detailed_brief || ''}

${project.special_instructions || ''}

═══════════════════════════════════════════════

PRICING:

Service Description                        Amount
─────────────────────────────────────────────────
${project.service_type}                    $${project.quote_amount || 0}

${project.quote_details || ''}

═══════════════════════════════════════════════

TOTAL QUOTE:                              $${project.quote_amount || 0}

Payment Terms: ${project.payment_terms || 'TBD'}

═══════════════════════════════════════════════`;
        break;

      case 'invoice':
        content = `INVOICE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Invoice #: ${project.project_number}
Date: ${project.quote_accepted_at ? new Date(project.quote_accepted_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

BILL TO:
${project.user_name}
${project.user_email}

═══════════════════════════════════════════════

PROJECT: ${project.project_title}

Service: ${project.service_type}
Amount: $${project.quote_amount || 0}

${project.quote_details || ''}

═══════════════════════════════════════════════

TOTAL AMOUNT DUE:                         $${project.quote_amount || 0}

Payment Terms: ${project.payment_terms || 'Due upon delivery'}

═══════════════════════════════════════════════`;
        break;

      case 'payment_confirmation':
        content = `PAYMENT CONFIRMATION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Date: ${project.payment_marked_by_client_at ? new Date(project.payment_marked_by_client_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

PAYMENT DETAILS:

Amount Paid: $${project.quote_amount || 0}
Payment Method: ${project.payment_method || 'N/A'}
${project.paypal_transaction_id ? `Transaction ID: ${project.paypal_transaction_id}` : ''}
${project.paypal_payer_email ? `Payer Email: ${project.paypal_payer_email}` : ''}

Status: ${project.payment_confirmed_by_admin ? 'CONFIRMED' : 'Pending Confirmation'}

═══════════════════════════════════════════════`;
        break;

      case 'receipt':
        content = `RECEIPT
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Receipt #: ${project.project_number}
Date: ${project.payment_confirmed_at ? new Date(project.payment_confirmed_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

RECEIVED FROM:
${project.user_name}
${project.user_email}

═══════════════════════════════════════════════

PAYMENT FOR:
${project.project_title}

Amount Received: $${project.quote_amount || 0}
Payment Method: ${project.payment_method || 'N/A'}

═══════════════════════════════════════════════

Thank you for your payment!`;
        break;

      case 'certificate':
        content = `CERTIFICATE OF COMPLETION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Certificate #: ${project.project_number}
Date: ${project.completed_at ? new Date(project.completed_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

This certifies that the following project has been completed:

Project: ${project.project_title}
Client: ${project.user_name}

Production Period:
Started: ${project.production_started_at ? new Date(project.production_started_at).toLocaleDateString() : 'N/A'}
Delivered: ${project.delivered_at ? new Date(project.delivered_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

All deliverables have been provided digitally via secure client portal.

Project Status: ${project.acceptance_status === 'approved' ? 'APPROVED' : 'Pending Approval'}

═══════════════════════════════════════════════`;
        break;

      default:
        content = 'Document content not available.';
    }

    setSelectedDocumentTitle(title);
    setSelectedDocumentContent(content);
    setShowDocumentModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {isClientView ? 'Project Operational Chain' : 'Project Documents'}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isClientView 
              ? 'Track your project progress and access important documents' 
              : 'Manage all document names used in this project'}
          </p>
        </div>
        {!isClientView && (
          !editing ? (
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
          )
        )}
      </div>

      <div className="space-y-3">
        {documents.map((doc) => {
          const status = getDocumentStatus(doc.key);
          const currentStep = getCurrentSubStep(doc.key);
          const subSteps = getSubSteps(doc.key);
          const progressPercent = subSteps.length > 0 ? ((currentStep + 1) / subSteps.length) * 100 : 0;
          
          return (
            <div
              key={doc.key}
              className={`border-2 rounded-lg p-4 transition ${
                status === 'completed'
                  ? 'border-green-200 bg-green-50'
                  : status === 'in_progress'
                  ? 'border-orange-200 bg-orange-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm">
                  {doc.step}
                </div>
                <div className="text-2xl flex-shrink-0">{doc.icon}</div>
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
                  <p className="text-xs text-gray-600 mb-3">{doc.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold text-gray-700">
                        {currentStep >= 0 && subSteps[currentStep] ? subSteps[currentStep].label : 'Not Started'}
                      </span>
                      <span className="text-xs text-gray-500">{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          status === 'completed' ? 'bg-green-600' : 
                          status === 'in_progress' ? 'bg-orange-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Sub-steps List */}
                  <div className="space-y-1 mb-3">
                    {subSteps.map((subStep, index) => (
                      <div key={subStep.key} className="flex items-center gap-2 text-xs">
                        {index <= currentStep ? (
                          <span className="text-green-600">✓</span>
                        ) : (
                          <span className="text-gray-400">○</span>
                        )}
                        <span className={index <= currentStep ? 'text-green-700 font-medium' : 'text-gray-500'}>
                          {subStep.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* View Document Button */}
                  {(status === 'completed' || status === 'in_progress') && (
                    <button
                      onClick={() => viewDocument(doc.key)}
                      className="btn-ocean-sm inline-flex items-center gap-2 mt-2"
                    >
                      <FaEye /> View Document
                    </button>
                  )}
                  
                  {/* Invoice Signature Upload (Client View Only) */}
                  {isClientView && doc.key === 'invoice' && project.invoice_sent_at && !project.invoice_signed_at && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-semibold text-yellow-900 mb-3">
                        📝 Action Required: Sign and Upload Invoice
                      </p>
                      <p className="text-xs text-yellow-700 mb-3">
                        Please download the invoice, sign it, and upload the signed PDF below.
                      </p>
                      <div className="mb-3">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setInvoiceSignatureFile(e.target.files[0])}
                          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none p-2"
                        />
                      </div>
                      <button
                        onClick={handleInvoiceSignatureUpload}
                        disabled={!invoiceSignatureFile || uploadingInvoiceSignature}
                        className="btn-ocean-sm w-full"
                      >
                        {uploadingInvoiceSignature ? 'Uploading...' : '✓ Upload Signed Invoice'}
                      </button>
                    </div>
                  )}
                  
                  {/* Invoice Signed Confirmation */}
                  {doc.key === 'invoice' && project.invoice_signed_at && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-semibold">
                        ✓ Invoice Signed on {new Date(project.invoice_signed_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
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

      {/* Document View Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-700 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold">{selectedDocumentTitle}</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-white hover:text-gray-200 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-6 rounded-lg border border-gray-200">
                {selectedDocumentContent}
              </pre>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  const element = document.createElement('a');
                  const file = new Blob([selectedDocumentContent], { type: 'text/plain' });
                  element.href = URL.createObjectURL(file);
                  element.download = `${selectedDocumentTitle.replace(/\s+/g, '_')}.txt`;
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
                }}
                className="btn-ocean-outline inline-flex items-center gap-2"
              >
                <FaFileAlt /> Download as TXT
              </button>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="btn-ocean"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDocuments;
