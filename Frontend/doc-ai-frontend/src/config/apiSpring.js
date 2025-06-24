import axios from 'axios';

const apiSpring = axios.create({
  baseURL: process.env.REACT_APP_SPRING_API,
  withCredentials: true,
});

export default apiSpring; 