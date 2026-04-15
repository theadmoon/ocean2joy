import React, { useState } from 'react';
import { FaDownload, FaEye, FaCheckCircle, FaUpload, FaClock, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function OperationalChainWithDocuments({ project, onUpdate }) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  
  // Upload signed invoice
  const [uploadingInvoice, setUploadingInvoice] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  // Get all documents for a specific step
  const getDocumentsForStep = (stepKey) => {
    const docs = [];
    
    switch(stepKey) {
      case 'submitted':
        // Quote Request document
        docs.push({
          id: 'quote_request',
          name: 'Quote Request',
          type: 'system',
          createdBy: 'System',
          createdAt: project.created_at,
          status: 'generated',
          icon: '📄',
          actions: ['view']
        });
        break;
        
      case 'order_activated':
        // Uploaded materials (each file as separate document)
        if (project.reference_materials && project.reference_materials.length > 0) {
          project.reference_materials.forEach((file, idx) => {
            const fileName = file.split(' (')[0];
            docs.push({
              id: `material_${idx}`,
              name: fileName,
              type: 'client_file',
              createdBy: 'Client',
              createdAt: project.order_activated_at || project.created_at,
              status: 'uploaded',
              icon: '📎',
              actions: ['view', 'download']
            });
          });
        }
        
        // Manager's Comments
        if (project.quote_request_manager_comments) {
          docs.push({
            id: 'manager_comments',
            name: "Manager's Notes",
            type: 'manager_notes',
            createdBy: 'Manager',
            createdAt: project.quote_request_created_at || project.order_activated_at,
            status: 'added',
            icon: '💬',
            actions: ['view']
          });
        }
        break;
        
      case 'invoice_sent':
        // Invoice document
        docs.push({
          id: 'invoice',
          name: `Invoice #${project.project_number?.split('-')[0] || 'N/A'}`,
          type: 'financial',
          createdBy: 'Manager',
          createdAt: project.invoice_sent_at,
          status: project.invoice_signed_at ? 'signed' : 'awaiting_signature',
          icon: '📃',
          amount: project.quote_amount,
          actions: ['view', 'upload_signed']
        });
        break;
        
      case 'invoice_signed':
        // Signed Invoice
        if (project.invoice_signed_at) {
          docs.push({
            id: 'signed_invoice',
            name: 'Signed Invoice',
            type: 'client_document',
            createdBy: 'Client',
            createdAt: project.invoice_signed_at,
            status: 'signed_by_client',
            icon: '✅',
            actions: ['view', 'download']
          });
        }
        break;
        
      case 'production_started':
        // Production notes (if any)
        if (project.production_notes) {
          docs.push({
            id: 'production_notes',
            name: 'Production Notes',
            type: 'notes',
            createdBy: 'Manager',
            createdAt: project.production_started_at,
            status: 'in_progress',
            icon: '📝',
            actions: ['view']
          });
        }
        break;
        
      case 'delivered':
        // Deliverables (videos)
        if (project.deliverables && project.deliverables.length > 0) {
          project.deliverables.forEach((deliverable, idx) => {
            docs.push({
              id: `deliverable_${idx}`,
              name: deliverable.filename || `Video_${idx + 1}.mp4`,
              type: 'deliverable',
              createdBy: 'Production',
              createdAt: deliverable.uploaded_at || project.delivered_at,
              status: deliverable.type === 'final' ? 'final' : 'intermediate',
              icon: '🎬',
              actions: ['download', 'view']
            });
          });
        }
        break;
        
      case 'payment_received':
        // Payment Confirmation
        docs.push({
          id: 'payment_confirmation',
          name: 'Payment Confirmation',
          type: 'payment',
          createdBy: 'Client',
          createdAt: project.payment_marked_by_client_at,
          status: project.payment_confirmed_by_admin ? 'confirmed' : 'pending_confirmation',
          icon: '💳',
          actions: ['view']
        });
        
        // Receipt

  // Handle View Document
  const handleViewDocument = (doc) => {
    setSelectedDocument(doc);
    
    // Generate document content based on type
    let content = '';
    
    switch(doc.id) {
      case 'quote_request':
        content = `QUOTE REQUEST
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Client: ${project.user_name}
Email: ${project.user_email}
Date Submitted: ${new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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

═══════════════════════════════════════════════

ATTACHED MATERIALS (Script & References):

${project.reference_materials && project.reference_materials.length > 0 ? 
  project.reference_materials.map((file, idx) => `${idx + 1}. ${file}`).join('\n') : 
  'No materials uploaded yet'}

═══════════════════════════════════════════════

${project.quote_request_manager_comments ? `MANAGER'S NOTES:\n\n${project.quote_request_manager_comments}\n\n═══════════════════════════════════════════════\n\n` : ''}

STATUS: ${project.order_activated_at ? 'Order Activated - Ready for Review' : 'Awaiting Order Activation'}`;
        break;
        
      case 'manager_comments':
        content = `MANAGER'S NOTES ON ORDER ACTIVATION
═══════════════════════════════════════════════

Project: ${project.project_number}
Date: ${new Date(project.quote_request_created_at || project.order_activated_at).toLocaleDateString()}

═══════════════════════════════════════════════

${project.quote_request_manager_comments || 'No notes available'}`;
        break;
        
      case 'invoice':
        content = `INVOICE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Invoice #: ${project.project_number?.split('-')[0] || 'N/A'}
Client: ${project.user_name}
Date: ${project.invoice_sent_at ? new Date(project.invoice_sent_at).toLocaleDateString() : 'N/A'}

═══════════════════════════════════════════════

SERVICE DESCRIPTION:

${project.service_type}
${project.quote_details || project.detailed_brief || ''}

═══════════════════════════════════════════════

AMOUNT DUE: $${project.quote_amount || '0.00'} USD

Payment Method: ${
  project.order_activation_payment_method === 'paypal' ? 'PayPal' :
  project.order_activation_payment_method === 'swift' ? 'SWIFT Transfer' :
  project.order_activation_payment_method === 'qr_code' ? 'QR Code Payment' : 
  'To be determined'
}

${project.invoice_signed_at ? `\nSTATUS: ✅ SIGNED by Client on ${new Date(project.invoice_signed_at).toLocaleDateString()}` : '\nSTATUS: ⏳ AWAITING CLIENT SIGNATURE'}

═══════════════════════════════════════════════

Please sign and return this invoice to proceed with production.`;
        break;
        
      case 'payment_confirmation':
        content = `PAYMENT CONFIRMATION
═══════════════════════════════════════════════

Project: ${project.project_number}
Amount: $${project.quote_amount || '0.00'} USD
Payment Method: ${project.order_activation_payment_method || 'N/A'}

${project.paypal_transaction_id ? `Transaction ID: ${project.paypal_transaction_id}` : ''}
${project.paypal_payer_email ? `Payer Email: ${project.paypal_payer_email}` : ''}

Status: ${project.payment_confirmed_by_admin ? '✅ Confirmed by Manager' : '⏳ Pending Manager Confirmation'}

═══════════════════════════════════════════════`;
        break;
        
      case 'receipt':
        content = `RECEIPT
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Receipt #: ${project.project_number}
Date: ${project.completed_at ? new Date(project.completed_at).toLocaleDateString() : 'N/A'}

Client: ${project.user_name}
Service: ${project.service_type}

AMOUNT PAID: $${project.quote_amount || '0.00'} USD

Payment Method: ${project.order_activation_payment_method || 'N/A'}
${project.paypal_transaction_id ? `Transaction ID: ${project.paypal_transaction_id}` : ''}

STATUS: ✅ PAID IN FULL

Thank you for your business!

═══════════════════════════════════════════════`;
        break;
        
      case 'certificate':
        content = `CERTIFICATE OF DELIVERY
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

This is to certify that the following work has been completed and delivered:

Project: ${project.project_number}
Client: ${project.user_name}
Service: ${project.service_type}

Delivered on: ${project.delivered_at ? new Date(project.delivered_at).toLocaleDateString() : 'N/A'}
Completed on: ${project.completed_at ? new Date(project.completed_at).toLocaleDateString() : 'N/A'}

DELIVERABLES:
${project.deliverables && project.deliverables.length > 0 ? 
  project.deliverables.map((d, idx) => `${idx + 1}. ${d.filename || 'Video file'}`).join('\n') : 
  'Final video files'}

All project requirements have been met and files are available for download.

═══════════════════════════════════════════════

Authorized by: Ocean2Joy Production Team
Date: ${new Date().toLocaleDateString()}`;
        break;
        
      default:
        // For client files (scripts, materials)
        if (doc.type === 'client_file') {
          content = `FILE INFORMATION
═══════════════════════════════════════════════

Filename: ${doc.name}
Uploaded by: ${doc.createdBy}
Date: ${new Date(doc.createdAt).toLocaleDateString()}
Type: Client Material

═══════════════════════════════════════════════

This file was uploaded by the client as part of the project materials.
To download this file, click the Download button.`;
        } else if (doc.type === 'deliverable') {
          content = `VIDEO DELIVERABLE
═══════════════════════════════════════════════

Filename: ${doc.name}
Type: ${doc.status === 'final' ? 'Final Version' : 'Intermediate Draft'}
Uploaded: ${new Date(doc.createdAt).toLocaleDateString()}

This video file is ready for download.
Click the Download button to save the file.`;
        } else {
          content = `DOCUMENT: ${doc.name}\n\nNo preview available. Use Download button to access the file.`;
        }
    }
    
    setDocumentContent(content);
    setShowDocumentModal(true);
  };
  
  // Handle Download
  const handleDownload = (doc) => {
    // For now, show alert - would implement actual download
    alert(`Download functionality for "${doc.name}" will be implemented with actual file storage.`);
    // TODO: Implement actual file download from storage
  };
  
  // Handle Upload Signed Invoice
  const handleUploadSignedInvoice = async () => {
    if (!invoiceFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    setUploadingInvoice(true);
    try {
      const formData = new FormData();
      formData.append('file', invoiceFile);

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
      setInvoiceFile(null);
      setShowUploadModal(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading signed invoice:', error);
      alert('Failed to upload signed invoice. Please try again.');
    } finally {
      setUploadingInvoice(false);
    }
  };

        if (project.payment_confirmed_by_admin) {
          docs.push({
            id: 'receipt',
            name: 'Receipt',
            type: 'financial',
            createdBy: 'System',
            createdAt: project.completed_at,
            status: 'generated',
            icon: '🧾',
            actions: ['view', 'download']
          });
        }
        break;
        
      case 'completed':
        // Certificate of Delivery
        if (project.completed_at) {
          docs.push({
            id: 'certificate',
            name: 'Certificate of Delivery',
            type: 'certificate',
            createdBy: 'Manager',
            createdAt: project.completed_at,
            status: 'issued',
            icon: '📜',
            actions: ['view', 'download']
          });
        }
        break;
    }
    
    return docs;
  };
  
  // Define operational steps
  const operationalSteps = [
    {
      key: 'submitted',
      label: 'Submitted',
      date: project.created_at,
      description: 'Initial request received',
      color: 'sky',
      completed: true
    },
    {
      key: 'order_activated',
      label: 'Order Activated',
      date: project.order_activated_at,
      description: 'Client submitted materials & brief',
      color: 'blue',
      completed: !!project.order_activated_at
    },
    {
      key: 'invoice_sent',
      label: 'Invoice Sent',
      date: project.invoice_sent_at || project.quote_sent_at,
      description: project.quote_amount ? `$${project.quote_amount} USD` : 'Awaiting invoice',
      color: 'purple',
      completed: !!(project.invoice_sent_at || project.quote_sent_at)
    },
    {
      key: 'invoice_signed',
      label: 'Invoice Signed',
      date: project.invoice_signed_at || project.quote_accepted_at,
      description: 'Client confirmed payment terms',
      color: 'green',
      completed: !!(project.invoice_signed_at || project.quote_accepted_at)
    },
    {
      key: 'production_started',
      label: 'Production Started',
      date: project.production_started_at,
      description: 'Work in progress',
      color: 'orange',
      completed: !!project.production_started_at
    },
    {
      key: 'delivered',
      label: 'Delivered',
      date: project.delivered_at,
      description: 'Files available for download',
      color: 'teal',
      completed: !!project.delivered_at
    },
    {
      key: 'payment_received',
      label: 'Payment Received',
      date: project.completed_at,
      description: 'Payment confirmed',
      color: 'emerald',
      completed: !!project.completed_at
    },
    {
      key: 'completed',
      label: 'Completed',
      date: project.completed_at,
      description: 'Project finished',
      color: 'green',
      completed: !!project.completed_at
    }
  ];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const getStatusBadge = (status) => {
    const badges = {
      'generated': { label: 'Generated', color: 'bg-blue-100 text-blue-800' },
      'uploaded': { label: 'Uploaded', color: 'bg-green-100 text-green-800' },
      'added': { label: 'Added', color: 'bg-purple-100 text-purple-800' },
      'awaiting_signature': { label: 'Awaiting Signature', color: 'bg-yellow-100 text-yellow-800' },
      'signed_by_client': { label: 'Signed', color: 'bg-green-100 text-green-800' },
      'pending_confirmation': { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      'confirmed': { label: 'Confirmed', color: 'bg-green-100 text-green-800' },
      'issued': { label: 'Issued', color: 'bg-blue-100 text-blue-800' },
      'final': { label: 'Final', color: 'bg-green-100 text-green-800' },
      'intermediate': { label: 'Draft', color: 'bg-gray-100 text-gray-800' }
    };
    
    const badge = badges[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Operational Chain & Documents</h2>
      
      <div className="space-y-6">
        {operationalSteps.map((step, index) => {
          const documents = getDocumentsForStep(step.key);
          const hasDocuments = documents.length > 0;
          
          return (
            <div key={step.key} className="grid grid-cols-12 gap-4">
              {/* Left: Operational Step */}
              <div className="col-span-5">
                <div className={`border-l-4 border-${step.color}-500 pl-4 py-2 ${!step.completed ? 'opacity-50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.completed && <FaCheckCircle className="text-green-600" />}
                      {!step.completed && <FaClock className="text-gray-400" />}
                      <span className="font-semibold text-gray-900">{step.label}</span>
                    </div>
                    {step.date && (
                      <span className="text-sm text-gray-600">{formatDate(step.date)}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                </div>
              </div>
              
              {/* Right: Documents */}
              <div className="col-span-7">
                {hasDocuments ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div key={doc.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{doc.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm text-gray-900">{doc.name}</p>
                                {getStatusBadge(doc.status)}
                              </div>
                              <p className="text-xs text-gray-500">
                                by {doc.createdBy} • {formatDate(doc.createdAt)}
                                {doc.amount && ` • $${doc.amount}`}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex items-center gap-2">
                            {doc.actions.includes('view') && (
                              <button 
                                onClick={() => handleViewDocument(doc)}
                                className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" 
                                title="View"
                              >
                                <FaEye />
                              </button>
                            )}
                            {doc.actions.includes('download') && (
                              <button 
                                onClick={() => handleDownload(doc)}
                                className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" 
                                title="Download"
                              >
                                <FaDownload />
                              </button>
                            )}
                            {doc.actions.includes('upload_signed') && !project.invoice_signed_at && (
                              <button 
                                onClick={() => setShowUploadModal(true)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" 
                                title="Upload Signed Invoice"
                              >
                                <FaUpload />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">No documents yet</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Document View Modal */}
      {showDocumentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedDocument?.icon}</span>
                <h3 className="text-xl font-bold text-gray-900">{selectedDocument?.name}</h3>
              </div>
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 bg-gray-50 p-4 rounded-lg">
                {documentContent}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              {selectedDocument?.actions.includes('download') && (
                <button 
                  onClick={() => handleDownload(selectedDocument)}
                  className="btn-ocean-sm inline-flex items-center gap-2"
                >
                  <FaDownload /> Download
                </button>
              )}
              <button 
                onClick={() => setShowDocumentModal(false)}
                className="btn-ghost-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Upload Signed Invoice Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload Signed Invoice</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              Please upload the signed invoice PDF to proceed with payment.
            </p>
            
            <div className="mb-4">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setInvoiceFile(e.target.files[0])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none p-2"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUploadSignedInvoice}
                disabled={!invoiceFile || uploadingInvoice}
                className="btn-ocean w-full disabled:opacity-50"
              >
                {uploadingInvoice ? 'Uploading...' : '✓ Upload Signed Invoice'}
              </button>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="btn-ghost-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OperationalChainWithDocuments;
