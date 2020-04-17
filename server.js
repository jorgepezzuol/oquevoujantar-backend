const express = require('express');
const cors = require('cors');

require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', require('./src/routes'));
app.use('/resources', express.static(__dirname + '/images'));

app.set( 'port', ( process.env.PORT || 5000 ));

// Start node server
app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
});