import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createTable } from '../utils/api';
import ErrorAlert from '../layout/ErrorAlert';

function Tables() {
	const history = useHistory();
	const [ errors, setErrors ] = useState([]);
	const [ apiError, setApiError ] = useState(null);

	const initialFormState = {
		table_name: '',
		capacity: ''
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
		setApiError(null);
		const abortController = new AbortController();

		if (handleValidation()) {
			try {
				await createTable({ ...formData, capacity: parseInt(formData.capacity) }, AbortController.signal);
			} catch (e) {
				setApiError(e);
				return () => abortController.abort();
			}
			history.push(`/`);
		} else {
			console.log('rejected');
		}
	};

	function handleValidation() {
		let validationErrors = [];
		let formIsValid = true;

		if (formData.table_name.length < 2) {
			formIsValid = false;
			validationErrors.push(new Error('Table name must be at least 2 characters'));
		}

		if (formData.capacity < 1) {
			formIsValid = false;
			validationErrors.push(new Error('Table capacity must be at least 1'));
		}

		setErrors(validationErrors);
		return formIsValid;
	}

	function cancelHandler() {
		history.goBack();
	}

	return (
		<main>
			{errors.length > 0 && (
				<div className="alert alert-danger"> {errors.map((error) => <p key={error.message}>{error.message}</p>)}</div>
			)}
			<ErrorAlert error={apiError} />
			<div className="card">
				<div className="card-header">New Table</div>
				<form onSubmit={handleSubmit} className="card-body">
					<div className="form-group text-center">
						<div className="form-group row">
							<label htmlFor="name" className="col-md-3 col-form-label">
								Table Name
							</label>
							<div className="col-md-9">
								<input
									type="text"
									className="form-control"
									id="table_name"
									name="table_name"
									onChange={handleChange}
									value={formData.table_name}
									required
								/>
							</div>
						</div>
						<div className="form-group row">
							<label htmlFor="name" className="col-md-3 col-form-label">
								Capacity
							</label>
							<div className="col-md-9">
								<input
									type="number"
									className="form-control"
									id="capacity"
									name="capacity"
									onChange={handleChange}
									value={formData.capacity}
									required
								/>
							</div>
						</div>

						<button type="button" onClick={cancelHandler} className="btn btn-secondary mr-2">
							Cancel
						</button>
						<button type="submit" className="btn btn-primary mr-2">
							Submit
						</button>
					</div>
				</form>
			</div>
		</main>
	);
}

export default Tables;
