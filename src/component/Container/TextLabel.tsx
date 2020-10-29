import React, {useState, useEffect}  from "react"
import Button from '@material-ui/core/Button'
import Dialog from '../Dialog'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root : {
        lineHeight:'3em',
    },
    header : {
        display : 'inline-block',
        borderLeft : '10px solid #555',
        paddingLeft : '8px',

        width : '40%',
    },
    content : {
        color : 'grey'
    },
  }),
)

export default function Container ({
    label, children
}) {
    const classes = useStyles()
    if(children === null) children = '정보없음'
    return (
        <div className={classes.root}>
            <span className={classes.header}>{label}</span>
            <span className={classes.content}>{children}</span>
        </div>
    )
}
