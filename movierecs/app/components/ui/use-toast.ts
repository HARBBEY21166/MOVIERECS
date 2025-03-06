import { useState } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState<string[]>([]); // Define the state type as string[]

  const toast = (message: string) => { // Add type annotation for message
    setToasts((prev) => [...prev, message]);
  };

  return { toast, toasts };
};
