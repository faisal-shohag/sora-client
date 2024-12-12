import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const LessonManagement = () => {
  const queryClient = useQueryClient();
  const [editingLesson, setEditingLesson] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  const fetchLessons = async () => {
    const { data } = await axiosSecure.get("/admin/lessons-with-vocabulary");
    return data;
  };

  const saveLessonMutation = async (lesson) => {
    if (lesson._id) {
      const { data } = await axiosSecure.put(
        `/admin/lessons/${lesson._id}`,
        lesson
      );
      return data;
    } else {
      const { data } = await axiosSecure.post("/admin/lessons", lesson);
      return data;
    }
  };

  const deleteLessonMutation = async (lessonId) => {
    const { data } = await axiosSecure.delete(`/admin/lessons/${lessonId}`);
    return data;
  };
  const {
    data: lessons,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: fetchLessons,
  });

  const saveMutation = useMutation({
    mutationFn: saveLessonMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      setIsDialogOpen(false);
      setEditingLesson(null);
      toast.success("Lesson saved!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error adding lessons.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLessonMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      toast.success("Lesson Deleted.");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error deleting the lesson!");
    },
  });

  const handleSaveLesson = (e) => {
    e.preventDefault();
    saveMutation.mutate(editingLesson);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching lessons</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lessons Management</h1>
        <Button
          onClick={() => {
            setEditingLesson({ name: "", lessonNumber: "" });
            setIsDialogOpen(true);
          }}
        >
          Add New Lesson
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lesson Name</TableHead>
            <TableHead>Lesson Number</TableHead>
            <TableHead>Vocabulary Count</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lessons.map((lesson) => (
            <TableRow key={lesson._id}>
              <TableCell>{lesson.name}</TableCell>
              <TableCell>{lesson.lessonNumber}</TableCell>
              <TableCell>{lesson.vocabularyCount}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingLesson(lesson);
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
                          This will permanently delete the lesson and all
                          associated vocabulary.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteMutation.mutate(lesson._id)}
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
              {editingLesson?._id ? "Edit Lesson" : "Add New Lesson"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveLesson} className="space-y-4">
            <div>
              <label>Lesson Name</label>
              <Input
                value={editingLesson?.name || ""}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div>
              <label>Lesson Number</label>
              <Input
                type="number"
                value={editingLesson?.lessonNumber || ""}
                onChange={(e) =>
                  setEditingLesson((prev) => ({
                    ...prev,
                    lessonNumber: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingLesson?._id ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonManagement;
