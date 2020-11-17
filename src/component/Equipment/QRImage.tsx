import React, {createRef, useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom'
import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import Dialog from '../Dialog'

const useStyles = makeStyles((theme) => ({
    image : {
        width:400,height:400, margin:'10px auto',
        border:'1px solid gray', borderRadius:'5px'
    }
}));

export default function QRImage(props) {
    const classes = useStyles()
    const {image, onClose = ()=>{}, open} = props
    const [_open, setOpen] = useState(open)
    const refs = createRef<HTMLDivElement>()

    useEffect(() => {
        setOpen(open)
    }, [open])

    return (
        <Dialog
            submitMsg = '프린트'
            type = 'component'
            onSubmit={() => {
                //새탭열어서 이미지 띄운 뒤 print 하는 방법이나을거같음
                const printContents = ReactDOM.findDOMNode(refs.current).innerHTML;
                const nwindow = window.open("", "print", "width=420, height=450, menubar=no, status=no, toolbar=no");
                if(nwindow) {
                    nwindow.document.write(`
                    ${printContents}
                    <script>
                        window.print()
                        setTimeout(() => window.close(), 500)
                    </script>
                    `)
                }

                return true
            }}
            title='QR Image'
            onClose= {() => onClose()}
            defaultState={_open}
        >
            <div ref={refs} ><img className={classes.image} src={`./imgs/${image}`} onError={(e:any) => {
                e.target.onerror=null
                e.target.src = 'https://fakeimg.pl/400x400/?text=No+Image'
            }}/></div>
        </Dialog>
    )
}