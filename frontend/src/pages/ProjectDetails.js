import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaCheckCircle, FaComments } from 'react-icons/fa';
import ProjectDocuments from '../components/ProjectDocuments';
import OperationalChainWithDocuments from '../components/OperationalChainWithDocuments';
import { 
  generateInvoice, 
  generateReceipt, 
  generateCertificate,
  generateClientMaterialTemplate
} from '../utils/documentGenerators';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// UTC Timezone Helper Functions
const formatDateTimeUTC = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }) + ' UTC';
};

const formatDateUTC = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric',
    timeZone: 'UTC'
  });
};

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  
  // Edit brief state
  const [editingBrief, setEditingBrief] = useState(false);
  const [editedBrief, setEditedBrief] = useState('');
  
  // Order Activation states
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [orderBrief, setOrderBrief] = useState('');
  const [orderPaymentMethod, setOrderPaymentMethod] = useState('');
  
  // Order Form expansion state - auto-collapsed after activation
  const [isOrderFormExpanded, setIsOrderFormExpanded] = useState(false);
  
  // Payment states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentMarked, setPaymentMarked] = useState(false);
  const [paymentReceipt, setPaymentReceipt] = useState(null);
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Static file contents for client materials - mock data
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
- Build: Average to slightly overweight
- Hair: Brown, slightly messy professional style
- Style: Business casual (khakis, polo shirts)

PERSONALITY TRAITS:
- Overly optimistic
- Loves creating unnecessary procedures
- Takes everything too seriously
- Physical comedy specialist
- Great comedic timing

REFERENCE ACTORS:
- Similar energy to Steve Carell (The Office)
- Physical comedy style of Jim Carrey
- Earnest delivery like Paul Rudd

COSTUME REQUIREMENTS:
- 3 business casual outfits
- "World's Best Boss" mug (prop)
- Clipboard and unnecessary charts
- Motivational posters (background)

═══════════════════════════════════════════════

CHARACTER 2: LISA
─────────────────────────────────────────────

AGE: 28 years old
ROLE: Sarcastic IT specialist

PHYSICAL DESCRIPTION:
- Height: 5'5" - 5'7"
- Build: Average, athletic
- Hair: Dark, practical ponytail or short
- Style: Casual tech wear (hoodies, jeans)

PERSONALITY TRAITS:
- Deadpan delivery expert
- Extremely competent but apathetic
- Quick wit and sarcasm
- Straight-woman to Dave's chaos
- Perfect comedic timing for reactions

REFERENCE ACTORS:
- Deadpan style of Aubrey Plaza
- Wit of Tina Fey
- Reactions like Rashida Jones

COSTUME REQUIREMENTS:
- Tech casual wardrobe (3 outfits)
- Laptop and tech props
- Coffee mug with sarcastic quote
- IT toolkit (visual prop)

═══════════════════════════════════════════════

CASTING NOTES:

Chemistry is CRITICAL. Actors must:
✓ Have improv experience
✓ Work well together (chemistry read required)
✓ Strong physical comedy skills (Dave)
✓ Perfect deadpan timing (Lisa)
✓ Both comfortable with 30-min format

APPROVED ACTORS (Selected by Production):
✓ Both actors cast - excellent chemistry
✓ Prior comedy experience confirmed
✓ Available for Feb 25-27 filming dates

═══════════════════════════════════════════════`
    },
    "Location_Photos.pdf": {
      type: "document",
      name: "Location Photos & Setup",
      content: `LOCATION PHOTOS & SETUP GUIDE
Project: Office Chaos Comedy
═══════════════════════════════════════════════

LOCATION 1: MAIN OFFICE SPACE
─────────────────────────────────────────────

DESCRIPTION:
Modern open-plan office with cubicles and 
contemporary furniture. Natural lighting from 
large windows.

SETUP REQUIREMENTS:
• 4-6 cubicle workstations
• Modern office chairs (rolling)
• Desktop computers and monitors
• Office supplies and paperwork (set dressing)
• Motivational posters on walls
• Professional but lived-in atmosphere

LIGHTING:
- Natural window light (primary)
- Overhead fluorescent (practical)
- Additional soft fill lights for faces
- No harsh shadows - keep it bright and airy

CAMERA ANGLES:
✓ Wide shots of office space
✓ Over-shoulder desk shots
✓ Close-ups for reaction shots
✓ Tracking shots through cubicles

═══════════════════════════════════════════════

LOCATION 2: BREAK ROOM
─────────────────────────────────────────────

DESCRIPTION:
Small office break room with coffee machine,
sink, small fridge, and table.

