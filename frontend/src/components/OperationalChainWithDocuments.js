import React from 'react';
import { FaDownload, FaEye, FaCheckCircle, FaUpload, FaClock } from 'react-icons/fa';

function OperationalChainWithDocuments({ project }) {
  
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
                              <button className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="View">
                                <FaEye />
                              </button>
                            )}
                            {doc.actions.includes('download') && (
                              <button className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Download">
                                <FaDownload />
                              </button>
                            )}
                            {doc.actions.includes('upload_signed') && !project.invoice_signed_at && (
                              <button className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Upload Signed">
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
    </div>
  );
}

export default OperationalChainWithDocuments;
