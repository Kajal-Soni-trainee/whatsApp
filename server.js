const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {storage} = require('./middlewares/multer');
require('dotenv').config();
app.use(cookieParser());
const port = process.env.PORT;
console.log(port);
const route = require('./routes/route');
app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: storage })
app.use('/', route);
app.listen(port);