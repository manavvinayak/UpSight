import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Footer from '../components/Footer';

const Privacy = () => {
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
        <h1 className="text-4xl font-bold text-blue-600 mb-3">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: January 21, 2026</p>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              Welcome to UpSight. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we handle your information when you use our document scanning service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data We Collect</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              When you use UpSight, we may collect the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Account information (email address, password)</li>
              <li>Uploaded documents and processed images</li>
              <li>Usage data and analytics</li>
              <li>Browser and device information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">How We Use Your Data</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              We use the collected data to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Provide and improve our document scanning services</li>
              <li>Store and manage your uploaded documents</li>
              <li>Authenticate and secure your account</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Communicate important updates about the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Local Storage</h2>
            <p className="text-slate-700 leading-relaxed">
              UpSight processes documents locally in your browser. Your documents are stored in your browser's 
              local storage and are not transmitted to external servers unless explicitly stated. This ensures 
              your data remains private and secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have any questions about this privacy policy or our data practices, please contact us 
              through our <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium">GitHub repository</a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
