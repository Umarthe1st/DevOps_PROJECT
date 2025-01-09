const { readJSON, writeJSON } = require("./Reservationutils");
const { create } = require('domain');
const { Reservation } = require('../models/Reservation');
const fs = require('fs').promises;

async function editReservation(req, res) {
    try {
        const id = req.params.booking_id;
        const { customer_name, location, date, time, number_of_guests, contact_info } = req.body;

        // Additional Validation on the server-side
        if (!customer_name || !location || !date || !time || !number_of_guests || !contact_info) {
            return res.status(400).json({ message: 'All fields are required!' });
        }

        if (!/^[a-zA-Z\s]{2,50}$/.test(customer_name)) {
            return res.status(400).json({ message: 'Customer name must be 2-50 characters and only contain letters.' });
        }

        if (String(contact_info).length < 8) {
            return res.status(400).json({ message: 'Contact number must be at least 8 digits!' });
        }

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
    readJSON,writeJSON,editReservation, deleteReservation
}