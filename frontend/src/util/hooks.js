import { useState, useEffect, useCallback } from "react";

/**
 * @param {Storage} storage 
 * @param {string} key 
 * @param {any} data 
 */
export const setStorage = (storage, key, data) => storage.setItem(key, JSON.stringify(data));

/**
 * @param {Storage} storage 
 * @param {string} key 
 * @return {any|null}
 */
export const getStorage = (storage, key) => {
  const localItem = storage.getItem(key);
  if (localItem) return JSON.parse(localItem);
  return null;
}

/**
 * hook to access data in localstorage
 * @param {string} key 
 * @param {any} data 
 * @returns {[any, React.Dispatch<any>]}
 */
export const useSessionStorage = (key) => {
  const [val, setVal] = useState(
    useCallback(() => getStorage(sessionStorage, key), [key])
  );
  useEffect(() => setStorage(sessionStorage, key, val), [val, key]);
  return [val, setVal];
}

/**
 * hook to access data in localstorage
 * @param {string} key 
 * @param {any} data 
 * @returns {[any, React.Dispatch<any>]}
 */
export const useLocalStorage = (key) => {
  const [val, setVal] = useState(
    useCallback(() => getStorage(localStorage, key), [key])
  );
  useEffect(() => setStorage(localStorage, key, val), [val, key]);
  return [val, setVal];
}

export function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    mobile: false,
    tablet: false,
    desktop: false,
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      const wwidth = window.innerWidth;
      setWindowSize({
        width: wwidth,
        height: window.innerHeight,
        mobile: wwidth <= 575.98,
        tablet: wwidth > 575.98 && wwidth <= 767.98,
        desktop: wwidth > 767.98,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return windowSize;
}