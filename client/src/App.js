import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./component/Nav/Header";
import Home from "./routes/Home";
import Notice from "./routes/Notice";
import Login from "./component/Login/Login";
import Logout from "./component/Login/Logout";
import NewNotice from "./component/Notice/NewNotice";
import ViewNotice from "./component/Notice/ViewNotice";
import ProtectedRoute from "./component/Auth/protected.route"

const App = () => {
	return ( <Router> <div>
		<Header />
		<div>
			<Switch>
				<Route exact path="/login" component={Login} />	
				<Route exact path="/logout" component={Logout} />	
				<Route exact path="/" component={Home} />
				<ProtectedRoute exact path="/notice" component={Notice} />
				<ProtectedRoute exact path="/view_notice/:id" component={ViewNotice} />
				<ProtectedRoute exact path="/new_notice/:id" component={NewNotice} />
				<Route path="*" component={() => "404 NOT FOUND 정확한 URL입력하세요"} />
			</Switch>
		</div>
	</div> </Router> );
};
export default App;
