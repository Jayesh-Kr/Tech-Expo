/**
 * Debug utility to check authentication status and routing
 */
export const debugAuth = (isSignedIn, user, location) => {
  console.group('Auth Debug Info');
  console.log('Is signed in:', isSignedIn);
  console.log('Current user:', user);
  console.log('Current location:', location);
  console.groupEnd();
};

/**
 * Debug utility to check if components are mounted properly
 * @param {string} componentName - Name of the component being debugged
 */
export function useDebugMount(componentName) {
  console.log(`${componentName} mounting...`);
  
  return () => {
    console.log(`${componentName} unmounting...`);
  };
}
