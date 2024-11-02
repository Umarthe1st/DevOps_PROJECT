const { create } = require('domain');
const { Reservation } = require('../models/Reservation');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function createReservation(req, res) {
    try {
        const { customer_name, date, time, number_of_guests, contact_info, status = 'pending' } = req.body;

        if (!customer_name || customer_name.length < 1) {
            return res.status(400).json({ error: "Customer name is required." });
        }

        if (!date) {
            return res.status(400).json({ error: "Reservation date must be in the future." });
        }

        if (!time) {
            return res.status(400).json({ error: "Reservation time is required." });
        }

        if (!number_of_guests || number_of_guests <= 0) {
            return res.status(400).json({ error: "Number of guests must be at least 1." });
        }

        if (!contact_info || !contact_info.phone) {
            return res.status(400).json({ error: "A valid phone number is required for contact." });
        } else {
            const newReservation = new Reservation(customer_name, date, time, number_of_guests, contact_info, status)
            const updatedReservation = await writeJSON(newReservation, 'utils/Reservation.json');
            return res.status(201).json(updatedReservation);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, createReservation
};