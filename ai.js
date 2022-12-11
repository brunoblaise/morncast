const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pg = require('pg');

// Set up the PostgreSQL connection
const pool = new pg.Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'password',
  database: 'mydb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Set up the websocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for new notifications
  socket.on('new_notification', (data) => {
    // Save the notification to the database
    pool.query('INSERT INTO notifications (message) VALUES ($1)', [data.message], (error, result) => {
      if (error) {
        console.error(error);
        return;
      }

      // Notify all clients about the new notification
      io.emit('notification', data);
    });
  });
});

// Start the server
http.listen(3000, () => {
  console.log('Server listening on port 3000');
});


const { TesseractWorker } = require('tesseract.js');
const worker = new TesseractWorker();

// path to the image file with handwritten text
const imagePath = './handwritten-text.png';

// recognize the text in the image
worker
  .recognize(imagePath, 'eng')
  .progress(message => console.log(message))
  .then(result => {
    console.log(result.text);
  })
  .finally(() => worker.terminate());



  const { init, getFullTextAnnotation } = require('@google-cloud/vision');

// path to the image file with handwritten text
const imagePath = './handwritten-text.png';

// initialize the Google Cloud Vision client
const client = init({
  keyFilename: '/path/to/service-account-key.json'
});

// recognize the text in the image
const [result] = await client.getFullTextAnnotation(imagePath);
const text = result.text;
console.log(text);
