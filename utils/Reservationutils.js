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
        const { customer_name, location, date, time, number_of_guests, contact_info, status = 'pending' } = req.body;

        if (!customer_name || customer_name.length < 1) {
            return res.status(400).json({ error: "Customer name is required." });
        }

        if (!location) {
            return res.status(400).json({ error: "Location is required." });
        }
        const dateFormat = /^\d{4}-\d{2}-\d{2}$/;
        if (!date) {
            return res.status(400).json({ error: "Reservation date is required." });
        } else if (!dateFormat.test(date)) {
            return res.status(400).json({ error: "Invalid date format. Follow this format YYYY-MM-DD" })
        }
        const timeFormat = /^(?:[01][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/
        if (!time) {
            return res.status(400).json({ error: "Reservation time is required." });
        } else if (!timeFormat.test(time)) {
            return res.status(400).json({ error: "Invalid time format. It should be in 24-hour format (HH:MM), ranging from 00:00 to 23:59." });
        }

        if (!number_of_guests || number_of_guests <= 0 || isNaN(number_of_guests)) {
            return res.status(400).json({ error: "Number of guests must be at least 1." });
        }

        if (!contact_info || contact_info.length !== 8 || isNaN(contact_info)) {
            return res.status(400).json({ error: "A valid phone number is required for contact." });
        } else {
            const reservations = await readJSON('utils/Reservation.json');
            const reservationsExist =  reservations.find(reservations => reservations.contact_info === contact_info);

            if (reservationsExist) {
                return res.status(400).json({ error: "This contact number is already in use for a reservation." });
            } else {
                const newReservation = new Reservation(customer_name, location, date, time, number_of_guests, contact_info, status)
                const updatedReservation = await writeJSON(newReservation, 'utils/Reservation.json');
                return res.status(201).json(updatedReservation);
            }
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewReservation(req, res) {
    try {
        const allReservation = await readJSON('utils/Reservation.json');
        return res.status(201).json(allReservation);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function editReservation(req, res) {
    try {
        const id = req.params.booking_id;
        const { customer_name, location, date, time, number_of_guests, contact_info } = req.body;

        const allReservations = await readJSON('utils/Reservation.json');
        let modified = false;

        // Find and update the reservation by ID
        for (let i = 0; i < allReservations.length; i++) {
            let currentReservation = allReservations[i];
            if (String(currentReservation.id) === String(id)) {
                allReservations[i].customer_name = customer_name || currentReservation.customer_name;
                allReservations[i].location = location || currentReservation.location;
                allReservations[i].date = date || currentReservation.date;
                allReservations[i].time = time || currentReservation.time;
                allReservations[i].number_of_guests = number_of_guests || currentReservation.number_of_guests;
                allReservations[i].contact_info = contact_info || currentReservation.contact_info;
                modified = true;
                break;
            }
        }

        if (modified) {
            await fs.writeFile('utils/Reservation.json', JSON.stringify(allReservations, null, 2), 'utf8');
            return res.status(200).json({ message: 'Reservation modified successfully!' });
        } else {
            return res.status(404).json({ message: 'Reservation not found, unable to modify!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function deleteReservation(req, res) {
    try {
        const id = req.params.booking_id;

        const allReservations = await readJSON('utils/Reservation.json');
        const index = allReservations.findIndex(reservation => String(reservation.id) === String(id));

        if (index !== -1) {
            allReservations.splice(index, 1); // Remove the reservation

            await fs.writeFile('utils/Reservation.json', JSON.stringify(allReservations, null, 2), 'utf8');
            return res.status(200).json({ message: 'Reservation deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'Reservation not found, unable to delete!' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    readJSON, writeJSON, createReservation, viewReservation, editReservation, deleteReservation
};

module.exports = {
    readJSON, writeJSON, createReservation, viewReservation
};
