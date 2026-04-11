import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const policyTitles = {
  terms: 'Terms of Service',
  digital_delivery: 'Digital Delivery Policy',
  refund: 'Refund & Cancellation Policy',
  revision: 'Revision Policy',
  privacy: 'Privacy Policy'
};

function Policies() {
  const { type } = useParams();
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type) {
      fetchPolicy();
    }
  }, [type]);

  const fetchPolicy = async () => {
    try {
      const response = await axios.get(`${API}/policies/${type}`);
      setPolicy(response.data);
    } catch (error) {
      console.error('Error fetching policy:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-sky-600">Loading...</div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy not found</h2>
          <Link to="/" className="btn-ocean">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="policies-page py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8 flex flex-wrap gap-2">
          {Object.entries(policyTitles).map(([key, title]) => (
            <Link
              key={key}
              to={`/policies/${key}`}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                type === key
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {title}
            </Link>
          ))}
        </div>

        {/* Policy Content */}
        <div className="card-ocean p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            {policy.title}
          </h1>
          <div className="text-sm text-gray-500 mb-8">
            Last updated: {new Date(policy.updated_at).toLocaleDateString()}
          </div>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>
              {policy.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-sky-50 to-teal-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions About Our Policies?
          </h3>
          <p className="text-gray-600 mb-6">
            We're here to help clarify anything about our services and terms.
          </p>
          <Link to="/contact" className="btn-ocean">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Policies;
