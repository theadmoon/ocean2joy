import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUpload, FaTrash, FaEdit, FaSave, FaTimes, FaVideo } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function AdminDemoVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    position: 1,
    title: '',
    description: '',
    tags: '',
    videoFile: null,
    videoUrl: '',
    uploadMethod: 'file' // 'file' or 'url'
  });
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/admin/demo-videos`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }
      
      // Validate file type
      const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type. Please upload MP4, WebM, MOV, or AVI');
        return;
      }
      
      setUploadForm({ ...uploadForm, videoFile: file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Validate based on upload method
    if (uploadForm.uploadMethod === 'file') {
      if (!uploadForm.videoFile) {
        alert('Please select a video file');
        return;
      }
    } else {
      if (!uploadForm.videoUrl) {
        alert('Please enter a video URL');
        return;
      }
    }

    // Use placeholder values as defaults if fields are empty
    const defaultTitles = {
      1: 'Professional Custom Video',
      2: 'AI-Powered Creation'
    };
    
    const defaultDescriptions = {
      1: 'Example of our custom video production with professional actors and crew',
      2: 'Example of our cutting-edge AI-generated video content with digital effects'
    };

    const finalTitle = uploadForm.title.trim() || defaultTitles[uploadForm.position];
    const finalDescription = uploadForm.description.trim() || defaultDescriptions[uploadForm.position];
    const finalTags = uploadForm.tags.trim() || 'Demo, Sample';

    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (uploadForm.uploadMethod === 'file') {
        // Upload file
        const formData = new FormData();
        formData.append('position', uploadForm.position);
        formData.append('title', finalTitle);
        formData.append('description', finalDescription);
        formData.append('tags', finalTags);
        formData.append('video', uploadForm.videoFile);

        await axios.post(`${API}/admin/demo-videos/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Upload URL
        const formData = new FormData();
        formData.append('position', uploadForm.position);
        formData.append('title', finalTitle);
        formData.append('description', finalDescription);
        formData.append('tags', finalTags);
        formData.append('video_url', uploadForm.videoUrl);

        await axios.post(`${API}/admin/demo-videos/upload-url`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
      }

      alert('Video added successfully!');
      setShowUploadForm(false);
      setUploadForm({
        position: 1,
        title: '',
        description: '',
        tags: '',
        videoFile: null,
        videoUrl: '',
        uploadMethod: 'file'
      });
      fetchVideos();
    } catch (error) {
      console.error('Upload error:', error);
      alert(error.response?.data?.detail || 'Failed to add video');
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (video) => {
    setEditingId(video.id);
    setEditData({
      title: video.title,
      description: video.description,
      tags: video.tags.join(', '),
      is_active: video.is_active
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const updatePayload = {
        title: editData.title,
        description: editData.description,
        tags: editData.tags.split(',').map(t => t.trim()).filter(t => t),
        is_active: editData.is_active
      };

      await axios.patch(`${API}/admin/demo-videos/${videoId}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Video updated successfully!');
      setEditingId(null);
      setEditData({});
      fetchVideos();
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update video');
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/admin/demo-videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete video');
    }
  };

  // Render video preview
  const renderVideoPreview = (video) => {
    if (video.video_type === 'url') {
      // For URL videos, show iframe or video tag
      if (video.video_url.includes('disk.yandex') || video.video_url.includes('drive.google')) {
        return (
          <div className="w-full rounded-lg bg-gray-900 flex items-center justify-center" style={{ height: '200px' }}>
            <p className="text-white text-sm text-center px-4">
              🎥 External Video<br />
              <span className="text-xs text-gray-400">{video.video_url.substring(0, 50)}...</span>
            </p>
          </div>
        );
      }
      
      return (
        <video
          controls
          className="w-full rounded-lg"
          style={{ maxHeight: '200px' }}
        >
          <source src={video.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    
    // For uploaded files
    return (
      <video
        controls
        className="w-full rounded-lg"
        style={{ maxHeight: '200px' }}
      >
        <source src={`${BACKEND_URL}${video.video_url}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-sky-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-demo-videos py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manage Demo Videos</h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn-ocean flex items-center gap-2"
          >
            <FaUpload />
            {showUploadForm ? 'Cancel Upload' : 'Upload New Video'}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="card-ocean p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Upload Demo Video</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Position</label>
                <select
                  value={uploadForm.position}
                  onChange={(e) => setUploadForm({ ...uploadForm, position: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                >
                  <option value={1}>Position 1 (Left - Professional Custom Video)</option>
                  <option value={2}>Position 2 (Right - AI-Powered Creation)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Title</label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder={uploadForm.position === 1 ? "Professional Custom Video" : "AI-Powered Creation"}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default title</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  rows="3"
                  placeholder={uploadForm.position === 1 
                    ? "Example of our custom video production with professional actors and crew"
                    : "Example of our cutting-edge AI-generated video content with digital effects"}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default description</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  placeholder="Drama, Professional, HD Quality"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default tags</p>
              </div>

              {/* Upload Method Toggle */}
              <div>
                <label className="block text-sm font-semibold mb-2">Upload Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="file"
                      checked={uploadForm.uploadMethod === 'file'}
                      onChange={(e) => setUploadForm({ ...uploadForm, uploadMethod: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span>Upload File</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="url"
                      checked={uploadForm.uploadMethod === 'url'}
                      onChange={(e) => setUploadForm({ ...uploadForm, uploadMethod: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span>Video URL</span>
                  </label>
                </div>
              </div>

              {/* Conditional: File Upload */}
              {uploadForm.uploadMethod === 'file' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Video File (Max 100MB)</label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
                    onChange={handleFileSelect}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required={uploadForm.uploadMethod === 'file'}
                  />
                  {uploadForm.videoFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {uploadForm.videoFile.name} ({(uploadForm.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              )}

              {/* Conditional: URL Input */}
              {uploadForm.uploadMethod === 'url' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">Video URL</label>
                  <input
                    type="url"
                    value={uploadForm.videoUrl}
                    onChange={(e) => setUploadForm({ ...uploadForm, videoUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="https://disk.yandex.ru/i/... or direct .mp4 link"
                    required={uploadForm.uploadMethod === 'url'}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Supported: Яндекс.Диск, Google Drive, Direct MP4/WebM links
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="btn-ocean w-full"
              >
                {uploading ? 'Adding Video...' : 'Add Video'}
              </button>
            </form>
          </div>
        )}

        {/* Videos List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Current Videos</h2>
          
          {videos.length === 0 ? (
            <div className="card-ocean p-8 text-center">
              <FaVideo className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500">No videos uploaded yet. Upload your first demo video!</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="card-ocean p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Video Preview */}
                  <div>
                    {renderVideoPreview(video)}
                    <p className="text-xs text-gray-500 mt-2">
                      Position: {video.position} | Type: {video.video_type === 'url' ? '🔗 URL' : '📁 File'} | Status: {video.is_active ? '✓ Active' : '✗ Inactive'}
                    </p>
                  </div>

                  {/* Video Details */}
                  <div className="lg:col-span-2">
                    {editingId === video.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          rows="2"
                        />
                        <input
                          type="text"
                          value={editData.tags}
                          onChange={(e) => setEditData({ ...editData, tags: e.target.value })}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          placeholder="Tags (comma-separated)"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editData.is_active}
                            onChange={(e) => setEditData({ ...editData, is_active: e.target.checked })}
                          />
                          <span className="text-sm">Active</span>
                        </label>
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(video.id)} className="btn-ocean text-sm">
                            <FaSave className="inline mr-1" /> Save
                          </button>
                          <button onClick={cancelEdit} className="btn-ocean-outline text-sm">
                            <FaTimes className="inline mr-1" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                        <p className="text-gray-600 mb-3">{video.description}</p>
                        {video.tags.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {video.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs bg-sky-100 text-sky-600 px-3 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => startEdit(video)} className="btn-ocean text-sm">
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button onClick={() => handleDelete(video.id)} className="btn-ocean-outline text-sm text-red-600 border-red-600 hover:bg-red-50">
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDemoVideos;
