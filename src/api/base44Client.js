import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "69449f9a81f3911088e34949", 
  requiresAuth: false // Avoid automatic redirects to Base44 login
});
