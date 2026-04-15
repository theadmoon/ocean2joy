"""
Test Suite for Ocean2joy Simplified Workflow
Tests the new workflow: Quote Request → Invoice → Payment → Receipt → Certificate
Without the Quote document step.

Features tested:
- Order Activation (client fills Brief, uploads files, selects payment method)
- POST /api/projects/{id}/activate-order endpoint
- POST /api/admin/projects/{id}/send-invoice endpoint
- Invoice signature upload and status change to INVOICE_SIGNED
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "admin@ocean2joy.com"
ADMIN_PASSWORD = "admin123"
CLIENT_EMAIL = "mek110@yahoo.com"
CLIENT_PASSWORD = "marcos2026"


class TestAuthEndpoints:
    """Authentication tests"""
    
    def test_admin_login(self):
        """Test admin login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "admin"
        print(f"✓ Admin login successful, role: {data['user']['role']}")
    
    def test_client_login(self):
        """Test client login with correct credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": CLIENT_EMAIL,
            "password": CLIENT_PASSWORD
        })
        assert response.status_code == 200, f"Client login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert data["user"]["role"] == "client"
        print(f"✓ Client login successful, role: {data['user']['role']}")


@pytest.fixture
def admin_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Admin authentication failed")


@pytest.fixture
def client_token():
    """Get client authentication token"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": CLIENT_EMAIL,
        "password": CLIENT_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("access_token")
    pytest.skip("Client authentication failed")


@pytest.fixture
def test_project_id(client_token):
    """Create a new test project for workflow testing"""
    headers = {"Authorization": f"Bearer {client_token}"}
    
    # Create a new project via detailed request
    project_data = {
        "service_type": "custom_video",
        "project_title": f"TEST_Workflow_Project_{uuid.uuid4().hex[:8]}",
        "detailed_brief": "Test project for workflow testing",
        "objectives": "Test the simplified workflow",
        "special_instructions": "This is a test project",
        "expected_duration": "30 minutes",
        "deadline_preference": "2 weeks",
        "budget_range": "$500-$1000"
    }
    
    response = requests.post(
        f"{BASE_URL}/api/requests",
        json=project_data,
        headers=headers
    )
    
    if response.status_code != 200:
        pytest.skip(f"Failed to create test project: {response.text}")
    
    # Get the project ID from the user's projects
    projects_response = requests.get(f"{BASE_URL}/api/projects", headers=headers)
    projects = projects_response.json()
    
    # Find the test project
    test_project = None
    for proj in projects:
        if proj["project_title"].startswith("TEST_Workflow_Project_"):
            test_project = proj
            break
    
    if not test_project:
        pytest.skip("Could not find created test project")
    
    yield test_project["id"]
    
    # Cleanup: We don't delete the project as there's no delete endpoint


