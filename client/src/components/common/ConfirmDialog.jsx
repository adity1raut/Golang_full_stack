import React from 'react'
import { AlertTriangle } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    loading = false
}) => {
    const handleConfirm = async () => {
        await onConfirm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            showCloseButton={false}
            size="sm"
        >
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    {message}
                </p>

                <div className="flex gap-3 justify-center">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={handleConfirm}
                        loading={loading}
                        className="w-full sm:w-auto"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
export default ConfirmDialog