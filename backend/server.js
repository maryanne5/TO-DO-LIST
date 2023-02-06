const express = require('express');
const userRoutes = require('./Routes/userRoutes');
const taskRooutes = require('./Routes/taskRoutes');
const mongoose = require('mongoose');
const config = require('./config/keys');
const path = require('path');
const app = express();

/****************************************** Server Setup  ********************************************/
const port = process.env.PORT || 8080;
const publicPath = path.join(__dirname, '../client/', 'build');
app.use(express.static(publicPath));
/******************************************MiddleWares  ********************************************/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRooutes);

/******************************************MongoDb Connection********************************************/

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('MongoDb Connected'))
  .catch((err) => console.log(err));

// if (process.env.NODE_ENV === 'production') { // For running client if you are hosting both client and backend on the server. The server will serve the static build file in client/build
//     app.use(express.static('../client/build'));

//     app.get('/*', (req, res) => {
//         res.sendFile(path.join(__dirname, '../client', '/build', '/index.html'));

//     });
// }


app.all("/api/*", function(req, res, next) {
  console.log("General Validations");
  next();
});


app.get("*", function(request, response) {
  response.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
})

app.listen(port, () => console.log(`Listening to port ${port}`));
