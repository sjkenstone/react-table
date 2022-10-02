import { Snackbar, Alert } from '@mui/material'


const SnackBar = ({ snackState, setSnackState, errMsg, setErrMsg, successMsg, setSuccessMsg}) => {
  const handleClose = () => {
    setSnackState(false)
    const timer = setTimeout(() => {
      setErrMsg(null)
      setSuccessMsg(null)
    }, 1050)

    return () => clearTimeout(timer)
  }

  return (
    <Snackbar
      anchorOrigin={{ 
        vertical: 'top', 
        horizontal: 'center' 
      }}
      open={snackState}
      autoHideDuration={1000}
      onClose={handleClose}
    >
      <Alert 
        severity={errMsg? 'error' : 'success'}
      >
        {errMsg? errMsg: successMsg}
      </Alert>
    </Snackbar>
  )
}

export default SnackBar