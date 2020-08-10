import React from "react";
import { NavLink, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import Auth from '../Auth/auth'
import Drawer from '@material-ui/core/Drawer';


import '../../style/font.css'
import "./Nav.css";

//const useStyles = makeStyles({ list: { width: 250 } });
const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX:'hidden',
    backgroundColor:'#2c537a'
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
    {name : "정류장관리", path : "/stoplist"},
    {name : "예매내역", path : "/ticket"},
]

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles()
	return(
		<div>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{paper: classes.drawerPaper,}}
				anchor="left"
			>
        <div className='MuiList-script'>
          <div className='MuiList-main script'>HUB</div>
          <div className='MuiList-sub script'>관리자 페이지</div>
          {Auth.isAuthenticated() ? 
            <Button variant="contained" className='script' onClick={Auth.logout}>Logout</Button> : 
            <Link to='/login'><Button variant="contained" className='script'>Login</Button></Link>}
        </div>
				
				<div className={classes.toolbar} />
				<List>
				{navList.map((item, idx) =>
            <NavLink exact to={item.path} activeClassName="active" key={idx}>
                <ListItem className="item" key={item.name}>
                  <ListItemText primary={item.name} />
                </ListItem>
            </NavLink>
        )}
				</List>
			</Drawer>

		</div>
  )
}
