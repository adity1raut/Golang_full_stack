import { useState } from 'react';
import { updateTodo, deleteTodo } from '../api/todos';
import { 
  Check, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Loader2,
  CheckCircle,
  Circle
} from 'lucide-react';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleToggleStatus = async () => {
    try {
      setIsUpdating(true);
      const updatedTodo = await updateTodo(todo.id, { status: !todo.status });
      onUpdate(updatedTodo);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editedTask.trim()) return;

    try {
      setIsUpdating(true);
      const updatedTodo = await updateTodo(todo.id, { task: editedTask });
      onUpdate(updatedTodo);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTodo(todo.id);
      onDelete(todo.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm mb-3 border border-gray-100 transition-all duration-200 hover:shadow-md ${
      showSuccess ? 'border-green-200 bg-green-50' : ''
    }`}>
      <div className="flex items-center justify-between gap-3">
        {isEditing ? (
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className="text-gray-300 hover:text-primary-500 transition-colors"
              aria-label={todo.status ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.status ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>
            <input
              type="text"
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className="flex-shrink-0"
              aria-label={todo.status ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin text-primary-500" />
              ) : todo.status ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300 hover:text-primary-500 transition-colors" />
              )}
            </button>
            <span
              className={`text-gray-700 break-words ${
                todo.status ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.task}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editedTask.trim()}
                className={`p-2 rounded-lg flex items-center gap-1 ${
                  isUpdating
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                } transition-colors`}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="text-xs">Save</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTask(todo.task);
                }}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span className="text-xs">Cancel</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center gap-1"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
                <span className="text-xs">Edit</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 rounded-lg flex items-center gap-1 ${
                  isDeleting
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                } transition-colors`}
                aria-label="Delete task"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span className="text-xs">Delete</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {showSuccess && (
        <div className="mt-2 px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4" />
          Task updated successfully!
        </div>
      )}
    </div>
  );
};

export default TodoItem;