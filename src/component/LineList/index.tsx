/*eslint-disable */
import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction
  } from "@material-ui/core";
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Alert from '@material-ui/lab/Alert'

const useStyles = makeStyles((theme : Theme) => createStyles({
    root: {
        margin: '0px auto'
    },
    cardHeader: { 
        border:'2px solid grey',
        padding: theme.spacing(1, 2)
    },
    list: {
        width: 400,
        height: '300px',
        backgroundColor: 'powderblue',
        overflow: 'auto'
    },
    button: {
        margin: theme.spacing(0.5, 0)
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(2, 4, 3),
    },
    submit : {
        display : 'block',
        margin : '10px auto'
    },
}))

function not(a : number[], b : number[]) {
    return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a : number[], b : number[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a : number[], b : number[]) {
    return [
        ...a,
        ...not(b, a)
    ];
}

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const getItemStyle = (isDragging, draggableStyle) => ({
// styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
        background: "rgb(235,235,235)"
    })
});

interface listProps {
    dataLabels ? : Object | null,
    chData : any[],
    allData : any[],
    title : string,
    onSubmit (list : any[]) : any
}

export default function TransferList({dataLabels = null, chData, allData, title, onSubmit} : listProps) {
    const [checked, setChecked] = React.useState<number[]>([])
    const [left, setLeft] = React.useState<any[]>([]);
    const [right, setRight] = React.useState<any[]>([])
    
    React.useEffect(()=> {
        setLeft(chData)
        setRight(allData.filter(value => !chData.includes(value)))
    }, [...chData, ...allData])

    const classes = useStyles()
    const leftChecked = intersection(checked, left)
    const rightChecked = intersection(checked, right)

    const handleToggle = (value : number) => () => { 
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    }

    const numberOfChecked = (items : number[]) => intersection(checked, items).length;

    const handleToggleAll = (items : number[]) => () => {
        if (numberOfChecked(items) === items.length) setChecked(not(checked, items)) 
        else setChecked(union(checked, items)) 
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    const onDragEnd = (result, type) => {
        // dropped outside the list
        if (!result.destination) return
        
        if( type === title ) {
            const items = reorder(
                left,
                result.source.index,
                result.destination.index
            );
            setLeft(items);
        }
        else {
            const items = reorder(
                right,
                result.source.index,
                result.destination.index
            );
            setRight(items);
        }
    }

    const customList = (title : React.ReactNode, items : number[]) => (
        <Card>
            <CardHeader
                className={classes.cardHeader}
                avatar={   
                    <Checkbox
                        onClick = { handleToggleAll(items) }
                        checked = { numberOfChecked(items) === items.length && items.length !== 0 }
                        indeterminate = { numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0 }
                        disabled = { items.length === 0 }
                        inputProps = {{ 'aria-label': 'all items selected' }}
                />}
                title={title}
                subheader={`${numberOfChecked(items)}/${items.length} selected`}/>
            <Divider/>
            <DragDropContext onDragEnd={(res) => onDragEnd(res, title)}>
                <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <RootRef rootRef={provided.innerRef}>
                        <List className={classes.list} dense component="div" role="list">
                            {
                                items.map((value, idx) => (
                                    <Draggable key={value} draggableId={value} index={idx}>
                                      {(provided, snapshot) => {   
                                        const labelId = `transfer-list-all-item-${value}-label`;                                       
                                        return (
                                        <ListItem
                                            ContainerComponent="li"
                                            ContainerProps={{ ref: provided.innerRef }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                            onClick={handleToggle(value)}
                                            >
                                            <ListItemIcon>
                                                <Checkbox
                                                    checked={checked.indexOf(value) !== -1}
                                                    tabIndex={-1}
                                                    disableRipple
                                                    inputProps={{
                                                        'aria-labelledby' : labelId
                                                }}/>
                                            </ListItemIcon>
                                            <ListItemText primary={(dataLabels !== null) ? dataLabels[value] : value} />
                                            <ListItemSecondaryAction/>
                                        </ListItem>)
                                    }}
                                    </Draggable>
                                ))
                            }
                            <ListItem/>
                            {provided.placeholder}
                        </List>
                    </RootRef>
                )}
                </Droppable>
            </DragDropContext>
        </Card>
    )
    return (
        <div className={classes.paper}>
            <Grid
                container
                spacing={2}
                justify="center"
                alignItems="center"
                className={classes.root}>
                <Grid item>{customList(title, left)}</Grid>
                <Grid item>
                    <Grid container direction="column" alignItems="center">
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedRight}
                            disabled={leftChecked.length === 0}
                            aria-label="move selected right">
                            &gt;
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className={classes.button}
                            onClick={handleCheckedLeft}
                            disabled={rightChecked.length === 0}
                            aria-label="move selected left">
                            &lt;
                        </Button>
                    </Grid>
                </Grid>
                <Grid item>{customList('ALL', right)}</Grid>
            </Grid>
            <Button 
                variant="contained" 
                color="primary" 
                className={classes.submit}
                onClick={()=>onSubmit(left)}>Submit</Button>
            <Alert variant="outlined" severity="warning">
                {"첫 or 마지막 정류장은 항상 캠퍼스여야 하며, 하나 이상의 경유지가 존재해야 합니다."}
            </Alert>
        </div>
    );
}