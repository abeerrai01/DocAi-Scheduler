import axios from 'axios';

const apiSpring = axios.create({
  baseURL: process.env.REACT_APP_SPRING_API,
  withCredentials: true,
});

const apiNode = axios.create({
  baseURL: process.env.REACT_APP_NODE_API,
  // ...
});

export default apiSpring; 