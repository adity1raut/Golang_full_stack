import { useState } from 'react';
import { createTodo } from '../api/todos';
import { Plus, Loader2, Check, Sparkles } from 'lucide-react';

const TodoForm = ({ onTodoCreated }) => {
  const [task, setTask] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    setIsLoading(true);
    setError('');
    setIsSuccess(false);

    try {
      const newTodo = await createTodo(task);
      onTodoCreated(newTodo);
      setTask('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative flex gap-2 items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm transition-all duration-200"
            disabled={isLoading}
          />
          {task && (
            <button
              type="button"
              onClick={() => setTask('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !task.trim()}
          className={`flex items-center justify-center px-5 py-3 rounded-xl shadow-md transition-all duration-200 ${
            isSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-primary-600 hover:bg-primary-700'
          } ${
            (isLoading || !task.trim()) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              <span>Adding</span>
            </>
          ) : isSuccess ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              <span>Add Task</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 px-4 py-2 bg-red-100 text-red-600 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </p>
      )}

      {isSuccess && (
        <div className="mt-3 flex items-center text-green-600">
          <Sparkles className="h-4 w-4 mr-1" />
          <span className="text-sm">Task added successfully!</span>
        </div>
      )}
    </form>
  );
};

export default TodoForm;