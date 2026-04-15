# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

user_problem_statement: "Simplify Ocean2joy workflow by removing Quote document. Client activates order with: Brief (text), Script (files), Payment Method (PayPal/SWIFT/QR). Manager reviews, sends Invoice directly. Client signs and uploads PDF Invoice. Chain: Quote Request → Invoice → Payment → Receipt → Certificate."

backend:
  - task: "New project statuses (INVOICE_SENT, INVOICE_SIGNED)"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py:133-143"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added new statuses to replace QUOTED and QUOTE_ACCEPTED. Kept legacy statuses for backward compatibility."

  - task: "Order activation endpoint with brief and payment_method"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py:1125-1170"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Updated /api/projects/{id}/activate-order to accept brief (Form) and payment_method (Form). Validates payment method."

  - task: "Send invoice endpoint for manager"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py:1173-1202"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added /api/admin/projects/{id}/send-invoice endpoint for managers to send invoice with amount and details."

  - task: "Invoice signature upload updates status"
    implemented: true
    working: "NA"
    file: "/app/backend/server.py:1310-1318"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Modified /api/projects/{id}/upload-confirmation/{doc_type} to set status=INVOICE_SIGNED when doc_type=invoice."

frontend:
  - task: "Remove Quote from operational chain"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/ProjectDocuments.js:106-112"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Removed Quote document from documents array. Chain now: Quote Request → Invoice → Payment → Receipt → Certificate."

  - task: "Update Quote Request sub-steps"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/ProjectDocuments.js:53-60"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Updated sub-steps to: awaiting_activation → activated → manager_reviewing → comments_added"

  - task: "Update Invoice sub-steps"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/ProjectDocuments.js:61-66"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Updated sub-steps to: pending → sent → awaiting_signature → signed"

  - task: "Order Activation UI with Brief, Files, Payment Method"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/ProjectDetails.js:1225-1362"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added textarea for Brief, file upload for Script, radio buttons for Payment Method (PayPal/SWIFT/QR). Shows progress: Step 1/2/3."

  - task: "Invoice signature upload UI"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/components/ProjectDocuments.js:481-505"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Added PDF upload UI for Invoice signature when invoice_sent_at exists and invoice_signed_at is null."

  - task: "Remove duplicate Client Materials section"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/ProjectDetails.js:1017"
    stuck_count: 0
    priority: "medium"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Removed duplicate 'Client Materials' and 'Upload Materials' sections - now handled in Order Activation."

  - task: "Replace Quote section with Invoice section"
    implemented: true
    working: "NA"
    file: "/app/frontend/src/pages/ProjectDetails.js:1018-1057"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Replaced old Quote section with Invoice section. Shows signature status and payment button when signed."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Complete Order Activation flow (new project)"
    - "Invoice send and signature flow"
    - "Operational chain without Quote document"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Implemented simplified workflow: removed Quote, added Order Activation with Brief/Files/Payment selection, Invoice signature upload. Need full e2e testing of new project flow."
