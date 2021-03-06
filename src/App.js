import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Nav from "./component/Nav/Nav";

import EquipList from "./routes/EquipList";
import CheckLog from "./routes/CheckLog";
import ManageMap from "./routes/ManageMap";
import MapLayout from "./routes/MapLayout";

import Home from "./routes/Home";
import Login from "./routes/Login";

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
				<ProtectedRoute exact path="/" component={Home} />
				<ProtectedRoute exact path="/equiplist" component={EquipList} />
				<ProtectedRoute exact path="/checklog" component={CheckLog} />
				<ProtectedRoute exact path="/managemap" component={ManageMap} />
				<ProtectedRoute exact path="/all_equip" component={MapLayout} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
				
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
