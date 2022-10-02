import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
// import axios from 'axios'
import Products from './components/Products'
import Login from './components/Login'
import { apiGetService } from './services'


function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  // const search_params = ['title', 'price']
  const [addNewState, setAddNewState] = useState(false)

  const [successMsg, setSuccessMsg] = useState()
  const [errMsg, setErrMsg] = useState()
  const [snackState, setSnackState] = useState(false) //Snackbar state
  const [authenticated, setAuthenticated] = useState()
  const [csvFile, setCsvFile] = useState()


  
  const fetchData = async () => {
    try {
      await apiGetService('products').then(res => {
        const rawData = res.data.sort((a, b) => b.id - a.id)
        setProducts(rawData)
        setError(null)
      })
    } catch (err) {
      setError(err.message)
      setProducts(null)
    } finally {
      setLoading(false)
    }
  }
  
  // useEffect(() => {
  //   fetchData()
  // }, [])

  // const data = Object.values(products)
  
  // const search_params = Object.keys(Object.assign({}, ...data))

  // const search = (data) => {
  //   const newData = data.filter(
  //     (item) =>
  //       search_params.some((param) =>
  //         item[param].toString().toLowerCase().includes(query)
  //       )
  //   )
  //   return newData
  // }

  // const resetSearch = () => {
  //   setQuery('')
  // }

  const onClickAdd = () => {
    setAddNewState(true)
  }

  const getErrorView = () => {
    return (
      <div className='container'>
        Something went wrong. {error.message}
        <button onClick={() => fetchData(query)}>
          Try again
        </button>
      </div>
    )
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem('token')
    const firstEnrollTime = localStorage.getItem('First_Enroll_Time')
    const nextTimeOpenProducts = Date.now()
    const timeFrame = nextTimeOpenProducts - firstEnrollTime

    if (loggedInUser && (timeFrame < 3600000) ) {
      setAuthenticated(loggedInUser)
    } else {
      setAuthenticated('')
    }
  }, [])
  

    return (
      <div className='container my-4'> 
        <Router>
          <Routes>
            <Route path='/' element={
              authenticated ? 
                <Products 
                  fetchData={fetchData}  
                  error={error} 
                  getErrorView={getErrorView} 
                  loading={loading} 
                  products={products} 
                  setProducts={setProducts} 
                  addNewState={addNewState} 
                  setAddNewState={setAddNewState} 
                  query={query}
                  setQuery={setQuery} 
                  onClickAdd={onClickAdd} 
                  authenticated={authenticated} 
                  setAuthenticated={setAuthenticated} 
                  successMsg={successMsg} 
                  setSuccessMsg={setSuccessMsg} 
                  errMsg={errMsg} 
                  setErrMsg={setErrMsg} 
                  snackState={snackState} 
                  setSnackState={setSnackState} 
                  csvFile={csvFile}
                  setCsvFile={setCsvFile}
                /> 
              : <Navigate to='/login' /> 
              } />
            <Route path='/login' element={
              !authenticated ? 
              <Login setAuthenticated={setAuthenticated} successMsg={successMsg} setSuccessMsg={setSuccessMsg} errMsg={errMsg} setErrMsg={setErrMsg} snackState={snackState} setSnackState={setSnackState} />
              :<Navigate to='/' />
              } />
          </Routes>
        </Router>
      </div>
    )
}

export default App;
