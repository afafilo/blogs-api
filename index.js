// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const blogRoutes = require('./routes/blogRoutes.js');
const categoryRoutes= require('./routes/categoryRoute.js')
const videoRoute = require('./routes/videoRoute.js')
const allBlogRoute = require('./routes/allblogRoute.js')

const app = express();

app.use(cors());
app.use(express.json()); // in case you handle JSON requests

app.use('/api/blogs', blogRoutes);
app.use('/api/category',categoryRoutes );
app.use('/api/videos',videoRoute );
app.use('/api/allBlog',allBlogRoute );

app.listen(5000, console.log('running on local'));

app.get("/", (req, res) => res.send("Express on Vercel")); 

module.exports = app;
