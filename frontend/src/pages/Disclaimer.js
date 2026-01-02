import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Disclaimer = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100">
          <h1 className="text-4xl font-bold text-slate-900 mb-8 font-outfit">Disclaimer</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg mb-8">
              <p className="font-semibold text-amber-900 mb-2">Important Notice</p>
              <p className="text-amber-800">
                ACCIO is a community platform designed to facilitate communication between users regarding lost and found items. The college/institution is not legally responsible for lost items or their recovery.
              </p>
            </div>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">1. Platform Purpose</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              ACCIO serves as a communication tool to help students and staff report and recover lost items. It does not guarantee the recovery of any item.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">2. No Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The college, institution, and ACCIO platform:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Are not responsible for the loss, theft, or damage of any items</li>
              <li>Do not guarantee the accuracy of information posted by users</li>
              <li>Cannot ensure the return or recovery of reported items</li>
              <li>Are not liable for any disputes between users</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">3. User Responsibility</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Users are responsible for:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Verifying the identity of other users before meeting</li>
              <li>Taking appropriate safety precautions during item exchanges</li>
              <li>Reporting suspicious activity to campus security</li>
              <li>Understanding that interactions with other users are at their own risk</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">4. AI Features</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The AI-powered matching feature is provided as-is and may not always produce accurate results. Users should verify all matches independently.
            </p>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">5. Security Recommendations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              For your safety:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Meet in public, well-lit areas on campus</li>
              <li>Inform a friend or roommate before meeting someone</li>
              <li>Contact campus security for high-value items</li>
              <li>Report any suspicious behavior immediately</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-slate-900 mt-8 mb-4">6. Content Accuracy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              While we strive to maintain platform integrity, we cannot guarantee the accuracy, completeness, or reliability of user-generated content. Users should exercise due diligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
