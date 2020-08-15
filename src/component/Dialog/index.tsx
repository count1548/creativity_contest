import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog({
  onSubmit=()=>{}, onExit=()=>{},
    children = 'default content',
    submitMsg = 'OK', resetMsg = 'Exit', 
    type = 'text',
    title = 'Dialog',
    defaultState = false,
}) { 
  const [open, setOpen] = useState(defaultState);
  useEffect(() =>  setOpen(defaultState), [defaultState])

  const handleClose = () => setOpen(false)

  return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        {(type === 'component') ? children : <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {children}
          </DialogContentText>
        </DialogContent>}
        <DialogActions>
          <Button onClick={()=>{
            onSubmit()
            handleClose()
          }} color="primary" autoFocus>
            {submitMsg}
          </Button>
          <Button onClick={()=>{
            onExit()
            handleClose()
          }} color="primary">
            {resetMsg}
          </Button>
        </DialogActions>
      </Dialog>
  );
}