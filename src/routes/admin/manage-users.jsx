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
import { UserCog, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import useAxiosSecure from '@/hooks/useAxiosSecure';

const ManageUsers = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const axiosSecure = useAxiosSecure();

  // Fetch Users
  const fetchUsers = async () => {
    const { data } = await axiosSecure.get('/admin/users');
    return data;
  };

  // Update User Role
  const updateUserRoleMutation = async ({ userId, newRole }) => {
    const { data } = await axiosSecure.patch(`/admin/users/${userId}/role`, { role: newRole });
    return data;
  };

  // Delete User
  const deleteUserMutation = async (userId) => {
    const { data } = await axiosSecure.delete(`/admin/users/${userId}`);
    return data;
  };

  // Users Query
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Update Role Mutation
  const updateRoleMutation = useMutation({
    mutationFn: updateUserRoleMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      setIsRoleDialogOpen(false);
      toast.success('User role updated successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error updating user role');
    }
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserMutation,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully!');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error deleting user');
    }
  });

  const handleUpdateRole = () => {
    if (selectedUser) {
      const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
      updateRoleMutation.mutate({ 
        userId: selectedUser._id, 
        newRole 
      });
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (error) return <div>Error fetching users</div>;

  console.log(users)
  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Registered Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell><img className='rounded-sm lg:h-8' src={user.avatar} alt={user.name}/></TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={
                  user.role === 'admin' 
                    ? 'text-green-600 font-semibold' 
                    : 'text-blue-600'
                }>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                {new Date(user.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsRoleDialogOpen(true);
                    }}
                  >
                    <UserCog className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this user? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteMutation.mutate(user._id)}
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

      {/* Role Update Dialog */}
      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p>Current User: <strong>{selectedUser?.name}</strong></p>
              <p>Current Role: <strong>{selectedUser?.role}</strong></p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsRoleDialogOpen(false)} 
                disabled={updateRoleMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateRole}
                disabled={updateRoleMutation.isPending}
                variant={selectedUser?.role === 'admin' ? 'destructive' : 'default'}
              >
                {updateRoleMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedUser?.role === 'admin' 
                      ? 'Demoting...' 
                      : 'Promoting...'}
                  </>
                ) : (
                  selectedUser?.role === 'admin' 
                    ? 'Demote to User' 
                    : 'Promote to Admin'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;