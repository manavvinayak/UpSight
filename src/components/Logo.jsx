import { Link } from 'react-router-dom';

const Logo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <Link to="/" className={`flex items-center ${className}`}>
      {/* Text */}
      <span className={`${sizeClasses[size]} font-bold text-slate-900 tracking-tight`}>
        Up<span className="text-blue-600">Sight</span>
      </span>
    </Link>
  );
};

export default Logo;
