import { toast } from 'react-hot-toast';
 
export const errorHandler = (error, fallbackMessage = 'Something went wrong') => {
  const msg = error?.message || fallbackMessage;
  toast.error(msg);
};