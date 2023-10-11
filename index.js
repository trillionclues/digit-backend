const bodyParser = require('body-parser');
const express = require('express');
const { dbConnect } = require('./config/dbConnect');
const authRouter = require('./routes/authRoute');
const productRouter = require('./routes/productRoute');
const prodCategoryRouter = require('./routes/blogCatRoute');
const blogCategoryRouter = require('./routes/blogCatRoute');
const brandRouter = require('./routes/brandRoute');
const blogRouter = require('./routes/blogRoute')
const couponRouter = require('./routes/couponRoute')
const colorRouter = require('./routes/colorRoute')
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 4000;
dbConnect();

app.use(morgan('dev')); // output dev timestamps in terminal
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter)
app.use('/api/category', prodCategoryRouter)
app.use('/api/blogcategory', blogCategoryRouter)
app.use('/api/brand', brandRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/color', colorRouter)

// NB: All middleware comes after the routes
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
