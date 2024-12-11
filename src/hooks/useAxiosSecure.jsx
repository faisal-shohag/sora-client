import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'content-type': 'application/json'
    },
    withCredentials: true
})

console.log(import.meta.env.VITE_API_URL)
const useAxiosSecure = () => {
    return axiosSecure;
};

export default useAxiosSecure;