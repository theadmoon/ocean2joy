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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({});
  const [editedData, setEditedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchMessages();
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

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
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

  // Static file contents (client-uploaded materials)
  const staticFileContents = {
    "Comedy_Script_v1.pdf": {
      type: "script",
      name: "Comedy Script - 'Office Chaos'",
      content: `COMEDY SCRIPT - "OFFICE CHAOS"
30-minute Comedy Video
Written by Marcos Knight

═══════════════════════════════════════════════

CHARACTERS:
- DAVE (Male, 35) - Overly enthusiastic office manager
- LISA (Female, 28) - Sarcastic IT specialist

SETTING: Modern office space with cubicles

═══════════════════════════════════════════════

SCENE 1: THE COFFEE MACHINE INCIDENT
[INT. OFFICE - MORNING]

DAVE enters the break room with exaggerated confidence, 
holding a "World's Best Boss" mug.

DAVE
(loudly to everyone)
Good morning team! Today is the day we revolutionize 
our coffee break procedures!

LISA
(not looking up from laptop)
Dave, it's just coffee.

DAVE
Just coffee?! JUST COFFEE?! Lisa, coffee is the 
lifeblood of productivity! Watch and learn!

Dave attempts to demonstrate an overly complicated 
coffee-making procedure involving timers and charts.

[SPECIAL EFFECT 1: Slow-motion coffee explosion]

═══════════════════════════════════════════════

SCENE 2: THE TECH SUPPORT CRISIS
[INT. OFFICE - AFTERNOON]

Dave's computer screen freezes during an important 
presentation. He panics.

DAVE
(sweating, clicking frantically)
No, no, no! Not now! LISA! EMERGENCY CODE RED!

LISA
(walking over calmly)
Did you try turning it off and on again?

DAVE
That's... that's your professional advice?

LISA
(deadpan)
I went to four years of university for this wisdom.

[She presses one button. Everything works.]

DAVE
You're a wizard, Lisa.

LISA
I'm really not.

═══════════════════════════════════════════════

SCENE 3: THE PRESENTATION DISASTER
[INT. CONFERENCE ROOM - LATE AFTERNOON]

Dave attempts to give a motivational presentation 
using a laser pointer. Things go wrong.

[SPECIAL EFFECT 2: Laser pointer creates 
animated chaos on screen - charts flying, 
digital explosions]

LISA
(whispering to camera)
This is why we can't have nice things.

═══════════════════════════════════════════════

[Additional 25 minutes of comedic scenes follow...]

FINAL SCENE: THE RECONCILIATION

Both characters share a laugh over the day's chaos.

FADE OUT.

═══════════════════════════════════════════════

PRODUCTION NOTES:
- 30 minutes total runtime
- 2 special effects sequences marked above
- Emphasis on physical comedy and timing
- Modern office setting with minimal props
- Natural lighting preferred

END OF SCRIPT`
    },
    "Character_References.zip": {
      type: "document",
      name: "Character References & Casting",
      content: `CHARACTER REFERENCES & CASTING NOTES
Project: Office Chaos Comedy
═══════════════════════════════════════════════

CHARACTER 1: DAVE
─────────────────────────────────────────────

AGE: 35 years old
ROLE: Overly enthusiastic office manager

PHYSICAL DESCRIPTION:
- Height: 5'10" - 6'0"
- Build: Average to slightly stocky
- Hair: Brown, slightly messy
- Style: Business casual, slightly disheveled

PERSONALITY TRAITS:
✓ Overly confident
✓ Enthusiastic to a fault
✓ Well-meaning but clueless
✓ Physically expressive
✓ Naturally comedic timing

ACTING REQUIREMENTS:
• Strong physical comedy skills
• Experience with improvisation
• Comfortable with slapstick
• Ability to deliver rapid-fire dialogue
• Previous comedy experience preferred

REFERENCE ACTORS:
Similar energy to: Steve Carell (The Office), 
Jason Bateman (Arrested Development)

─────────────────────────────────────────────

CHARACTER 2: LISA
─────────────────────────────────────────────

AGE: 28 years old
ROLE: Sarcastic IT specialist

PHYSICAL DESCRIPTION:
- Height: 5'4" - 5'8"
- Build: Slim to average
- Hair: Any color, professional style
- Style: Casual tech professional

PERSONALITY TRAITS:
✓ Dry sense of humor
✓ Deadpan delivery
✓ Patient but sarcastic
✓ Intelligent and capable
✓ Subtle reactions

ACTING REQUIREMENTS:
• Excellent deadpan comedy skills
• Strong reaction shots
• Comfortable with technical dialogue
• Natural chemistry with co-star
• Previous comedy experience required

REFERENCE ACTORS:
Similar style to: Aubrey Plaza, 
Anna Kendrick, Rashida Jones

═══════════════════════════════════════════════

CASTING NOTES:

CHEMISTRY:
The two actors must have natural comedic chemistry.
Recommend chemistry read before final casting.

AVAILABILITY:
Filming dates: February 25-27, 2026
Rehearsal: February 24, 2026
Post-production ADR: TBD (March 2026)

COMPENSATION:
Professional day rate + usage rights
Screen credit guaranteed

═══════════════════════════════════════════════

APPROVED HEADSHOTS & RESUMES:

📎 Dave_Candidate_1.pdf
📎 Dave_Candidate_2.pdf
📎 Lisa_Candidate_1.pdf  
📎 Lisa_Candidate_2.pdf

[Attached separately in casting folder]

END OF DOCUMENT`
    },
    "Location_Photos.pdf": {
      type: "document",
      name: "Location Photos & Setup Requirements",
      content: `LOCATION PHOTOS & PRODUCTION SETUP
Project: Office Chaos - Comedy Video Production
═══════════════════════════════════════════════

LOCATION 1: MAIN OFFICE SPACE
─────────────────────────────────────────────

DESCRIPTION:
Open-plan office with 6-8 cubicles, natural lighting
from large windows, modern but slightly worn aesthetic.

SETUP REQUIREMENTS:
• Desk with computer monitors (2-3 stations)
• Office chairs (wheeled, adjustable)
• Filing cabinets and office supplies
• Wall clock (visible for comedic timing)
• Motivational posters (ironic tone)
• Coffee mugs, papers, desk accessories

SPECIAL NOTES:
⚠ Will need power outlets for practical lights
⚠ Carpet floor - good for sound dampening
⚠ Windows - may need blackout for light control

DIMENSIONS:
Approximately 30ft × 40ft
Ceiling height: 9ft
Natural light: North-facing windows

AVAILABLE DATES:
February 25-27, 2026 (all three days)

─────────────────────────────────────────────

LOCATION 2: BREAK ROOM
─────────────────────────────────────────────

DESCRIPTION:
Small break room with coffee machine, microwave,
small table with chairs. Fluorescent overhead lighting.

SETUP:
• Coffee machine (practical - will be used)
• Small refrigerator
• Microwave
• Break table with 4 chairs
• Sink and counter space
• Coffee supplies and mugs

SPECIAL REQUIREMENTS:
⚠ Coffee machine MUST work (SPECIAL EFFECT #1)
  Coffee explosion scene - requires practical setup
- Protective coverings for floor/walls
- Multiple takes planned
- Cleaning crew standing by

LIGHTING:
- Overhead practical lights
- Window light from side
- Additional fill for actor faces

═══════════════════════════════════════════════

LOCATION 3: CONFERENCE ROOM
─────────────────────────────────────────────

DESCRIPTION:
Professional conference room with large table,
presentation screen, and whiteboard.

SETUP:
• Large conference table (seats 8-10)
• Office chairs
• Projection screen or large monitor
• Whiteboard with markers
• Presentation materials
• Water glasses and pitcher

SPECIAL REQUIREMENTS:
⚠ Laser pointer for SPECIAL EFFECT #2
  (animated chaos on screen)
- Green screen or practical screen
- VFX markers for post-production
- Multiple camera angles for coverage

LIGHTING:
- Professional conference room feel
- Overhead recessed lighting
- Monitor/screen glow (practical)
- Clean, professional look

═══════════════════════════════════════════════

GENERAL PRODUCTION NOTES:

FILMING DATES: February 25-27, 2026

SCHEDULE:
Day 1: Main office scenes (Scenes 1-4)
Day 2: Break room + coffee explosion (Scene 5-8)
Day 3: Conference room + VFX shots (Scene 9-12)

CREW REQUIREMENTS:
✓ Director of Photography
✓ Gaffer + Lighting crew (3)
✓ Sound mixer + boom op
✓ Production assistants (2)
✓ Set decorator
✓ Props master
✓ VFX supervisor (on-set for marker placement)

EQUIPMENT:
- 2 cameras (A-cam, B-cam)
- Dolly/tracking system
- Professional lighting kit
- Lavalier mics for actors
- Boom microphones
- Monitors for director/client review

═══════════════════════════════════════════════

All locations secured and ready for production.
Insurance and permits: ✓ APPROVED

END OF DOCUMENT`
    }
  };

  // Open client-uploaded file
  const openFile = (fileName) => {
    const fileContent = staticFileContents[fileName];
    if (fileContent) {
      setSelectedFile(fileContent);
      setShowFileModal(true);
    }
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
    if (!project) return 'Loading...';
    
    const formatDate = (dateStr) => {
      if (!dateStr) return 'Not set';
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    };
    
    switch(docType) {
      case 'Quote Request':
        return `QUOTE REQUEST
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Project Request Form

═══════════════════════════════════════════════

REQUEST INFORMATION:

Request ID: ${project.project_number}
Submitted: ${formatDate(project.created_at)}
Client: ${project.user_name || 'Client'}
Email: ${project.user_email || 'Not provided'}

═══════════════════════════════════════════════

PROJECT DETAILS:

Title: ${project.project_title}
Service Type: ${project.service_type === 'custom_video' ? 'Custom Video Production' : project.service_type}

DETAILED BRIEF:
${project.detailed_brief || 'No details provided'}

OBJECTIVES:
${project.objectives || 'Not specified'}

SPECIAL INSTRUCTIONS:
${project.special_instructions || 'None'}

═══════════════════════════════════════════════

STATUS: Request received and under review

This quote request has been submitted to Ocean2Joy Digital Video Production.
Our team will review the requirements and provide a detailed quote within 24-48 hours.

All communications and updates available through your client portal.
Support: ocean2joy@gmail.com
═══════════════════════════════════════════════`;

      case 'Quote Document':
        return `OFFICIAL QUOTE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

═══════════════════════════════════════════════

QUOTE INFORMATION:

Quote Number: ${project.project_number}
Date Issued: ${formatDate(project.quote_sent_at)}
Valid Until: ${formatDate(project.quote_accepted_at || project.quote_sent_at)}

Client: ${project.user_name || 'Client'}
Project: ${project.project_title}

═══════════════════════════════════════════════

QUOTED SERVICES:

Service Type: ${project.service_type === 'custom_video' ? 'Custom Video Production' : project.service_type}

${project.quote_details || 'Details not specified'}

═══════════════════════════════════════════════

PRICING:

Total Amount: $${project.quote_amount?.toFixed(2) || '0.00'} USD

Payment Terms: ${project.payment_terms || 'Payment due upon delivery'}

═══════════════════════════════════════════════

SCOPE OF WORK:

${project.detailed_brief || 'See project brief for details'}

═══════════════════════════════════════════════

ACCEPTANCE:

To accept this quote, please confirm through your client portal.
Upon acceptance, we will begin production according to the agreed timeline.

All project communications available in your client dashboard.
Support: ocean2joy@gmail.com

═══════════════════════════════════════════════`;

      case 'Acceptance Confirmation':
        return `QUOTE ACCEPTANCE CONFIRMATION
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

═══════════════════════════════════════════════

CONFIRMATION DETAILS:

Project: ${project.project_number}
Client: ${project.user_name || 'Client'}
Date Accepted: ${formatDate(project.quote_accepted_at)}

═══════════════════════════════════════════════

ACCEPTED QUOTE:

Service: ${project.project_title}
Amount: $${project.quote_amount?.toFixed(2)} USD
Payment Terms: ${project.payment_terms || 'Upon delivery'}

═══════════════════════════════════════════════

NEXT STEPS:

✓ Quote has been accepted
✓ Production will begin on: ${formatDate(project.production_started_at)}
✓ Client will be notified of progress updates
✓ Expected delivery: ${formatDate(project.delivered_at)}

═══════════════════════════════════════════════

This document confirms that the client has reviewed and accepted
the quote for the above-mentioned project. Production will proceed
according to the agreed terms and timeline.

═══════════════════════════════════════════════`;

      case 'Production Order':
        return `PRODUCTION ORDER
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production
Internal Production Document

═══════════════════════════════════════════════

ORDER INFORMATION:

Project ID: ${project.project_number}
Client: ${project.user_name || 'Client'}
Production Start: ${formatDate(project.production_started_at)}
Expected Delivery: ${formatDate(project.delivered_at)}

═══════════════════════════════════════════════

PROJECT SPECIFICATIONS:

Title: ${project.project_title}
Type: ${project.service_type}
Budget: $${project.quote_amount?.toFixed(2)}

${project.detailed_brief || ''}

${project.special_instructions || ''}

═══════════════════════════════════════════════

PRODUCTION STATUS:

Status: ${project.status === 'in_progress' ? 'Work in Progress' : 'Completed'}
Started: ${formatDate(project.production_started_at)}

═══════════════════════════════════════════════

DELIVERABLES:

Final video files will be delivered digitally through client portal.

═══════════════════════════════════════════════`;

      case 'Invoice':
      case 'Receipt':
      case 'Certificate':
        // Use existing generation functions from ProjectDetails
        const clientData = {
          ...project,
          client_name: project.user_name || 'Client',
          client_email: project.user_email || ''
        };
        
        if (docType === 'Invoice') {
          return generateInvoiceContent(clientData);
        } else if (docType === 'Receipt') {
          return generateReceiptContent(clientData);
        } else {
          return generateCertificateContent(clientData);
        }
        
      default:
        return `Document: ${docType}\n\nProject: ${project.project_number}\nClient: ${project.user_name}\nAmount: $${project.quote_amount}`;
    }
  };
  
  // Helper functions for Invoice, Receipt, Certificate (same as in ProjectDetails.js)
  const generateInvoiceContent = (projectData) => {
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
${projectData.client_name || 'Client'}
Email: ${projectData.client_email || ''}
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
Send payment to: 302335809@postbox.ge

Payment is due upon receipt of this invoice.
Track payment status in your client portal.

═══════════════════════════════════════════════

DELIVERABLES (Included):

All files delivered digitally via secure client portal.

═══════════════════════════════════════════════

Thank you for choosing Ocean2Joy!

Support: ocean2joy@gmail.com
Client Portal: www.ocean2joy.com/dashboard

Ocean2Joy Digital Video Production
Digital Services - No Physical Shipping
www.ocean2joy.com

═══════════════════════════════════════════════`;
  };

  const generateReceiptContent = (projectData) => {
    if (!projectData) return '';
    
    const paymentDate = projectData.completed_at ? new Date(projectData.completed_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';
    const transactionId = projectData.paypal_transaction_id || `PAYPAL-${projectData.project_number?.replace(/[^A-Z0-9]/g, '')}`;
    const payerEmail = projectData.paypal_payer_email || projectData.client_email || '';
    const paymentStatus = projectData.paypal_payment_status || 'COMPLETED';
    
    return `PAYMENT RECEIPT
═══════════════════════════════════════════════

PayPal Payment Confirmation

Transaction ID: ${transactionId}
Payment Date: ${paymentDate}
Status: ✓ ${paymentStatus}

═══════════════════════════════════════════════

TRANSACTION DETAILS:

From: ${projectData.client_name || 'Client'}
Email: ${payerEmail}

To: Ocean2Joy Digital Video Production
Email: 302335809@postbox.ge

═══════════════════════════════════════════════

PAYMENT INFORMATION:

Amount Paid: $${projectData.quote_amount?.toFixed(2)} USD
Payment Method: PayPal
Currency: USD
Transaction Type: Goods & Services Payment

Invoice Reference: ${projectData.project_number}
Project: ${projectData.project_title}

═══════════════════════════════════════════════

This receipt confirms successful payment processing
through PayPal for digital services rendered by
Ocean2Joy Digital Video Production.

═══════════════════════════════════════════════`;
  };

  const generateCertificateContent = (projectData) => {
    if (!projectData) return '';
    
    const formatDate = (dateStr) => {
      if (!dateStr) return 'Not set';
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    
    return `PROJECT COMPLETION CERTIFICATE
═══════════════════════════════════════════════

Ocean2Joy Digital Video Production

═══════════════════════════════════════════════

PROJECT INFORMATION:

Project Number: ${projectData.project_number}
Project Title: ${projectData.project_title}
Service Type: Custom Digital Video Production
Client: ${projectData.client_name || 'Client'} (${projectData.client_email || ''})

═══════════════════════════════════════════════

PROJECT TIMELINE:

Request Submitted: ${formatDate(projectData.created_at)}
Quote Provided: ${formatDate(projectData.quote_sent_at)}
Quote Accepted: ${formatDate(projectData.quote_accepted_at)}
Production Started: ${formatDate(projectData.production_started_at)}
Deliverables Provided: ${formatDate(projectData.delivered_at)}
Payment Received: ${formatDate(projectData.completed_at)}
Project Closed: ${formatDate(projectData.completed_at)}

═══════════════════════════════════════════════

FINANCIAL SETTLEMENT:

Total Project Value: $${projectData.quote_amount?.toFixed(2)} USD
Payment Method: PayPal
Payment Status: ✓ PAID IN FULL
Payment Date: ${formatDate(projectData.completed_at)}

═══════════════════════════════════════════════

PROJECT STATUS: ✓ SUCCESSFULLY COMPLETED

Issued by: Ocean2Joy Digital Video Production
Issue Date: ${formatDate(projectData.completed_at)}

═══════════════════════════════════════════════`;
  };

  // Print operational chain - improved version
  const handlePrint = () => {
    console.log('Print button clicked');
    
    try {
      // Create a clean print version
      const content = document.getElementById('operational-chain-content');
      if (!content) {
        alert('Content not available for printing');
        return;
      }
      
      const printWindow = window.open('', 'PRINT', 'height=800,width=1000');
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Print - ${project?.project_number || 'Project'}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h2 { color: #0369a1; }
              .step { margin-bottom: 20px; padding: 15px; border-left: 4px solid #0ea5e9; background: #f9fafb; }
              .field { margin: 8px 0; }
              .label { font-weight: bold; }
              button { display: none !important; }
              @media print {
                button { display: none !important; }
              }
            </style>
          </head>
          <body>
            <h1>Ocean2Joy - Project ${project?.project_number || ''}</h1>
            ${content.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Trigger print after a delay and close only after print dialog is done
      setTimeout(() => {
        printWindow.print();
        // Don't close automatically - let user close the window
      }, 500);
      
    } catch (error) {
      console.error('Print error:', error);
      alert('Unable to open print dialog. Please use Ctrl+P (Cmd+P on Mac) to print this page.');
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

  // Download all documents
  const handleDownloadAllDocuments = () => {
    console.log('Download All Documents clicked');
    
    const steps = operationalSteps;
    let allDocs = `OCEAN2JOY DIGITAL VIDEO PRODUCTION\nPROJECT DOCUMENTATION PACKAGE\n\n`;
    allDocs += `Project: ${project.project_number}\n`;
    allDocs += `Client: ${project.user_name || 'Client'}\n`;
    allDocs += `Generated: ${new Date().toLocaleString()}\n\n`;
    allDocs += `${'='.repeat(80)}\n\n`;
    
    steps.forEach((step, index) => {
      const docType = getDocumentForStep(step.key);
      const content = generateDocumentContent(docType, step.key);
      allDocs += `\n\nDOCUMENT ${index + 1}: ${docType.toUpperCase()}\n`;
      allDocs += `${'='.repeat(80)}\n\n`;
      allDocs += content;
      allDocs += `\n\n${'='.repeat(80)}\n`;
    });
    
    // Create downloadable text file
    const blob = new Blob([allDocs], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.project_number}_AllDocuments.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('All documents downloaded successfully!');
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
                      <div className="bg-sky-50 rounded-lg p-3 border border-sky-200 mb-3">
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

                      {/* Client Attachments Section */}
                      {messages.length > 0 && (() => {
                        // Find messages with attachments related to this step
                        const stepMessages = messages.filter(msg => msg.attachments && msg.attachments.length > 0);
                        
                        // Show attachments for specific steps
                        const showAttachments = step.key === 'quote_accepted' && stepMessages.length > 0;
                        
                        if (showAttachments) {
                          return (
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <label className="text-xs font-semibold text-green-700 block mb-2">📎 Client Uploaded Files:</label>
                              <div className="space-y-1">
                                {stepMessages.map(msg => 
                                  msg.attachments.map((file, idx) => (
                                    <div 
                                      key={`${msg.id}-${idx}`}
                                      onClick={() => openFile(file)}
                                      className="text-xs flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-green-100 transition-colors"
                                    >
                                      📎 <span className="text-gray-900">{file}</span>
                                      <span className="ml-auto text-[10px] bg-green-200 px-2 py-0.5 rounded">
                                        click to view
                                      </span>
                                    </div>
                                  ))
                                )}
                              </div>
                              <p className="text-[10px] text-gray-500 mt-2 italic">
                                Client materials uploaded on {new Date(project.quote_accepted_at).toLocaleDateString()}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      })()}
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
              onClick={handleDownloadAllDocuments}
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
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded text-left">
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

      {/* Client File View Modal */}
      {showFileModal && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">
                📎 {selectedFile.name}
              </h3>
              <button
                onClick={() => setShowFileModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded text-left">
                {selectedFile.content}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowFileModal(false)}
                className="btn-ocean-outline"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedFile.content);
                  alert('File content copied to clipboard!');
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
