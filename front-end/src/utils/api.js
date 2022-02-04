/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL;

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}
export async function createReservation(reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  const body = JSON.stringify({ data: reservation });
  return await fetchJson(url,{headers, signal, method: "POST", body}, []);
}

export async function editReservation(reservation_id, reservation, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  const body = JSON.stringify({ data: reservation });
  console.log("edit body", body)
  return await fetchJson(url,{headers, signal, method: "PUT", body}, []);
}

export async function createTable(table, signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  const body = JSON.stringify({ data: table });
  return await fetchJson(url,{headers, signal, method: "POST", body}, []);
}

export async function listTables(signal) {
  const url = new URL(`${API_BASE_URL}/tables`);
  return await fetchJson(url, { headers, signal }, []);
}

export async function seatTable(tableId, reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const body = JSON.stringify({ data: {reservation_id: reservationId } });
  return await fetchJson(url, {headers, signal, method: "PUT", body});
}

export async function finishTable(tableId, reservationId, signal) {
  const url = new URL(`${API_BASE_URL}/tables/${tableId}/seat`);
  const body = JSON.stringify({ data: {reservation_id: reservationId } });
  await fetchJson(url, {headers, signal, method: "DELETE", body});
  return null;
}

export async function updateTableStatus(tableId, status, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${tableId}/status`);
  const body = JSON.stringify({data: { status: status } });
  //console.log("status body: ", body)
  await fetchJson(url, {headers, signal, method: "PUT", body});
  return null;
}

export async function search(mobile_number, signal) {
  const url = new URL(`${API_BASE_URL}/reservations?mobile_phone${mobile_number}`);
  const data = await fetchJson(url, {headers, signal, method: "GET"});
  return data;
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

export async function getReservation(reservation_id, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservation_id}`);
  return await fetchJson(url,{headers, signal, method: "GET"});
}