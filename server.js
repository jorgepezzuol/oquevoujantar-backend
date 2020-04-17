const express = require('express');
const cors = require('cors');

require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./src/routes'));
app.use('/resources', express.static(__dirname + '/images'));

const NODE_PORT = 'process.env.PORT || 3000';
//app.listen(3005);
app.listen(NODE_PORT);