import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./component/Nav/Header";
import Home from "./routes/Home";
import BusLine from "./routes/BusLine";
import BusStop from "./routes/BusStop";
import TimeTable from "./routes/TimeTable";
import Ticket from "./routes/Ticket";
import Login from "./component/Login/Login";
import Logout from "./component/Login/Logout";
import ProtectedRoute from "./component/Auth/protected.route"

const App = () => {
	return ( <Router> <div>
		<Header />
		<div> 
			<Switch>
				<Route exact path="/login" component={Login} />	
				<Route exact path="/logout" component={Logout} />	
				<Route exact path="/" component={Home} />
				<ProtectedRoute exact path="/busline" component={BusLine} />
                <ProtectedRoute exact path="/busstop" component={BusStop} />
                <ProtectedRoute exact path="/ticket" component={Ticket} />
                <ProtectedRoute exact path="/timetable" component={TimeTable} />
				<ProtectedRoute exact path="/timetable/:id" component={TimeTable} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
