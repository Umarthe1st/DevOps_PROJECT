const { describe, it } = require("mocha");
const { expect } = require("chai");
const { app, server } = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
let baseUrl;
describe("Reservation API", () => {
  before(async () => {
    const { address, port } = await server.address();
    baseUrl = `http://${address == "::" ? "localhost" : address}:${port}`;
  });
  after(() => {
    return new Promise((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  });
  let count = 0;
  let reservationId;

  describe('PUT /edit-reservation/:id', () => {
    it('should update an existing resource', (done) => {
      chai.request(baseUrl)
        .put(`/edit-reservation/${reservationId}`)
        .send({
            customer_name: 'John Doe',
            location: 'New Location',
            date: '2024-12-10',
            time: '19:00',
            number_of_guests: 4,
            contact_info: '98765432'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.message).to.equal('Reservation modified successfully!');
          done();
        });
    });
  });
  it('should have all fields', (done) => {
    chai.request(baseUrl)
      .put(`/edit-reservation/${reservationId}`)
      .send({
          customer_name: 'John Doe',
          location: 'New Location',
          date: '2024-12-10',
          time: '19:00',
          number_of_guests: 0,
          contact_info: '98765432'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('All fields are required!');
        done();
      });
  });

  it('should have at least 8 numbers', (done) => {
    chai.request(baseUrl)
      .put(`/edit-reservation/${reservationId}`)
      .send({
          customer_name: 'John Doe',
          location: 'New Location',
          date: '2024-12-10',
          time: '19:00',
          number_of_guests: 4,
          contact_info: '9876543'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Contact number must be at least 8 digits!');
        done();
      });
  });

  it('should have at least 2 and max 50 characters', (done) => {
    chai.request(baseUrl)
      .put(`/edit-reservation/${reservationId}`)
      .send({
          customer_name: 'J',
          location: 'New Location',
          date: '2024-12-10',
          time: '19:00',
          number_of_guests: 4,
          contact_info: '9876543'
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.equal('Customer name must be 2-50 characters and only contain letters.');
        done();
      });
  });

  describe('DELETE /delete-reservation/:id', () => {
    it('should delete an existing reservation', (done) => {
        chai.request(baseUrl)
            .delete(`/delete-reservation/${reservationId}`)
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.message).to.equal('Reservation deleted successfully!');
                done();
            });
    });
});


  
});