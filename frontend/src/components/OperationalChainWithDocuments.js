import React, { useState } from 'react';
import { FaDownload, FaEye, FaCheckCircle, FaUpload, FaClock, FaTimes } from 'react-icons/fa';
import { 
  generateInvoice, 
  generateReceipt, 
  generateCertificate,
  generateAcceptanceAct,
  generateDownloadConfirmation,
  generatePaymentProof,
  generateClientMaterialTemplate,
  generatePayPalPaymentReference,
  generateOrderConfirmation,
  generateDeliveryCertificate
} from '../utils/documentGenerators';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// UTC Timezone Helper Functions (matching documentGenerators.js)
const formatDateUTC = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: 'UTC'
  });
};

const formatDateTimeUTC = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }) + ' UTC';
};

const formatDateShortUTC = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: 'UTC'
  });
};

function OperationalChainWithDocuments({ project, onUpdate }) {
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentContent, setDocumentContent] = useState('');
  
  // Upload document (invoice or delivery confirmation)
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadContext, setUploadContext] = useState(null); // 'invoice' or 'delivery'
  
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
Date Submitted: ${formatDateUTC(project.created_at)}
${project.order_activated_at ? `Order Activated: ${formatDateTimeUTC(project.order_activated_at)}` : ''}

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
Date: ${formatDateShortUTC(project.quote_request_created_at || project.order_activated_at)}

═══════════════════════════════════════════════

${project.quote_request_manager_comments || 'No notes available'}`;
        break;
        
      case 'invoice':
        content = generateInvoice(project);
        break;
        
      case 'payment_confirmation':
        content = `PAYMENT CONFIRMATION
═══════════════════════════════════════════════

Project: ${project.project_number}
Amount: $${project.quote_amount || '0.00'} USD
Payment Method: ${project.order_activation_payment_method || 'paypal'}

Transaction ID: ${project.paypal_transaction_id || 'N/A'}

From (Payer): ${project.paypal_payer_email || project.user_email || 'N/A'}
To (Recipient): Individual Entrepreneur Vera Iambaeva
                PayPal Account: 302335809@postbox.ge

Status: ${project.payment_confirmed_by_admin ? '✅ Confirmed by Manager' : '⏳ Pending Manager Confirmation'}

═══════════════════════════════════════════════`;
        break;
        
      case 'receipt':
        content = generateReceipt(project);
        break;
        
      case 'certificate':
        content = generateCertificate(project);
        break;
        
      case 'order_confirmation':
        content = generateOrderConfirmation(project);
        break;
        
      case 'delivery_certificate':
      case 'delivery_certificate_pending':
        content = generateDeliveryCertificate(project);
        break;
        
      case 'payment_proof':
        content = generatePaymentProof(project);
        break;
        
      case 'payment_instructions':
      case 'paypal_instructions':
        content = generatePayPalPaymentReference(project);
        break;
        
      case 'production_notes':
        // Production notes - informational update about work in progress or completed
        const productionStartDate = formatDateUTC(project.production_started_at) || 'N/A';
        
        const deliveredDate = formatDateUTC(project.delivered_at);
        
        // Determine current status
        let productionStatus = '🎬 PRODUCTION IN PROGRESS';
        let statusText = 'Your project is currently in active production.';
        
        if (project.completed_at) {
          productionStatus = '✅ PRODUCTION COMPLETED';
          statusText = `Production was completed and delivered on ${deliveredDate}.`;
        } else if (project.delivered_at) {
          productionStatus = '✅ PRODUCTION COMPLETED';
          statusText = `Production was completed and delivered on ${deliveredDate}.`;
        }
        
        content = `PRODUCTION UPDATE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
${project.completed_at || project.delivered_at ? 'Completed' : 'Work in Progress'}

Project: ${project.project_number}
Project Title: ${project.project_title || ''}
Production Started: ${productionStartDate}
${deliveredDate ? `Production Completed: ${deliveredDate}` : ''}