KEY PROPS:
• Coffee machine (hero prop - must be functional)
• "World's Best Boss" mug
• Multiple coffee mugs
• Water cooler
• Microwave
• Small table with chairs
• Bulletin board with notices

SPECIAL REQUIREMENTS:
⚠ Coffee machine for SPECIAL EFFECT #1
  (slow-motion coffee explosion scene)
- Safe breakaway materials needed
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

  const openFile = (fileName) => {
    let fileContent = null;
    
    // Check if it's a static file (client-uploaded materials)
    if (staticFileContents[fileName]) {
      fileContent = staticFileContents[fileName];
    }
    // Generate dynamic documents based on project data using utilities
    else if (fileName === 'invoice_VAPP6_1050USD.pdf' || fileName.includes('invoice')) {
      fileContent = {
        type: "document",
        name: `Invoice ${project.project_number} - $${project.quote_amount}`,
        content: generateInvoice({
          ...project,
          client_name: project.user_name,
          client_email: project.user_email
        })
      };
    }
    else if (fileName === 'PayPal_Receipt_VAPP6_1050USD.pdf' || fileName.includes('Receipt')) {
      fileContent = {
        type: "document",
        name: `PayPal Payment Receipt - $${project.quote_amount} USD`,
        content: generateReceipt({
          ...project,
          client_name: project.user_name,
          client_email: project.user_email
        })
      };
    }
    else if (fileName === 'completion_certificate.pdf' || fileName.includes('certificate')) {
      fileContent = {
        type: "document",
        name: "Project Completion Certificate",
        content: generateCertificate({
          ...project,
          client_name: project.user_name,
          client_email: project.user_email
        })
      };
    }
    // Generate template for unknown client materials
    else if (project && project.reference_materials && project.reference_materials.includes(fileName)) {
      fileContent = {
        type: fileName.toLowerCase().includes('script') ? 'script' : 'document',
        name: fileName,
        content: generateClientMaterialTemplate({
          name: fileName,
          type: fileName.toLowerCase().includes('script') ? 'script' : 'document',
          uploadedBy: project.user_name || 'Client',
          uploadedAt: project.order_activated_at || project.created_at
        })
      };
    }
    
    if (fileContent) {
      setSelectedFile(fileContent);
      setShowFileModal(true);
    }
  };

  const closeFileModal = () => {
    setShowFileModal(false);
    setSelectedFile(null);
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectDetails();
      fetchMessages();
      fetchPaymentSettings();
    }
  }, [projectId]);

  // Initialize order brief and payment method from project data
  useEffect(() => {
    if (project) {
      setOrderBrief(project.detailed_brief || '');
      setOrderPaymentMethod(project.order_activation_payment_method || '');
      
      // Auto-collapse: expanded if NOT activated, collapsed if activated
      setIsOrderFormExpanded(!project.order_activated_at);
    }
  }, [project]);


  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      const projectData = response.data;
      
      setProject(projectData);
      setPaymentMarked(projectData.payment_marked_by_client_at ? true : false);
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
      console.error('Error:', error);
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const response = await axios.get(`${API}/payment-settings`);
      setPaymentSettings(response.data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

  const handleMarkPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setSubmittingPayment(true);
    try {
      const formData = new FormData();
      formData.append('payment_method', selectedPaymentMethod);
      if (paymentReceipt) {
        formData.append('receipt', paymentReceipt);
      }

      await axios.patch(`${API}/projects/${projectId}/mark-payment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setPaymentMarked(true);
      setShowPaymentModal(false);
      alert('Payment marked successfully! Admin will confirm receipt.');
      fetchProjectDetails(); // Refresh project data
    } catch (error) {
      console.error('Error marking payment:', error);
      alert('Failed to mark payment');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const generatePayPalMessage = () => {
    if (!project || !paymentSettings) return '';

    // Service description mapping
    const serviceDescriptions = {
      'custom_video': 'Custom film production according to client\'s script',
      'video_editing': 'Professional video editing services',
      'ai_generated_video': 'AI-generated video content production'
    };

    const serviceDesc = serviceDescriptions[project.service_type] || 'Custom video production services';

    return `Please send $${project.quote_amount} to the account ${paymentSettings.paypal_email}

In the comments, please indicate:

${serviceDesc}

- Project Reference: ${project.project_number}

Payment terms: 100% post-payment (invoice is issued after delivery).

By completing payment via PayPal, the Client confirms successful receipt of the delivered digital materials and accepts that no refunds apply after delivery.

- No physical shipment – digital service delivered electronically`;
  };

  const copyPayPalMessage = () => {
    const message = generatePayPalMessage();
    navigator.clipboard.writeText(message).then(() => {
      alert('PayPal payment message copied to clipboard! ✓\nPaste it in PayPal comments when making payment.');
    }).catch((err) => {
      console.error('Failed to copy:', err);
      alert('Failed to copy message. Please copy manually.');
    });
  };

  // Order Activation - File Upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploadingFiles(true);
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post(
        `${API}/projects/${projectId}/upload-materials`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update project with new materials
      setProject(prev => ({
        ...prev,
        reference_materials: response.data.reference_materials
      }));
      
      alert('Files uploaded successfully! Manager will review your materials.');
      fetchProjectDetails(); // Refresh project data
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setUploadingFiles(false);
    }
  };

  const activateOrder = async () => {
    if (!project.reference_materials || project.reference_materials.length === 0) {
      alert('Please upload your script/materials before activating the order.');
      return;
    }
    
    if (!orderBrief.trim()) {
      alert('Please provide a brief description of your project.');
      return;
    }
    
    if (!orderPaymentMethod) {
      alert('Please select a payment method.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('brief', orderBrief);
      formData.append('payment_method', orderPaymentMethod);
      
      await axios.patch(`${API}/projects/${projectId}/activate-order`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Order activated! Manager will review and prepare your invoice.');
      fetchProjectDetails();
    } catch (error) {
      console.error('Error activating order:', error);
      alert('Failed to activate order. Please try again.');
    }
  };


  const handleApprove = async () => {
    try {
      await axios.patch(`${API}/projects/${projectId}/approve`);
      fetchProjectDetails();
      alert('Project approved successfully!');
    } catch (error) {
      alert('Failed to approve project');
    }
  };

  const handleSaveBrief = async () => {
    if (!editedBrief.trim()) {
      alert('Brief cannot be empty');
      return;
    }

    try {
      await axios.patch(`${API}/projects/${projectId}`, {
        detailed_brief: editedBrief
      });
      
      setProject(prev => ({
        ...prev,
        detailed_brief: editedBrief
      }));
      setEditingBrief(false);
      alert('Brief updated successfully!');
    } catch (error) {
      console.error('Error updating brief:', error);
      alert('Failed to update brief. Please try again.');
    }
  };

  const handleEditBrief = () => {
    setEditedBrief(project.detailed_brief || '');
    setEditingBrief(true);
  };


  const handleAcceptQuote = async () => {
    try {
      await axios.patch(`${API}/projects/${projectId}/accept-quote`);
      fetchProjectDetails();
      alert('Quote accepted! Production will begin soon.');
    } catch (error) {
      alert('Failed to accept quote');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-sky-600">Loading...</div></div>;
  }

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2><Link to="/dashboard" className="btn-ocean">Back to Dashboard</Link></div></div>;
  }

  return (
    <div className="project-details-page py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/dashboard" className="text-sky-600 hover:text-sky-700 font-semibold mb-6 inline-block">← Back to Dashboard</Link>
        
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 text-left">{project.project_title}</h1>
            <span className={`status-badge status-${project.status}`}>{project.status.replace('_', ' ')}</span>
          </div>
          <p className="text-gray-600 text-left">Project #{project.project_number}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="space-y-6">
            <div className="card-ocean p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Project Details</h2>
              <div className="space-y-3 text-left">
                <div className="text-left"><span className="font-semibold">Service:</span> {project.service_type}</div>
                
                {/* Payment Method */}
                {project.order_activation_payment_method && (
                  <div className="text-left">
                    <span className="font-semibold">Payment Method:</span>{' '}
                    <span className="inline-flex items-center gap-2">
                      {project.order_activation_payment_method === 'paypal' && '💳 PayPal'}
                      {project.order_activation_payment_method === 'swift' && '🏦 SWIFT Transfer'}
                      {project.order_activation_payment_method === 'qr_code' && '📱 QR Code'}
                    </span>
                  </div>
                )}
                
                {/* Order Activated Date */}
                {project.order_activated_at && (
                  <div className="text-left">
                    <span className="font-semibold">Order Activated:</span>{' '}
                    {formatDateTimeUTC(project.order_activated_at)}
                  </div>
                )}
                
                {/* Uploaded Materials */}
                {project.reference_materials && project.reference_materials.length > 0 && (
                  <div className="text-left">
                    <span className="font-semibold">Uploaded Materials:</span>
                    <ul className="mt-2 space-y-1 ml-4">
                      {project.reference_materials.map((file, idx) => (
                        <li key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span>{file}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Editable Brief */}
                <div className="text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Brief:</span>
                    {!editingBrief && (
                      <button
                        onClick={handleEditBrief}
                        className="text-sky-600 hover:text-sky-700 text-sm"
                      >
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                  {editingBrief ? (
                    <div>
                      <textarea
                        value={editedBrief}
                        onChange={(e) => setEditedBrief(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        rows={6}
                        placeholder="Describe your project in detail..."
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSaveBrief}
                          className="btn-ocean-sm"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={() => setEditingBrief(false)}
                          className="px-4 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-1 text-left whitespace-pre-wrap">{project.detailed_brief || 'No brief provided yet'}</p>
                  )}
                </div>
                
                <div className="text-left"><span className="font-semibold">Objectives:</span> <p className="mt-1 text-left">{project.objectives}</p></div>
                {project.special_instructions && <div className="text-left"><span className="font-semibold">Special Instructions:</span> <p className="mt-1 text-left">{project.special_instructions}</p></div>}
              </div>
            </div>

            {/* Messages / Communication Thread */}
            {messages.length > 0 && (
              <div className="card-ocean p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left flex items-center gap-2">
                  <FaComments className="text-sky-500" />
                  Communication History
                </h3>
                <p className="text-sm text-gray-600 mb-6 text-left">
                  Complete message thread between client and production team
                </p>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.map((msg, index) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender_role === 'client' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.sender_role === 'client' 
                            ? 'bg-gradient-to-br from-sky-500 to-teal-500 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">
                            {msg.sender_name}
                          </span>
                          <span className={`text-xs ${msg.sender_role === 'client' ? 'text-sky-100' : 'text-gray-500'}`}>
                            {formatDateTimeUTC(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap text-left">
                          {msg.message}
                        </p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs mb-2 opacity-80">Attachments:</p>
                            {msg.attachments.map((file, idx) => {
                              // All files are viewable - either static or dynamically generated
                              const isViewable = true;
                              return (
                                <div 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isViewable) openFile(file);
                                  }}
                                  className={`text-xs flex items-center gap-2 mt-1 p-2 rounded ${
                                    isViewable 
                                      ? 'cursor-pointer hover:bg-white/10 transition-colors' 
                                      : ''
                                  }`}
                                >
                                  📎 {file}
                                  {isViewable && (
                                    <span className="ml-auto text-[10px] bg-white/20 px-2 py-0.5 rounded">
                                      click to view
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Visual separator for preliminary vs official communication */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center italic">
                    💬 Full communication history preserved - from initial inquiry to project completion
                  </p>
                </div>
              </div>
            )}


            {/* Order Activation Section - Unified form with auto-collapse */}
            <div className="card-ocean p-6 mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 text-left flex items-center gap-2">
                  🚀 Order Activation
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.order_activated_at 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {project.order_activated_at ? '✅ Completed' : '⏳ Pending'}
                  </span>
                  
                  {/* Toggle button - only show after activation */}
                  {project.order_activated_at && (
                    <button
                      onClick={() => setIsOrderFormExpanded(!isOrderFormExpanded)}
                      className="text-sm text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                    >
                      {isOrderFormExpanded ? (
                        <>Hide Details <span>▲</span></>
                      ) : (
                        <>View Details <span>▼</span></>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Compact Summary - shown when collapsed and activated */}
              {project.order_activated_at && !isOrderFormExpanded && (
                <div className="space-y-3 text-sm">
                  {/* Brief summary */}
                  <div className="flex items-start gap-3">
                    <span className="text-gray-500 font-semibold min-w-[80px]">📝 Brief:</span>
                    <span className="text-gray-700 flex-1">
                      {project.detailed_brief 
                        ? (project.detailed_brief.length > 120 
                            ? project.detailed_brief.substring(0, 120) + '...' 
                            : project.detailed_brief)
                        : 'No brief provided'}
                    </span>
                  </div>
                  
                  {/* Files & Payment on same line */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-semibold">📎 Files:</span>
                      <span className="text-gray-700">
                        {project.reference_materials?.length || 0} file{project.reference_materials?.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 font-semibold">💳 Payment:</span>
                      <span className="text-gray-700">
                        {project.order_activation_payment_method === 'paypal' && 'PayPal'}
                        {project.order_activation_payment_method === 'swift' && 'SWIFT Transfer'}
                        {project.order_activation_payment_method === 'qr_code' && 'QR Code'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Manager comments summary */}
                  {project.quote_request_manager_comments && (
                    <div className="flex items-start gap-3">
                      <span className="text-gray-500 font-semibold min-w-[80px]">💬 Manager:</span>
                      <span className="text-gray-700 flex-1">
                        {project.quote_request_manager_comments.length > 80
                          ? project.quote_request_manager_comments.substring(0, 80) + '...'
                          : project.quote_request_manager_comments}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Activated on {formatDateTimeUTC(project.order_activated_at)}
                  </div>
                </div>
              )}
              
              {/* Full Form - shown when expanded OR not activated */}
              {(!project.order_activated_at || isOrderFormExpanded) && (
                <>
                  {/* Status Info */}
                  {!project.order_activated_at ? (
                    <p className="text-sm text-gray-600 text-left">
                      Complete all fields below to activate your order. Manager will review and prepare your invoice.
                    </p>
                  ) : (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                      <p className="text-sm text-green-800 font-semibold">
                        ✓ Activated on {formatDateTimeUTC(project.order_activated_at)}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        This is the form you submitted. All fields are locked for audit purposes.
                      </p>
                    </div>
                  )}

                {/* Progress indicator (only when not activated) */}
                {!project.order_activated_at && (
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-sky-900 mb-2">
                      📋 Current Status:
                    </p>
                    <p className="text-sm text-sky-700">
                      {!project.reference_materials || project.reference_materials.length === 0 ? (
                        <span>⏳ Step 1/3: Upload Script & Materials</span>
                      ) : !orderBrief ? (
                        <span>⏳ Step 2/3: Provide Project Brief</span>
                      ) : !orderPaymentMethod ? (
                        <span>⏳ Step 3/3: Select Payment Method</span>
                      ) : (
                        <span>✅ Ready to Activate Order</span>
                      )}
                    </p>
                  </div>
                )}

                {/* 1. Project Brief Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Project Brief {project.order_activated_at && <span className="text-xs text-gray-500">(submitted)</span>}
                  </label>
                  <textarea
                    value={project.order_activated_at ? (project.detailed_brief || '') : orderBrief}
                    onChange={(e) => !project.order_activated_at && setOrderBrief(e.target.value)}
                    placeholder={project.order_activated_at ? '' : "Describe your project in detail: objectives, style, target audience, specific requirements..."}
                    disabled={project.order_activated_at}
                    className={`w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                      project.order_activated_at 
                        ? 'bg-gray-50 border-gray-300 text-gray-700 cursor-not-allowed' 
                        : 'border-gray-300'
                    }`}
                    rows={6}
                  />
                  {!project.order_activated_at && (
                    <p className="text-xs text-gray-500 mt-2">
                      Provide detailed information about your project to help us prepare an accurate quote.
                    </p>
                  )}
                </div>

                {/* 2. Script & Materials */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📎 Script & Materials {project.order_activated_at && <span className="text-xs text-gray-500">(submitted)</span>}
                  </label>
                  
                  {!project.order_activated_at && (
                    <>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        disabled={uploadingFiles}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Upload your script, character references, location photos, or any other materials (PDF, DOCX, ZIP, Images)
                      </p>
                    </>
                  )}

                  {/* Uploaded Files List (shown in both states) */}
                  {project.reference_materials && project.reference_materials.length > 0 && (
                    <div className={`mt-3 border rounded-lg p-4 ${
                      project.order_activated_at 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <p className={`text-sm font-semibold mb-2 ${
                        project.order_activated_at ? 'text-gray-700' : 'text-green-900'
                      }`}>
                        {project.order_activated_at ? '📎 Uploaded Materials:' : '✅ Uploaded Materials:'}
                      </p>
                      <ul className="space-y-1">
                        {project.reference_materials.map((file, idx) => (
                          <li key={idx} className={`text-sm flex items-center gap-2 ${
                            project.order_activated_at ? 'text-gray-700' : 'text-green-700'
                          }`}>
                            <span>{project.order_activated_at ? '📄' : '✓'}</span>
                            <span>{file}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {uploadingFiles && (
                    <div className="text-center text-sm text-gray-600 mt-2">
                      <span className="inline-block animate-spin mr-2">⏳</span>
                      Uploading files...
                    </div>
                  )}
                </div>

                {/* 3. Payment Method Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    💳 Payment Method {project.order_activated_at && <span className="text-xs text-gray-500">(selected)</span>}
                  </label>
                  <div className="space-y-3">
                    <label className={`flex items-center p-4 border-2 rounded-lg ${
                      project.order_activated_at 
                        ? 'cursor-not-allowed bg-gray-50' 
                        : 'cursor-pointer hover:bg-sky-50 transition-colors'
                    }`}
                      style={{ 
                        borderColor: (project.order_activated_at ? project.order_activation_payment_method === 'paypal' : orderPaymentMethod === 'paypal') 
                          ? '#0ea5e9' 
                          : '#d1d5db' 
                      }}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="paypal"
                        checked={project.order_activated_at ? project.order_activation_payment_method === 'paypal' : orderPaymentMethod === 'paypal'}
                        onChange={(e) => !project.order_activated_at && setOrderPaymentMethod(e.target.value)}
                        disabled={project.order_activated_at}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold ${project.order_activated_at ? 'text-gray-700' : 'text-gray-900'}`}>
                          💳 PayPal
                        </p>
                        <p className="text-xs text-gray-600">Quick and secure online payment</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-4 border-2 rounded-lg ${
                      project.order_activated_at 
                        ? 'cursor-not-allowed bg-gray-50' 
                        : 'cursor-pointer hover:bg-sky-50 transition-colors'
                    }`}
                      style={{ 
                        borderColor: (project.order_activated_at ? project.order_activation_payment_method === 'swift' : orderPaymentMethod === 'swift') 
                          ? '#0ea5e9' 
                          : '#d1d5db' 
                      }}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="swift"
                        checked={project.order_activated_at ? project.order_activation_payment_method === 'swift' : orderPaymentMethod === 'swift'}
                        onChange={(e) => !project.order_activated_at && setOrderPaymentMethod(e.target.value)}
                        disabled={project.order_activated_at}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold ${project.order_activated_at ? 'text-gray-700' : 'text-gray-900'}`}>
                          🏦 SWIFT Transfer
                        </p>
                        <p className="text-xs text-gray-600">International bank transfer (USD)</p>
                      </div>
                    </label>
                    
                    <label className={`flex items-center p-4 border-2 rounded-lg ${
                      project.order_activated_at 
                        ? 'cursor-not-allowed bg-gray-50' 
                        : 'cursor-pointer hover:bg-sky-50 transition-colors'
                    }`}
                      style={{ 
                        borderColor: (project.order_activated_at ? project.order_activation_payment_method === 'qr_code' : orderPaymentMethod === 'qr_code') 
                          ? '#0ea5e9' 
                          : '#d1d5db' 
                      }}>
                      <input
                        type="radio"
                        name="payment_method"
                        value="qr_code"
                        checked={project.order_activated_at ? project.order_activation_payment_method === 'qr_code' : orderPaymentMethod === 'qr_code'}
                        onChange={(e) => !project.order_activated_at && setOrderPaymentMethod(e.target.value)}
                        disabled={project.order_activated_at}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <p className={`font-semibold ${project.order_activated_at ? 'text-gray-700' : 'text-gray-900'}`}>
                          📱 QR Code
                        </p>
                        <p className="text-xs text-gray-600">Instant local payment (GEL)</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 4. Manager Comments Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    💬 Manager's Comments {project.order_activated_at && project.quote_request_manager_comments && <span className="text-xs text-gray-500">(from manager)</span>}
                  </label>
                  
                  {project.quote_request_manager_comments ? (
                    <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                      <p className="text-sm text-blue-900 whitespace-pre-wrap">{project.quote_request_manager_comments}</p>
                    </div>
                  ) : (
                    <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                      <p className="text-xs text-gray-500 italic">
                        {project.order_activated_at 
                          ? 'No comments from manager yet.' 
                          : 'Manager will add comments after reviewing your submission.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div>
                  {!project.order_activated_at ? (
                    project.reference_materials && project.reference_materials.length > 0 && (
                      <button
                        onClick={activateOrder}
                        disabled={!orderBrief.trim() || !orderPaymentMethod}
                        className="btn-ocean w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        🚀 Activate Order & Submit for Review
                      </button>
                    )
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 text-lg font-semibold bg-green-100 text-green-800 border-2 border-green-300 rounded-lg cursor-not-allowed"
                    >
                      ✓ Order Activation Completed
                    </button>
                  )}
                </div>
                </>
              )}
            </div>



            {/* Operational Chain with Documents - Complete OS.1 v2.0 Timeline */}
            <OperationalChainWithDocuments project={project} onUpdate={fetchProjectDetails} />

          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {showFileModal && selectedFile && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeFileModal}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-sky-500 to-teal-500 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedFile.name}</h3>
                <p className="text-sky-100 text-sm mt-1">
                  {selectedFile.type === 'script' ? '📄 Script Document' : '📋 Reference Document'}
                </p>
              </div>
              <button
                onClick={closeFileModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)] bg-gray-50">
              <div className="bg-white rounded-lg p-8 shadow-inner border border-gray-200">
                <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed text-left">
                  {selectedFile.content}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-4 flex items-center justify-between border-t border-gray-200">
              <p className="text-xs text-gray-600">
                ✓ Client-uploaded material used for custom production
              </p>
              <button
                onClick={closeFileModal}
                className="btn-ocean-outline text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && paymentSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-6 flex items-center justify-between sticky top-0">
              <div>
                <h3 className="text-2xl font-bold">💳 Payment Details</h3>
                <p className="text-green-100 text-sm mt-1">
                  Amount: ${project.quote_amount} USD
                </p>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-white/80 hover:text-white text-3xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Please select a payment method and copy the details to make your payment. After completing the payment, mark it as paid below.
              </p>

              {/* Payment Method Selection */}
              <div className="mb-6">
                <h4 className="font-bold text-gray-900 mb-3">Select Payment Method:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* SWIFT Transfer */}
                  <button
                    onClick={() => setSelectedPaymentMethod('swift')}
                    className={`border-2 rounded-xl p-4 transition ${
                      selectedPaymentMethod === 'swift'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="text-3xl">🏦</div>
                      <div>
                        <p className="font-bold text-gray-900">SWIFT Transfer</p>
                        <span className="inline-block mt-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">USD</span>
                        <p className="text-xs text-gray-600 mt-1">International</p>
                      </div>
                    </div>
                  </button>

                  {/* PayPal */}
                  <button
                    onClick={() => setSelectedPaymentMethod('paypal')}
                    className={`border-2 rounded-xl p-4 transition ${
                      selectedPaymentMethod === 'paypal'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="text-3xl">💳</div>
                      <div>
                        <p className="font-bold text-gray-900">PayPal</p>
                        <span className="inline-block mt-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-0.5 rounded">USD</span>
                        <p className="text-xs text-gray-600 mt-1">Online payment</p>
                      </div>
                    </div>
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => setSelectedPaymentMethod('qr_code')}
                    className={`border-2 rounded-xl p-4 transition ${
                      selectedPaymentMethod === 'qr_code'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-10 h-10 bg-white p-1 border border-gray-300 rounded">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Top-left corner */}
                          <rect x="0" y="0" width="30" height="30" fill="black"/>
                          <rect x="5" y="5" width="20" height="20" fill="white"/>
                          <rect x="10" y="10" width="10" height="10" fill="black"/>
                          
                          {/* Top-right corner */}
                          <rect x="70" y="0" width="30" height="30" fill="black"/>
                          <rect x="75" y="5" width="20" height="20" fill="white"/>
                          <rect x="80" y="10" width="10" height="10" fill="black"/>
                          
                          {/* Bottom-left corner */}
                          <rect x="0" y="70" width="30" height="30" fill="black"/>
                          <rect x="5" y="75" width="20" height="20" fill="white"/>
                          <rect x="10" y="80" width="10" height="10" fill="black"/>
                          
                          {/* Random pixels in center */}
                          <rect x="40" y="15" width="5" height="5" fill="black"/>
                          <rect x="50" y="15" width="5" height="5" fill="black"/>
                          <rect x="45" y="25" width="5" height="5" fill="black"/>
                          <rect x="55" y="25" width="5" height="5" fill="black"/>
                          <rect x="35" y="35" width="5" height="5" fill="black"/>
                          <rect x="45" y="35" width="5" height="5" fill="black"/>
                          <rect x="55" y="35" width="5" height="5" fill="black"/>
                          <rect x="40" y="45" width="5" height="5" fill="black"/>
                          <rect x="50" y="45" width="5" height="5" fill="black"/>
                          <rect x="60" y="45" width="5" height="5" fill="black"/>
                          <rect x="35" y="55" width="5" height="5" fill="black"/>
                          <rect x="50" y="55" width="5" height="5" fill="black"/>
                          <rect x="40" y="65" width="5" height="5" fill="black"/>
                          <rect x="55" y="65" width="5" height="5" fill="black"/>
                          <rect x="65" y="55" width="5" height="5" fill="black"/>
                          <rect x="70" y="65" width="5" height="5" fill="black"/>
                          <rect x="80" y="75" width="5" height="5" fill="black"/>
                          <rect x="45" y="75" width="5" height="5" fill="black"/>
                          <rect x="55" y="85" width="5" height="5" fill="black"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">QR Code</p>
                        <span className="inline-block mt-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded">GEL</span>
                        <p className="text-xs text-gray-600 mt-1">Instant local</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* SWIFT Payment Details */}
              {selectedPaymentMethod === 'swift' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-bold text-gray-900 text-left">International Bank Transfer (SWIFT)</h4>
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">USD</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 text-left">
                    For international payments in <strong>US Dollars (USD)</strong>. This is a dollar-denominated account. Transfer typically takes 3-5 business days.
                  </p>
                  <div className="space-y-3 text-sm text-left">
                    <div>
                      <label className="font-semibold text-gray-700">Beneficiary Bank:</label>
                      <p className="text-gray-900 font-mono">{paymentSettings.bank_transfer.beneficiary_bank_name}</p>
                      <p className="text-gray-600">{paymentSettings.bank_transfer.beneficiary_bank_location}</p>
                      <p className="text-gray-600">SWIFT: {paymentSettings.bank_transfer.beneficiary_bank_swift}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700">IBAN:</label>
                      <p className="text-gray-900 font-mono text-lg">{paymentSettings.bank_transfer.beneficiary_iban}</p>
                    </div>
                    <div>
                      <label className="font-semibold text-gray-700">Beneficiary:</label>
                      <p className="text-gray-900">{paymentSettings.bank_transfer.beneficiary_name}</p>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <label className="font-semibold text-gray-700">Intermediary Bank 1:</label>
                      <p className="text-gray-900">{paymentSettings.bank_transfer.intermediary_bank_1.name}</p>
                      <p className="text-gray-600">{paymentSettings.bank_transfer.intermediary_bank_1.location}</p>
                      <p className="text-gray-600">SWIFT: {paymentSettings.bank_transfer.intermediary_bank_1.swift}</p>
                    </div>
                    <div className="border-t pt-3">
                      <label className="font-semibold text-gray-700">Intermediary Bank 2:</label>
                      <p className="text-gray-900">{paymentSettings.bank_transfer.intermediary_bank_2.name}</p>
                      <p className="text-gray-600">{paymentSettings.bank_transfer.intermediary_bank_2.location}</p>
                      <p className="text-gray-600">SWIFT: {paymentSettings.bank_transfer.intermediary_bank_2.swift}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Payment Details */}
              {selectedPaymentMethod === 'qr_code' && paymentSettings.bank_transfer.qr_code_url && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h4 className="font-bold text-gray-900 text-left">QR Code Payment</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded">GEL</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 text-left">
                    For local payments in <strong>Georgian Lari (GEL)</strong>. Scan the QR code with your TBC Bank mobile app for instant transfer.
                  </p>
                  <div className="flex justify-center">
                    <img
                      src={`${BACKEND_URL}${paymentSettings.bank_transfer.qr_code_url}`}
                      alt="Payment QR Code"
                      className="w-full max-w-md h-auto object-contain rounded-lg shadow-sm"
                    />
                  </div>
                </div>
              )}

              {selectedPaymentMethod === 'paypal' && (
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <h4 className="font-bold text-gray-900 mb-4">PayPal Payment Instructions:</h4>
                  
                  <div className="bg-white border-2 border-blue-300 rounded-lg p-4 mb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 mb-2 font-semibold">
                          📋 Copy this text and paste it in PayPal comments when making payment:
                        </p>
                      </div>
                      <button
                        onClick={copyPayPalMessage}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold whitespace-nowrap flex items-center gap-2"
                      >
                        📋 Copy Message
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded border border-gray-300 p-4 text-sm font-mono text-gray-800 whitespace-pre-wrap overflow-x-auto">
                      {generatePayPalMessage()}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900 mb-2">
                      <strong>💡 Important:</strong>
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1 ml-4">
                      <li>• Click "Copy Message" button above</li>
                      <li>• Go to PayPal and send <strong>${project.quote_amount} USD</strong> to <strong>{paymentSettings.paypal_email}</strong></li>
                      <li>• Paste the copied text into PayPal payment comments/notes</li>
                      <li>• After payment, return here and mark as completed below</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Confirmation */}
              {selectedPaymentMethod && (
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentMarked}
                      onChange={(e) => setPaymentMarked(e.target.checked)}
                      className="mt-1 w-5 h-5 text-sky-600"
                    />
                    <span className="text-gray-900 font-semibold">
                      I have completed the payment
                    </span>
                  </label>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Receipt (Optional):
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setPaymentReceipt(e.target.files[0])}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      You can upload a screenshot or PDF of your payment confirmation
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-100 p-6 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="btn-ocean-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkPayment}
                disabled={!paymentMarked || submittingPayment}
                className="btn-ocean disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingPayment ? 'Submitting...' : 'Confirm Payment Made'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetails;
