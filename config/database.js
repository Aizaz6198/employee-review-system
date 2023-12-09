const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
  mongoose
    .connect('mongodb+srv://aizaz060198:Ahmed6198%40@cluster0.iaiuzrt.mongodb.net', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log('DB CONNECTED SUCCESSFULLY'))
    .catch((err) => {
      console.log('DB CONNECTION FAILED');
      console.log(err);
      process.exit(1);
    });
};
