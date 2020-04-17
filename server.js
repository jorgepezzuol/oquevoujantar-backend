const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./src/routes'));
app.use('/resources', express.static(__dirname + '/images'));

//app.listen(3005);
app.listen(8080);