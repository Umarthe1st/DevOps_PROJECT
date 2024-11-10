var express = require('express');
var bodyParser = require("body-parser");

var app = express();

const PORT = process.env.PORT || 5050
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(express.static("./utils"));

const { addMenuItem, viewMenu } = require('./utils/MenuUtil.js')
app.post('/add-MenuItem', addMenuItem);
app.get('/view-menu', viewMenu)
const { createReservation, viewReservation,  } = require('./utils/Reservationutils.js');
const {  editReservation, deleteReservation, } = require('./utils/UpdateUtil.js');


app.post('/reservation', createReservation);
app.get('/view-reservation', viewReservation);
app.put('/edit-reservation/:id', editReservation);
app.delete('/delete-reservation/:id', deleteReservation);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };
