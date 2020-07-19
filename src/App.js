import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./component/Nav/Nav";
import Home from "./routes/Home";
import BusLine from "./routes/BusLine";
import Shuttle from "./routes/Shuttle";
import TimeTable from "./routes/TimeTable";
import Ticket from "./routes/Ticket";
import Login from "./component/Login/Login";
import Logout from "./component/Login/Logout";
import ProtectedRoute from "./component/Auth/protected.route"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	  },
	content: {
	  flexGrow: 1,
	},
  }));

const App = () => {
	const classes = useStyles()
	return ( <Router> <div className={classes.root}>
		<Nav />
		<div className={classes.content}>
			<Switch >
				<Route exact path="/login" component={Login} />	
				<Route exact path="/logout" component={Logout} />
				<Route exact path="/" component={Home} />
				<ProtectedRoute exact path="/busline" component={BusLine} />
                <ProtectedRoute exact path="/shuttle" component={Shuttle} />
                <ProtectedRoute exact path="/ticket" component={Ticket} />
                <ProtectedRoute exact path="/timetable" component={TimeTable} />
				<ProtectedRoute exact path="/timetable/:id" component={TimeTable} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
