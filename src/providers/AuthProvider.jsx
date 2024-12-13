import { createContext, useState, useEffect } from 'react';
import useAxiosSecure from '@/hooks/useAxiosSecure';
import toast from 'react-hot-toast';

export const AuthContext = createContext();
import PropTypes from 'prop-types';



const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const axiosSecure = useAxiosSecure()
  
  const login = async (email, password) => {
    toast.loading("Loging in...", { id: "login" });
    try {
      const response = await axiosSecure.post(`/auth/login`, { email, password });
      setUser(user);
      toast.success(response.data?.message || "Logged in successfully", { id: "login" });
      setTimeout(() => {
        window.location.reload()
      }, 1200);
    } catch (error) {
        toast.error(error.response?.data?.error || "Login failed", { id: "login" });
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error;
    }
  };


  const signup = async (name, email, password, avatar) => {
    console.log({name, email, password, avatar});
    try {
      const response = await axiosSecure.post('/auth/signup', {
        name,
        email,
        password,
        avatar,
      });
      setUser(user);
      toast.success(response.data?.message || "Signed up successfully", { id: "signup" });
      setTimeout(() => {
        window.location.reload()
      }, 1200);
    } catch (error) {
        toast.error(error.response?.data?.error || "Signup failed", { id: "signup" });
      console.error('Registration error:', error.response?.data?.message || error.message);
      throw error;
    }
  };

  const logout = () => {
    axiosSecure.post('/auth/logout')
    .then(() => {
      setUser(null);
    })
    .catch(error => {
      console.error('Logout error:', error.response?.data?.message || error.message);
    });
  };

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosSecure.get('/user');
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

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
