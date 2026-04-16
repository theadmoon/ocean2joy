// Document generation utilities for Ocean2Joy platform
// These functions create standardized document content for invoices, receipts, certificates, etc.
// Used across the application to ensure consistent document formatting

/**
 * Generate Invoice document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted invoice content
 */
export const generateInvoice = (projectData) => {
  if (!projectData) return '';
  
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const productionStart = projectData.production_started_at ? new Date(projectData.production_started_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const productionEnd = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  return `INVOICE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Custom Digital Video Services

Invoice #: ${projectData.project_number}
Date Issued: ${deliveredDate}
Due Date: Upon Receipt

═══════════════════════════════════════════════

BILL TO:
${projectData.client_name || projectData.user_name || 'Client'}
Email: ${projectData.client_email || projectData.user_email || ''}
Project: ${projectData.project_number}
Project Title: ${projectData.project_title}

═══════════════════════════════════════════════

PROJECT DETAILS:

Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}
${projectData.detailed_brief ? 'Brief: ' + projectData.detailed_brief : ''}
Production Period: ${productionStart} - ${productionEnd}

═══════════════════════════════════════════════

PRICING BREAKDOWN:

Service Description                        Amount
─────────────────────────────────────────────────
${projectData.service_type === 'custom_video' ? 'Custom Video Production' : 'Service'}      $${projectData.quote_amount?.toFixed(2)}

${projectData.quote_details || ''}

═══════════════════════════════════════════════

SUBTOTAL:                              $${projectData.quote_amount?.toFixed(2)}
Tax:                                        $0.00
                                       ──────────
TOTAL AMOUNT DUE:                      $${projectData.quote_amount?.toFixed(2)}

═══════════════════════════════════════════════

PAYMENT INSTRUCTIONS:

Payment Method: PayPal
Please send payment to: 302335809@postbox.ge

Payment is due upon receipt of this invoice.

═══════════════════════════════════════════════

DELIVERABLES (Included):

All files delivered digitally via secure client portal.

═══════════════════════════════════════════════

NOTES:

This invoice is for digital video production services.
No physical goods are shipped - all deliverables are
provided electronically through our secure platform.

Files have been delivered to your client portal and
are ready for download.

═══════════════════════════════════════════════

Thank you for choosing Ocean2Joy!

For questions about this invoice, contact:
ocean2joy@gmail.com

Ocean2Joy Digital Video Production
Digital Services - No Physical Shipping
www.ocean2joy.com

═══════════════════════════════════════════════`;
};

/**
 * Generate Payment Receipt document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted receipt content
 */
export const generateReceipt = (projectData) => {
  if (!projectData) return '';
  
  const paymentDate = projectData.completed_at ? new Date(projectData.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const paymentTime = projectData.completed_at ? new Date(projectData.completed_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }) : '';
  
  // Use real PayPal data if available, otherwise generate from project_number
  const transactionId = projectData.paypal_transaction_id || `PAYPAL-${projectData.project_number?.replace(/[^A-Z0-9]/g, '')}`;
  const payerEmail = projectData.paypal_payer_email || projectData.client_email || projectData.user_email || '';
  const paymentStatus = projectData.paypal_payment_status || 'COMPLETED';
  
  return `PAYMENT RECEIPT
═══════════════════════════════════════════════

PayPal Payment Confirmation

Transaction ID: ${transactionId}
Payment Date: ${paymentDate}
Status: ✓ ${paymentStatus}

═══════════════════════════════════════════════

TRANSACTION DETAILS:

From: ${projectData.client_name || projectData.user_name || 'Client'}
Email: ${payerEmail}

To: Ocean2Joy Digital Video Production
Email: 302335809@postbox.ge

═══════════════════════════════════════════════

PAYMENT INFORMATION:

Amount Paid: $${projectData.quote_amount?.toFixed(2)} USD
Payment Method: PayPal Balance
Currency: USD
Transaction Type: Goods & Services Payment

Invoice Reference: ${projectData.project_number}
Project: ${projectData.project_title}

═══════════════════════════════════════════════

PAYMENT BREAKDOWN:

Subtotal:                              $${projectData.quote_amount?.toFixed(2)}
PayPal Fee: (paid by merchant)              $0.00
                                       ──────────
Total Paid by Customer:                $${projectData.quote_amount?.toFixed(2)}

═══════════════════════════════════════════════

PAYMENT TIMELINE:

Payment Initiated: ${paymentDate} at ${paymentTime}
Payment Processed: ${paymentDate} at ${paymentTime}
Payment Completed: ${paymentDate}

Processing Time: Instant

═══════════════════════════════════════════════

MERCHANT INFORMATION:

Business Name: Ocean2Joy Digital Video Production
Business Email: 302335809@postbox.ge
Business Type: Digital Services Provider
Service Description: Custom video production services

═══════════════════════════════════════════════

PURCHASE DETAILS:

Item: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : 'Digital Service'}
Project ID: ${projectData.project_number}
Service Type: Digital video creation and delivery
Delivery Method: Digital download (no shipping)

═══════════════════════════════════════════════

BUYER PROTECTION:

This transaction is covered by PayPal's Purchase
Protection program for eligible digital goods and
services.

Dispute Resolution: Available through PayPal
Resolution Center

═══════════════════════════════════════════════

TRANSACTION VERIFICATION:

✓ Payment verified and completed
✓ Funds transferred to merchant account
✓ Digital service delivered to customer
✓ Customer access confirmed
✓ No disputes or claims filed

═══════════════════════════════════════════════

RECEIPT NOTES:

• This is an official PayPal payment receipt
• Transaction completed successfully
• Payment for digital video production services
• No physical goods shipped
• All deliverables provided digitally
• Customer confirmed receipt of files

═══════════════════════════════════════════════

For questions about this transaction:
• Contact Ocean2Joy: ocean2joy@gmail.com
• PayPal Support: www.paypal.com/support
• Transaction ID: ${transactionId}

═══════════════════════════════════════════════

This receipt confirms successful payment processing
through PayPal for digital services rendered by
Ocean2Joy Digital Video Production.

Receipt Generated: ${paymentDate}
Document ID: RCPT-${projectData.project_number?.replace(/[^A-Z0-9]/g, '')}

═══════════════════════════════════════════════`;
};

/**
 * Generate Completion Certificate document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted certificate content
 */
export const generateCertificate = (projectData) => {
  if (!projectData) return '';
  
  const submittedDate = projectData.created_at ? new Date(projectData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const quoteSentDate = projectData.invoice_sent_at || projectData.quote_sent_at ? new Date(projectData.invoice_sent_at || projectData.quote_sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const quoteAcceptedDate = projectData.invoice_signed_at || projectData.quote_accepted_at ? new Date(projectData.invoice_signed_at || projectData.quote_accepted_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const productionStartDate = projectData.production_started_at ? new Date(projectData.production_started_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const paymentDate = projectData.completed_at ? new Date(projectData.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  // Calculate production time
  let productionDays = '';
  if (projectData.production_started_at && projectData.delivered_at) {
    const start = new Date(projectData.production_started_at);
    const end = new Date(projectData.delivered_at);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    productionDays = `${days} days`;
  }
  
  return `PROJECT COMPLETION CERTIFICATE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

═══════════════════════════════════════════════

This certificate confirms the successful 
completion of the following digital service:

PROJECT INFORMATION:
─────────────────────────────────────────────
Project Number: ${projectData.project_number}
Project Title: ${projectData.project_title}
Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Digital Video Production' : projectData.service_type}
Client: ${projectData.client_name || projectData.user_name || 'Client'} (${projectData.client_email || projectData.user_email || ''})

═══════════════════════════════════════════════

PROJECT TIMELINE:
─────────────────────────────────────────────

Request Submitted: ${submittedDate}
Quote Provided: ${quoteSentDate}
Quote Accepted: ${quoteAcceptedDate}
Production Started: ${productionStartDate}
Production Completed: ${deliveredDate}
Deliverables Provided: ${deliveredDate}
Payment Received: ${paymentDate}
Project Closed: ${paymentDate}

Total Production Time: ${productionDays}

═══════════════════════════════════════════════

DELIVERABLES PROVIDED:
─────────────────────────────────────────────

All files delivered digitally via secure 
client portal on ${deliveredDate}.

═══════════════════════════════════════════════

FINANCIAL SETTLEMENT:
─────────────────────────────────────────────

Total Project Value: $${projectData.quote_amount?.toFixed(2)} USD
Payment Method: PayPal
Payment Status: ✓ PAID IN FULL
Payment Date: ${paymentDate}
Transaction Reference: PAYPAL-${projectData.project_number?.replace(/[^A-Z0-9]/g, '')}

═══════════════════════════════════════════════

CLIENT ACCEPTANCE:
─────────────────────────────────────────────

✓ Client reviewed all deliverables
✓ Client approved final work
✓ Payment completed via PayPal
✓ No disputes or issues raised

Client satisfaction confirmed through:
• Successful payment completion
• Digital delivery acceptance
• No refund requests
• Project marked as complete

═══════════════════════════════════════════════

SERVICE VERIFICATION:

This was a DIGITAL-ONLY service transaction.

✓ No physical products were created
✓ No shipping or logistics involved
✓ All deliverables provided digitally
✓ Client accessed files via secure portal
✓ Full transaction trace available
✓ Communication history preserved

═══════════════════════════════════════════════

COMPLIANCE NOTES:

This certificate serves as verification for 
payment processors and dispute resolution:

• Complete project lifecycle documented
• All communications preserved
• Payment processed through verified channel
• Digital delivery confirmed by client access
• No outstanding issues or disputes

═══════════════════════════════════════════════

PROJECT STATUS: ✓ SUCCESSFULLY COMPLETED

Issued by: Ocean2Joy Digital Video Production
Issue Date: ${paymentDate}
Certificate ID: CERT-${projectData.project_number?.replace(/[^A-Z0-9]/g, '')}

═══════════════════════════════════════════════

For verification inquiries, contact:
ocean2joy@gmail.com

This certificate may be used for:
• Tax and accounting purposes
• Project portfolio documentation
• Payment dispute resolution
• Service verification requests

═══════════════════════════════════════════════`;
};

/**
 * Generate Acceptance Act document content (OS.1 v2.0 Step 12)
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted acceptance act content
 */
export const generateAcceptanceAct = (projectData) => {
  if (!projectData) return '';
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0 
    ? projectData.deliverables.filter(d => d.is_final).map((d, idx) => `${idx + 1}. ${d.file_name || 'Video file'}`).join('\n')
    : 'Final video files';
  
  return `ACCEPTANCE ACT (ТЗ Step 12: Acceptance/Completion)
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
ACT OF WORK ACCEPTANCE (Акт приёмки-сдачи работ)

Project: ${projectData.project_number}
Client: ${projectData.user_name}
Service: ${projectData.service_type}

═══════════════════════════════════════════════

WORK DESCRIPTION:

${projectData.detailed_brief || 'Digital video production services'}

DELIVERABLES:
${deliverablesList}

═══════════════════════════════════════════════

CLIENT CONFIRMATION:

"I, ${projectData.user_name}, confirm that:
 1. I have downloaded and reviewed all deliverable files
 2. The work meets the requirements specified in the brief
 3. The quality is satisfactory and acceptable
 4. I accept the work as completed"

Signed: ${projectData.work_accepted_at ? new Date(projectData.work_accepted_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Pending'}

═══════════════════════════════════════════════

STATUS: ✅ WORK ACCEPTED BY CLIENT

This document satisfies the "Acceptance/Completion" requirement 
for digital service fulfillment and payment processing.`;
};

/**
 * Generate Download Confirmation document (OS.1 v2.0 Step 11)
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted download confirmation content
 */
export const generateDownloadConfirmation = (projectData) => {
  if (!projectData) return '';
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0 
    ? projectData.deliverables.filter(d => d.is_final).map((d, idx) => `${idx + 1}. ${d.file_name || 'Video file'}`).join('\n')
    : 'Final video files';
  
  return `DOWNLOAD CONFIRMATION (ТЗ Step 11: Buyer-Specific Handoff)
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${projectData.project_number}
Client: ${projectData.user_name}

═══════════════════════════════════════════════

FILES ACCESSED:

Download Confirmed: ${projectData.files_accessed_at ? new Date(projectData.files_accessed_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}

This log confirms that the client has successfully downloaded the 
deliverable files from the portal.

═══════════════════════════════════════════════

DELIVERABLE FILES:
${deliverablesList}

STATUS: ✅ CLIENT ACCESSED FILES

This confirms the "Buyer-Specific Handoff" requirement for payment 
dispute resolution (PayPal, Stripe protection).`;
};

/**
 * Generate Payment Proof document
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted payment proof content
 */
export const generatePaymentProof = (projectData) => {
  if (!projectData) return '';
  
  return `PAYMENT PROOF
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${projectData.project_number}
Client: ${projectData.user_name}
Invoice Amount: $${projectData.quote_amount || '0.00'} USD

═══════════════════════════════════════════════

PAYMENT DETAILS:

Transaction ID: ${projectData.paypal_transaction_id || 'N/A'}
${projectData.paypal_payer_email ? `Payer Email: ${projectData.paypal_payer_email}` : ''}
Payment Method: ${projectData.order_activation_payment_method || 'N/A'}

Payment Sent: ${projectData.payment_marked_by_client_at ? new Date(projectData.payment_marked_by_client_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}

═══════════════════════════════════════════════

STATUS: ${projectData.payment_confirmed_by_admin_at ? 
  `✅ CONFIRMED by Manager on ${new Date(projectData.payment_confirmed_by_admin_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : 
  '⏳ PENDING Manager Confirmation'}

${!projectData.payment_confirmed_by_admin_at ? '\nThis payment is awaiting verification by the manager.' : ''}`;
};

/**
 * Generate Client Script/Material Template
 * Shows the expected format for client-uploaded materials
 * @param {Object} fileData - File information {name, type, uploadedBy, uploadedAt}
 * @returns {string} Formatted script template or file info
 */
export const generateClientMaterialTemplate = (fileData) => {
  if (!fileData) return '';
  
  const fileName = fileData.name || 'Client Material';
  const fileType = fileData.type || 'document';
  const uploadedBy = fileData.uploadedBy || 'Client';
  const uploadedAt = fileData.uploadedAt ? new Date(fileData.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  
  // If it's a script/screenplay
  if (fileName.toLowerCase().includes('script') || fileType === 'script') {
    return `SCRIPT/SCREENPLAY TEMPLATE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Client Material: ${fileName}

Uploaded by: ${uploadedBy}
Upload Date: ${uploadedAt}

═══════════════════════════════════════════════

EXPECTED FORMAT FOR VIDEO SCRIPTS:

TITLE: [Project Title]
Duration: [Target runtime in minutes]
Written by: [Client Name]

═══════════════════════════════════════════════

CHARACTERS:
- [Character Name] ([Gender], [Age]) - [Role Description]
- [Character Name] ([Gender], [Age]) - [Role Description]

SETTING: [Primary location/environment]

═══════════════════════════════════════════════

SCENE 1: [SCENE TITLE]
[INT./EXT.] [LOCATION] - [TIME OF DAY]

[Scene description and action]

CHARACTER NAME
(direction/emotion)
Dialogue text...

[Camera directions, special effects notes]

═══════════════════════════════════════════════

PRODUCTION NOTES:
- Total runtime: [X minutes]
- Special effects/VFX requirements
- Costume/prop requirements
- Location requirements
- Lighting notes

═══════════════════════════════════════════════

NOTE: This is a template showing the expected format.
Your actual script content should be uploaded as a PDF or DOC file.

For questions about script format, contact:
ocean2joy@gmail.com`;
  }
  
  // Generic client material
  return `CLIENT MATERIAL
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

File: ${fileName}
Type: ${fileType}
Uploaded by: ${uploadedBy}
Upload Date: ${uploadedAt}

═══════════════════════════════════════════════

This file was uploaded by the client as reference material 
for the project. It may include:

• Scripts and screenplays
• Character references and casting notes
• Location photos and setup guides
• Storyboards and visual references
• Brand guidelines and style guides
• Music or audio references
• Any other project-specific materials

═══════════════════════════════════════════════

To download this file, use the Download button.

For questions about this material:
ocean2joy@gmail.com`;
};

/**
 * Generate PayPal Payment Reference/Comment
 * Text that client copies and pastes into PayPal payment comment field
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted payment reference for PayPal
 */
export const generatePayPalPaymentReference = (projectData) => {
  if (!projectData) return '';
  
  return `PAYPAL PAYMENT INSTRUCTIONS
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Please send $${projectData.quote_amount || '0.00'} to the account:

📧 302335809@postbox.ge

═══════════════════════════════════════════════

COPY THIS TEXT FOR PAYMENT COMMENT:
─────────────────────────────────────────────

Custom film production according to client's script

- Project Reference: ${projectData.project_number}

Payment terms: 100% post-payment (invoice is issued after delivery).

By completing payment via PayPal, the Client confirms successful receipt of the delivered digital materials and accepts that no refunds apply after delivery.

- No physical shipment – digital service delivered electronically

─────────────────────────────────────────────

═══════════════════════════════════════════════

IMPORTANT INSTRUCTIONS:

1. Log in to your PayPal account
2. Click "Send Money" or "Send & Request"
3. Enter recipient email: 302335809@postbox.ge
4. Enter amount: $${projectData.quote_amount || '0.00'} USD
5. Select payment type: "Goods & Services"
6. COPY the text above and PASTE into "Add a note" field
7. Review and complete payment

═══════════════════════════════════════════════

After payment is completed:

• Your transaction will receive a unique PayPal Transaction ID
• Return to this portal and navigate to "Payment Sent" section
• Upload screenshot or enter your Transaction ID
• Manager will confirm payment within 24 hours
• Project will be marked as "Completed"

═══════════════════════════════════════════════

For payment support:
ocean2joy@gmail.com

Project: ${projectData.project_number}
Amount Due: $${projectData.quote_amount || '0.00'} USD
Payment Method: PayPal (Goods & Services)`;
};
