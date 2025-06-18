const LoadingSpinner = ({ size = 'medium', color = 'blue', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    blue: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
};

// Alternative dot spinner
export const DotSpinner = ({ size = 'medium', color = 'blue', className = '' }) => {
  const sizeClasses = {
    small: 'h-1 w-1',
    medium: 'h-2 w-2',
    large: 'h-3 w-3'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '0ms' }}
      ></div>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '150ms' }}
      ></div>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-bounce`}
        style={{ animationDelay: '300ms' }}
      ></div>
    </div>
  );
};

// Pulse spinner
export const PulseSpinner = ({ size = 'medium', color = 'blue', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'bg-blue-600',
    white: 'bg-white',
    gray: 'bg-gray-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse`}
      ></div>
    </div>
  );
};

// Loading with text
export const LoadingWithText = ({ 
  text = 'Loading...', 
  size = 'medium', 
  color = 'blue',
  className = '' 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <LoadingSpinner size={size} color={color} />
      <p className="text-sm text-gray-600 animate-pulse">{text}</p>
    </div>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ 
  text = 'Loading...', 
  size = 'large', 
  color = 'blue' 
}) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingWithText text={text} size={size} color={color} />
    </div>
  );
};

export default LoadingSpinner;