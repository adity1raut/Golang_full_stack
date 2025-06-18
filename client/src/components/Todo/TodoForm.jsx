import { useState } from 'react';
import { createTodo } from '../../services/api';

const TodoForm = ({ onAdd }) => {
  const [task, setTask] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      const newTodo = await createTodo(task);
      onAdd(newTodo);
      setTask('');
      setError('');
    } catch (error) {
      setError('Failed to add todo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 appearance-none block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TodoForm;