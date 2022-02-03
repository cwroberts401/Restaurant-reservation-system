import React from "react";
import { Link } from "react-router-dom";

function Breadcrumbs({page}){

    function links(page){
        if (!page) {
        return (
            <li className="breadcrumb-item active"> Dashboard </li>
        )
    } else {
        return (
            <>
            <li className="breadcrumb-item"><Link to="/"> Dashboard </Link></li>
            <li className="breadcrumb-item active"> {page} </li>
            </>
        )
    }
    }

    
    return (
    <ol className="breadcrumb my-4">
      {links(page)}
    </ol>
    )

}


export default Breadcrumbs;