import React, {useState, useEffect}  from "react"
import Button from '@material-ui/core/Button'
import Dialog from '../Dialog'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mainWarp : {
        borderRadius : '6px',
        background : '#eee',
    },
    warp : {
        padding : '15px 30px',
    },
    header : {
        textAlign : 'center',
        borderBottom : '1px solid grey',
        background:'#376b9f',
        color:'#fff',
    },
    button : {
        display:'block',
        padding : '10',
        margin : '10px auto'
    },
    mainContent : {
        '&:after' : {
            content:'\' \'',
            display:'block',
            clear:'both'
        }
    }
  }),
)

interface containerInterface {
    title : string,
    background? : null | string,
    width : string,
    align : null | 'left' | 'right',
    children : any
}

export default function Container ({
    title = '',
    background = null,
    width='100%',
    align=null,
    children
} : containerInterface) {
    const classes = useStyles()
    const style = {
        width : width,
        ...(align === null) ? null : {float : align},
        ...(background === null) ? null : {background : background}
    }
    return (
        <div className={classes.mainWarp} style={style}>
            <div className={`${classes.warp} ${classes.header}`}>{title}</div>
            <section className={`${classes.warp}`}>
                {children}
            </section>
        </div>
    )
}
