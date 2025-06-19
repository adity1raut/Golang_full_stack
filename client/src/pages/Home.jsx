import { CheckCircle, Clock, List, PlusCircle } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <PlusCircle className="h-8 w-8 text-primary-500" />,
      title: "Easy Task Creation",
      description: "Quickly add new tasks with just a few clicks"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Task Management",
      description: "Mark tasks as complete and track your progress"
    },
    {
      icon: <List className="h-8 w-8 text-blue-500" />,
      title: "Organized Lists",
      description: "Keep all your tasks neatly organized in one place"
    },
    {
      icon: <Clock className="h-8 w-8 text-yellow-500" />,
      title: "Time Tracking",
      description: "Monitor how long tasks take to complete"
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
          Welcome to <span className="text-primary-600">Todo App</span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          A simple yet powerful application to manage your daily tasks and boost your productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;