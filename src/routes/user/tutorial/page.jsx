import  { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card,  
} from "@/components/ui/card";
import { 
   
  PlayCircle 
} from 'lucide-react';
import useAxiosSecure from "@/hooks/useAxiosSecure";

const TutorialPage = () => {
  const axiosSecure = useAxiosSecure();
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  // Function to extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return videoId 
      ? `https://www.youtube.com/embed/${videoId}?rel=0` 
      : null;
  };

  // Fetch Tutorials
  const fetchTutorials = async () => {
    const { data } = await axiosSecure.get('/api/tutorials');
    return data;
  };
  const { 
    data: tutorials = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['tutorials'],
    queryFn: fetchTutorials,
    onSuccess: (data) => {
        if (data && data.length > 0) {
          setSelectedTutorial(data[0]);
        }
      }
    
  });

  useEffect(() => {
    if (tutorials.length > 0) {
      setSelectedTutorial(tutorials[0]);
    }
  }, [tutorials])


  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center text-red-500 p-8">
      Error loading tutorials. Please try again later.
    </div>
  );



  return (
    <div className="container mx-auto px-4 py-6">
      <div className="w-full bg-gradient-to-r from-slate-700 to-slate-500 rounded-lg mb-6 py-6">
        {selectedTutorial && (
          <div className="aspect-video max-w-2xl mx-auto">
            <iframe
              width="100%"
              height="100%"
              src={getYouTubeEmbedUrl(selectedTutorial.link)}
              title={selectedTutorial.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        )}
        
        
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {tutorials.map((tutorial) => (
          <Card 
            key={tutorial._id}
            className={`
              cursor-pointer hover:shadow-xl transition-all duration-300
              ${selectedTutorial?._id === tutorial._id 
                ? 'ring-2 ring-blue-500 border-blue-500' 
                : 'hover:border-gray-300'}
            `}
            onClick={() => setSelectedTutorial(tutorial)}
          >
            <div className="relative">
              <img 
                src={`https://img.youtube.com/vi/${tutorial.link.split('v=')[1]?.split('&')[0]}/mqdefault.jpg`} 
                alt={tutorial.title}
                className="w-full h-36 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircle className="text-white/80 hover:text-white" size={36} />
              </div>
            </div>
            <div className="p-2">
              <h3 className="font-semibold text-xs line-clamp-2">{tutorial.title}</h3>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TutorialPage;