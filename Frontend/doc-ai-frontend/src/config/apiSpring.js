import axios from 'axios';

const apiSpring = axios.create({
  baseURL: 'https://docai-scheduler-production.up.railway.app/api',
  withCredentials: true,
});

export default apiSpring; 