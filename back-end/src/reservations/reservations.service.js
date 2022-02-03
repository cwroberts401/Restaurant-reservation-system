const knex = require('../db/connection');

function list(reservation_date) {
	return knex('reservations')
		.select('*')
		.where({ reservation_date })
		.whereNot({ status: 'finished' })
		.orderBy('reservation_time', 'asc');
}

function create(reservation) {
	return knex('reservations')
		.insert(reservation)
		.returning([
			'reservation_id',
			'first_name',
			'last_name',
			'mobile_number',
			'people',
			'reservation_date',
			'reservation_time'
		])
		.then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
	return knex('reservations').select('*').where({ reservation_id }).first();
}

function search(mobile_number) {
	return knex('reservations')
		.whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, '')}%`)
		.orderBy('reservation_date');
}

function updateStatus(reservation_id, status) {
	return knex('reservations')
		.where({ reservation_id })
		.update({ status })
		.returning('status')
		.then((result) => result[0]);
}

function edit(reservation_id, edits) {
	return knex('reservations')
		.select('*')
		.where({ reservation_id })
		.update(edits, '*')
		.returning([
			'reservation_id',
			'first_name',
			'last_name',
			'mobile_number',
			'people',
			'reservation_date',
			'reservation_time'
		])
		.then((result) => result[0]);
}

module.exports = {
	list,
	create,
	read,
	search,
	updateStatus,
	edit
};
