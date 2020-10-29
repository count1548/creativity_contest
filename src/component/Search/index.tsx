import React, {useState, useEffect} from "react"
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import InputBase from '@material-ui/core/InputBase'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import SearchIcon from '@material-ui/icons/Search'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            border:'1px solid black',
            width: 400,
            margin:'10px auto',
        },
        input: {
            marginLeft: theme.spacing(1),
            flex: 1,
        },
        iconButton: {
            padding: 10,
        },
        divider: {
            margin:'10px auto'
        },
    }),
)

export default function CustomizedInputBase(props) {
    const classes = useStyles()
    const [text, setText] = useState<string>('')
    const { onSearch=()=>{} } = props

    useEffect(()=>{}, [])

    return (
        <div>
            <Paper component="form" className={classes.root}>
                <IconButton className={classes.iconButton} aria-label="menu">
                    <MenuIcon />
                </IconButton>
                <InputBase
                    className={classes.input}
                    placeholder="학번을 입력하시오"
                    inputProps={{ 'aria-label': 'search student id' }}
                    onChange={(e) => setText(e.target.value)}/>
                <IconButton 
                    type="submit" 
                    className={classes.iconButton} 
                    aria-label="search"
                    onClick={(e) => {
                        e.preventDefault()
                        onSearch(text)
                    }}>
                    <SearchIcon />
                </IconButton>
            </Paper>
            
        </div>
    )
}