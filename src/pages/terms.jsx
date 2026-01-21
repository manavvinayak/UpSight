import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const Terms = () => {
  const { user, signout } = useAuth();
  const navigate = useNavigate();

  const handleSignout = () => {
    signout();
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Logo className="hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate('/')} />
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-600">{user.email}</span>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate('/history')}
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  History
                </button>
                <button
                  onClick={handleSignout}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  className="px-4 py-2 text-sm font-medium text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-blue-600 mb-3">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: January 21, 2026</p>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              By accessing and using UpSight, you accept and agree to be bound by the terms and provision 
              of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Use License</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              Permission is granted to use UpSight for document scanning purposes subject to the following restrictions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>You must not modify or copy the materials without permission</li>
              <li>You must not use the materials for commercial purposes without authorization</li>
              <li>You must not attempt to reverse engineer any software contained in UpSight</li>
              <li>You must not remove any copyright or proprietary notations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">User Accounts</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              When you create an account with us, you must provide accurate and complete information. 
              You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Maintaining the security of your account and password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your use complies with applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Document Processing</h2>
            <p className="text-slate-700 leading-relaxed">
              UpSight processes documents locally in your browser. You retain all rights to your documents 
              and processed images. We do not claim ownership of any content you upload. However, you are 
              responsible for ensuring you have the necessary rights to process any documents you upload.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Prohibited Uses</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              You may not use UpSight to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Process illegal, harmful, or offensive content</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Transmit malware, viruses, or harmful code</li>
              <li>Attempt to gain unauthorized access to systems or networks</li>
              <li>Interfere with or disrupt the service or servers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Service Availability</h2>
            <p className="text-slate-700 leading-relaxed">
              We strive to provide reliable service, but we do not guarantee that UpSight will be 
              available at all times without interruption. We may modify, suspend, or discontinue 
              the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed">
              UpSight is provided "as is" without warranties of any kind, either express or implied. 
              We do not warrant that the service will meet your requirements or that the results obtained 
              from document processing will be accurate or reliable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed">
              In no event shall UpSight or its suppliers be liable for any damages arising out of the 
              use or inability to use the service, even if we have been notified of the possibility of 
              such damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any 
              material changes. Your continued use of the service after changes constitutes acceptance 
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Information</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us through our{' '}
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">GitHub repository</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
