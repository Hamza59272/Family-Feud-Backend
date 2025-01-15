require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./connection');
var cors = require('cors')
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const {
    connectRoute
} = require("./Router/index");
// const bcrypt = require('bcrypt');
// const Admin = require('./Model/Admin'); 


connectDB();
var app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Allow all origins
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// async function createAdmin() {
//     const hashedPassword = await bcrypt.hash("password123", 10);
//     const admin = new Admin({ username: "admin", password: hashedPassword });
//     await admin.save();
//     console.log("Admin created!");
// }
// createAdmin();

connectRoute(app);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page if found
  res.status(err.status || 500);
  res.render('error');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);

  socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
  });
});

// Attach Socket.IO to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;