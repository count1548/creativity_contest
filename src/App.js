import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./component/Nav/Nav";
import UserShuttlePage from "./routes/UserShuttlePage";

import BusLine from "./routes/BusLine";
import Notice from "./routes/Notice";
import Shuttle from "./routes/Shuttle";
import Ticket from "./routes/Ticket";
import StopList from "./routes/StopList";
import ShuttleStopList from "./routes/ShuttleStopList";
import Login from "./routes/Login";
import UserManage from './routes/UserManage'
import AccountManage from './routes/AdminPage'


import ProtectedRoute from "./component/Auth/protected.route"
import { makeStyles } from "@material-ui/core/styles";
import Auth from './component/Auth/auth'


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
		{Auth.isAuthenticated() ? <Nav/> : null}
		<div className={classes.content}>
			<Switch >
				<Route exact path="/login" component={Login} />	
				<Route exact path="/user/shuttle" component={UserShuttlePage} />	
				<ProtectedRoute exact path="/" component={BusLine} />
				<ProtectedRoute exact path="/busline" component={BusLine} />
                <ProtectedRoute exact path="/shuttle" component={Shuttle} />
                <ProtectedRoute exact path="/ticket" component={Ticket} />
				<ProtectedRoute exact path="/stoplist" component={StopList} />
				<ProtectedRoute exact path="/shuttlestoplist" component={ShuttleStopList} />
				<ProtectedRoute exact path="/account" component={AccountManage} />
				<ProtectedRoute exact path="/usermanage" component={UserManage} />
				<ProtectedRoute exact path="/notice" component={Notice} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
