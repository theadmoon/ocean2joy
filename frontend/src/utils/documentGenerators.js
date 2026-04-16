// Document generation utilities for Ocean2Joy platform
// These functions create standardized document content for invoices, receipts, certificates, etc.
// Used across the application to ensure consistent document formatting

// IMPORTANT: Email addresses
// PayPal Account (for payments): 302335809@postbox.ge
// Contact Email (for support): ocean2joy@gmail.com

/**
 * Generate Invoice document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted invoice content
 */
export const generateInvoice = (projectData) => {
  if (!projectData) return '';
  
  // Use invoice_sent_at as the invoice date
  const invoiceDate = projectData.invoice_sent_at ? new Date(projectData.invoice_sent_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  const productionStart = projectData.production_started_at ? new Date(projectData.production_started_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const productionEnd = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Estimated timeline in agreement';
  
  // Use the short document number from document_numbers.invoice
  const invoiceNumber = projectData.document_numbers?.invoice || projectData.project_number;
  
  return `INVOICE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Custom Digital Video Services

Invoice: ${invoiceNumber}
Date Issued: ${invoiceDate}
Due Date: Upon Delivery of Digital Assets

═══════════════════════════════════════════════

BILL TO:
${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}
Project Reference: ${projectData.project_number}
Project Title: ${projectData.project_title || ''}

═══════════════════════════════════════════════

SERVICE DESCRIPTION:

Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}

Project Brief:
${projectData.detailed_brief || ''}

Estimated Production Period:
Start: ${productionStart}
Delivery: ${productionEnd}

═══════════════════════════════════════════════

PRICING:

Service Fee                           $${projectData.quote_amount?.toFixed(2)} USD

═══════════════════════════════════════════════

SUBTOTAL:                             $${projectData.quote_amount?.toFixed(2)} USD
Tax (Digital Services):                          $0.00
                                      ────────────────
TOTAL AMOUNT DUE:                     $${projectData.quote_amount?.toFixed(2)} USD

═══════════════════════════════════════════════

PAYMENT TERMS:

✓ 100% post-payment model (pay after delivery)
✓ Invoice issued before production begins
✓ Payment due upon delivery of digital files
✓ Payment confirms acceptance of delivered work
✓ No refunds after delivery completion
✓ All deliverables provided electronically

═══════════════════════════════════════════════

PAYMENT METHOD:

${projectData.order_activation_payment_method?.toUpperCase() || 'PAYPAL'}

PayPal Account: 302335809@postbox.ge

Important: Include project reference "${projectData.project_number}"
in payment notes for proper tracking.

═══════════════════════════════════════════════

COMMUNICATION:

All project communication should be conducted through
the secure client portal chat system.

For urgent technical matters only:
ocean2joy@gmail.com

═══════════════════════════════════════════════

NOTES:

• This is a digital service - no physical goods shipped
• All files delivered via secure client portal
• By signing this invoice, you agree to the terms above
• Production begins after invoice confirmation
• Delivery timeline confirmed after production start

═══════════════════════════════════════════════

CLIENT ACCEPTANCE & SIGNATURE:

By signing below, the Client confirms:
✓ Agreement with all terms and pricing stated above
✓ Authorization to begin production
✓ Understanding of payment terms (due upon delivery)

Client Name: ${projectData.user_name || ''}
Email: ${projectData.user_email || ''}
Date: ${invoiceDate}


Signature: ___________________________________________


═══════════════════════════════════════════════

Thank you for choosing Ocean2Joy!
Professional digital video production services.

Ocean2Joy Digital Production
Digital Services - Electronic Delivery Only

═══════════════════════════════════════════════`;
};

/**
 * Generate Payment Receipt document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted receipt content
 */
export const generateReceipt = (projectData) => {
  if (!projectData) return '';
  
  const paymentDate = projectData.payment_confirmed_at ? new Date(projectData.payment_confirmed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const paymentDatetime = projectData.payment_confirmed_at ? new Date(projectData.payment_confirmed_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' }) : '';
  
  const paymentSentDate = projectData.payment_marked_by_client_at ? new Date(projectData.payment_marked_by_client_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' }) : 'N/A';
  
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  const filesAccessedDate = projectData.files_accessed_at ? new Date(projectData.files_accessed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Pending';
  
  const receiptNumber = projectData.document_numbers?.receipt || projectData.project_number;
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0
    ? projectData.deliverables.map(d => `- ${d.file_name || 'File'}`).join('\n')
    : '';
  
  return `PAYMENT RECEIPT
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Official Payment Receipt

Receipt: ${receiptNumber}
Date Issued: ${paymentDate}

═══════════════════════════════════════════════

PAYMENT RECEIVED FROM:
Client: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}
Project Reference: ${projectData.project_number}

═══════════════════════════════════════════════

PAYMENT DETAILS:

Amount Received: $${projectData.quote_amount?.toFixed(2)} USD
Payment Method: ${projectData.order_activation_payment_method?.toUpperCase() || 'PAYPAL'}
Payment Date: ${paymentSentDate}
Payment Confirmed: ${paymentDatetime}
Transaction ID: ${projectData.paypal_transaction_id || 'See payment proof'}
Payment Status: ${projectData.paypal_payment_status || 'COMPLETED'}

═══════════════════════════════════════════════

SERVICES RENDERED:

Project Title: ${projectData.project_title || ''}
Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}

Deliverables:
${deliverablesList}

═══════════════════════════════════════════════

PAYMENT STATUS: ✓ PAID IN FULL

Total Amount: $${projectData.quote_amount?.toFixed(2)} USD
Amount Paid: $${projectData.quote_amount?.toFixed(2)} USD
Balance Due: $0.00 USD

═══════════════════════════════════════════════

DELIVERY CONFIRMATION:

Digital files delivered electronically on:
${deliveredDate}

Delivery Method: Secure client portal
Files Accessed: ${filesAccessedDate}

═══════════════════════════════════════════════

This receipt confirms full payment for digital video
production services. No further payment is required.

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com

═══════════════════════════════════════════════

Ocean2Joy Digital Production
Professional video services delivered digitally

Receipt Date: ${paymentDate}
Project Reference: ${projectData.project_number}

═══════════════════════════════════════════════`;
};

/**
 * Generate Completion Certificate document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted certificate content
 */
export const generateCertificate = (projectData) => {
  if (!projectData) return '';
  
  const completedDate = projectData.completed_at ? new Date(projectData.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  const orderActivatedDate = projectData.order_activated_at ? new Date(projectData.order_activated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const productionStartDate = projectData.production_started_at ? new Date(projectData.production_started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const filesAccessedDate = projectData.files_accessed_at ? new Date(projectData.files_accessed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const deliveryConfirmedDate = projectData.delivery_confirmed_at ? new Date(projectData.delivery_confirmed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const workAcceptedDate = projectData.work_accepted_at ? new Date(projectData.work_accepted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  const paymentReceivedDate = projectData.payment_confirmed_at ? new Date(projectData.payment_confirmed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  
  const certNumber = projectData.document_numbers?.completion_certificate || projectData.project_number;
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0
    ? projectData.deliverables.map(d => `✓ ${d.file_name || 'File'}`).join('\n')
    : '';
  
  return `CERTIFICATE OF COMPLETION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Project Completion Certificate

Certificate: ${certNumber}
Project Reference: ${projectData.project_number}
Completion Date: ${completedDate}

═══════════════════════════════════════════════

This certifies that Ocean2Joy Digital Production has
successfully completed and delivered the following
digital video production service:

═══════════════════════════════════════════════

CLIENT INFORMATION:
Name: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}

═══════════════════════════════════════════════

PROJECT DETAILS:

Project Title: ${projectData.project_title || ''}
Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}

Brief: ${projectData.detailed_brief || ''}

═══════════════════════════════════════════════

DELIVERABLES TRANSFERRED ELECTRONICALLY:

${deliverablesList}

═══════════════════════════════════════════════

PROJECT TIMELINE:

Order Activated: ${orderActivatedDate}
Production Started: ${productionStartDate}
Delivered: ${deliveredDate}
Files Accessed: ${filesAccessedDate}
Delivery Confirmed: ${deliveryConfirmedDate}
Work Accepted: ${workAcceptedDate}
Payment Received: ${paymentReceivedDate}
Completed: ${completedDate}

═══════════════════════════════════════════════

PROJECT STATUS: ✓ SUCCESSFULLY COMPLETED

✓ All deliverables transferred electronically
✓ Client accessed and downloaded files
✓ Client confirmed delivery receipt
✓ Client confirmed receipt of files
✓ Work accepted by client
✓ Payment received and confirmed
✓ Project closed successfully

═══════════════════════════════════════════════

DELIVERY METHOD:
Electronic delivery via secure client portal
No physical shipment (digital service only)

═══════════════════════════════════════════════

This certificate confirms the successful completion
of digital video production services for project
${projectData.project_number}.

Issued by: Ocean2Joy Digital Production
Date: ${completedDate}

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com

═══════════════════════════════════════════════

Thank you for choosing Ocean2Joy!
Professional video production delivered digitally.

═══════════════════════════════════════════════`;
};

/**
 * Generate Acceptance Act document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted acceptance act content
 */
export const generateAcceptanceAct = (projectData) => {
  if (!projectData) return '';
  
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  const actNumber = projectData.document_numbers?.acceptance_act || projectData.project_number;
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0
    ? projectData.deliverables.map(d => `- ${d.file_name || 'File'}`).join('\n')
    : '';
  
  return `ACCEPTANCE ACT
═══════════════════════════════════════════════

Digital Video Production Service
Acceptance Certificate

Act: ${actNumber}
Project Reference: ${projectData.project_number}
Client: ${projectData.user_name || 'Client'}
Service Provider: Ocean2Joy Digital Production

═══════════════════════════════════════════════

PROJECT DETAILS:

Title: ${projectData.project_title || ''}
Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}
Brief: ${projectData.detailed_brief || ''}

Deliverables:
${deliverablesList}

Delivery Date: ${deliveredDate}
Delivery Method: Secure Digital Portal

═══════════════════════════════════════════════

ACCEPTANCE CONFIRMATION:

By signing this document, the Client confirms:

✓ Receipt of all deliverable digital files
✓ Access to files via secure download portal
✓ Acceptance of delivered materials as complete
✓ Agreement that work meets specified requirements
✓ Completion of the service contract

═══════════════════════════════════════════════

CLIENT SIGNATURE:

Name: ${projectData.user_name || ''}
Email: ${projectData.user_email || ''}
Date: ${deliveredDate}


Signature: ___________________________________________


═══════════════════════════════════════════════

This document serves as legal confirmation of service delivery
and client acceptance for project ${projectData.project_number}.

Ocean2Joy Digital Production
All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com`;
};

/**
 * Generate Download Confirmation document
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted download confirmation content
 */
export const generateDownloadConfirmation = (projectData) => {
  if (!projectData) return '';
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0 
    ? projectData.deliverables.filter(d => d.is_final).map((d, idx) => `${idx + 1}. ${d.file_name || 'Video file'}`).join('\n')
    : 'Final video files';
  
  // Generate realistic time (not rounded to 10 minutes)
  const filesAccessedDate = projectData.files_accessed_at ? new Date(projectData.files_accessed_at) : new Date();
  const accessDate = filesAccessedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const accessTime = filesAccessedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  return `DOWNLOAD CONFIRMATION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Deliverable Access Confirmation

Project: ${projectData.project_number}
Client: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}

═══════════════════════════════════════════════

FILES ACCESSED:

Download Confirmed: ${accessDate} at ${accessTime}

This log confirms that the client has successfully downloaded the 
deliverable files from the portal.

═══════════════════════════════════════════════

DELIVERABLE FILES:
${deliverablesList}

STATUS: ✅ CLIENT ACCESSED FILES

This document confirms delivery completion and client access 
to all digital files for payment processor protection.`;
};

/**
 * Generate Payment Proof document
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted payment proof content
 */
export const generatePaymentProof = (projectData) => {
  if (!projectData) return '';
  
  // Generate realistic time (not rounded)
  const paymentSentDate = projectData.payment_marked_by_client_at ? new Date(projectData.payment_marked_by_client_at) : null;
  const paymentSentFormatted = paymentSentDate 
    ? paymentSentDate.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    : 'N/A';
  
  const paymentConfirmedDate = projectData.payment_confirmed_by_admin_at ? new Date(projectData.payment_confirmed_by_admin_at) : null;
  const paymentConfirmedFormatted = paymentConfirmedDate
    ? paymentConfirmedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  
  return `PAYMENT PROOF
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

Project: ${projectData.project_number}
Client: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}
Invoice Amount: $${projectData.quote_amount || '0.00'} USD

═══════════════════════════════════════════════

PAYMENT DETAILS:

Transaction ID: ${projectData.paypal_transaction_id || 'N/A'}
${projectData.paypal_payer_email ? `Payer Email: ${projectData.paypal_payer_email}` : ''}
Payment Method: ${projectData.order_activation_payment_method || 'N/A'}

Payment Sent: ${paymentSentFormatted}

═══════════════════════════════════════════════

STATUS: ${paymentConfirmedFormatted ? 
  `✅ CONFIRMED by Manager on ${paymentConfirmedFormatted}` : 
  '⏳ PENDING Manager Confirmation'}

${!paymentConfirmedFormatted ? '\nThis payment is awaiting verification by the manager.' : ''}`;
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

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com`;
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

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com`;
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

Please send $${projectData.quote_amount || '0.00'} USD to:

📧 PayPal Account: 302335809@postbox.ge
(This is our payment receiving account)

═══════════════════════════════════════════════

✂️ COPY THIS TEXT FOR PAYMENT COMMENT:
─────────────────────────────────────────────

Custom film production according to client's script

- Project Reference: ${projectData.project_number}

Payment terms: 100% post-payment (invoice is issued after delivery).

By completing payment via PayPal, the Client confirms successful receipt of the delivered digital materials and accepts that no refunds apply after delivery.

- No physical shipment – digital service delivered electronically

─────────────────────────────────────────────
(Click anywhere in the text box above, press Ctrl+A to select all, 
then Ctrl+C to copy)

═══════════════════════════════════════════════

STEP-BY-STEP PAYMENT INSTRUCTIONS:

1. Log in to your PayPal account (www.paypal.com)

2. Click "Send Money" or "Send & Request"

3. Enter recipient email: 302335809@postbox.ge
   (This is our PayPal business account for receiving payments)

4. Enter amount: $${projectData.quote_amount || '0.00'} USD

5. Select payment type: "Goods & Services"
   (IMPORTANT: This protects both parties)

6. In the "Add a note" or "What's this payment for?" field:
   → PASTE the text you copied above

7. Review all details carefully

8. Click "Send" to complete payment

═══════════════════════════════════════════════

AFTER COMPLETING PAYMENT:

• You will receive a PayPal Transaction ID
  (Example: 12ABC34567DEF890)

• Screenshot your payment confirmation (optional but recommended)

• Return to this portal:
  → Navigate to "Payment Sent" section
  → Click "Upload" button
  → Upload screenshot or enter Transaction ID

• Manager will confirm payment within 24 hours

• Project will be marked as "Completed"

═══════════════════════════════════════════════

NEED HELP?

All communication through secure client portal chat.
For urgent payment issues only: ocean2joy@gmail.com

For PayPal issues:
Visit: www.paypal.com/support

═══════════════════════════════════════════════

Project: ${projectData.project_number}
Amount Due: $${projectData.quote_amount || '0.00'} USD
Payment Method: PayPal (Goods & Services)

Ocean2Joy Digital Video Production
www.ocean2joy.com`;
};


/**
 * Generate Order Confirmation document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted order confirmation content
 */
export const generateOrderConfirmation = (projectData) => {
  if (!projectData) return '';
  
  // Generate realistic time (not rounded)
  const orderActivatedDate = projectData.order_activated_at ? new Date(projectData.order_activated_at) : new Date();
  const activationDate = orderActivatedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const activationTime = orderActivatedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  
  const orderNumber = projectData.document_numbers?.order_confirmation || projectData.project_number;
  
  const materialsList = projectData.reference_materials && projectData.reference_materials.length > 0
    ? projectData.reference_materials.map(mat => `✓ ${mat}`).join('\n')
    : '✓ No materials uploaded yet';
  
  return `ORDER CONFIRMATION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Order Activation Confirmation

Order: ${orderNumber}
Project Reference: ${projectData.project_number}
Date Activated: ${activationDate} at ${activationTime}

═══════════════════════════════════════════════

CLIENT INFORMATION:
Name: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}
Project Title: ${projectData.project_title || ''}

═══════════════════════════════════════════════

ORDER DETAILS:

Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}

Project Brief:
${projectData.detailed_brief || 'No description provided'}

═══════════════════════════════════════════════

UPLOADED MATERIALS:

${materialsList}

═══════════════════════════════════════════════

PAYMENT METHOD SELECTED:
${projectData.order_activation_payment_method?.toUpperCase() || 'PAYPAL'}

═══════════════════════════════════════════════

ORDER STATUS: ✓ ACTIVATED

Your order has been activated and sent to our production
team for review.

═══════════════════════════════════════════════

NEXT STEPS:

1. Manager will review your order and materials
2. You will receive an Invoice with quote and timeline
3. After Invoice confirmation, production will begin
4. You will receive updates during production
5. Final deliverables will be available in your portal

═══════════════════════════════════════════════

ESTIMATED TIMELINE:
Review: 1-2 business days
Quote/Invoice: Will be sent after review
Production: Timeline specified in Invoice
Delivery: Via secure electronic portal

═══════════════════════════════════════════════

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com

═══════════════════════════════════════════════

Thank you for choosing Ocean2Joy!

Order Reference: ${projectData.project_number}
Keep this number for all future correspondence.

═══════════════════════════════════════════════`;
};

/**
 * Generate Delivery Certificate document content
 * @param {Object} projectData - Project data from backend
 * @returns {string} Formatted delivery certificate content
 */
export const generateDeliveryCertificate = (projectData) => {
  if (!projectData) return '';
  
  const deliveredDate = projectData.delivered_at ? new Date(projectData.delivered_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
  
  const filesAccessedDate = projectData.files_accessed_at ? new Date(projectData.files_accessed_at).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, timeZoneName: 'short' }) : 'Not accessed yet';
  
  const productionStartDate = projectData.production_started_at ? new Date(projectData.production_started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  
  const certNumber = projectData.document_numbers?.delivery_certificate || projectData.project_number;
  
  const deliverablesList = projectData.deliverables && projectData.deliverables.length > 0
    ? projectData.deliverables.map((d, i) => `${i + 1}. ${d.file_name || 'File'}`).join('\n')
    : '1. Final video files';
  
  return `CERTIFICATE OF DELIVERY
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Electronic Service Delivery Confirmation

Certificate: ${certNumber}
Project Reference: ${projectData.project_number}
Delivery Date: ${deliveredDate}

═══════════════════════════════════════════════

DELIVERED TO:
Client: ${projectData.user_name || 'Client'}
Email: ${projectData.user_email || ''}
Account: Active

═══════════════════════════════════════════════

SERVICE DELIVERED:
Service Type: ${projectData.service_type === 'custom_video' ? 'Custom Video Production' : projectData.service_type}
Project Title: ${projectData.project_title || ''}
Brief: ${projectData.detailed_brief || ''}
Production Period: ${productionStartDate} - ${deliveredDate}

═══════════════════════════════════════════════

DIGITAL DELIVERABLES TRANSFERRED:

The following files were made available for download
via secure client portal on ${deliveredDate}:

${deliverablesList}

Delivery Method: Electronic portal download
Access Provided: ${deliveredDate}
Files Accessed: ${filesAccessedDate}

═══════════════════════════════════════════════

DELIVERY CONFIRMATION:

By signing this certificate, the Client confirms:

✓ Receipt of download access to all listed files
✓ Successful download of deliverable files
✓ Files are accessible and openable
✓ Electronic delivery completed as agreed
✓ No physical shipment involved (digital-only service)

This is NOT an acceptance of quality or approval.
Quality acceptance is documented separately in
the Acceptance Act.

═══════════════════════════════════════════════

CLIENT CONFIRMATION:

I confirm receipt of the above digital files via
electronic delivery on the date specified.

Client Name: ${projectData.user_name || ''}
Client Email: ${projectData.user_email || ''}
Date: ${deliveredDate}


Signature: ___________________________________________


═══════════════════════════════════════════════

SERVICE PROVIDER CONFIRMATION:

Ocean2Joy Digital Production
Delivered by: Production Team
Date: ${deliveredDate}

All communication through secure client portal chat.
For urgent matters only: ocean2joy@gmail.com

═══════════════════════════════════════════════

IMPORTANT NOTES FOR PAYPAL/PAYMENT PROCESSORS:

✓ This is a DIGITAL SERVICE delivery (no physical goods)
✓ Delivery method: Secure electronic portal
✓ Client confirmed file download and accessibility
✓ Transaction ID: ${projectData.project_number}
✓ Service category: Custom digital video production
✓ No shipping/tracking (electronic delivery only)

This certificate serves as proof of service delivery
for dispute resolution and compliance purposes.

═══════════════════════════════════════════════`;
};
