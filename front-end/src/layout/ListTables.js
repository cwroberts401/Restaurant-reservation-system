import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { listTables, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";




function ListTables(){
    const history = useHistory();

    const [tables, setTables] = useState([]);
    const [tablesError, setTablesError] = useState(null);

    useEffect(loadTables, []);

    function loadTables() {
      const abortController = new AbortController();
  
      setTablesError(null);
      listTables(abortController.signal)
        .then(setTables)
        .catch(setTablesError);
      return () => abortController.abort();
    }

    function tableStatus(id){
        if (id){
            return "table-secondary text-muted"
        } else { return "table-default"}
      }


    async function finishHandler({target}){
        const result = window.confirm("Is this table ready to seat new guests?")
        if (result) {
            const table_id = target.getAttribute("data-table-id-finish");
            const table = tables.find((table) => table.table_id === Number(table_id));
            const partyId = table.reservation_id;
            const abortController = new AbortController();
            await finishTable(table_id, partyId, abortController.signal);
            history.push("/");
            
        }
    }

    const tableRows = tables.map((table) => (
        <tr key={table.table_id} className={tableStatus(table.reservation_id)}>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td>
                <p data-table-id-status={table.table_id}>
                    {table.reservation_id? "occupied": "free"}
                </p>
            </td>
            <td>
                {table.reservation_id && (
                    <button
                        type = "button"
                        className = "btn btn-success"
                        data-table-id-finish={table.table_id}
                        onClick={finishHandler}
                    >
                        Finish
                    </button>
                )}
            </td>
        </tr>
    ));

    return (
        <>
        <ErrorAlert error={ tablesError }/>
        <div className="table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th scope="col">Table Name</th>
                        <th scope="col">Capacity</th>
                        <th scope="col">Status</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </div>
        </>
    )
}

export default ListTables;