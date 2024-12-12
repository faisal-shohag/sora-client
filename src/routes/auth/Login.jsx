import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';


const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

const Login = () => {
const { login, user } = useAuth();
const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  // Handle form submission
  const onSubmit = async (data) => {
  login(data.email, data.password);
   
  };

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate])

  return (
    <>
   <div className='flex flex-col justify-center items-center  min-h-screen'>
   <div>
    <h1 className='text-4xl font-bold text-center'>~<span className='text-red-500'>日本</span>~ Learn</h1>
    <p className='text-center'>A Japanese Vocabulary Learning Application</p>
   </div>
   

    <div className="flex justify-center items-center p-4">
      
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Welcome back!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              
              
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
                        placeholder="Password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            <div>
            <Link to="/signup" className="text-sm  text-gray-00 hover:text-gray-600">
                Don&apos;t have an account? Sign up
              </Link>
            </div>
              
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
    </>
  );
};

export default Login;