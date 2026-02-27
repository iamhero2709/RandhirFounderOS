// QUICK FIX SCRIPT - PASTE IN BROWSER CONSOLE (F12)
// This will clear old data and reload with fixed structure

console.log('🔧 Fixing Founder OS data...');

// Clear old data
localStorage.removeItem('founderOS-v2');

console.log('✅ Old data cleared!');
console.log('🔄 Refresh page (Ctrl+R) to load fixed structure!');

// Auto-refresh after 1 second
setTimeout(() => {
  console.log('🔃 Auto-refreshing...');
  window.location.reload();
}, 1000);
