import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { seatTable, listTables, getReservation } from '../utils/api';

function Seat() {
	const history = useHistory();

	const [ errors, setErrors ] = useState([]);
	const [ tables, setTables ] = useState([]);
	const [ reservation, setReservation ] = useState({});

	const { reservation_id } = useParams();

	useEffect(
		() => {
			async function loadSeatTable() {
				const abortController = new AbortController();

				const tables = await listTables(abortController.signal);
				setTables(tables);
				const reservation = await getReservation(reservation_id, abortController.signal);
				setReservation(reservation);
				return null;
			}
			loadSeatTable();
		},
		[ reservation_id ]
	);

	const initialFormState = {
		table_id: ''
	};

	const [ formData, setFormData ] = useState({ ...initialFormState });

	const handleChange = ({ target }) => {
		setFormData({
			...formData,
			[target.name]: target.value
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		setErrors([]);
		if (handleValidation()) {
			await seatTable(formData.table_id, reservation_id, AbortController.signal);
			history.push(`/`);
		} else {
      return null;
		}
	};

	function handleValidation() {
		let formIsValid = true;
		let validationErrors = [];

		let table = tables.find((element) => element.table_id === Number(formData.table_id));

		if (table?.capacity < reservation.people) {
			validationErrors.push(new Error('Party cannot be larger than table capacity'));
			formIsValid = false;
		}

    if (formData.table_id === "") {
      validationErrors.push(new Error('Please select a table'));
      formIsValid = false;
    }

		setErrors(validationErrors);

		return formIsValid;
	}

	function cancelHandler() {
		history.push('/');
	}

	//populate select with options. occupied tables and tables that are too small are set to disabled={true}
  const options = tables.map((table) => (
		<option
			type="text"
			key={table.table_id}
			value={table.table_id}
			disabled={table && (table.capacity < reservation.people || table.reservation_id !== null)}
		>
			{table.table_name} - {table.capacity}
		</option>
	));

	return (
		<div>
			{errors.length > 0 && (
				<div className="alert alert-danger"> {errors.map((error) => <p key={error.message}>{error.message}</p>)}</div>
			)}
			<div className="card">
				<div className="card-header">
					Seating
					<span class="badge bg-primary text-white">
						{reservation.last_name} party of {reservation.people}
					</span>
				</div>
				<form onSubmit={handleSubmit} className="card-body">
					<div className="form-group text-center">
						<label htmlFor="table_id" />
						<div className="mb-4">
							<select
								name="table_id"
								type="text"
								className="form-control"
								id="table_id"
								onChange={handleChange}
							>
								<option type="text" value="">
									Select table...
								</option>
								{options}
							</select>
						</div>
						<button type="button" className="btn btn-secondary mr-2" onClick={cancelHandler}>
							Cancel
						</button>
						<button type="submit" className="btn btn-primary mr-2">
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default Seat;
