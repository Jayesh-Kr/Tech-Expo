import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

// Import styles for Clerk's components
import '@clerk/clerk-react/dist/index.css';

const ClerkAuthWrapper = ({ children }) => {
  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY';

  if (!clerkPubKey) {
    console.error("Missing Clerk Publishable Key");
    return <div>Error: Missing authentication configuration</div>;
  }

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      {children}
    </ClerkProvider>
  );
};

export default ClerkAuthWrapper;
