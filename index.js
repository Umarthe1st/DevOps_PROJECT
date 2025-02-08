const express = require('express');
const bodyParser = require("body-parser");
const logger = require('./logger');
const promClient = require('prom-client');

const app = express();
const PORT = process.env.PORT || 5050;

// Create a Registry for Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Fix: Register default metrics under the correct register
const httpRequestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status'],
});
register.registerMetric(httpRequestCounter); // Important: Register the metric

// Middleware to track requests
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
    });
    next();
});

// Fix: Correctly expose the `/metrics` endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics()); // Fix: Use `send()` instead of `end()`
});

// Fix: Use middleware after defining metrics
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));
app.use(express.static("./utils"));

const { addMenuItem, viewMenu } = require('./utils/MenuUtil.js');
app.post('/add-MenuItem', addMenuItem);
app.get('/view-menu', viewMenu);
const { createReservation, viewReservation } = require('./utils/Reservationutils.js');
const { editReservation, deleteReservation } = require('./utils/UpdateUtil.js');

app.post('/reservation', createReservation);
app.get('/view-reservation', viewReservation);
app.put('/edit-reservation/:id', editReservation);
app.delete('/delete-reservation/:id', deleteReservation);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// Add Express Status Monitor
const statusMonitor = require('express-status-monitor');
app.use(statusMonitor());

// Start Express server
server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    logger.info(`Server running at http://localhost:${PORT}!`);
});

module.exports = { app, server };
