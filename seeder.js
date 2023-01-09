const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);


const importData = async () => {
  try {
    await User.create(users);
    console.log('Data Imported');
    process.exit();
  }
  catch (err) {
    console.error(err);
  }
}

const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  }
  catch (err) {
    console.error(err);
  }
}

if(process.argv[2] === '-i') {
  importData();
} else if(process.argv[2] === '-d') {
  deleteData()
}