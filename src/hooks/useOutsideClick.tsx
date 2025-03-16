import { useEffect, useRef, RefObject } from 'react';

type Handler = () => void;

/**
 * Hook that detects clicks outside of the specified element
 * @param callback Function to call when a click outside is detected
 * @returns React ref to attach to the element
 */
export const useOutsideClick = <T extends HTMLElement = HTMLDivElement>(callback: Handler): RefObject<T | null> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};

export default useOutsideClick;