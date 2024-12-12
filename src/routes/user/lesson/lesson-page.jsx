import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Volume2, Check, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { Skeleton } from '@/components/ui/skeleton';

const LessonPage = () => {
  const axiosSecure = useAxiosSecure();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Audio refs
  const correctSoundRef = useRef(new Audio('/audio/correct-sound-effect.mp3'));
  const lessonCompleteSoundRef = useRef(new Audio('/audio/lesson-complete-sound-effect.mp3'));

  // Fetch vocabularies for the specific lesson
  const { 
    data, 
    isLoading, 
    isError,
  } = useQuery({
    queryKey: ['lessonVocabularies', id, currentPage],
    queryFn: async () => {
      const response = await axiosSecure.get(`/api/vocabularies/lesson/${id}`, {
        params: { page: currentPage, limit: 1 }
      });
      return response.data;
    },
    keepPreviousData: true
  });

  // Navigation handlers
  const handleNext = () => {
    correctSoundRef.current.play();
    
    if (data && currentPage < data.totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      setIsLessonCompleted(true);
      lessonCompleteSoundRef.current.play();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  // Lesson completion handler
  const handleLessonCompletion = () => {
    setCountdown(0); // This will trigger the redirection immediately
  };

  useEffect(() => {
    if (isLessonCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (isLessonCompleted && countdown === 0) {
      window.location.href = '/lessons';
    }
  }, [isLessonCompleted, countdown]);

  // Text-to-speech function
  const speakWord = (word) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'ja-JP'
    window.speechSynthesis.speak(utterance);
  };

  // Loading state
  if (isLoading) return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500">
          <Skeleton className="h-8 w-3/4 bg-white/20" />
        </CardHeader>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-full mb-6" />
          <div className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="flex justify-between mt-8">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  // Error state
  if (isError) return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={24} />
            <span>Error</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-xl mb-4">An error occurred while loading the lesson vocabulary.</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
  
  // No vocabularies found state
  if (!data || !data.vocabularies || data.vocabularies.length === 0) return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-yellow-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle size={24} />
            <span>No Vocabularies Found</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-xl mb-4">There are no vocabularies available for this lesson.</p>
          <Button onClick={() => window.location.href = '/lessons'} variant="outline">
            Return to Lessons
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  // Get current vocabulary
  const currentVocabulary = data.vocabularies[0];
  const progress = (currentPage / data.totalPages) * 100;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <AnimatePresence mode="wait">
        {isLessonCompleted ? (
          <motion.div
            key="completion"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Confetti 
              width={window.innerWidth} 
              height={window.innerHeight} 
              recycle={false}
              numberOfPieces={500}
            />
            <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <CardHeader>
                <CardTitle className="text-4xl font-bold mb-4">Congratulations! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.p 
                  className="text-2xl mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                >
                  You&apos;ve mastered {data.lesson.name}!
                </motion.p>
                <motion.p
                  className="text-xl mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Returning to lessons in {countdown} seconds...
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
                >
                  <Button 
                    onClick={handleLessonCompletion}
                    className="mt-4 bg-white text-purple-500 hover:bg-gray-100 hover:text-purple-600 transition-all duration-300"
                    size="lg"
                  >
                    Return to Lessons Now
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="lesson"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-2xl font-bold">
                    {data.lesson.name} 
                    <span className="text-sm ml-2">
                      (Lesson {data.lesson.lessonNumber})
                    </span>
                  </span>
                  <span className="text-lg">
                    {currentPage} / {data.totalPages}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <Progress value={progress} className="mb-6" />
                <motion.div 
                  key={currentPage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div 
                    className="text-5xl font-bold flex items-center justify-center gap-4 cursor-pointer bg-gray-100 dark:bg-zinc-900 p-6 rounded-lg hover:bg-gray-200 transition-all duration-300"
                    onClick={() => speakWord(currentVocabulary.word)}
                  >
                    {currentVocabulary.word}
                    <Volume2 
                      className="text-blue-500 hover:text-blue-700" 
                      size={36} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg">
                      <label className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Pronunciation</label>
                      <p className="text-lg">{currentVocabulary.pronunciation}</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg">
                      <label className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Meaning</label>
                      <p className="text-lg">{currentVocabulary.meaning}</p>
                    </div>
                  </div>

                  <div className="bg-gray-100 dark:bg-zinc-900 p-4 rounded-lg">
                    <label className="text-sm text-gray-600 dark:text-gray-400 font-semibold">When to Say</label>
                    <p className="text-lg">{currentVocabulary.whenToSay}</p>
                  </div>
                </motion.div>

                <div className="flex justify-between mt-8">
                  <Button 
                    variant="outline" 
                    onClick={handlePrevious} 
                    disabled={currentPage === 1}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    {currentPage === data.totalPages ? 'Complete Lesson' : 'Next'}
                    {currentPage === data.totalPages ? <Check size={20} /> : <ChevronRight size={20} />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonPage;

