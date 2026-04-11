import { seedAll } from './src/utils/seed.js';

// Mock localStorage
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, value) => { store[key] = value; },
  removeItem: (key) => { delete store[key]; }
};

console.log("Running seedAll()...");
seedAll();

console.log("Checking seeded data...");
const admins = JSON.parse(localStorage.getItem('admins:edusync') || '[]');
const teachers = JSON.parse(localStorage.getItem('teachers:edusync') || '[]');
const parents = JSON.parse(localStorage.getItem('parents:edusync') || '[]');
const messages = JSON.parse(localStorage.getItem('conversations:edusync') || '[]');

console.log(`Admins: ${admins.length}`);
console.log(`Teachers: ${teachers.length}`);
console.log(`Parents: ${parents.length}`);
console.log(`Conversations: ${messages.length}`);

if (admins.length > 0 && teachers.length > 0 && parents.length > 0) {
  console.log("SUCCESS: Data seeded correctly.");
} else {
  console.log("FAILURE: Data missing.");
}
