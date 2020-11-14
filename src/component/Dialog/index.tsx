import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({
  onSubmit=()=>true, onExit=()=>true,
    children,
    submitMsg = '확인', resetMsg = '나가기', 
    type = 'text',
    title = 'Dialog',
    onClose = ()=>{},
    defaultState = false,
}) { 
  const [open, setOpen] = useState(defaultState);
  useEffect(() =>  setOpen(defaultState), [defaultState])

  const handleClose = () => {
    setOpen(false)
    onClose()
  }

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xl'}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        {(type === 'component') ? <div style={{padding : '20px'}}>{children}</div> : <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>}
        <DialogActions>
          <Button onClick={()=>{
            if(onSubmit()) handleClose()
          }} color="primary" autoFocus>
            {submitMsg}
          </Button>
          <Button onClick={()=>{
            if(onExit()) handleClose()
          }} color="primary">
            {resetMsg}
          </Button>
        </DialogActions>
      </Dialog>
  );
}