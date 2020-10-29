import React, {useState, useEffect } from 'react'
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    header : {
        fontSize:'24px',
        marginBottom:'20px',
        fontFamily:'NanumSquareRoundEB',
        fontWeight: 'bold',
        color:'#2c537a',
        textAlign:'center'
    },
}));

const Notice = props => {
    const classes = useStyles()

    const Header = () => <div className={classes.header}>공지사항</div>


    return (
        <div>
            <Header/>
        </div>
    )
}

export default Notice