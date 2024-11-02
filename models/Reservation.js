class Reservation {
    constructor(customer_name, date, time, number_of_guests, contact_info, status) {
        this.customer_name = customer_name;
        this.date = date;
        this.time = time;
        this.number_of_guests = number_of_guests;
        this.contact_info = contact_info;
        this.status = status;


        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.booking_id = timestamp + "" + random.toString().padStart(3, '0');
    }
}
module.exports = { Reservation };