import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaCheckCircle, FaComments } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [deliverables, setDeliverables] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);

  // Mock file contents that match the comedy project
  const fileContents = {
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
    const content = fileContents[fileName];
    if (content) {
      setSelectedFile(content);
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
      fetchDeliverables();
    }
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}`);
      setProject(response.data);
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

  const fetchDeliverables = async () => {
    try {
      const response = await axios.get(`${API}/projects/${projectId}/deliverables`);
      setDeliverables(response.data);
    } catch (error) {
      console.error('Error:', error);
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card-ocean p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Project Details</h2>
              <div className="space-y-3 text-left">
                <div className="text-left"><span className="font-semibold">Service:</span> {project.service_type}</div>
                <div className="text-left"><span className="font-semibold">Brief:</span> <p className="mt-1 text-left">{project.detailed_brief}</p></div>
                <div className="text-left"><span className="font-semibold">Objectives:</span> <p className="mt-1 text-left">{project.objectives}</p></div>
                {project.special_instructions && <div className="text-left"><span className="font-semibold">Special Instructions:</span> <p className="mt-1 text-left">{project.special_instructions}</p></div>}
              </div>
            </div>

            {/* Client Materials - Always visible if files exist */}
            {project.reference_materials && project.reference_materials.length > 0 && (
              <div className="card-ocean p-6 bg-gradient-to-br from-teal-50 to-sky-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">
                  📎 Client Materials
                </h3>
                <p className="text-gray-700 mb-4 text-left">
                  Materials uploaded by client for this project (click to view):
                </p>
                <div className="space-y-2">
                  {project.reference_materials.map((file, idx) => {
                    const fileName = file.split(' (')[0]; // Extract filename before " (uploaded by client)"
                    const hasContent = fileContents[fileName];
                    
                    return (
                      <div 
                        key={idx} 
                        onClick={() => hasContent && openFile(fileName)}
                        className={`flex items-center gap-3 text-sm bg-white p-3 rounded-lg border border-sky-200 ${
                          hasContent ? 'cursor-pointer hover:bg-sky-50 hover:border-sky-400 transition-all' : ''
                        }`}
                      >
                        <svg className="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-left flex-1">{file}</span>
                        {hasContent && (
                          <span className="text-xs bg-sky-500 text-white px-2 py-1 rounded font-medium">
                            Click to view
                          </span>
                        )}
                        <span className="text-xs text-teal-600 font-medium">✓</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 bg-white p-3 rounded-lg border border-teal-200">
                  <p className="text-xs text-teal-800 text-left">
                    <strong>Note:</strong> These materials were used for custom production. Click any file to view its contents.
                  </p>
                </div>
              </div>
            )}

            {/* Upload Materials - Only for active projects */}
            {!project.reference_materials?.length && (project.status === 'submitted' || project.status === 'quoted' || project.status === 'quote_accepted' || project.status === 'in_production') && (
              <div className="card-ocean p-6 bg-gradient-to-br from-teal-50 to-sky-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Upload Materials</h3>
                <p className="text-gray-700 mb-4 text-left">
                  Upload your script, reference materials, or any files needed for production.
                </p>
                <div className="border-2 border-dashed border-sky-300 rounded-lg p-8 text-center bg-white">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-sky-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <label htmlFor="file-upload" className="text-sky-600 hover:text-sky-700 font-semibold cursor-pointer">
                      Click to upload
                    </label>
                    {' '}or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT, ZIP up to 100MB</p>
                  <input id="file-upload" name="file-upload" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,.zip" />
                </div>
              </div>
            )}

            {project.quote_amount && (
              <div className="card-ocean p-6 bg-gradient-to-br from-sky-50 to-teal-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Quote</h3>
                <div className="text-3xl font-bold text-sky-600 mb-2 text-left">${project.quote_amount}</div>
                <p className="text-gray-700 mb-4 text-left">{project.quote_details}</p>
                {project.status === 'quoted' && (
                  <button onClick={handleAcceptQuote} className="btn-ocean">Accept Quote & Start Production</button>
                )}
              </div>
            )}

            {deliverables.length > 0 && (
              <div className="card-ocean p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Deliverables</h3>
                <div className="space-y-3">
                  {deliverables.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="text-left">
                        <p className="font-semibold text-left">{file.file_name}</p>
                        <p className="text-sm text-gray-600 text-left">{file.description}</p>
                      </div>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="btn-ocean-outline">
                        <FaDownload className="inline mr-2" />Download
                      </a>
                    </div>
                  ))}
                </div>
                {project.status === 'delivered' && (
                  <button onClick={handleApprove} className="btn-ocean mt-4 w-full"><FaCheckCircle className="inline mr-2" />Approve & Complete Project</button>
                )}
              </div>
            )}

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
                            {new Date(msg.created_at).toLocaleString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap text-left">
                          {msg.message}
                        </p>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs mb-2 opacity-80">Attachments:</p>
                            {msg.attachments.map((file, idx) => {
                              const hasContent = fileContents[file];
                              return (
                                <div 
                                  key={idx} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (hasContent) openFile(file);
                                  }}
                                  className={`text-xs flex items-center gap-2 mt-1 p-2 rounded ${
                                    hasContent 
                                      ? 'cursor-pointer hover:bg-white/10 transition-colors' 
                                      : ''
                                  }`}
                                >
                                  📎 {file}
                                  {hasContent && (
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
          </div>

          <div className="lg:col-span-1">
            <div className="card-ocean p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-left">Project Status Timeline</h3>
              <div className="space-y-3 text-sm text-left">
                {/* Submitted */}
                <div className="border-l-4 border-sky-500 pl-3 py-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Submitted</span>
                    <span className="text-gray-700">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Initial request received</p>
                </div>

                {/* Quote Sent */}
                {project.quote_sent_at && (
                  <div className="border-l-4 border-purple-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Quote Sent</span>
                      <span className="text-gray-700">{new Date(project.quote_sent_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">${project.quote_amount} USD</p>
                  </div>
                )}

                {/* Quote Accepted */}
                {project.quote_accepted_at && (
                  <div className="border-l-4 border-green-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Quote Accepted</span>
                      <span className="text-gray-700">{new Date(project.quote_accepted_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Client confirmed terms</p>
                  </div>
                )}

                {/* Production Started */}
                {project.production_started_at && (
                  <div className="border-l-4 border-orange-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Production Started</span>
                      <span className="text-gray-700">{new Date(project.production_started_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Work in progress</p>
                  </div>
                )}

                {/* Delivered */}
                {project.delivered_at && (
                  <div className="border-l-4 border-teal-500 pl-3 py-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Delivered</span>
                      <span className="text-gray-700">{new Date(project.delivered_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Files available for download</p>
                  </div>
                )}

                {/* Payment & Completion */}
                {project.completed_at && (
                  <>
                    <div className="border-l-4 border-emerald-600 pl-3 py-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Payment Received</span>
                        <span className="text-gray-700">{new Date(project.completed_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">PayPal payment confirmed</p>
                    </div>
                    <div className="border-l-4 border-emerald-700 pl-3 py-1 bg-emerald-50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-emerald-900">Project Completed</span>
                        <span className="text-emerald-700">{new Date(project.completed_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-1">
                        {project.acceptance_status === 'approved' ? 'Client approved ✓' : 'Work accepted'}
                      </p>
                    </div>
                  </>
                )}

                {/* Production Timeline Info */}
                {project.production_started_at && project.delivered_at && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold">Production Time:</span>
                    </p>
                    <p className="text-sm text-gray-900 font-medium">
                      {Math.ceil((new Date(project.delivered_at) - new Date(project.production_started_at)) / (1000 * 60 * 60 * 24))} days
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      From production start to delivery
                    </p>
                  </div>
                )}
              </div>
            </div>
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
    </div>
  );
}

export default ProjectDetails;
