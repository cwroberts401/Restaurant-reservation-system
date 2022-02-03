import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import Reservations from "../reservations/New_Reservation";
import Tables from "../tables/New_Table";
import Seat from "../reservations/Seat_Reservation";
import Search from "../search/search";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import Breadcrumbs from "../utils/breadcrumbs";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <>
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <Breadcrumbs page="New Reservation"/>
        <Reservations />
      </Route>
      <Route exact={true} path="/tables/new">
        <Breadcrumbs page="New Table"/>
        <Tables />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Breadcrumbs page="Seat Reservation"/>
        <Seat />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <Breadcrumbs page="Edit Reservation"/>
        <Reservations />
      </Route>
      <Route path="/dashboard">
        <Breadcrumbs/>
        <Dashboard date={today()} />
      </Route>
      <Route path="/search">
        <Breadcrumbs page="Search"/>
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
    </>
  );
}

export default Routes;
