import React, {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import {getUnreadList} from './database_function';
import {commentFormat} from '../database';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

interface user {
    id:number,
    name:string
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    button: { margin: theme.spacing(1), },
  }),
);

export default function ReadTable({bbsid, receiver}) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);

    const [data, setState] = useState<user[] | null>(null)
    useEffect(()=> getUnreadList(bbsid, receiver, setState), [])

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1)  newChecked.push(value);
        else newChecked.splice(currentIndex, 1);

        setChecked(newChecked);
    };
    if(data == null || data.length == 0) {
        return (
            <div className="card my-4">
                <div className="card-body">
                    UNREAD STUDENT LIST
                    nothing
                </div>
            </div>
        )
    }else return (
        <div className="card my-4">
                <div className="card-body">
                    <div style={{marginLeft:'16px'}}>
                        UNREAD STUDENT LIST
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            className={classes.button}
                            endIcon={<Icon>send</Icon>}
                        >PUSH</Button>
                    </div>
                        <List dense className={classes.root}>
                            {data.map((value, idx) => {
                                const labelId = `checkbox-list-secondary-label-${value.id}`;
                                return (
                                    <ListItem key={idx} button>
                                        <ListItemAvatar>
                                            <Avatar
                                            alt={`Avatar n°${value.id}`}
                                            src={`http://placehold.it/50x50.jpg`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText id={labelId} primary={`${value.id} ${value.name}`} />
                                            <ListItemSecondaryAction>
                                            <Checkbox
                                                edge="end"
                                                onChange={handleToggle(value.id)}
                                                checked={checked.indexOf(value.id) !== -1}
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
            </div>
    );
}