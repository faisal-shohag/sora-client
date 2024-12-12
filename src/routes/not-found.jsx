import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  Home, 
  RefreshCw 
} from 'lucide-react';

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="text-center p-8 max-w-md w-full">
        <div className="relative">
       
          <div className="absolute inset-0 bg-blue-100 dark:bg-zinc-900 opacity-20 dark:opacity-10 rounded-2xl animate-pulse"></div>
          
     
          <div className="relative z-10 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-100 dark:border-gray-700">
         
            <div className="flex justify-center mb-6">
              <AlertTriangle 
                size={80} 
                className="text-red-500 dark:text-red-400 animate-bounce" 
              />
            </div>

    
            <h1 className="text-6xl font-bold mb-4 text-gray-800 dark:text-gray-100 
                           bg-gradient-to-r from-blue-600 to-purple-600 
                           bg-clip-text text-transparent">
              404
            </h1>

            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
              Page Not Found
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Oops! The page you&apos;re looking for seems to have wandered off into the digital wilderness.
            </p>

 
            <div className="flex justify-center space-x-4">
              <Link 
                to="/lessons" 
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg 
                           hover:bg-blue-600 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Home size={20} className="mr-2" /> Lessons
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg 
                           hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 
                           dark:hover:bg-gray-600"
              >
                <RefreshCw size={20} className="mr-2" /> Reload
              </button>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-200 dark:bg-blue-800 opacity-20 rounded-full animate-float"></div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-200 dark:bg-purple-800 opacity-20 rounded-full animate-float-delay"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

