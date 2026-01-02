import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 font-outfit">Terms & Conditions</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing and using ACCIO, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. Use License</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Permission is granted to use ACCIO for personal, non-commercial purposes to report and recover lost items within your college campus.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. User Responsibilities</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Users agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Provide accurate information when reporting items</li>
              <li>Not post fake or misleading information</li>
              <li>Respect other users' privacy</li>
              <li>Use the platform responsibly and legally</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. Content Guidelines</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Users must not post inappropriate, offensive, or illegal content. The platform reserves the right to remove any content that violates these guidelines.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ACCIO is a platform to facilitate communication between users. We are not responsible for the actual recovery or return of items.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
