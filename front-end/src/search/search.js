import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ListReservations from "../reservations/List_Reservations";

//implement no results found 

function Search() {
    const [errors, setErrors] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [noResult, setNoResult] = useState(false);

    const initialFormState = {
        mobile_number: "",
    };

    const [formData, setFormData] = useState({ ...initialFormState });
      
    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });
    };
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors([]);
        setSearchResults([]);
        setNoResult(false);

        if( handleValidation() ){
            let res = await listReservations(formData, AbortController.signal);
            res.length ? setSearchResults(res) : setNoResult(true);
            //history.push(`/`);
        
        } else {console.log("rejected");};

   
      
    };

    function handleValidation(){
        let validationErrors = [];
        let formIsValid = true;
        

        setErrors(validationErrors)      
        return formIsValid;
    }


  return (
    <main>
      {errors.length > 0 && <div  className="alert alert-danger"> {errors.map((error) => (<p>{error.message}</p>))}</div>}
      <div className="card">
        <div className="card-header"> Search </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-group text-center">


          <div className="input-group mb-4">
            <input type="tel" className="form-control" id="mobile_number" name="mobile_number" onChange={handleChange} value={formData.mobile_number} required placeholder="Enter a customer's phone number"/>
            <div className="input-group-append">
              <button type="submit" className="btn btn-primary" >Find</button>
            </div>
          </div>

          
          </div>
        </form>
        {searchResults.length > 0 && <ListReservations reservations = { searchResults }/>}
        <div className="text-center">
          {noResult && <p>No reservations found</p>}
        </div>
        </div>
    </main>
  );
}

export default Search;

/**
 * <div>
        {errors.length > 0 && <div  className="alert alert-danger"> {errors.map((error) => (<p>{error.message}</p>))}</div>}
        <div className="card">
        <div className="card-header"> Seating <span class="badge bg-primary text-white"> {reservation.last_name} party of {reservation.people} </span> </div>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="form-group text-center">
            <label htmlFor="table_id"></label>
            <div className="mb-4">
              <select
                name="table_id"
                type="text"
                className="form-control"
                id="table_id"
                onChange={handleChange}
              >
                <option type="text" value="{Select Table...}">
                  Select table...
                </option>
                {options}
              </select>
            </div>
            <button
              type="cancel"
              className="btn btn-secondary mr-2"
              onClick={cancelHandler}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary mr-2">
              Submit
            </button>
          </div>
        </form>
        </div>
      </div>
 */