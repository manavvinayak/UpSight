const Logo = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Text */}
      <span className={`${sizeClasses[size]} font-bold text-slate-900 tracking-tight`}>
        Up<span className="text-blue-600">Sight</span>
      </span>
    </div>
  );
};

export default Logo;
