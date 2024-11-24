import { faker } from '@faker-js/faker';

describe('API Automation - Restful Booker', () => {
    let token;
    let bookingId;
    const randomFirstName = faker.person.firstName();
    const randomLastName = faker.person.lastName();

    it('Create Token - Verify Status Code and Token', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/auth',
            body: {
                username: 'admin',
                password: 'password123',
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            token = response.body.token;
        });
    });

    it('Create Booking - Verify Status Code and Response Body', () => {
        cy.request({
            method: 'POST',
            url: 'https://restful-booker.herokuapp.com/booking',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: {
                firstname: randomFirstName,
                lastname: randomLastName,
                totalprice: 123,
                depositpaid: true,
                bookingdates: {
                    checkin: '2024-11-24',
                    checkout: '2024-11-30',
                },
                additionalneeds: 'Breakfast',
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body.booking).to.have.property('firstname', randomFirstName);
            expect(response.body.booking).to.have.property('lastname', randomLastName);
            bookingId = response.body.bookingid;
        });
    });

    it('Get Booking - Verify Status Code and Response Body', () => {
        cy.request({
            method: 'GET',
            url: `https://restful-booker.herokuapp.com/booking/${bookingId}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('firstname', randomFirstName);
            expect(response.body).to.have.property('lastname', randomLastName);
            expect(response.body).to.have.property('additionalneeds', 'Breakfast');
        });
    });
});
