// utils/auth.js
export const loginWithRole = (role) => {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  console.log('domain: ', domain);
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = window.location.origin;

  const url = `https://${domain}/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid%20profile%20email&state=${role}`;

  window.location.href = url;
};