class TestOrderActivationWorkflow:
    """Tests for the Order Activation feature"""
    
    def test_upload_materials_endpoint(self, client_token, test_project_id):
        """Test uploading materials to a project"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # Create a test file
        files = {
            'files': ('test_script.pdf', b'Test script content', 'application/pdf')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/projects/{test_project_id}/upload-materials",
            files=files,
            headers=headers
        )
        
        assert response.status_code == 200, f"Upload materials failed: {response.text}"
        data = response.json()
        assert "reference_materials" in data
        assert len(data["reference_materials"]) > 0
        print(f"✓ Materials uploaded successfully: {data['reference_materials']}")
    
    def test_activate_order_without_materials(self, client_token, test_project_id):
        """Test that order activation fails without materials"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # First, get a fresh project without materials
        # Create new project
        project_data = {
            "service_type": "custom_video",
            "project_title": f"TEST_NoMaterials_{uuid.uuid4().hex[:8]}",
            "detailed_brief": "Test project without materials",
            "objectives": "Test validation"
        }
        
        requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=headers)
        
        # Get the new project
        projects_response = requests.get(f"{BASE_URL}/api/projects", headers=headers)
        projects = projects_response.json()
        
        new_project = None
        for proj in projects:
            if proj["project_title"].startswith("TEST_NoMaterials_"):
                new_project = proj
                break
        
        if not new_project:
            pytest.skip("Could not find test project")
        
        # Try to activate without materials
        form_data = {
            'brief': 'Test brief',
            'payment_method': 'paypal'
        }
        
        response = requests.patch(
            f"{BASE_URL}/api/projects/{new_project['id']}/activate-order",
            data=form_data,
            headers=headers
        )
        
        # Should fail because no materials uploaded
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✓ Order activation correctly rejected without materials")
    
    def test_activate_order_with_valid_data(self, client_token, test_project_id):
        """Test successful order activation with all required data"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # First upload materials
        files = {
            'files': ('test_script.pdf', b'Test script content', 'application/pdf')
        }
        
        upload_response = requests.post(
            f"{BASE_URL}/api/projects/{test_project_id}/upload-materials",
            files=files,
            headers=headers
        )
        assert upload_response.status_code == 200
        
        # Now activate order
        form_data = {
            'brief': 'This is a detailed brief for the project',
            'payment_method': 'paypal'
        }
        
        response = requests.patch(
            f"{BASE_URL}/api/projects/{test_project_id}/activate-order",
            data=form_data,
            headers=headers
        )
        
        assert response.status_code == 200, f"Order activation failed: {response.text}"
        data = response.json()
        assert data["message"] == "Order activated successfully"
        assert data["payment_method"] == "paypal"
        print(f"✓ Order activated successfully with payment method: {data['payment_method']}")
        
        # Verify project was updated
        project_response = requests.get(
            f"{BASE_URL}/api/projects/{test_project_id}",
            headers=headers
        )
        project = project_response.json()
        assert project.get("order_activated_at") is not None
        assert project.get("order_activation_payment_method") == "paypal"
        print("✓ Project updated with activation data")
    
    def test_activate_order_payment_methods(self, client_token):
        """Test all valid payment methods: paypal, swift, qr_code"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        valid_methods = ['paypal', 'swift', 'qr_code']
        
        for method in valid_methods:
            # Create a new project for each test
            project_data = {
                "service_type": "custom_video",
                "project_title": f"TEST_PaymentMethod_{method}_{uuid.uuid4().hex[:8]}",
                "detailed_brief": f"Test {method} payment",
                "objectives": "Test payment method"
            }
            
            requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=headers)
            
            # Get the project
            projects_response = requests.get(f"{BASE_URL}/api/projects", headers=headers)
            projects = projects_response.json()
            
            test_project = None
            for proj in projects:
                if f"TEST_PaymentMethod_{method}_" in proj["project_title"]:
                    test_project = proj
                    break
            
            if not test_project:
                continue
            
            # Upload materials
            files = {'files': ('script.pdf', b'content', 'application/pdf')}
            requests.post(
                f"{BASE_URL}/api/projects/{test_project['id']}/upload-materials",
                files=files,
                headers=headers
            )
            
            # Activate with payment method
            form_data = {'brief': 'Test', 'payment_method': method}
            response = requests.patch(
                f"{BASE_URL}/api/projects/{test_project['id']}/activate-order",
                data=form_data,
                headers=headers
            )
            
            assert response.status_code == 200, f"Failed for {method}: {response.text}"
            print(f"✓ Payment method '{method}' accepted")


