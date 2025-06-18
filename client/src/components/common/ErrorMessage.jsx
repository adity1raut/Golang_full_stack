
import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Button from '../ui/Button'

const ErrorMessage = ({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  showRetry = false,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="w-16 h-16 mx-auto mb-4 text-red-500">
        <AlertCircle className="w-full h-full" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          className="inline-flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorMessage
