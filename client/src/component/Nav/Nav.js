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
const useStyles = makeStyles({ list: { width: 250 } });

const navList = [
    {name : "홈화면",  path : "/"},
    {name : "노선", path : "/busline"},
	{name : "시간표", path : "/timetable"},
    {name : "정류장", path : "/busstop"},
    {name : "예매내역", path : "/ticket"},
]

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
			onKeyDown={toggleDrawer(side, false)}>
            {
                navList.map((item, idx) =>
                    <List key={idx}>
                        <NavLink exact to={item.path} className="item" activeClassName="active"> 
                            <ListItem button key={item.name}>
                                <ListItemIcon>
                                    <InboxIcon />
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItem>
                        </NavLink>
                    </List>
                )
            }
			<Divider />
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
