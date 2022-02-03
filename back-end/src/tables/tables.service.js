const knex = require('../db/connection');

function list(reservation_date) {
	return knex('tables').select('*').orderBy('table_name');
}

function create(table) {
	return knex('tables').insert(table).returning('*').then((createdRecords) => createdRecords[0]);
}

function seat(table_id, reservation_id) {
	return knex('tables').select('*').where({ table_id }).update({ reservation_id }).returning('*');
}

function finish(table_id) {
	return knex('tables').select('*').where({ table_id }).update({ reservation_id: null }).returning('*');
}

function read(table_id) {
	return knex('tables').select('*').where({ table_id }).first();
}

function reservationSeated(reservation_id) {
	return knex('reservations')
		.select('*')
		.where({ reservation_id: reservation_id })
		.update({ status: 'seated' })
		.catch((e) => res.status(500).json(e));
}

function reservationFinished(reservation_id) {
	return knex('reservations').select('*').where({ reservation_id: reservation_id }).update({ status: 'finished' });
}

module.exports = {
	list,
	create,
	seat,
	reservationSeated,
	reservationFinished,
	read,
	finish
};