═══════════════════════════════════════════════

STATUS: ${productionStatus}

${statusText}

Service Type: ${project.service_type === 'custom_video' ? 'Custom Video Production' : project.service_type}

Brief:
${project.detailed_brief || 'No description provided'}

═══════════════════════════════════════════════

PRODUCTION TIMELINE:

Production Phase: ${project.completed_at || project.delivered_at ? 'Completed' : 'Active'}
${project.completed_at || project.delivered_at ? `Delivered: ${deliveredDate}` : 'Estimated Delivery: As per invoice timeline'}
Current Status: ${project.completed_at || project.delivered_at ? 'Completed and delivered' : 'Work in progress'}

${project.completed_at || project.delivered_at 
  ? 'Production has been completed and deliverables are available.'
  : 'The production team is working on your project.\nYou will be notified when deliverables are ready.'}

═══════════════════════════════════════════════

UPDATES:

${project.production_notes || 'Production is proceeding according to plan. No additional updates at this time.'}

═══════════════════════════════════════════════

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com

═══════════════════════════════════════════════`;
        break;
        
      case 'download_confirmation':
        content = generateDownloadConfirmation(project);
        break;
        
      case 'access_pending':
        content = `DOWNLOAD CONFIRMATION (Template Preview)
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Client: ${project.user_name}

═══════════════════════════════════════════════

FILES READY FOR DOWNLOAD:

Status: ⏳ AWAITING CLIENT CONFIRMATION

Once you download the deliverable files and click 
"Confirm Access", this document will be automatically 
generated with the timestamp of your download.

═══════════════════════════════════════════════

DELIVERABLE FILES AVAILABLE:
${project.deliverables && project.deliverables.length > 0 ? 
  project.deliverables.filter(d => d.is_final).map((d, idx) => `${idx + 1}. ${d.file_name || 'Video file'}`).join('\n') : 
  'Final video files'}

IMPORTANT: This confirmation is required for:
- PayPal/Stripe dispute protection
- Proof of delivery and client file access
- Payment processing authorization

Please download the files and click "Confirm Access" to proceed.`;
        break;
        
      case 'acceptance_act':
        content = generateAcceptanceAct(project);
        break;
        
      case 'acceptance_pending':
        content = `ACCEPTANCE ACT (Template Preview)
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
ACT OF WORK ACCEPTANCE (Акт приёмки-сдачи работ)

Project: ${project.project_number}
Client: ${project.user_name}
Service: ${project.service_type}

═══════════════════════════════════════════════

WORK DESCRIPTION:

${project.detailed_brief || 'Digital video production services'}

DELIVERABLES:
${project.deliverables && project.deliverables.length > 0 ? 
  project.deliverables.filter(d => d.is_final).map((d, idx) => `${idx + 1}. ${d.file_name || 'Video file'}`).join('\n') : 
  'Final video files'}

═══════════════════════════════════════════════

STATUS: ⏳ AWAITING CLIENT SIGNATURE

This is a TEMPLATE preview of the Acceptance Act that will be 
generated once you upload the signed document.

NEXT STEPS:
1. Download this template
2. Review all deliverable files
3. If quality is satisfactory, sign this document
4. Upload the signed document using the Upload button

═══════════════════════════════════════════════

IMPORTANT: This acceptance is required BEFORE payment.
It confirms you accept the work quality and completeness.

This confirms client acceptance of delivered materials 
for PayPal/Stripe payment processing protection.`;
        break;
        
      case 'delivery_receipt':
        content = `DELIVERY CONFIRMATION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${project.project_number}
Client: ${project.user_name}

═══════════════════════════════════════════════

I, ${project.user_name}, hereby confirm that I have received and 
downloaded the final deliverables for this project.

Delivery Date: ${formatDateUTC(project.delivered_at) || 'N/A'}
Confirmed on: ${formatDateTimeUTC(project.delivery_confirmed_at) || 'N/A'}

