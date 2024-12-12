import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Layers, Star } from 'lucide-react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Link } from 'react-router-dom';

// Gradient background classes
const GRADIENT_BACKGROUNDS = [
  'bg-gradient-to-br from-blue-500 to-blue-700',
  'bg-gradient-to-br from-purple-500 to-purple-700',
  'bg-gradient-to-br from-green-500 to-green-700',
  'bg-gradient-to-br from-pink-500 to-pink-700',
  'bg-gradient-to-br from-indigo-500 to-indigo-700',
  'bg-gradient-to-br from-teal-500 to-teal-700',
];

const Lesson = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch Lessons with Vocabulary Count
  const fetchLessons = async () => {
    const { data } = await axiosSecure.get('/api/lessons-with-vocabulary');
    return data;
  };

  // Use Tanstack Query to fetch lessons
  const { 
    data: lessons, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['lessons-with-vocabulary'],
    queryFn: fetchLessons
  });

  // Function to get a gradient background
  const getGradientBackground = (index) => {
    return GRADIENT_BACKGROUNDS[index % GRADIENT_BACKGROUNDS.length];
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-2xl">Loading Lessons...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error loading lessons: {error.message}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Learning Lessons
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
         <Link  key={lesson._id || lesson.lessonNumber}  to={`/lessons/${lesson.lessonNumber}`}><Card 
           
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