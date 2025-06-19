
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { Layout } from '../components/layout/Layout';
import { TodoList } from '../components/todo/TodoList';
import { TodoForm } from '../components/todo/TodoForm';
import { TodoStats } from '../components/todo/TodoStats';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Plus, Filter, Search } from 'lucide-react';
import { formatName } from '../utils/formatters';

export const Dashboard = () => {
  const { user } = useAuth();
  const { todos, loading, error, stats, addTodo, updateTodo, deleteTodo, toggleTodo, refetch } = useTodos();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleAddTodo = async (todoData) => {
    try {
      await addTodo(todoData);
      setShowAddModal(false);
      setSuccessMessage('Todo created successfully!');
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleEditTodo = async (todoData) => {
    try {
      await updateTodo(editingTodo.id, todoData);
      setEditingTodo(null);
      setSuccessMessage('Todo updated successfully!');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setSuccessMessage('Todo deleted successfully!');
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      await toggleTodo(id);
      setSuccessMessage('Todo status updated!');
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'completed' && todo.completed) ||
                         (filterStatus === 'pending' && !todo.completed);
    
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading && todos.length === 0) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {formatName(user?.firstName, user?.lastName)}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Here's what you need to get done today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Todo
              </Button>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <Alert type="success" message={successMessage} />
        )}

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} onRetry={refetch} />
        )}

        {/* Stats */}
        <TodoStats stats={stats} />

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white shadow rounded-lg">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <Plus className="h-12 w-12" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No todos found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'Get started by creating a new todo.'}
              </p>
              {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
                <div className="mt-6">
                  <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add your first todo
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              onEdit={setEditingTodo}
              onDelete={handleDeleteTodo}
              onToggle={handleToggleTodo}
              loading={loading}
            />
          )}
        </div>

        {/* Add Todo Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Todo"
        >
          <TodoForm
            onSubmit={handleAddTodo}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>

        {/* Edit Todo Modal */}
        <Modal
          isOpen={!!editingTodo}
          onClose={() => setEditingTodo(null)}
          title="Edit Todo"
        >
          {editingTodo && (
            <TodoForm
              initialData={editingTodo}
              onSubmit={handleEditTodo}
              onCancel={() => setEditingTodo(null)}
              isEditing={true}
            />
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Dashboard;