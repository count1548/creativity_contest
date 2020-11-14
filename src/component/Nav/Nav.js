import React, {useState} from "react";
import { NavLink, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from '@material-ui/core/Button';
import Auth from '../Auth/auth'
import Drawer from '@material-ui/core/Drawer';
import Dialog from '../Dialog'
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import '../../style/font.css'
import "./Nav.css";

//const useStyles = makeStyles({ list: { width: 250 } });
const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  drawer: {
    position:'relative',
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    overflowX:'hidden',
    backgroundColor:'#de1f2f'
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
  {name : "홈화면", path : "/"},
  {name : "장비관리", path : "/equiplist"},
  {name : "점검기록", path : "/checklog"},
]

const CopyrightInfo = (props) => {
  const {open, onClose} = props
  return (
    <Dialog
      title='Copyright'
      type='component'
      defaultState={open}
      onClose={onClose}>
      <div style = {{
        margin : '1.5rem',
        lineHeight: '1.5rem',
        padding : '1.2rem',
        backgroundColor:'#eee',
        borderRadius:'5px',
      }}>
        Copyright © 2020 HoseoGuard<br/>
        Copyright © 2020 Material-UI<br/>
        Copyright © 2020 icon-icons.com<br/>
        Copyright © 2010-2020 Freepik Company S.L<br/>
      </div>
    </Dialog>
  )
}

const tockenItem = (arr, idx) => {
  const cpArr = arr.slice()
  return cpArr.map((open, i) => 
    (idx === i) ? !open : false
  )
}

export default function SwipeableTemporaryDrawer() {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState([])

	return(
		<div>
			<Drawer
				className={classes.drawer}
				variant="permanent"
				classes={{paper: classes.drawerPaper,}}
				anchor="left"
			>
        <div className='MuiList-script'>
          <div className='MuiList-main script'>HoseoGuard</div>
          <div className='MuiList-sub script'>관리자 페이지</div>
          {Auth.isAuthenticated() ? 
            <Button variant="contained" className='script' onClick={Auth.logout}>Logout</Button> : 
            <Link to='/login'><Button variant="contained" className='script'>Login</Button></Link>}
        </div>
				
				<div className={classes.toolbar} />
				<List>
				{navList.map((item, idx) => {
          const haveSubMenu = typeof(item.path) === 'object'
          if(haveSubMenu) drop.push(false)
          const inner_component = <ListItem className="item" key={item.name} 
            onClick = {haveSubMenu ? ()=>setDrop(tockenItem(drop, idx)) : null}>
          <ListItemText primary={item.name} />
          {haveSubMenu ? ( drop[idx] ? 
            <ExpandLess onClick={()=>setDrop(tockenItem(drop, idx))}/> : 
            <ExpandMore onClick={()=>setDrop(tockenItem(drop, idx))}/> ) : null}
        </ListItem>
          const item_component = [
            (haveSubMenu) ? inner_component : 
            <NavLink exact to={item.path} activeClassName="active" key={idx}>
              {inner_component}
            </NavLink>]
          if(haveSubMenu) {
            item_component.push(
              <Collapse in={drop[idx]} timeout="auto" unmountOnExit key={item.name + idx}>
                {item.path.map((sub, idx2) => (
                  <NavLink exact to={sub.path} activeClassName="active" key={idx2}>
                    <ListItem className="item sub-item" key={sub.name}>
                      <ListItemText primary={sub.name} />
                    </ListItem>
                  </NavLink>
                ))}
              </Collapse>
            )
          }
          return item_component
        })}
				</List>
        <div className='copyright' onClick={()=>setOpen(true)}>
          Copyright © 2020 HoseoGuard <br/><br/>Click more information
        </div>
			</Drawer>
      <CopyrightInfo 
        open={open}
        onClose={()=>setOpen(false)}
        />
		</div>
  )
}
