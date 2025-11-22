import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://peskonindukbackend-1062022672602.asia-southeast1.run.app', 
});

export default instance;