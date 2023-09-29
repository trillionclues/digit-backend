const bodyParser = require('body-parser');
const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/user', authRouter);

// NB: All middleware comes after the routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});