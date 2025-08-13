console.log('Frontend script running')
// Intentional error below
try {
  consol.log('This will cause an error');
} catch (e) {
  console.error('An error occurred:', e);
}
