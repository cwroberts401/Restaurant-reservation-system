const service = require('./tables.service.js');
const reservationsService = require('../reservations/reservations.service');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const hasRequiredPropertiesCreate = hasProperties('table_name', 'capacity');
const hasRequiredPropertiesSeat = hasProperties('reservation_id');

async function reservationExists(req, res, next) {
	const { reservation_id } = req.body.data;
	const reservation = await reservationsService.read(reservation_id);

	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({ status: 404, message: `reservation ${reservation_id} cannot be found.` });
}

function table_nameIsValid(req, res, next) {
	let table = req.body.data.table_name;
	if (table.length < 2) {
		return next({
			status: 400,
			message: 'table_name must at least 2 characters'
		});
	}
	next();
}

function capacityIsValid(req, res, next) {
	let capacity = req.body.data.capacity;
	if (typeof capacity !== 'number') {
		return next({
			status: 400,
			message: 'capacity must be a number'
		});
	}
	next();
}

async function create(req, res) {
	const data = await service.create(req.body.data);
	res.status(201).json({ data });
}

async function list(req, res) {
	const data = await service.list();
	res.status(200).json({ data });
}

async function seat(req, res) {
	await service.seat(req.params.table_id, req.body.data.reservation_id);
	await service.reservationSeated(req.body.data.reservation_id);
	res.status(200).json({});
}

async function validateTableStatus(req, res, next) {
	const table = await service.read(req.params.table_id);

	if (table.capacity < res.locals.reservation.people) {
		return next({
			status: 400,
			message: 'capacity must be larger than party'
		});
	}

	if (table.reservation_id !== null) {
		return next({
			status: 400,
			message: 'table is occupied'
		});
	}
	next();
}

async function tableExists(req, res, next) {
	const table = await service.read(req.params.table_id);
	if (table) {
		res.locals.table = table;
		return next();
	}
	next({ status: 404, message: `table ${req.params.table_id} cannot be found.` });
}

function tableStatus(req, res, next) {
	if (res.locals.table.reservation_id === null) {
		return next({
			status: 400,
			message: 'table is not occupied'
		});
	}
	next();
}

async function finish(req, res) {
	await service.finish(req.params.table_id);
	await service.reservationFinished(res.locals.table.reservation_id);
	res.status(200).json({});
}

function validateSeatedStatus(req, res, next) {
	if (res.locals.reservation.status === 'seated') {
		return next({
			status: 400,
			message: 'table is already seated'
		});
	}
	next();
}

module.exports = {
	create: [ hasRequiredPropertiesCreate, table_nameIsValid, capacityIsValid, asyncErrorBoundary(create) ],
	list: [asyncErrorBoundary(list)],
	seat: [
		hasRequiredPropertiesSeat,
		asyncErrorBoundary(reservationExists),
		asyncErrorBoundary(tableExists),
		validateSeatedStatus,
		asyncErrorBoundary(validateTableStatus),
		asyncErrorBoundary(seat)
	],
	finish: [ asyncErrorBoundary(tableExists), tableStatus, asyncErrorBoundary(finish) ]
};
