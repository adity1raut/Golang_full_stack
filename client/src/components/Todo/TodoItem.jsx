import { useState } from 'react';
import { updateTodo } from '../../services/api';

const TodoItem = ({ todo, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [task, setTask] = useState(todo.task);
  const [status, setStatus] = useState(todo.status);

  const handleUpdate = async () => {
    try {
      await updateTodo(todo.id, { task, status });
      setIsEditing(false);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <li className="py-4 px-6 bg-white shadow rounded-lg mb-3 hover:shadow-md transition-shadow">
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div className="flex items-center">
            <input
              id={`completed-${todo.id}`}
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor={`completed-${todo.id}`} className="ml-2 block text-sm text-gray-700">
              Completed
            </label>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleUpdate}
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <span className={`${status ? 'line-through text-gray-400' : 'text-gray-800'} flex-grow`}>
            {todo.task}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default TodoItem;