═══════════════════════════════════════════════

This confirmation is required for payment processing and serves as 
acknowledgment that all digital deliverables have been successfully 
received by the client.

STATUS: ✅ DELIVERY CONFIRMED`;
        break;
        
      default:
        // For client files (scripts, materials)
        if (doc.type === 'client_file') {
          content = generateClientMaterialTemplate({
            name: doc.name,
            type: doc.name.toLowerCase().includes('script') ? 'script' : 'document',
            uploadedBy: doc.createdBy,
            uploadedAt: doc.createdAt
          });
        } else if (doc.type === 'deliverable') {
          content = `VIDEO DELIVERABLE
═══════════════════════════════════════════════

Filename: ${doc.name}
Type: ${doc.status === 'final' ? 'Final Version' : 'Intermediate Draft'}
Uploaded: ${formatDateShortUTC(doc.createdAt)}

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
  const handleDownload = async (doc) => {
    console.log('🔽 Download clicked for:', doc);
    
    try {
      // Map frontend document IDs to backend doc_types
      const docTypeMap = {
        'quote_request': 'quote_request',
        'order_confirmation': 'order_confirmation',
        'invoice': 'invoice',
        'signed_invoice': 'invoice',
        'delivery_certificate': 'delivery_certificate',
        'download_confirmation': 'delivery_certificate', // Maps to delivery certificate
        'acceptance_act': 'acceptance_act',
        'acceptance_pending': 'acceptance_act',
        'paypal_instructions': 'payment_instructions',
        'payment_proof': 'payment_proof',
        'payment_pending': 'payment_proof',
        'receipt': 'receipt',
        'certificate': 'certificate'
      };
      
      const docType = docTypeMap[doc.id];
      
      if (!docType) {
        console.error('❌ Unknown document type:', doc.id);
        alert(`Download not available for "${doc.name}".`);
        return;
      }
      
      console.log('📄 Document type mapped to:', docType);
      
      // Check if this is an uploaded document (signed/confirmed)
      const isUploaded = project.client_confirmations && project.client_confirmations[docType];
      
      // PDF-enabled document types
      const pdfDocTypes = ['invoice', 'acceptance_act', 'receipt', 'certificate'];
      
      let downloadUrl;
      let fileExtension = 'txt';
      
      if (isUploaded) {
        // Download uploaded/signed version
        downloadUrl = `${API}/projects/${project.id}/documents/${docType}/download`;
        fileExtension = 'pdf';
        console.log('📥 Downloading uploaded document');
      } else if (pdfDocTypes.includes(docType)) {
        // Generate and download as PDF
        downloadUrl = `${API}/projects/${project.id}/documents/${docType}/pdf`;
        fileExtension = 'pdf';
        console.log('📥 Generating PDF document');
      } else {
        // Other document types - use old TXT generation endpoint
        downloadUrl = `${API}/projects/${project.id}/documents/${docType}/generate`;
        fileExtension = 'txt';
        console.log('📥 Generating TXT document');
      }
      
      console.log('🌐 Download URL:', downloadUrl);
      
      // Download with auth token
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });
      
      console.log('✅ Document received, creating preview...');
      
      // Create blob URL  
      const blob = new Blob([response.data], { 
        type: fileExtension === 'pdf' ? 'application/pdf' : 'text/plain'
      });
      const url = window.URL.createObjectURL(blob);
      
      // Try to open in new window
      const docWindow = window.open(url, '_blank');
      
      if (docWindow) {
        console.log(`✅ ${doc.name} opened in new window`);
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // Fallback: Direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.project_number}_${docType}.${fileExtension}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log(`✅ ${doc.name} downloaded`);
      }
      
    } catch (error) {
      console.error('❌ Download error:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to download document. Please try again.');
    }
  };

  
  // Handle Upload Document (Invoice, Acceptance Act, Payment Proof, or Delivery Certificate)
  const handleUploadDocument = async () => {
    if (!uploadFile) {
      alert('Please select a file to upload');
      return;
    }

    setUploadingDocument(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);

      // Map upload context to backend doc_type
      const docTypeMap = {
        'invoice': 'invoice',
        'acceptance': 'acceptance_act',
        'payment': 'payment_proof',
        'delivery': 'delivery_certificate'
      };
      
      const docType = docTypeMap[uploadContext];
      
      if (!docType) {
        alert('Invalid upload context');
        return;
      }

      // Use new upload endpoint
      await axios.post(
        `${API}/projects/${project.id}/documents/${docType}/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      const successMessages = {
        'invoice': '✅ Signed invoice uploaded successfully!',
        'delivery': '✅ Certificate of Delivery uploaded successfully!',
        'acceptance': '✅ Acceptance act uploaded successfully!',
        'payment': '✅ Payment proof uploaded successfully!'
      };
      
      alert(successMessages[uploadContext] || '✅ Document uploaded successfully!');

      setUploadFile(null);
      setShowUploadModal(false);
      setUploadContext(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    } finally {
      setUploadingDocument(false);
    }
  };
  
  // Get all documents for a specific step
  const getDocumentsForStep = (stepKey) => {
    const docs = [];
    
    switch(stepKey) {
      case 'submitted':
        // Quote Request document (system - no upload)
        docs.push({
          id: 'quote_request',
          name: 'Quote Request',
          type: 'system',
          createdBy: 'System',
          createdAt: project.created_at,
          status: 'generated',
          icon: '📄',
          actions: ['view', 'download', 'upload:disabled:System document']
        });
        break;
        
      case 'order_activated':
        // Order Confirmation - NEW
        if (project.order_activated_at) {
          docs.push({
            id: 'order_confirmation',
            name: 'Order Confirmation',
            type: 'order_confirmation',
            createdBy: 'System',
            createdAt: project.order_activated_at,
            status: 'generated',
            icon: '✅',
            actions: ['view', 'download', 'upload:disabled:Auto-generated']
          });
        }
        
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
        
        // Manager's Comments (text notes - no upload)
        if (project.quote_request_manager_comments) {
          docs.push({
            id: 'manager_comments',
            name: "Manager's Notes",
            type: 'manager_notes',
            createdBy: 'Manager',
            createdAt: project.quote_request_created_at || project.order_activated_at,
            status: 'added',
            icon: '💬',
            actions: ['view', 'download', 'upload:disabled:Read-only notes']
          });
        }
        break;
        
      case 'invoice_sent':
        // Invoice document - unified: view, download, upload (if unsigned)
        const invoiceNumber = project.document_numbers?.invoice || `Invoice #${project.project_number?.split('-')[0] || 'N/A'}`;
        docs.push({
          id: 'invoice',
          name: invoiceNumber,
          type: 'financial',
          createdBy: 'Manager',
          createdAt: project.invoice_sent_at,
          status: project.invoice_signed_at ? 'signed' : 'awaiting_signature',
          icon: '📃',
          amount: project.quote_amount,
          actions: project.invoice_signed_at ? ['view', 'download'] : ['view', 'download', 'upload']
        });
        break;
        
      case 'invoice_signed':
        // Signed Invoice - unified: view, download, upload
        if (project.invoice_signed_at) {
          docs.push({
            id: 'signed_invoice',
            name: 'Signed Invoice',
            type: 'client_document',
            createdBy: 'Client',
            createdAt: project.invoice_signed_at,
            status: 'signed_by_client',
            icon: '✅',
            actions: ['view', 'download', 'upload']
          });
        }
        break;
        
      case 'production_started':
        // Production notes (text notes - no upload)
        if (project.production_notes) {
          // Determine status based on project progress
          let noteStatus = 'in_progress';
          if (project.completed_at) {
            noteStatus = 'completed';
          } else if (project.delivered_at) {
            noteStatus = 'completed';
          }
          
          docs.push({
            id: 'production_notes',
            name: 'Production Notes',
            type: 'notes',
            createdBy: 'Manager',
            createdAt: project.production_started_at,
            status: noteStatus,
            icon: '📝',
            actions: ['view', 'download', 'upload:disabled:Read-only notes']
          });
        }
        break;
        
      case 'delivered':
        // Deliverables (videos) - no upload (client cannot upload deliverables)
        if (project.deliverables && project.deliverables.length > 0) {
          // Find first final deliverable
          const finalDeliverable = project.deliverables.find(d => d.is_final === true);
          
          if (finalDeliverable) {
            docs.push({
              id: 'final_deliverable',
              name: finalDeliverable.file_name || 'Final_Video.mp4',
              type: 'deliverable',
              createdBy: 'Production',
              createdAt: finalDeliverable.uploaded_at || project.delivered_at,
              status: 'final',
              icon: '🎬',
              actions: ['view', 'download', 'upload:disabled:Deliverable file']
            });
          }
        }
        break;
        
      case 'files_accessed':
        // Files Accessed - Client downloaded deliverables
        if (project.files_accessed_at) {
          // Files already accessed
          docs.push({
            id: 'download_confirmation',
            name: 'Download Confirmation',
            type: 'access_log',
            createdBy: 'System',
            createdAt: project.files_accessed_at,
            status: 'confirmed',
            icon: '📥',
            actions: ['view', 'download', 'upload:disabled:Auto-generated log']
          });
        } else if (project.delivered_at) {
          // Waiting for client to access files
          docs.push({
            id: 'access_pending',
            name: 'Confirm Download',
            type: 'action_required',
            createdBy: 'Client',
            createdAt: project.delivered_at,
            status: 'pending_access',
            icon: '📥',
            actions: ['view', 'download:disabled:Not accessed yet', 'confirm_access']
          });
        }
        break;
        
      case 'delivery_confirmed':
        // Delivery Confirmed - Client signed Certificate of Delivery (CRITICAL for PayPal)
        if (project.delivery_confirmed_at) {
          // Certificate of Delivery uploaded and signed
          const delCertNumber = project.document_numbers?.delivery_certificate || 'Certificate of Delivery';
          docs.push({
            id: 'delivery_certificate',
            name: delCertNumber,
            type: 'delivery_certificate',
            createdBy: 'Client',
            createdAt: project.delivery_confirmed_at,
            status: 'signed',
            icon: '📜',
            actions: ['view', 'download', 'upload:disabled:Already signed']
          });
        } else if (project.files_accessed_at) {
          // Files accessed, waiting for delivery certificate signature
          const delCertNumber = project.document_numbers?.delivery_certificate || 'Certificate of Delivery';
          docs.push({
            id: 'delivery_certificate',
            name: delCertNumber,
            type: 'delivery_certificate_pending',
            createdBy: 'System',
            createdAt: project.files_accessed_at,
            status: 'pending_signature',
            icon: '📜',
            actions: ['view', 'download', 'upload']
          });
        }
        break;
        
      case 'work_accepted':
        // Work Accepted - Client signed acceptance act
        if (project.work_accepted_at) {
          // Acceptance document uploaded - can view and download signed version
          const accActNumber = project.document_numbers?.acceptance_act || 'Acceptance Act';
          docs.push({
            id: 'acceptance_act',
            name: accActNumber,
            type: 'acceptance',
            createdBy: 'Client',
            createdAt: project.work_accepted_at,
            status: 'signed',
            icon: '✅',
            actions: ['view', 'download', 'upload:disabled:Already signed']
          });
          
          // PayPal Payment Instructions - ALWAYS show after work is accepted
          // Change status based on payment state, but NEVER hide
          docs.push({
            id: 'paypal_instructions',
            name: '💳 Payment Instructions',
            type: 'payment_instructions',
            createdBy: 'System',
            createdAt: project.work_accepted_at,
            status: project.payment_marked_by_client_at ? 'payment_completed' : 'payment_due',
            icon: '📋',
            actions: ['view', 'download:disabled:Instructions only', 'upload:disabled:Use PayPal directly']
          });
        } else if (project.files_accessed_at) {
          // Files accessed, waiting for acceptance - can view template and upload signed version
          const accActNumber = project.document_numbers?.acceptance_act || 'Acceptance Act';
          docs.push({
            id: 'acceptance_pending',
            name: accActNumber,
            type: 'acceptance_pending',
            createdBy: 'Client',
            createdAt: project.files_accessed_at,
            status: 'pending_signature',
            icon: '📝',
            actions: ['view', 'download:disabled:Not signed yet', 'upload']
          });
        }
        break;
        
      case 'payment_sent':
        // Payment Proof uploaded by client
        if (project.paypal_transaction_id || project.payment_marked_by_client_at) {
          // Payment proof already uploaded
          docs.push({
            id: 'payment_proof',
            name: 'Payment Proof',
            type: 'payment_proof',
            createdBy: 'Client',
            createdAt: project.payment_marked_by_client_at,
            status: project.payment_confirmed_by_admin_at ? 'confirmed' : 'pending_confirmation',
            icon: '💳',
            actions: ['view', 'download', 'upload']
          });
        } else if (project.work_accepted_at) {
          // Work accepted, waiting for payment proof upload
          docs.push({
            id: 'payment_pending',
            name: 'Payment Proof',
            type: 'payment_pending',
            createdBy: 'Client',
            createdAt: project.work_accepted_at,
            status: 'pending_upload',
            icon: '💳',
            actions: ['view:disabled:No payment proof yet', 'download:disabled:No payment proof yet', 'upload']
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
        if (project.payment_confirmed_by_admin_at) {
          const receiptNumber = project.document_numbers?.receipt || 'Receipt';
          docs.push({
            id: 'receipt',
            name: receiptNumber,
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
        // Certificate of Completion - NEW
        if (project.completed_at) {
          const certNumber = project.document_numbers?.completion_certificate || 'Certificate of Completion';
          docs.push({
            id: 'certificate',
            name: certNumber,
            type: 'certificate_completion',
            createdBy: 'System',
            createdAt: project.completed_at,
            status: 'issued',
            icon: '🏆',
            actions: ['view', 'download', 'upload:disabled:Auto-generated']
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
      description: (project.completed_at || project.delivered_at) ? 'Completed' : 'Work in progress',
      color: (project.completed_at || project.delivered_at) ? 'green' : 'orange',
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
      key: 'files_accessed',
      label: 'Files Accessed',
      date: project.files_accessed_at,
      description: 'Client downloaded files',
      color: 'cyan',
      completed: !!project.files_accessed_at
    },
    {
      key: 'delivery_confirmed',
      label: 'Delivery Confirmed',
      date: project.delivery_confirmed_at,
      description: 'Client signed delivery certificate',
      color: 'indigo',
      completed: !!project.delivery_confirmed_at
    },
    {
      key: 'work_accepted',
      label: 'Work Accepted',
      date: project.work_accepted_at,
      description: 'Client signed acceptance',
      color: 'emerald',
      completed: !!project.work_accepted_at
    },
    {
      key: 'payment_sent',
      label: 'Payment Sent',
      date: project.payment_marked_by_client_at,
      description: 'Payment proof uploaded',
      color: 'blue',
      completed: !!(project.paypal_transaction_id || project.payment_marked_by_client_at)
    },
    {
      key: 'payment_received',
      label: 'Payment Received',
      date: project.payment_confirmed_by_admin_at,
      description: 'Payment confirmed by manager',
      color: 'green',
      completed: !!project.payment_confirmed_by_admin_at
    },
    {
      key: 'completed',
      label: 'Completed',
      date: project.completed_at,
      description: 'Deal closed, all docs signed',
      color: 'gray',
      completed: !!project.completed_at
    }
  ];
  
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
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

  // Download Operational Chain PDF
  const handleDownloadOperationalChainPDF = async () => {
    try {
      console.log('📥 Starting Operational Chain PDF download...');
      
      // Download with auth token
      const response = await axios.get(
        `${API}/projects/${project.id}/operational-chain/pdf`,
        { responseType: 'blob' }
      );
      
      console.log('✅ PDF received, creating preview...');
      
      // Create blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Open in new window with blob URL (works in sandbox)
      const pdfWindow = window.open(url, '_blank');
      
      if (pdfWindow) {
        console.log('✅ PDF opened in new window');
        // Cleanup after window is opened
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // Fallback: Download directly
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.project_number}_Operational_Chain.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('✅ PDF downloaded');
      }
      
    } catch (error) {
      console.error('❌ PDF error:', error);
      alert(`Failed to load PDF: ${error.response?.data?.detail || error.message}`);
    }
  };


  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Operational Chain & Documents</h2>
        <button
          onClick={handleDownloadOperationalChainPDF}
          className="btn-ocean inline-flex items-center gap-2"
        >
          <FaDownload /> Download Operational Chain PDF
        </button>
      </div>
      
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
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <span className="text-2xl flex-shrink-0">{doc.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm text-gray-900 truncate" title={doc.name}>
                                  {doc.name}
                                </p>
                                {getStatusBadge(doc.status)}
                              </div>
                              <p className="text-xs text-gray-500 truncate">
                                by {doc.createdBy} • {formatDate(doc.createdAt)}
                                {doc.amount && ` • $${doc.amount}`}
                              </p>
                            </div>
                          </div>
                          
                          {/* Action buttons - UNIFIED ORDER with FIXED ALIGNMENT */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {/* View button - always show if in actions */}
                            {(() => {
                              const viewAction = doc.actions.find(a => a === 'view' || a.startsWith('view:'));
                              if (!viewAction) return null;
                              
                              const isDisabled = viewAction.startsWith('view:disabled');
                              const disabledReason = isDisabled ? viewAction.split(':')[2] || 'Not available' : '';
                              
                              return (
                                <button 
                                  onClick={() => !isDisabled && handleViewDocument(doc)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDisabled 
                                      ? 'text-gray-400 cursor-not-allowed opacity-40' 
                                      : 'text-sky-600 hover:bg-sky-50'
                                  }`}
                                  title={isDisabled ? `View not available: ${disabledReason}` : 'View'}
                                  disabled={isDisabled}
                                >
                                  <FaEye />
                                </button>
                              );
                            })()}
                            
                            {/* Download button - always show if in actions */}
                            {(() => {
                              const downloadAction = doc.actions.find(a => a === 'download' || a.startsWith('download:'));
                              if (!downloadAction) return null;
                              
                              const isDisabled = downloadAction.startsWith('download:disabled');
                              const disabledReason = isDisabled ? downloadAction.split(':')[2] || 'Not available' : '';
                              
                              return (
                                <button 
                                  onClick={() => !isDisabled && handleDownload(doc)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDisabled 
                                      ? 'text-gray-400 cursor-not-allowed opacity-40' 
                                      : 'text-teal-600 hover:bg-teal-50'
                                  }`}
                                  title={isDisabled ? `Download not available: ${disabledReason}` : 'Download'}
                                  disabled={isDisabled}
                                >
                                  <FaDownload />
                                </button>
                              );
                            })()}
                            
                            {/* Upload button - always show, but disabled if needed */}
                            {(() => {
                              const uploadAction = doc.actions.find(a => a === 'upload' || a.startsWith('upload:'));
                              if (!uploadAction) return null;
                              
                              const isDisabled = uploadAction.startsWith('upload:disabled');
                              const disabledReason = isDisabled ? uploadAction.split(':')[2] || 'Not available' : '';
                              
                              // Determine upload context
                              const getUploadContext = () => {
                                if (doc.id === 'delivery_certificate') return 'delivery';
                                if (doc.id === 'acceptance_pending' || doc.id === 'acceptance_act') return 'acceptance';
                                if (doc.id === 'payment_pending' || doc.id === 'payment_proof') return 'payment';
                                return 'invoice';
                              };
                              
                              return (
                                <button 
                                  onClick={() => {
                                    if (!isDisabled) {
                                      setUploadContext(getUploadContext());
                                      setShowUploadModal(true);
                                    }
                                  }}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isDisabled 
                                      ? 'text-gray-400 cursor-not-allowed opacity-40' 
                                      : 'text-purple-600 hover:bg-purple-50'
                                  }`}
                                  title={isDisabled ? `Upload not available: ${disabledReason}` : 'Upload Signed Document'}
                                  disabled={isDisabled}
                                >
                                  <FaUpload />
                                </button>
                              );
                            })()}
                            
                            {/* Confirm Access button - for files_accessed step */}
                            {doc.actions.includes('confirm_access') && (
                              <button 
                                onClick={async () => {
                                  if (confirm('Have you downloaded the deliverable files?')) {
                                    try {
                                      await axios.post(`${API}/projects/${project.id}/confirm-access`);
                                      alert('✅ Download confirmed!');
                                      if (onUpdate) onUpdate();
                                    } catch (error) {
                                      console.error('Error confirming access:', error);
                                      alert('Failed to confirm download. Please try again.');
                                    }
                                  }
                                }}
                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                                title="Confirm Download"
                              >
                                <FaCheckCircle />
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
                  <FaDownload /> Download as {['invoice', 'acceptance_act', 'receipt', 'certificate'].includes(selectedDocument?.id) ? 'PDF' : 'TXT'}
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
      
      {/* Upload Document Modal (Invoice or Delivery Confirmation) */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {uploadContext === 'delivery' ? 'Upload Signed Certificate of Delivery' :
                 uploadContext === 'acceptance' ? 'Upload Signed Acceptance Act' : 
                 uploadContext === 'payment' ? 'Upload Payment Proof' :
                 'Upload Signed Invoice'}
              </h3>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadContext(null);
                  setUploadFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">
              {uploadContext === 'delivery'
                ? 'Please upload the signed Certificate of Delivery to confirm you received the digital files. This is required for PayPal compliance.'
                : uploadContext === 'acceptance'
                ? 'Please upload the signed Acceptance Act (Акт приёмки-сдачи работ) to confirm that the work meets your requirements.'
                : uploadContext === 'payment'
                ? 'Please upload proof of payment (screenshot, receipt, or confirmation) to confirm the transaction.'
                : 'Please upload the signed invoice PDF to proceed with payment.'}
            </p>
            
            <div className="mb-4">
              <input
                type="file"
                accept={uploadContext === 'payment' ? 'image/*,.pdf' : '.pdf'}
                onChange={(e) => setUploadFile(e.target.files[0])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none p-2"
              />
              {uploadContext === 'payment' && (
                <p className="text-xs text-gray-500 mt-1">Accepted: PDF, PNG, JPG (screenshot or receipt)</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleUploadDocument}
                disabled={!uploadFile || uploadingDocument}
                className="btn-ocean w-full disabled:opacity-50"
              >
                {uploadingDocument ? 'Uploading...' : 
                  uploadContext === 'delivery' ? '✓ Upload Certificate' :
                  uploadContext === 'acceptance' ? '✓ Upload Acceptance Act' :
                  uploadContext === 'payment' ? '✓ Upload Payment Proof' :
                  '✓ Upload Invoice'}
              </button>
              <button 
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadContext(null);
                  setUploadFile(null);
                }}
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
