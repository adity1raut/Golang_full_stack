
import React from 'react'
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react'

const Alert = ({ 
  type = 'info', 
  title, 
  message, 
  dismissible = false, 
  onDismiss,
  className = '' 
}) => {
  const types = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500'
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500'
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500'
    }
  }

  const config = types[type]
  const Icon = config.icon

  return (
    <div className={`rounded-md border p-4 ${config.bgColor} ${config.borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${config.iconColor}`} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          {message && (
            <div className={`${title ? 'mt-1' : ''} text-sm ${config.textColor}`}>
              {message}
            </div>
          )}
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 ${config.textColor} hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-offset-2`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alert