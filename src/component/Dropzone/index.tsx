import { DropzoneDialog } from 'material-ui-dropzone'
import React, { useState, useEffect } from 'react';

const Dropzone = ({ onClose, onSave, defaultState }) => {
  const [open, setOpen] = useState(defaultState);
  useEffect(() =>  setOpen(defaultState), [defaultState])
  return (
    <DropzoneDialog
      acceptedFiles={["image/*", "video/*", "application/*"]}
      cancelButtonText={"cancel"}
      submitButtonText={"submit"}
      maxFileSize={5000000}
      open={open}
      onClose={onClose}
      onSave={files => onSave(files)}
      showPreviews={false}
      showFileNamesInPreview={true}
      dialogTitle={'미구현기능'}
    />
  )
}

export default Dropzone