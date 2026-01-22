import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
           <div>
            <Logo className="mb-3" />
            <p className="text-slate-600 text-sm leading-relaxed">
              Smart document scanning in your browser.
            </p>
          </div>

           <div className="flex items-center justify-center">
            <p className="text-slate-600 text-sm text-center leading-relaxed max-w-xs">
              Built with open-source computer vision and web technologies.
            </p>
          </div>

          {/* Right - Links */}
          <div className="flex items-center justify-start md:justify-end">
            <div className="flex gap-1 text-sm">
              <a
                href="https://github.com/manavvinayak/UpSight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors px-2"
              >
                GitHub
              </a>
              <span className="text-slate-300">·</span>
              <Link
                to="/privacy"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors px-2"
              >
                Privacy
              </Link>
              <span className="text-slate-300">·</span>
              <Link
                to="/terms"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors px-2"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

         <div className="pt-8 border-t border-slate-200">
          <p className="text-center text-slate-500 text-sm">
            © 2026 UpSight. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
