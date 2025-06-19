import { useState } from 'react';
import { createTodo } from '../api/todos';

const TodoForm = ({ onTodoCreated }) => {
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const newTodo = await createTodo(task);
      onTodoCreated(newTodo);
      setTask('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !task.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};

export default TodoForm;