console.log('Frontend script running')
fetch('/').then(response => response.text()).then(data => console.log(data)).catch(error => console.error('Error:', error));
