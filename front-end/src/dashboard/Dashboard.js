import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "../reservations/List_Reservations";
import ListTables from "../layout/ListTables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const history = useHistory();

  const query= useQuery().get("date");
  if (query) date = query;

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();

    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // display only booked or seated reservations on dashboard
  const filterStatus = reservations.filter((reservation) => reservation.status !== "finished" && reservation.status !== "cancelled");

  function previousHandler() {
    history.push(`dashboard?date=${previous(date)}`);
  }

  function nextHandler() {
    history.push(`dashboard?date=${next(date)}`);
  }

  function todayHandler() {
    history.push(`dashboard?date=${today(date)}`);
  }

  return (
    <main>
      <div className="btn-group p-2">
        <button type="button" className="btn btn-outline-primary" onClick ={previousHandler}>Previous</button>
        <button type="button" className="btn btn-outline-primary" onClick ={todayHandler}>Today</button>
        <button type="button" className="btn btn-outline-primary" onClick ={nextHandler}>Next</button>
      </div>
      <div className="card my-2">
        <div className="card-header"> <span class="oi oi-calendar"/> Reservations  
          <span class="badge badge-primary text-white ml-2"> {date} </span> 
          <Link to="/reservations/new" className="btn btn-success btn-sm float-right"> + </Link>
        </div>

        <ListReservations reservations={ filterStatus }/>
      </div>
      <ErrorAlert error={ reservationsError }/>
      <div className="card my-2">
        <div className="card-header"> <span class="oi oi-list" /> Tables 
        <Link to="/tables/new" className="btn btn-success btn-sm float-right"> + </Link>   
        </div> 
        <ListTables/>
      </div>
      
    </main>
  );
}

export default Dashboard;
