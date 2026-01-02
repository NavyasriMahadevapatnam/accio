import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 font-outfit">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Email address and password for account creation</li>
              <li>Item details (name, location, description, photos)</li>
              <li>Messages sent through the platform</li>
              <li>Usage data and analytics</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process your requests and send notifications</li>
              <li>Facilitate matching of lost and found items</li>
              <li>Monitor and analyze usage patterns</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell your personal information. We share information only in these cases:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>With other users for item recovery purposes</li>
              <li>With college authorities if required by policy</li>
              <li>When required by law or legal process</li>
              <li>To protect the safety and security of our users</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact your college administration or the ACCIO platform administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
