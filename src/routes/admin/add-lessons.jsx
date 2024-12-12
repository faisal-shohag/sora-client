import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure';


const initialFormState = {
  name: '',
  lessonNumber: '',
};

const AddLessons = () => {
  const [formData, setFormData] = useState(initialFormState);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure()

  const addLessonMutation = useMutation({
    mutationFn: async (lessonData) => {
      const response = await axiosSecure.post('/admin/lessons', lessonData);
      return response.data;
    },
    onSuccess: (newLesson) => {
 
      queryClient.invalidateQueries(['lessons']);

      setFormData(initialFormState);
      

      toast.success(`Lesson - ${newLesson.name} Added Successfully`);
    },
    onError: (error) => {
      console.log(error)
      toast.error('Failed to Add Lesson');
    }
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lessonNumber' ? Number(value) : value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.lessonNumber <= 0) {
      toast.error('Invalid Lesson Number', {
        description: 'Lesson number must be a positive number'
      });
      return;
    }

    addLessonMutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Lesson</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Lesson Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter lesson name"
              required
            />
          </div>

          <div>
            <Label htmlFor="lessonNumber">Lesson Number</Label>
            <Input
              id="lessonNumber"
              name="lessonNumber"
              type="number"
              value={formData.lessonNumber}
              onChange={handleChange}
              placeholder="Enter lesson number"
              min="1"
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={addLessonMutation.isPending}
          >
            {addLessonMutation.isPending ? 'Adding...' : 'Add Lesson'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddLessons;