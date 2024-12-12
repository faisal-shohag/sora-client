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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure';

const VocabularyManagement = () => {
  const queryClient = useQueryClient();
  const [editingVocabulary, setEditingVocabulary] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lessonFilter, setLessonFilter] = useState(null);
  const axiosSecure = useAxiosSecure();

  const fetchLessons = async () => {
    const { data } = await axiosSecure.get('/admin/lessons');
    return data;
  };

  const fetchVocabularies = async () => {
    const url = lessonFilter 
      ? `/admin/vocabularies?lessonNo=${lessonFilter}` 
      : '/admin/vocabularies';
    const { data } = await axiosSecure.get(url);
    return data;
  };

  const saveVocabularyMutation = async (vocabulary) => {
    if (vocabulary._id) {
      const { data } = await axiosSecure.put(`/admin/vocabularies/${vocabulary._id}`, vocabulary);
      return data;
    } else {
      const { data } = await axiosSecure.post('/admin/vocabularies', vocabulary);
      return data;
    }
  };

  const deleteVocabularyMutation = async (vocabularyId) => {
    const { data } = await axiosSecure.delete(`/admin/vocabularies/${vocabularyId}`);
    return data;
  };
  const { data: lessons } = useQuery({
    queryKey: ['lessons'],
    queryFn: fetchLessons
  });
  const { data: vocabularies, isLoading, error } = useQuery({
    queryKey: ['vocabularies', lessonFilter],
    queryFn: fetchVocabularies
  });

  const saveMutation = useMutation({
    mutationFn: saveVocabularyMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['vocabularies']);
      setIsDialogOpen(false);
      setEditingVocabulary(null);
      toast.success('Vocabulary saved!');
    },
    onError: (error) => {
      console.log(error); 
      toast.error('Error saving vocabulary.');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVocabularyMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['vocabularies']);
      toast.success('Vocabulary Deleted.');
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting the vocabulary!");
    }
  });

  const handleSaveVocabulary = (e) => {
    e.preventDefault();
    saveMutation.mutate(editingVocabulary);
  };

  const handleResetFilter = () => {
    setLessonFilter(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching vocabularies</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Vocabulary Management</h1>
        <div className="flex items-center space-x-2">
          <Select 
            value={lessonFilter?.toString() || ''} 
            onValueChange={(value) => setLessonFilter(value ? parseInt(value) : null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Lesson" />
            </SelectTrigger>
            <SelectContent>
              {lessons?.map((lesson) => (
                <SelectItem 
                  key={lesson.lessonNumber} 
                  value={lesson.lessonNumber.toString()}
                >
                  Lesson {lesson.lessonNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {lessonFilter && (
            <Button variant="outline" onClick={handleResetFilter}>
              Clear Filter
            </Button>
          )}
          <Button onClick={() => {
            setEditingVocabulary({ 
              word: '', 
              meaning: '', 
              pronunciation: '', 
              whenToSay: '', 
              lessonNo: '' 
            });
            setIsDialogOpen(true);
          }}>
            Add New Vocabulary
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Word</TableHead>
            <TableHead>Meaning</TableHead>
            <TableHead>Pronunciation</TableHead>
            <TableHead>When to Say</TableHead>
            <TableHead>Lesson No</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vocabularies.map((vocab) => (
            <TableRow key={vocab._id}>
              <TableCell>{vocab.word}</TableCell>
              <TableCell>{vocab.meaning}</TableCell>
              <TableCell>{vocab.pronunciation}</TableCell>
              <TableCell>{vocab.whenToSay}</TableCell>
              <TableCell>{vocab.lessonNo}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setEditingVocabulary(vocab);
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
                          This will permanently delete the vocabulary entry.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutation.mutate(vocab._id)}
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingVocabulary?._id ? 'Edit Vocabulary' : 'Add New Vocabulary'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveVocabulary} className="space-y-4">
            <div>
              <label>Word</label>
              <Input 
                value={editingVocabulary?.word || ''}
                onChange={(e) => setEditingVocabulary(prev => ({ 
                  ...prev, 
                  word: e.target.value 
                }))}
                required
              />
            </div>
            <div>
              <label>Meaning</label>
              <Input 
                value={editingVocabulary?.meaning || ''}
                onChange={(e) => setEditingVocabulary(prev => ({ 
                  ...prev, 
                  meaning: e.target.value 
                }))}
                required
              />
            </div>
            <div>
              <label>Pronunciation</label>
              <Input 
                value={editingVocabulary?.pronunciation || ''}
                onChange={(e) => setEditingVocabulary(prev => ({ 
                  ...prev, 
                  pronunciation: e.target.value 
                }))}
                required
              />
            </div>
            <div>
              <label>When to Say</label>
              <Input 
                value={editingVocabulary?.whenToSay || ''}
                onChange={(e) => setEditingVocabulary(prev => ({ 
                  ...prev, 
                  whenToSay: e.target.value 
                }))}
                required
              />
            </div>
            <div>
              <label>Lesson Number</label>
              <Select 
                value={editingVocabulary?.lessonNo?.toString() || ''}
                onValueChange={(value) => setEditingVocabulary(prev => ({ 
                  ...prev, 
                  lessonNo: parseInt(value) 
                }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Lesson Number" />
                </SelectTrigger>
                <SelectContent>
                  {lessons?.map((lesson) => (
                    <SelectItem 
                      key={lesson.lessonNumber} 
                      value={lesson.lessonNumber.toString()}
                    >
                      Lesson {lesson.lessonNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingVocabulary?._id ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VocabularyManagement;