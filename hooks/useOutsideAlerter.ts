import { RefObject, useEffect, useRef } from 'react';

const useOutsideClicked = (ref: RefObject<HTMLElement>, handler: any) => {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, handler]);
};

export { useOutsideClicked };
