import { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { getTodos } from '../api/todos';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleTodoCreated = (newTodo) => {
    setTodos((prev) => [newTodo, ...prev]);
  };

  const handleTodoUpdated = (updatedTodo) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
  };

  const handleTodoDeleted = (deletedId) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== deletedId));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Todos</h1>
      
      <TodoForm onTodoCreated={handleTodoCreated} />
      
      {isLoading && !error && <div className="text-center py-8">Loading todos...</div>}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {!isLoading && todos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No todos found. Add your first todo above!
        </div>
      )}
      
      <div>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onUpdate={handleTodoUpdated}
            onDelete={handleTodoDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default Todos;