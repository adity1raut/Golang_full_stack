import { useState } from 'react';
import { updateTodo, deleteTodo } from '../api/todos';

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(todo.task);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleToggleStatus = async () => {
    try {
      setIsUpdating(true);
      const updatedTodo = await updateTodo(todo.id, { status: !todo.status });
      onUpdate(updatedTodo);
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
    <div className="bg-white p-4 rounded-lg shadow mb-3">
      <div className="flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={editedTask}
            onChange={(e) => setEditedTask(e.target.value)}
            className="flex-1 px-3 py-1 border rounded mr-2"
            autoFocus
          />
        ) : (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.status}
              onChange={handleToggleStatus}
              disabled={isUpdating}
              className="h-5 w-5 text-primary-600 rounded mr-3"
            />
            <span
              className={`flex-1 ${todo.status ? 'line-through text-gray-400' : 'text-gray-700'}`}
            >
              {todo.task}
            </span>
          </div>
        )}

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdating || !editedTask.trim()}
                className="px-2 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
              >
                {isUpdating ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTask(todo.task);
                }}
                className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-2 py-1 bg-red-500 text-white rounded text-sm disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TodoItem;