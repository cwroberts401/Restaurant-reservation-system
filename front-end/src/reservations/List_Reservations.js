import React from "react";
import { updateTableStatus } from "../utils/api";
import { Link, useHistory } from "react-router-dom";


function ListReservations({ reservations }){
    const { push } = useHistory();

    function cancelHandler({target}) {
        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
        if (result) {
            const abortController = new AbortController();
            const reservation_id = target.getAttribute("data-reservation-id-cancel");
            updateTableStatus(reservation_id, "cancelled", abortController.signal);
            push("/");
        }
      }

      function timeConverter(time){
          let hours = time.slice(0,2);
          let minutes = time.slice(3,5);
          if (Number(hours) > 12){
            hours = Number(hours) - 12;
            return `${hours}:${minutes} PM`
          }
          return `${hours}:${minutes} AM`
      }

      function reservationStatus(status){
          if (status === "cancelled"){
              return "table-secondary"
          } else { return "table"}
      }

      function disableButtons(status, reservation_id){
        if (status !== "booked"){
            return(
                <div className="btn-group" >
                <button type="button" className="btn btn-warning" disabled={true}>
                  Edit
                </button>
                <button type="button" className="btn btn-danger" disabled={true}>
                  Cancel
                </button>
                </div>
            )

        } else {
            return (
                <div className="btn-group" >
                <Link to={`/reservations/${reservation_id}/edit`} type="button" className="btn btn-warning">
                  Edit
                </Link>
                <button type="button" className="btn btn-danger" data-reservation-id-cancel={reservation_id} value={reservation_id} onClick={cancelHandler}>
                  Cancel
                </button>
                </div>
            )
        }
      }

      function seatButton(status, reservation_id){
          if (status === "booked"){
              return (
                    <Link to={`/reservations/${reservation_id}/seat`} type="button" className="btn btn-success" >
                        Seat
                    </Link>
              )
          } else { return null }
      }


      const tableRows = reservations.map(
        ({
          reservation_id,
          first_name,
          last_name,
          mobile_number,
          people,
          status,
          reservation_time,
        }) => (
          <tr key={reservation_id} className={reservationStatus(status)}>
            <td> {first_name} {last_name} </td>
            <td>{mobile_number}</td>
            <td>{people}</td>
            <td>
              <p data-reservation-id-status={reservation_id}>{status}</p>
            </td>
            <td>{timeConverter(reservation_time)}</td>
            <td>        
                {seatButton(status, reservation_id)}
            </td>
            <td>
            {disableButtons(status, reservation_id)}
            </td>
          </tr>
        )
      );

    return (
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">People</th>
                        <th scope="col">Status</th>
                        <th scope="col">Time</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
    )
}

export default ListReservations;