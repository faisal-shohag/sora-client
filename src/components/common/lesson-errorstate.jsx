import { AlertTriangle, Frown, RefreshCw } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const LessonErrorState = ({ error, onRetry }) => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center text-center p-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <AlertTriangle
            size={80}
            className="text-red-500 dark:text-red-400 animate-bounce"
          />
        </div>

        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          Oops! Something Went Wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          We couldn&apos;t load the lessons at the moment.
          {error?.message && (
            <span className="block mt-2 text-sm italic">
              Error: {error.message}
            </span>
          )}
        </p>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={onRetry}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white"
          >
            <RefreshCw size={20} className="mr-2" /> Retry
          </Button>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Frown size={20} className="mr-2" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

LessonErrorState.propTypes = {
  error: PropTypes.object.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default LessonErrorState;
