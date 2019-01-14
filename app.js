const express = require('express');
const path = require('path');

const router = require('./routes/router')

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public'));

router(app);

app.listen(3000, () => console.log("Server up!"));