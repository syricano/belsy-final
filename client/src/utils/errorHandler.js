export const errorHandler = (error, fallbackMessage = 'Something went wrong') => {
  const msg = error?.message || fallbackMessage;
  alert(msg); 
};