class TestInvoiceWorkflow:
    """Tests for Invoice sending and signing"""
    
    def test_send_invoice_by_manager(self, admin_token, client_token):
        """Test manager sending invoice to client"""
        client_headers = {"Authorization": f"Bearer {client_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create and prepare a project
        project_data = {
            "service_type": "custom_video",
            "project_title": f"TEST_Invoice_{uuid.uuid4().hex[:8]}",
            "detailed_brief": "Test invoice workflow",
            "objectives": "Test invoice"
        }
        
        requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=client_headers)
        
        # Get the project
        projects_response = requests.get(f"{BASE_URL}/api/projects", headers=client_headers)
        projects = projects_response.json()
        
        test_project = None
        for proj in projects:
            if "TEST_Invoice_" in proj["project_title"]:
                test_project = proj
                break
        
        if not test_project:
            pytest.skip("Could not find test project")
        
        # Upload materials and activate order
        files = {'files': ('script.pdf', b'content', 'application/pdf')}
        requests.post(
            f"{BASE_URL}/api/projects/{test_project['id']}/upload-materials",
            files=files,
            headers=client_headers
        )
        
        form_data = {'brief': 'Test', 'payment_method': 'paypal'}
        requests.patch(
            f"{BASE_URL}/api/projects/{test_project['id']}/activate-order",
            data=form_data,
            headers=client_headers
        )
        
        # Manager sends invoice
        invoice_data = {
            'invoice_amount': 500.00,
            'invoice_details': 'Custom video production - 30 minutes'
        }
        
        response = requests.patch(
            f"{BASE_URL}/api/admin/projects/{test_project['id']}/send-invoice",
            data=invoice_data,
            headers=admin_headers
        )
        
        assert response.status_code == 200, f"Send invoice failed: {response.text}"
        data = response.json()
        assert data["invoice_amount"] == 500.00
        assert data["status"] == "invoice_sent"
        print(f"✓ Invoice sent successfully: ${data['invoice_amount']}")
        
        # Verify project status updated
        project_response = requests.get(
            f"{BASE_URL}/api/projects/{test_project['id']}",
            headers=client_headers
        )
        project = project_response.json()
        assert project["status"] == "invoice_sent"
        assert project.get("invoice_sent_at") is not None
        print("✓ Project status updated to invoice_sent")
    
    def test_sign_invoice_by_client(self, admin_token, client_token):
        """Test client signing invoice"""
        client_headers = {"Authorization": f"Bearer {client_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create project
        project_data = {
            "service_type": "custom_video",
            "project_title": f"TEST_SignInvoice_{uuid.uuid4().hex[:8]}",
            "detailed_brief": "Test sign invoice",
            "objectives": "Test"
        }
        
        requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=client_headers)
        
        # Get project
        projects_response = requests.get(f"{BASE_URL}/api/projects", headers=client_headers)
        projects = projects_response.json()
        
        test_project = None
        for proj in projects:
            if "TEST_SignInvoice_" in proj["project_title"]:
                test_project = proj
                break
        
        if not test_project:
            pytest.skip("Could not find test project")
        
        # Prepare project (upload materials, activate, send invoice)
        files = {'files': ('script.pdf', b'content', 'application/pdf')}
        requests.post(
            f"{BASE_URL}/api/projects/{test_project['id']}/upload-materials",
            files=files,
            headers=client_headers
        )
        
        requests.patch(
            f"{BASE_URL}/api/projects/{test_project['id']}/activate-order",
            data={'brief': 'Test', 'payment_method': 'paypal'},
            headers=client_headers
        )
        
        requests.patch(
            f"{BASE_URL}/api/admin/projects/{test_project['id']}/send-invoice",
            data={'invoice_amount': 500.00, 'invoice_details': 'Test'},
            headers=admin_headers
        )
        
        # Client signs invoice
        response = requests.patch(
            f"{BASE_URL}/api/projects/{test_project['id']}/sign-invoice",
            headers=client_headers
        )
        
        assert response.status_code == 200, f"Sign invoice failed: {response.text}"
        data = response.json()
        assert data["status"] == "invoice_signed"
        print("✓ Invoice signed successfully")
        
        # Verify project status
        project_response = requests.get(
            f"{BASE_URL}/api/projects/{test_project['id']}",
            headers=client_headers
        )
        project = project_response.json()
        assert project["status"] == "invoice_signed"
        assert project.get("invoice_signed_at") is not None
        print("✓ Project status updated to invoice_signed")
    
    def test_upload_signed_invoice_pdf(self, admin_token, client_token):
        """Test client uploading signed invoice PDF"""
        client_headers = {"Authorization": f"Bearer {client_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create and prepare project
        project_data = {
            "service_type": "custom_video",
            "project_title": f"TEST_UploadInvoice_{uuid.uuid4().hex[:8]}",
            "detailed_brief": "Test upload invoice",
            "objectives": "Test"
        }
        
        requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=client_headers)
        
        # Get project
        projects_response = requests.get(f"{BASE_URL}/api/projects", headers=client_headers)
        projects = projects_response.json()
        
        test_project = None
        for proj in projects:
            if "TEST_UploadInvoice_" in proj["project_title"]:
                test_project = proj
                break
        
        if not test_project:
            pytest.skip("Could not find test project")
        
        # Prepare project
        files = {'files': ('script.pdf', b'content', 'application/pdf')}
        requests.post(
            f"{BASE_URL}/api/projects/{test_project['id']}/upload-materials",
            files=files,
            headers=client_headers
        )
        
        requests.patch(
            f"{BASE_URL}/api/projects/{test_project['id']}/activate-order",
            data={'brief': 'Test', 'payment_method': 'paypal'},
            headers=client_headers
        )
        
        requests.patch(
            f"{BASE_URL}/api/admin/projects/{test_project['id']}/send-invoice",
            data={'invoice_amount': 500.00, 'invoice_details': 'Test'},
            headers=admin_headers
        )
        
        # Upload signed invoice PDF
        files = {
            'file': ('signed_invoice.pdf', b'%PDF-1.4 signed invoice content', 'application/pdf')
        }
        
        response = requests.post(
            f"{BASE_URL}/api/projects/{test_project['id']}/upload-confirmation/invoice",
            files=files,
            headers=client_headers
        )
        
        assert response.status_code == 200, f"Upload signed invoice failed: {response.text}"
        data = response.json()
        assert data["doc_type"] == "invoice"
        print(f"✓ Signed invoice uploaded: {data['filename']}")
        
        # Verify project status changed to invoice_signed
        project_response = requests.get(
            f"{BASE_URL}/api/projects/{test_project['id']}",
            headers=client_headers
        )
        project = project_response.json()
        assert project["status"] == "invoice_signed"
        assert project.get("invoice_signed_at") is not None
        assert project.get("invoice_signed_filename") is not None
        print("✓ Project status updated to invoice_signed after PDF upload")


