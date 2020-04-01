import React from "react";
import { NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MenuIcon from "@material-ui/icons/Menu";
import "./Nav.css";
const useStyles = makeStyles({
	list: {
		width: 250
	}
});

export default function SwipeableTemporaryDrawer() {
	const classes = useStyles();
	const [state, setState] = React.useState({
		left: false
	});

	const toggleDrawer = (side, open) => event => {
		if (
			event &&
			event.type === "keydown" &&
			(event.key === "Tab" || event.key === "Shift")
		) {
			return;
		}

		setState({ ...state, [side]: open });
	};

	const sideList = side => (
		<div
			className={classes.list}
			role="presentation"
			onClick={toggleDrawer(side, false)}
			onKeyDown={toggleDrawer(side, false)}
		>
			<List>
				<NavLink exact to="/" className="item" activeClassName="active"> 
					<ListItem button key={"홈화면"}>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"홈화면"} />
					</ListItem>
				</NavLink>
			</List>
			<List>
				<NavLink exact to="/notice" className="item" activeClassName="active"> 
					<ListItem button key={"공지게시판"}>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={"공지게시판"} />
					</ListItem>
				</NavLink>
			</List>
			<Divider />
			<List>
			</List>
			<Divider />
			<List>
			</List>
		</div>
	);
	return (
		<div>
			<Button onClick={toggleDrawer("left", true)}>
				<MenuIcon className="MenuIcon" />
			</Button>
			<SwipeableDrawer
				open={state.left}
				onClose={toggleDrawer("left", false)}
				onOpen={toggleDrawer("left", true)}
			>
				{sideList("left")}
			</SwipeableDrawer>
		</div>
	);
}
