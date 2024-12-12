import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAxiosSecure from '@/hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';


const initialFormState = {
  word: '',
  pronunciation: '',
  meaning: '',
  whenToSay: '',
  lessonNo: '',
};

const AddVocabularies = () => {
  const [formData, setFormData] = useState(initialFormState);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();


  const { data: lessons = [], isLoading: isLoadingLessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: async () => {
      const response = await axiosSecure.get('/admin/lessons');
      return response.data;
    }
  });

 
  const addVocabularyMutation = useMutation({
    mutationFn: async (vocabularyData) => {
      const response = await axiosSecure.post('/admin/vocabularies', vocabularyData);
      return response.data;
    },
    onSuccess: (newVocabulary) => {
      queryClient.invalidateQueries(['vocabularies']);
      setFormData(initialFormState);
      toast.success(`Vocabulary - (${newVocabulary.word}) Added Successfully`);
    },
    onError: (error) => {
      console.log(error);
      toast.error('Failed to Add Vocabulary');
    }
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleLessonSelect = (value) => {
    setFormData(prev => ({
      ...prev,
      lessonNo: Number(value)
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.word || !formData.pronunciation || !formData.meaning || !formData.whenToSay || !formData.lessonNo) {
      toast.error('Please fill in all fields');
      return;
    }
    if (!user || !user.email) {
      toast.error('You must be logged in to add vocabularies');
      return;
    }
    const submissionData = {
      ...formData,
      adminEmail: user.email
    }
    
    addVocabularyMutation.mutate(submissionData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Vocabulary</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="word">Word</Label>
            <Input
              id="word"
              name="word"
              value={formData.word}
              onChange={handleChange}
              placeholder="Enter the word"
              required
            />
          </div>

          <div>
            <Label htmlFor="pronunciation">Pronunciation</Label>
            <Input
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              placeholder="Enter pronunciation"
              required
            />
          </div>

          <div>
            <Label htmlFor="meaning">Meaning</Label>
            <Textarea
              id="meaning"
              name="meaning"
              value={formData.meaning}
              onChange={handleChange}
              placeholder="Enter the meaning of the word"
              required
            />
          </div>

          <div>
            <Label htmlFor="whenToSay">When to Say</Label>
            <Textarea
              id="whenToSay"
              name="whenToSay"
              value={formData.whenToSay}
              onChange={handleChange}
              placeholder="Describe when to use this word"
              required
            />
          </div>

          <div>
            <Label htmlFor="lessonNo">Lesson Number</Label>
            <Select 
              onValueChange={handleLessonSelect}
              value={formData.lessonNo.toString()}
              disabled={isLoadingLessons}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Lesson" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingLessons ? (
                  <SelectItem value="loading" disabled>
                    Loading lessons...
                  </SelectItem>
                ) : (
                  lessons.map((lesson) => (
                    <SelectItem 
                      key={lesson.lessonNumber} 
                      value={lesson.lessonNumber.toString()}
                    >
                      Lesson {lesson.lessonNumber} - {lesson.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            disabled={addVocabularyMutation.isPending || isLoadingLessons}
            className="w-full"
          >
            {addVocabularyMutation.isPending 
              ? 'Adding...' 
              : isLoadingLessons 
                ? 'Loading...' 
                : 'Add Vocabulary'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddVocabularies;