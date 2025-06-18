import { useEffect, useState } from 'react';
import { getTodos, deleteTodo } from '../../services/api';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getTodos();
        setTodos(data);
      } catch (error) {
        setError('Failed to fetch todos');
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError('Failed to delete todo');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md mx-auto my-4">
      {error}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {todos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No todos found. Add one to get started!</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {todos.map(todo => (
            <TodoItem 
              key={todo.id} 
              todo={todo} 
              onDelete={handleDelete} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;