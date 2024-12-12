import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure';

const TutorialManagement = () => {
  const queryClient = useQueryClient();
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const fetchTutorials = async () => {
    const { data } = await axiosSecure.get('/admin/tutorials');
    return data;
  };

  const saveTutorialMutation = async (tutorial) => {
    if (tutorial._id) {
      const { data } = await axiosSecure.put(`/admin/tutorials/${tutorial._id}`, tutorial);
      return data;
    } else {
      const { data } = await axiosSecure.post('/admin/tutorials', tutorial);
      return data;
    }
  };

  const deleteTutorialMutation = async (tutorialId) => {
    const { data } = await axiosSecure.delete(`/admin/tutorials/${tutorialId}`);
    return data;
  };

  const { data: tutorials, isLoading, error } = useQuery({
    queryKey: ['tutorials'],
    queryFn: fetchTutorials
  });

  const saveMutation = useMutation({
    mutationFn: saveTutorialMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['tutorials']);
      setIsDialogOpen(false);
      setEditingTutorial(null);
      toast.success('Tutorial saved!');
    },
    onError: (error) => {
      console.log(error); 
      toast.error('Error adding tutorial.');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTutorialMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['tutorials']);
      toast.success('Tutorial Deleted.');
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting the tutorial!");
    }
  });

  const handleSaveTutorial = (e) => {
    e.preventDefault();
    saveMutation.mutate(editingTutorial);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tutorials</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tutorials Management</h1>
        <Button onClick={() => {
          setEditingTutorial({ title: '', link: '' });
          setIsDialogOpen(true);
        }}>
          Add New Tutorial
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tutorials.map((tutorial) => (
            <TableRow key={tutorial._id}>
              <TableCell>{tutorial.title}</TableCell>
              <TableCell>
                <a 
                  href={tutorial.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 hover:underline"
                >
                  {tutorial.link}
                </a>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setEditingTutorial(tutorial);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the tutorial.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutation.mutate(tutorial._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <>
      {tutorials.length === 0 && <div className="text-center text-2xl font-semibold text-gray-500 mt-10">No tutorials found.</div>}
      </>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTutorial?._id ? 'Edit Tutorial' : 'Add New Tutorial'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveTutorial} className="space-y-4">
            <div>
              <label>Tutorial Title</label>
              <Input 
                value={editingTutorial?.title || ''}
                onChange={(e) => setEditingTutorial(prev => ({ 
                  ...prev, 
                  title: e.target.value 
                }))}
                required
              />
            </div>
            <div>
              <label>Tutorial Link</label>
              <Input 
                type="url"
                value={editingTutorial?.link || ''}
                onChange={(e) => setEditingTutorial(prev => ({ 
                  ...prev, 
                  link: e.target.value 
                }))}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTutorial?._id ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TutorialManagement;