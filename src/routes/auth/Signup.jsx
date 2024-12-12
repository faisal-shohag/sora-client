import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import PhotoUpload from './PhotoUpload';
import ImageKit from "imagekit";
import { Link, useNavigate } from 'react-router-dom';

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const Signup = () => {
  const { signup, user } = useAuth();
  const navigate = useNavigate()
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const imageKit = new ImageKit({
    publicKey: "public_Vh5nLR3Jrm4T8zA+77I+lh7nZSY=",
    privateKey: "private_NmXzE7tSS12GF17YPjVqGuEolgM=",
    urlEndpoint: "https://ik.imagekit.io/britto",
  });

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data) => {
    // Check if photo is selected before allowing signup
    if (!avatarFile) {
      toast.error("Please select a profile picture before creating an account");
      return;
    }

    toast.loading("Please wait...", { id: "signup" });
    try {
      // Upload photo first
      const reader = new FileReader();
      reader.readAsDataURL(avatarFile);
      
      reader.onloadend = async () => {
        try {
          const fileName = `profile_${Date.now()}`;
          const uploadResponse = await imageKit.upload({
            file: reader.result,
            fileName: fileName,
            folder: "/profile_images"
          });

          // Signup with uploaded avatar URL
          await signup(
            data.name, 
            data.email, 
            data.password, 
            uploadResponse.url
          );

          // toast.dismiss("signup");
        } catch (error) {
          console.log(error);
          toast.error("Signup failed", { id: "signup" });
        }
      };
    } catch (error) {
      console.log(error);
      toast.error("Error uploading profile picture", { id: "signup" });
    }
  };

  // Function to handle photo selection
  const handlePhotoSelect = (file, preview) => {
    setAvatarFile(file);
    setAvatarPreview(preview);
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate])

  return (
    <div className='flex flex-col justify-center items-center  min-h-screen'>
   <div>
    <h1 className='text-4xl font-bold text-center'>~<span className='text-red-500'>日本</span>~ Learn</h1>
    <p className='text-center'>A Japanese Vocabulary Learning Application</p>
   </div>
   

    <div className="flex justify-center items-center p-4">
      <Card className="min-w-[420px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Sign up to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PhotoUpload 
                aspectRatio={1} 
                onPhotoSelect={handlePhotoSelect}
                initialPreview={avatarPreview}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="you@example.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Strong password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800">
                Already have an account? Login
              </Link>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!avatarFile}
              >
                Create Account
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default Signup;