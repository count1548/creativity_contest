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

import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';

import "./Nav.css";

//const useStyles = makeStyles({ list: { width: 250 } });
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
	flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const navList = [
    {name : "홈화면",  path : "/"},
    {name : "통학버스", path : "/busline"},
    {name : "셔틀버스", path : "/shuttle"},
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
	return(
		<div>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{paper: classes.drawerPaper,}}
				anchor="left"
			>
				<img src="/logo_type.png" alt="logo" style={{"display":"block", "margin" : '10px auto'}}></img>
				<NavLink to="/login">
					<Button color="inherit">Login</Button>
				</NavLink>
				<NavLink to="/logout">
					<Button color="inherit">logout</Button>
				</NavLink>
				<div className={classes.toolbar} />
				<Divider />
				<List>
				{navList.map((item, idx) =>
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
                )}
				</List>
			</Drawer>

		</div>
	)
}
