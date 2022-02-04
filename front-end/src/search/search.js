import React, { useState } from 'react';
import { listReservations } from '../utils/api';
import ListReservations from '../reservations/List_Reservations';
import ErrorAlert from '../layout/ErrorAlert';

function Search() {
	const [ searchResults, setSearchResults ] = useState([]);
	const [ noResult, setNoResult ] = useState(false);
	const [ apiError, setApiError ] = useState(null);

	const initialFormState = {
		mobile_number: ''
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
		setApiError(null);
		setSearchResults([]);
		setNoResult(false);
		const abortController = new AbortController();


			try {
				let res = await listReservations(formData, AbortController.signal);
				res.length ? setSearchResults(res) : setNoResult(true);
			} catch (e) {
				setApiError(e);
				return () => abortController.abort();
			}
	};

	return (
		<main>
			<ErrorAlert error={apiError} />
			<div className="card">
				<div className="card-header"> Search </div>
				<form onSubmit={handleSubmit} className="card-body">
					<div className="form-group text-center">
						<div className="input-group mb-4">
							<input
								type="tel"
								className="form-control"
								id="mobile_number"
								name="mobile_number"
								onChange={handleChange}
								value={formData.mobile_number}
								required
								placeholder="Enter a customer's phone number"
							/>
							<div className="input-group-append">
								<button type="submit" className="btn btn-primary">
									Find
								</button>
							</div>
						</div>
					</div>
				</form>
				{searchResults.length > 0 && <ListReservations reservations={searchResults} />}
				<div className="text-center">{noResult && <p>No reservations found</p>}</div>
			</div>
		</main>
	);
}

export default Search;