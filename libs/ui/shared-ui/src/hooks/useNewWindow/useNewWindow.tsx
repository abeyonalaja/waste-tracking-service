'use client';
import { useState, useEffect } from 'react';

export function useNewWindow() {
  const [newWindow, setNewWindow] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.history?.length === 1) {
      setNewWindow(true);
    }
  }, []);
  return newWindow;
}
