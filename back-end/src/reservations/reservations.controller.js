const service = require('./reservations.service.js');
const hasProperties = require('../errors/hasProperties');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

const hasRequiredProperties = hasProperties(
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people'
);

async function list(req, res) {
	try {
		let response = [];
		if (req.query.mobile_number) {
			const mobile = req.query.mobile_number;
			response = await service.search(mobile);
		}
		if (req.query.date) {
			const { date } = req.query;
			response = await service.list(date);
		}
		return res.json({ data: response });
	} catch (error) {
		console.log(error);
	}
}

async function reservationExists(req, res, next) {
	const { reservation_id } = req.params;
	const reservation = await service.read(reservation_id);

	if (reservation) {
		res.locals.reservation = reservation;
		return next();
	}
	next({ status: 404, message: `reservation ${req.params.reservation_id} cannot be found.` });
}

async function read(req, res) {
	res.status(200).json({ data: res.locals.reservation });
}

async function updateStatus(req, res) {
	const result = await service.updateStatus(res.locals.reservation.reservation_id, req.body.data.status);
	res.status(200).json({ data: { status: result } });
}

async function edit(req, res, next) {
	const data = await service.edit(res.locals.reservation.reservation_id, req.body.data);
	res.status(200).json({ data });
}

async function create(req, res) {
	const response = await service.create(req.body.data);
	res.status(201).json({ data: response });
}

function validTime(req, res, next) {
	let reservation = req.body.data;

	if (!reservation.reservation_time) {
		return next({
			status: 400,
			message: 'Invalid time, must include a time'
		});
	}

	if (reservation.reservation_time < '10:30') {
		return next({
			status: 400,
			message: 'Invalid time, restaurant opens at 10:30 AM'
		});
	}

	if (reservation.reservation_time > '21:30') {
		return next({
			status: 400,
			message: 'Invalid time, restaurant closes at 9:30 PM'
		});
	}
	next();
}

function addADay(currentDate) {

    let result = new Date(currentDate);
    result.setDate(result.getDate() + 1);
    return result.toISOString().slice(0, 10);

}

function validDay(req, res, next) {
	let reservation = req.body.data;
	let offset = req.body.offset;

	// check time is in HH:MM format
	const timeRegex = /\d{2}\:\d{2}/g;
	if (!timeRegex.test(reservation.reservation_time)) {
		return next({
			status: 400,
			message: `reservation_time format invalid`
		});
	}

	// check date is in YYYY-MM-DD format
	const dateRegex = /\d{4}\-\d{2}\-\d{2}/g;
	if (!dateRegex.test(reservation.reservation_date)) {
		return next({
			status: 400,
			message: `reservation_date format invalid`
		});
	}

	// get current date & time as ISO string
	const currentDate = new Date();
	const currentUTCDate = currentDate.toISOString().slice(0, 10);
	const currentUTCTime = currentDate.toISOString().slice(11, 16);

	// convert reservation date & time to ISO string
	const totalInMinutes =
		parseInt(reservation.reservation_time.split(':')[0]) * 60 +
		parseInt(reservation.reservation_time.split(':')[1]);
	const UTCInMinutes = totalInMinutes + offset;

	let H = Math.floor(UTCInMinutes / 60);
	let M = UTCInMinutes % 60;

	let resUTCDate = reservation.reservation_date;

	if (H > 24) {
		H = H - 24;
		resUTCDate = addADay(resUTCDate);
	}

	const resUTCTime = H + ':' + M;

	const invalidDay = 'Cannot make reservation for that day,';

	if (new Date(resUTCDate).getUTCDay() === 2) {
		return next({
			status: 400,
			message: `${invalidDay} restaurant closed.`
		});
	}

	if (resUTCDate < currentUTCDate) {
		return next({
			status: 400,
			message: `${invalidDay} date must be in the future.`
		});
	}

	if (resUTCDate === currentUTCDate && resUTCTime < currentUTCTime) {
		return next({
			status: 400,
			message: `${invalidDay} time must be in the future. resUTCTime:${resUTCTime} currentUTCTime:${currentUTCTime} currentDate:${currentDate} resUTC: ${resUTC}`
		});
	}

	next();
}

const VALID_PROPERTIES = [
	'first_name',
	'last_name',
	'mobile_number',
	'reservation_date',
	'reservation_time',
	'people',
	'status',
	'reservation_id',
	'created_at',
	'updated_at'
];

function hasOnlyValidProperties(req, res, next) {
	const { data = {} } = req.body;

	const invalidFields = Object.keys(data).filter((field) => !VALID_PROPERTIES.includes(field));

	if (invalidFields.length) {
		return next({
			status: 400,
			message: `Invalid field(s): ${invalidFields.join(', ')}`
		});
	}
	next();
}

function peopleIsValid(req, res, next) {
	let people = req.body.data.people;
	if (typeof people !== 'number') {
		return next({
			status: 400,
			message: 'people must be a number'
		});
	}
	next();
}

function statusIsBooked(req, res, next) {
	let { status } = req.body.data;

	if (status) {
		if (status !== 'booked') {
			return next({
				status: 400,
				message: `invalid status, ${status}.`
			});
		}
	}
	next();
}

function validStatus(req, res, next) {
	let { status } = req.body.data;
	let validStates = [ 'booked', 'seated', 'finished', 'cancelled' ];
	if (!validStates.includes(status)) {
		return next({
			status: 400,
			message: `invalid status, ${status}.`
		});
	}
	next();
}

function statusNotFinished(req, res, next) {
	let { status } = res.locals.reservation;
	if (status === 'finished') {
		return next({
			status: 400,
			message: `cannot update finished reservation.`
		});
	}
	next();
}

function statusNotCancelled(req, res, next) {
	let { status } = res.locals.reservation;
	if (status === 'cancelled') {
		return next({
			status: 400,
			message: `cannot change cancelled reservation.`
		});
	}
	next();
}

module.exports = {
	list: asyncErrorBoundary(list),
	create: [
		hasRequiredProperties,
		validDay,
		validTime,
		peopleIsValid,
		hasOnlyValidProperties,
		statusIsBooked,
		asyncErrorBoundary(create)
	],
	read: [ asyncErrorBoundary(reservationExists), asyncErrorBoundary(read) ],
	updateStatus: [
		asyncErrorBoundary(reservationExists),
		validStatus,
		statusNotFinished,
		asyncErrorBoundary(updateStatus)
	],
	edit: [
		asyncErrorBoundary(reservationExists),
		statusNotCancelled,
		hasRequiredProperties,
		validDay,
		validTime,
		peopleIsValid,
		hasOnlyValidProperties,
		statusIsBooked,
		asyncErrorBoundary(edit)
	]
};
