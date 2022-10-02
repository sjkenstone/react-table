import {
  Grid,
  TextField,
  Paper,
  Button
} from '@mui/material'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {FormControl} from '@mui/material'
import { apiPostService } from '../services'
import SnackBar from './SnackBar'


const Login = ({ setAuthenticated, successMsg, setSuccessMsg, errMsg, setErrMsg, snackState, setSnackState }) => {

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [token, setToken] = useState()

  
  const handleSubmit = async (event) => {
    event.preventDefault()

    // await apiPost('login', {email, password})
    // .then(res => {
    //   const token = res.data.token
    //   localStorage.setItem('token', JSON.stringify(token))
    //   localStorage.setItem('First_Enroll_Time', Date.now())
    //   setToken(token)
    //   setAuthenticated(token)
    //   setEmail('')
    //   setPassword('')
    //   // console.log({token})
    // })
    // .catch(err => {
    //   if (!err?.response) {
    //     // setSnackState(true)
    //     setErrMsg('No Server Response')
    //   } else if (err.response?.status === 422) {
    //     // setSnackState(true)
    //     setErrMsg('Missing Email or Password')
    //   } else if (err.response?.status === 401) {
    //     // setSnackState(true)
    //     setErrMsg('Error Email or Password')
    //   } else {
    //     // setSnackState(true)
    //     setErrMsg('Login Failed')
    //   }
    // })
    // console.log({ errMsg })
    try{
      await apiPostService('login', {
        email, password
      }).then(res => {
        console.log('login response',res.response)
          if(res.response?.status === 422) {
            setSnackState(true)
            setErrMsg('Missing Email or Password')
          } else if (res.response?.status === 401) {
            setSnackState(true)
            setErrMsg('Error Email or Password')
          } else if(res?.data) {
            const token = res?.data.token
              if (token) {
                localStorage.setItem('token', token.token)
                localStorage.setItem('First_Enroll_Time', Date.now())
                setToken(token)
                setEmail('')
                setPassword('')
                setSuccessMsg('Login successfully')
                setSnackState(true)
              }
         }
      })
    } catch (err){
      console.log({err})
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // setAuthenticated(token)
      //Below comes from 'https://app.spiritx.co.nz/api/'
      setAuthenticated(token?.token)
     
    }, 1100)
    return () => clearTimeout(timer)
  }, [setAuthenticated,token])


      return (
        <div className='d-flex justify-content-center p-5'>
          <FormControl>
            <Paper className='p-5' elevation={5}>
              <Grid
                container
                spacing={4}
                direction={'column'}
                justify={'center'}
                alignItems={'center'}
              >
                <Grid item xs={12}>
                  <h2>Login Page</h2>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Email'
                    onChange={(e) => setEmail(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label='Password'
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                  ></TextField>
                </Grid>
                <Grid item xs={12} >
                  <Button
                    type='submit'
                    variant='contained'
                    onClick={(e) => handleSubmit(e)}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </FormControl>
          <SnackBar
            snackState={snackState}
            setSnackState={setSnackState}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
          />
        </div>
      )    
}

Login.proTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login