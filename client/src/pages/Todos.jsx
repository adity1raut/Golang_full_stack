import { useEffect, useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoItem from '../components/TodoItem';
import { getTodos } from '../api/todos';
import { Loader2, Plus, List, Filter, ChevronDown, CheckCircle } from 'lucide-react';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.status;
    if (filter === 'active') return !todo.status;
    return true;
  });

  const completedCount = todos.filter(todo => todo.status).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <List className="h-8 w-8 text-primary-500" />
          My Todos
        </h1>
        
        <div className="relative">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="capitalize">{filter}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilters && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <button
                onClick={() => {
                  setFilter('all');
                  setShowFilters(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filter === 'all' ? 'text-primary-600' : ''}`}
              >
                All
              </button>
              <button
                onClick={() => {
                  setFilter('active');
                  setShowFilters(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filter === 'active' ? 'text-primary-600' : ''}`}
              >
                Active
              </button>
              <button
                onClick={() => {
                  setFilter('completed');
                  setShowFilters(false);
                }}
                className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${filter === 'completed' ? 'text-primary-600' : ''}`}
              >
                Completed
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-6 bg-gradient-to-r from-primary-50 to-blue-50 p-4 rounded-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-gray-600">
              <span className="text-primary-600 font-bold">{todos.length}</span> total
            </div>
            <div className="text-sm font-medium text-gray-600">
              <span className="text-green-600 font-bold">{completedCount}</span> completed
            </div>
            <div className="text-sm font-medium text-gray-600">
              <span className="text-yellow-600 font-bold">{activeCount}</span> active
            </div>
          </div>
          {completedCount === todos.length && todos.length > 0 && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">All done!</span>
            </div>
          )}
        </div>
      </div>
      
      <TodoForm onTodoCreated={handleTodoCreated} />
      
      {isLoading && !error && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}
      
      {!isLoading && filteredTodos.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <List className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-1">
            {filter === 'all' 
              ? 'No todos yet' 
              : filter === 'completed' 
                ? 'No completed todos' 
                : 'No active todos'}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Add your first todo above!' 
              : filter === 'completed' 
                ? 'Complete some todos to see them here' 
                : 'All your todos are completed!'}
          </p>
        </div>
      )}
      
      <div className="space-y-3">
        {filteredTodos.map((todo) => (
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