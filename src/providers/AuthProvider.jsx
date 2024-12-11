import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';


export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds user data
  const [loading, setLoading] = useState(true); // Manages loading state
  const axiosSecure = useAxiosSecure()
  const navigate = useNavigate()

  const saveToken = (token) => {
    Cookies.set('jwt_token', token, { expires: 1 }); 
  };

  const removeToken = () => {
    Cookies.remove('jwt_token');
  };

  // Function to log in the user
  const login = async (email, password) => {
    toast.loading("Loging in...", { id: "login" });
    try {
      const response = await axiosSecure.post(`/auth/login`, { email, password });
      const { token, user } = response.data;
      saveToken(token);
      setUser(user);
      toast.success(response.data?.message || "Logged in successfully", { id: "login" });
    } catch (error) {
        toast.error(error.response?.data?.error || "Login failed", { id: "login" });
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Function to register the user
  const signup = async (name, email, password, avatar) => {
    // toast.loading("Signing up...", { id: "signup" });
    console.log({name, email, password, avatar});
    console.log("Signup called");
    try {
      const response = await axiosSecure.post('/auth/signup', {
        name,
        email,
        password,
        avatar,
      });
      console.log(response.data);
      const { token, user } = response.data;
      saveToken(token);
      setUser(user);
      toast.success(response.data?.message || "Signed up successfully", { id: "signup" });
    } catch (error) {
        toast.error(error.response?.data?.error || "Signup failed", { id: "signup" });
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    axiosSecure.post('/auth/logout')
    .then(() => {
      removeToken();
      setUser(null);
    })
    .catch(error => {
      console.error('Logout error:', error.response?.data?.message || error.message);
    });
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosSecure.get('/user');
      // console.log(response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error.response?.data?.message || error.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
