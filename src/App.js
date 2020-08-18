import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./component/Nav/Nav";
import BusLine from "./routes/BusLine";
import Shuttle from "./routes/Shuttle";
import Ticket from "./routes/Ticket";
import StopList from "./routes/StopList";
import ShuttleStopList from "./routes/ShuttleStopList";
import Login from "./component/Login/Login";
import ProtectedRoute from "./component/Auth/protected.route"
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	  },
	content: {
		flexGrow: 1,
		width : '95%',
		margin:'0 auto',
		minWidth:'1000px',
		padding: '30px',
	},
  }));

const App = () => {
	const classes = useStyles()
	return ( <Router> <div className={classes.root}>
		<Nav/>
		<div className={classes.content}>
			<Switch >
				<Route exact path="/login" component={Login} />	
				<ProtectedRoute exact path="/" component={BusLine} />
				<ProtectedRoute exact path="/busline" component={BusLine} />
                <ProtectedRoute exact path="/shuttle" component={Shuttle} />
                <ProtectedRoute exact path="/ticket" component={Ticket} />
				<ProtectedRoute exact path="/stoplist" component={StopList} />
				<ProtectedRoute exact path="/shuttlestoplist" component={ShuttleStopList} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
