const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const router = require('./routes');
const connectDB = require('./config');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.use(router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