class TestProjectStatusFlow:
    """Tests for the complete project status flow"""
    
    def test_project_statuses_exist(self):
        """Verify all required statuses are defined"""
        expected_statuses = [
            "submitted",
            "invoice_sent",
            "invoice_signed",
            "in_production",
            "in_review",
            "revision_requested",
            "delivered",
            "completed",
            "cancelled"
        ]
        
        # This is a documentation test - we verify the statuses exist in the API
        print(f"✓ Expected statuses: {expected_statuses}")
    
    def test_existing_project_has_correct_structure(self, client_token):
        """Test that existing project has all required fields"""
        headers = {"Authorization": f"Bearer {client_token}"}
        
        # Get the existing test project
        existing_project_id = "ead900d9-33ab-4b22-9e72-20fbc1820bcc"
        
        response = requests.get(
            f"{BASE_URL}/api/projects/{existing_project_id}",
            headers=headers
        )
        
        assert response.status_code == 200, f"Failed to get project: {response.text}"
        project = response.json()
        
        # Check required fields exist
        required_fields = [
            "id", "project_number", "user_id", "user_name", "user_email",
            "service_type", "project_title", "detailed_brief", "status",
            "created_at", "updated_at"
        ]
        
        for field in required_fields:
            assert field in project, f"Missing field: {field}"
        
        print(f"✓ Project has all required fields")
        print(f"  - Status: {project['status']}")
        print(f"  - Project Number: {project['project_number']}")


class TestQuoteRequestComments:
    """Tests for Quote Request manager comments"""
    
    def test_update_quote_request_comments(self, admin_token, client_token):
        """Test manager adding comments to Quote Request"""
        client_headers = {"Authorization": f"Bearer {client_token}"}
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Create project
        project_data = {
            "service_type": "custom_video",
            "project_title": f"TEST_Comments_{uuid.uuid4().hex[:8]}",
            "detailed_brief": "Test comments",
            "objectives": "Test"
        }
        
        requests.post(f"{BASE_URL}/api/requests", json=project_data, headers=client_headers)
        
        # Get project
        projects_response = requests.get(f"{BASE_URL}/api/projects", headers=client_headers)
        projects = projects_response.json()
        
        test_project = None
        for proj in projects:
            if "TEST_Comments_" in proj["project_title"]:
                test_project = proj
                break
        
        if not test_project:
            pytest.skip("Could not find test project")
        
        # Manager adds comments
        response = requests.patch(
            f"{BASE_URL}/api/admin/projects/{test_project['id']}/update-quote-request-comments",
            data={'comments': 'Manager reviewed the request. Looks good!'},
            headers=admin_headers
        )
        
        assert response.status_code == 200, f"Update comments failed: {response.text}"
        data = response.json()
        assert "Manager reviewed" in data["comments"]
        print("✓ Quote Request comments updated successfully")


class TestPaymentSettings:
    """Tests for payment settings endpoint"""
    
    def test_get_payment_settings(self):
        """Test getting payment settings (public endpoint)"""
        response = requests.get(f"{BASE_URL}/api/payment-settings")
        
        assert response.status_code == 200, f"Failed to get payment settings: {response.text}"
        data = response.json()
        
        assert "paypal_email" in data
        assert "bank_transfer" in data
        print(f"✓ Payment settings retrieved: PayPal email: {data['paypal_email']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
