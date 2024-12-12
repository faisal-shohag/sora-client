import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Layers, Star, AlertTriangle, Frown, RefreshCw } from 'lucide-react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Link } from 'react-router-dom';

const GRADIENT_BACKGROUNDS = [
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-green-500 to-green-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
];


const LessonSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card 
          key={index} 
          className="animate-pulse bg-gray-100 dark:bg-zinc-900"
        >
          <CardHeader>
            <div className="h-6 bg-gray-300 dark:bg-zinc-800 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 dark:bg-zinc-800 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-5 bg-gray-300 dark:bg-zinc-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-zinc-800 rounded w-1/2"></div>
              <div className="h-10 bg-gray-300 dark:bg-zinc-800 rounded w-full mt-4"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};


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
          We couldn't load the lessons at the moment. 
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
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
            <Frown size={20} className="mr-2" /> Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const Lesson = () => {
  const axiosSecure = useAxiosSecure();

  const fetchLessons = async () => {
    const { data } = await axiosSecure.get('/api/lessons-with-vocabulary');
    return data;
  };

  const { 
    data: lessons, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['lessons-with-vocabulary'],
    queryFn: fetchLessons,
    retry: 2
  });

  const getGradientBackground = (index) => {
    return GRADIENT_BACKGROUNDS[index % GRADIENT_BACKGROUNDS.length];
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Learning Lessons
        </h1>
        <LessonSkeleton />
      </div>
    );
  }

  if (error) {
    return <LessonErrorState error={error} onRetry={refetch} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Learning Lessons
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <Link key={lesson._id || lesson.lessonNumber} to={`/lessons/${lesson.lessonNumber}`}>
            <Card 
              className={`
                ${getGradientBackground(index)} 
                text-white 
                shadow-xl 
                hover:scale-105 
                transition-transform 
                duration-300 
                ease-in-out
              `}
            >
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-2xl font-semibold">
                    Lesson {lesson.lessonNumber}
                  </span>
                  <Book className="w-8 h-8 opacity-70" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">{lesson.name}</h3>
                  
                  <div className="flex items-center space-x-2 mt-2 text-white/80">
                    <Layers className="w-5 h-5" />
                    <span>
                      {lesson.vocabularyCount} Vocabulary Words
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white"
                    >
                      Start Lesson
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link> 
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <Star className="mx-auto mb-4 w-12 h-12 text-gray-400" />
          <p className="text-2xl">No lessons available yet</p>
        </div>
      )}
    </div>
  );
};

export default Lesson;