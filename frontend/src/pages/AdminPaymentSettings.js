import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaEdit, FaUpload } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminPaymentSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editedSettings, setEditedSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/payment-settings`);
      setSettings(response.data);
      setEditedSettings(response.data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.patch(`${API}/admin/payment-settings`, {
        paypal_email: editedSettings.paypal_email,
        bank_transfer: editedSettings.bank_transfer
      });
      setSettings(editedSettings);
      setEditMode(false);
      alert('Payment settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleQRUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('qr_code', file);

    try {
      const response = await axios.post(`${API}/admin/payment-settings/qr-code`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Update settings with new QR code URL
      const updatedSettings = { ...settings };
      updatedSettings.bank_transfer.qr_code_url = response.data.qr_code_url;
      setSettings(updatedSettings);
      setEditedSettings(updatedSettings);
      
      alert('QR code uploaded successfully!');
    } catch (error) {
      console.error('Error uploading QR code:', error);
      alert('Failed to upload QR code');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (path, value) => {
    const newSettings = { ...editedSettings };
    const keys = path.split('.');
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setEditedSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-sky-600">Loading...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment settings not found</h2>
          <Link to="/admin/dashboard" className="btn-ocean">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-payment-settings py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/admin/dashboard" className="text-sky-600 hover:text-sky-700 font-semibold mb-6 inline-block">
          ← Back to Admin Dashboard
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment Settings</h1>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="btn-ocean inline-flex items-center"
              >
                <FaEdit className="mr-2" />
                Edit Settings
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedSettings(settings);
                  }}
                  className="btn-ocean-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-ocean inline-flex items-center"
                >
                  <FaSave className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>

          {/* PayPal Section */}
          <div className="mb-8 border-b pb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">PayPal</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  PayPal Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={editedSettings.paypal_email}
                    onChange={(e) => handleFieldChange('paypal_email', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                ) : (
                  <p className="text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg">
                    {settings.paypal_email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bank Transfer Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Bank Transfer (SWIFT)</h2>
            
            {/* Beneficiary Bank */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Beneficiary's Bank</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bank Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.beneficiary_bank_name}
                      onChange={(e) => handleFieldChange('bank_transfer.beneficiary_bank_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                      {settings.bank_transfer.beneficiary_bank_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.beneficiary_bank_location}
                      onChange={(e) => handleFieldChange('bank_transfer.beneficiary_bank_location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                      {settings.bank_transfer.beneficiary_bank_location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SWIFT</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.beneficiary_bank_swift}
                      onChange={(e) => handleFieldChange('bank_transfer.beneficiary_bank_swift', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg">
                      {settings.bank_transfer.beneficiary_bank_swift}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Beneficiary Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Beneficiary Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">IBAN</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.beneficiary_iban}
                      onChange={(e) => handleFieldChange('bank_transfer.beneficiary_iban', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg">
                      {settings.bank_transfer.beneficiary_iban}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.beneficiary_name}
                      onChange={(e) => handleFieldChange('bank_transfer.beneficiary_name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                      {settings.bank_transfer.beneficiary_name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Intermediary Banks */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Intermediary Bank 1</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_1.name}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_1.name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_1.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_1.location}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_1.location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_1.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SWIFT</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_1.swift}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_1.swift', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_1.swift}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Intermediary Bank 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_2.name}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_2.name', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_2.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_2.location}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_2.location', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_2.location}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">SWIFT</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedSettings.bank_transfer.intermediary_bank_2.swift}
                      onChange={(e) => handleFieldChange('bank_transfer.intermediary_bank_2.swift', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  ) : (
                    <p className="text-gray-900 font-mono bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {settings.bank_transfer.intermediary_bank_2.swift}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Payment QR Code</h3>
              {settings.bank_transfer.qr_code_url && (
                <div className="mb-4">
                  <img
                    src={`${BACKEND_URL}${settings.bank_transfer.qr_code_url}`}
                    alt="Payment QR Code"
                    className="max-w-xs border border-gray-300 rounded-lg shadow-md"
                  />
                </div>
              )}
              <label className="btn-ocean inline-flex items-center cursor-pointer">
                <FaUpload className="mr-2" />
                {uploading ? 'Uploading...' : 'Upload New QR Code'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQRUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentSettings;
