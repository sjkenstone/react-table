import React, { useState, useEffect } from 'react'
import { 
  Table,
  TableBody,
  TableCell,
  TableSortLabel,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  CircularProgress
} from '@mui/material'
import Product from './Product'
import RowEdit from './RowEdit'
import SearchBar from './SearchBar'
import SnackBar from './SnackBar'
import { apiDeleteService, apiPutService } from '../services'


const Products = ({ fetchData, error, getErrorView, loading, search, products, setProducts, addNewState, setAddNewState, setQuery, resetSearch, onClickAdd, snackState, setSnackState, authenticated, setAuthenticated, successMsg, setSuccessMsg, errMsg, setErrMsg, csvFile, setCsvFile  }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const [isEditing, setIsEditing] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [orderPriceDirection, setOrderPriceDirection] = useState('asc')
  const [orderTitleDirection, setOrderTitleDirection] = useState('asc')
  //state for edit row inputs
  const [editRow, setEditRow] = useState({})
  const [deleteRow, setDeleteRow] = useState({})


  const [image, setImage] = useState()
  let bodyFormData = new FormData()

  useEffect(() => {
    fetchData()
  }, [])


  const changeEditState = (product) => {
    if (product.id === editRow.id) {

      setIsEditing(!isEditing) 
      
      
    } else if(isEditing === false) {
      setIsEditing(!isEditing)
    }
  }

  const changeDeleteState = (product) => {
    if (product.id === deleteRow.id) {
      setIsDelete(!isDelete)
    } else if(isDelete === false) {
      setIsDelete(!isDelete)
    }
  }

  //capture the product wanting to edit, set to state
  const captureEdit = (mode, clickedProduct) => {
    let filtered = products.filter((product) => product.id === clickedProduct.id)

    if (mode === 'edit') {
      setEditRow(filtered[0])
    }

    if (mode === 'delete') {
      setDeleteRow(filtered[0])
    }
  }

  //cancel edit mode
  const onClickCancel = (mode, item) => {
    
    if(mode === 'cancelEdit') {
      setIsEditing(false)
      setImage(undefined)
      //editRow store the previous data
      setProducts(state => {
        return products.map(product => {
          if (item.id === product.id) {
            return editRow
          }
          return product
        })
      })
    }

    if(mode === 'cancelDelete') {
      setIsDelete(false)
    }

    if( mode === 'cancelAdd') {
      setAddNewState(false)
    }
  }

  const onClickSaveBtn = async (mode, item) => {

    if(mode === 'edit') {
      setIsEditing(false)
      console.log({products})

      products.map(product => {
        if(item.id === product.id) {
          bodyFormData.append('title', product.title)
          bodyFormData.append('description', product.description)
          bodyFormData.append('price', product.price)
          bodyFormData.append('category_id', product.category_id)
          bodyFormData.append('is_active', 1)
          if (image !== undefined) {
            bodyFormData.append('product_image', image)
          }
          bodyFormData.append('_method', 'put')
        }
        return product
      })
      //Save edit item
      try {
        await apiPutService(`product/${item.id}`,
          bodyFormData,
        ).then(res =>{
          if (res.response?.status !== 400 && res.response?.status !== 500 && res.response?.status !== 403 ) {
            setProducts(state => {
              return products.map(product => {
                if (item.id === product.id) {
                  return { ...product, 'product_image': res.data.product_image }
                }
                return product
              })
            })
            setSnackState(true)
            setSuccessMsg('Success')
            setImage(undefined)
          } else {
            setSnackState(true)
            setErrMsg('Failed')
          }
        })
      } catch (err) {
        console.log({ err })
      }
    }

    
    if(mode === 'delete') {
      setIsDelete(false)

      try {
        await apiDeleteService(`product/${item.id}`
        ).then(res => {
          console.log('From apiPostService', {res})
          if (res.response?.status !== 400 && res.response?.status !== 500 && res.response?.status !== 403 ) {
              const filteredProducts = products.filter((product) => {
                if (item.id !== product.id) {
                  return true
                }
                return false
              })
              setSnackState(true)
              setSuccessMsg('Success')
              setProducts(filteredProducts)
            } else if (res.response.status === 403) {
              setSnackState(true)
              setErrMsg('Time out, please log out')
            } else {
              setSnackState(true)
              setErrMsg('Failed')
              console.log('Product delete failed')
            }
            
        })
      } catch (err) {
        console.log({err})
      }
    }
  }

  const handleChange = (e, item) => {
    setProducts(state => {
      return products.map(product => {
        if(item.id === product.id) {
            return { ...product, [e.target.name]: e.target.value }
          }
        return product 
      })
    })
  }

  const handleChangeImage = (e, item) => {
    // const filePath = e.target.value
    // const name = e.target.name
    // const fileName = 'images/' + filePath.replace(/^.*[\\\/]/, '')
    setImage(e.target.files[0])
    console.log({ image })
    // setProducts(state => {
    //   return products.map(product => {
    //     if (item.id === product.id) {
    //       return { ...product, [name]: fileName}
    //     }
    //     return product
    //   })
    // })
  }

  const priceSort = (arr, orderBy) => {
    switch(orderBy) {
      case 'asc': 
      default:
        return arr.sort((a, b) => Number(a.price) - Number(b.price))
      case 'desc':
        return arr.sort((a, b) => Number(b.price) - Number(a.price))
    }
  }

  const titleSort = (arr, orderBy) => {
    switch(orderBy) {
      case 'asc':
      default:
        return arr.sort((a, b) => a.title.localeCompare(b.title))
      case 'desc':
        return arr.sort((a, b) => b.title.localeCompare(a.title))
    }
  }

  const handleSortRequest = (type) => {
        if(type === 'priceSort') {
          setProducts(priceSort(products, orderPriceDirection))
          setOrderPriceDirection(orderPriceDirection === 'asc' ? 'desc' : 'asc')
        }
        if(type === 'titleSort') {
          setProducts(titleSort(products, orderTitleDirection))
          setOrderTitleDirection(orderTitleDirection === 'asc' ? 'desc' : 'asc')
        }
  }

  const searchResLength = search(products).length
  useEffect(() => {
    // if (searchResLength <= rowsPerPage && page > 0) {
    setPage(0)
    // }
  }, [searchResLength])
  
  const handleChangePage = (_event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, products.length - page * rowsPerPage)

  //if no row data in table, then switch to 0 page  
  // useEffect(() => {
  //   if (emptyRows === 5) {
  //     setPage(0)
  //   }
  // }, [emptyRows])

  const handleLogout = () => {
    localStorage.clear()
    setSnackState(true)
    setSuccessMsg('Logging out')
    setErrMsg('')
    const timer = setTimeout(() => {
      setAuthenticated('')      
    }, 1100)
    return () => clearTimeout(timer)
  }

  const tableHeadStyled = {
    backgroundColor: '#1565c0',
    color: '#fff',
    fontSize: '18px'
  }

  const tableSortLabelStyled = {
    '&.MuiTableSortLabel-root': {
      color: '#fff',
    },
    '& .MuiTableSortLabel-icon': {
      color: '#fff !important',
    }
  }


  if (error) {
    return getErrorView()
  } else if (loading) {
    return (
      <div>
        Loading page
        <CircularProgress 
          size={30}
        />
      </div>)
  } else {
    return (
      <div>
        <SearchBar csvFile={csvFile} setCsvFile={setCsvFile} setQuery={setQuery} resetSearch={resetSearch} onClickAdd={onClickAdd} products={products} setProducts={setProducts} isEditing={isEditing} />
        <Paper elevation={20}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeadStyled}>Actions</TableCell>
                  <TableCell sx={tableHeadStyled} onClick={() => handleSortRequest('titleSort')}>
                    <TableSortLabel sx={tableSortLabelStyled} active={true} direction={orderTitleDirection}>
                      Title
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeadStyled}>Description</TableCell>
                  <TableCell sx={tableHeadStyled}>Image</TableCell>
                  <TableCell sx={tableHeadStyled} onClick={() => handleSortRequest('priceSort')}>
                    <TableSortLabel sx={tableSortLabelStyled} active={true} direction={orderPriceDirection}>
                      Price{'($)'}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {addNewState && <RowEdit fetchData={fetchData} setProducts={setProducts} products={products} onClickCancel={onClickCancel} setAddNewState={setAddNewState} image={image} setImage={setImage} snackState={snackState} setSnackState={setSnackState} successMsg={successMsg} setSuccessMsg={setSuccessMsg} errMsg={errMsg} setErrMsg={setErrMsg} />}
                {search(products).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) =>
                  <Product
                    key={product.id}
                    product={product}
                    isEditing={isEditing}
                    isDelete={isDelete}
                    editRow={editRow}
                    deleteRow={deleteRow}
                    captureEdit={captureEdit}
                    handleChange={handleChange}
                    handleChangeImage={handleChangeImage}
                    changeEditState={changeEditState}
                    changeDeleteState={changeDeleteState}
                    onClickSaveBtn={onClickSaveBtn}
                    onClickCancel={onClickCancel}
                    addNewState={addNewState}
                    image={image}
                  />)}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 133 * emptyRows }}>
                    <TableCell colSpan={5} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component='div'
              count={search(products).length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Paper>
        <div className='d-flex justify-content-center m-2'>
          <Button
            className='m-2'
            variant='contained'
            color='success'
            onClick={() => handleLogout()}
          >
            Log out
          </Button>
          <SnackBar
            snackState={snackState}
            setSnackState={setSnackState}
            errMsg={errMsg}
            setErrMsg={setErrMsg}
            successMsg={successMsg}
            setSuccessMsg={setSuccessMsg}
          />
        </div>

      </div>
    )
  }
}

export default Products