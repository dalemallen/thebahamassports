
// utils/validatePlayerName.js

export default function validatePlayerName(name) {
  const regex = /^[A-Za-z\s'-]+$/;
  return regex.test(name);
}
