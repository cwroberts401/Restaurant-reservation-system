# Restaurant Reservation System

> A simple Reservation managment tool build using React, Knex, and Express.

This simple app was created to allow users to easily create, edit, and keep track of reservations made over the phone or in person. It uses a simple interface that clearly shows the status of all tables and reservations in one place.

## Live Site
The live site deployed with Heroku can be found here: [https://cr-reservation-client.herokuapp.com/](https://cr-reservation-client.herokuapp.com/)


## Features
### Dashboard
![](https://github.com/cwroberts401/starter-restaurant-reservation/blob/main/dashboard.png)
This is the main interface with the site, here users have access to all reservation and table listings so they can clearly see the status of everything. 

### Table Status
![](https://github.com/cwroberts401/starter-restaurant-reservation/blob/main/table-status.png)
A "finish" button appears dynamically when a reservation is seated, when the finish button is clicked the table status is updated and another reservation is allowed to be seated.

### New reservation
![](https://github.com/cwroberts401/starter-restaurant-reservation/blob/main/new-reservation.png)
This component allows users to easily create new reservation. Once all required fields are filled out the time and date are validated to make sure they fall within the restaurant's operating hours

### Search
![](https://github.com/cwroberts401/starter-restaurant-reservation/blob/main/search.png)
This page allows users to quickly search for a reservation by phone number. All reservation statuses appear on this page. 


## Local Installation

1. Fork and clone this repository.
1. Run `cp ./back-end/.env.sample ./back-end/.env`.
1. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
1. Run `cp ./front-end/.env.sample ./front-end/.env`.
1. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5000`.
1. Run `npm install` to install project dependencies.
1. Run `npm run start:dev` to start your server in development mode.

