const express = require('express');
const cors = require('cors');
//const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandlers');
const path = require('path');

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", "https://cdn.tiny.cloud"],
//         imgSrc: ["'self'", "data:", "*"],
//         styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tiny.cloud"], 
//         connectSrc: ["'self'", "https://cdn.tiny.cloud"], 
//       },
//     },
//   })
// );


app.use(morgan('dev'));


app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));


const buildPath = path.join(__dirname, '../screens', 'dist')
app.use(express.static(buildPath))
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../screens', 'dist', "index.html"));
});


app.use(errorHandler);


module.exports = app;