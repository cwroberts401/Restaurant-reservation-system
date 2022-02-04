import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createReservation, getReservation, editReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";



function Reservations() {
    const history = useHistory();
    const [errors, setErrors] = useState([]);
    const [apiError, setApiError] = useState(null);
    const {reservation_id} = useParams();

    
    let initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    };
    
    const [formData, setFormData] = useState({ ...initialFormState });

    
    useEffect(() => {
        if (reservation_id) {
        async function loadReservation(){
            const abortController = new AbortController();
            const result = await getReservation(reservation_id, abortController.signal);
            setFormData(result);
        
        }
        loadReservation(); }

    },[reservation_id])

    /**
     *     const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
     * 
     */



    

  
      
    const handleChange = ({ target }) => {
        setFormData({
          ...formData,
          [target.name]: target.value,
        });

        if (target.name === "mobile_number"){
            if ((target.value.length === 4 || target.value.length === 8) && target.value.includes("-")){
                console.log("howdy")
                let val;
                target.value.length === 4? val = target.value.slice(0,3): val = target.value.slice(0,7);
                console.log(target.value.slice(0,2))
                setFormData({...formData, [target.name]: val});
            }
            else if ((target.value.length === 3 || target.value.length === 7)){
                    console.log("added")
                    setFormData({...formData, [target.name]:target.value += "-"});
            }
        }

    };

    
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrors([]);
        console.log("hihi")

        if( handleValidation() ){
            if (reservation_id) {
                console.log("hihiHi")
                await editReservation(reservation_id, {...formData, people: parseInt(formData.people)}, AbortController.signal);
                console.log("edited");
                history.push(`/dashboard`);

            } else {
            await createReservation({...formData, people: parseInt(formData.people)}, AbortController.signal);
            console.log("created"); }
            history.push(`/dashboard?date=${formData.reservation_date}`); 
        
        } else {console.log("rejected");};
    }

    function handleValidation(){
        let validationErrors = [];
        let formIsValid = true;

        if (formData.reservation_date === "" || formData.reservation_time === "" ){
            formIsValid = false;
            validationErrors.push(new Error ("Please provide a date and time"));
            setErrors(validationErrors); 
            return formIsValid;

        }

        const currentDate = new Date()
        const currentUTCDate = currentDate.toISOString().slice(0, 10);
        const currentUTCTime = currentDate.toISOString().slice(11, 16);


        // convert reservation date & time to ISO string

        let resUTC = 0;
        let resUTCDate = 0;
        let resUTCTime = 0;
        if (formData.reservation_date.includes("Z")){
            resUTCDate = formData.reservation_date.slice(0, 10);
            formData.reservation_date = resUTCDate;
            resUTCTime = formData.reservation_time.slice(0, 5);
            formData.reservation_time = resUTCTime;
            resUTC = new Date(`${resUTCDate}T${resUTCTime}`);
        } else {
            resUTC = new Date(`${formData.reservation_date}T${formData.reservation_time}`);
            resUTCDate = resUTC.toISOString().slice(0, 10);
            resUTCTime = resUTC.toISOString().slice(11, 16);
        }

        
        if (resUTCDate < currentUTCDate){
            formIsValid = false;
            validationErrors.push(new Error ("You cannont make a reservation in the past"));
        }



        if (resUTCDate === currentUTCDate && resUTCTime < currentUTCTime){
            formIsValid = false;
            validationErrors.push(new Error ("You cannont make a reservation in the past"));
        }


        if (resUTC.getDay() === 2 ){
            formIsValid = false;
            validationErrors.push(new Error ("You cannont make a reservation on Tuesday, restaurant closed"));
        }


        if (formData.reservation_time < "10:30"){
            formIsValid = false;
            validationErrors.push(new Error ("Resturant closed before 10:30 AM"));
        }


        if (formData.reservation_time > "21:30"){
            formIsValid = false;
            validationErrors.push(new Error ("Resturant closed after 9:30 PM"));
        }
        
        console.log(validationErrors)
        setErrors(validationErrors);     
        return formIsValid;
    }

    function cancelHandler() {
        history.goBack();
    }

  return (
    <main>
      {errors.length > 0 && <div  className="alert alert-danger"> {errors.map((error) => (<p>{error.message}</p>))}</div>}
      <ErrorAlert error={ apiError }/>
      <div className="card">
          <div className="card-header"> {reservation_id? "Edit Reservation":"New Reservation"} </div>
      <form onSubmit={handleSubmit} className="card-body">
      
        <div className="container">
        <div className="row justify-content-center mb-4">
          <div className="col-md-4">
            <label htmlFor="first_name" className="form-label mx-2">First Name</label>
            <input type="text" className="form-control mx-2" id="first_name" name="first_name" onChange={handleChange} value={formData.first_name} required/>
          </div>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label mx-2">Last Name</label>
            <input type="text" className="form-control mx-2" id="last_name" placeholder="Smith" name="last_name" onChange={handleChange} value={formData.last_name} required/>
          </div>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label mx-2">Mobile Number</label>
            <input type="tel" className="form-control mx-2" id="mobile_number" placeholder="000-000-0000" name="mobile_number" onChange={handleChange} value={formData.mobile_number} required/>
          </div>
        </div>
        <div className="row justify-content-center mb-4">
          <div className="col-md-4">
            <label htmlFor="name" className="form-label mx-2">Reservation Date</label>
            <input type="date" className="form-control mx-2" id="reservation_date" placeholder="11/11/2022" name="reservation_date" onChange={handleChange} value={formData.reservation_date} required/>
          </div>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label mx-2">Reservation Time</label>
            <input type="time" className="form-control mx-2" id="reservation_time" placeholder="11:10 AM" name="reservation_time" onChange={handleChange} value={formData.reservation_time} required/>
          </div>
          <div className="col-md-4">
            <label htmlFor="name" className="form-label mx-2">People</label>
            <input type="number" className="form-control mx-2" id="people" placeholder="2" name="people" onChange={handleChange} value={formData.people} required/>
          </div>
        </div>
        <div className="row justify-content-center">
        <button type="button" onClick ={cancelHandler} className="btn btn-secondary mr-2"> cancel </button>
        <button type="submit" onClick ={handleSubmit} value="submit" className="btn btn-primary mr-2" > submit </button>
        </div>
        </div>
        </form>
        
      </div>
    </main>
  );
}

/**
 *    if no onclick on submit test 8 doesn't pass
 *    but onclick stops required from working

 */

export default Reservations;