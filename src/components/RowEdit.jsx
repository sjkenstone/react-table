import { useState, useEffect } from 'react'
import { 
  TableRow,
  TableCell,
  Tooltip,
  IconButton,
  Button,
  Input
} from "@mui/material"
import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'
import FormHelperText from '@mui/material/FormHelperText'
import NumberFormat from 'react-number-format'
import InputAdornment from '@mui/material/InputAdornment'
import { apiPostService, handleTimeOut } from '../services'


const RowEdit = ({ products, setProducts,setAddNewState, image, setImage, onClickCancel, setSnackState, setSuccessMsg, setErrMsg }) => {
  const [addRow, setAddRow] = useState({
    category_id: 99,
    title:null,
    description:null,
    price:null,
    product_image:'',
    is_active: '',
  })
  const {title, description, price, category_id, is_active} = addRow
  
  const [titleEmpty, setTitleEmpty] = useState(false)
  const [desctiptionEmpty, setDescriptionEmpty] = useState(false)
  const [priceEmpty, setPriceEmpty] = useState(false)
  let bodyFormData = new FormData()

  useEffect(() => {
    if(title !== null) {
      setTitleEmpty(false)
    } 

    if(description !== null) {
      setDescriptionEmpty(false)
    }

    if(price !== null) {
      setPriceEmpty(false)
    }
  }, [ title, description, price])


  const getInputValue = (e, type) => {
    
    if (type === 'image') {
      // const filePath = e.target.value
      // const name = e.target.name
      // const fileName = 'images/' + filePath.replace(/^.*[\\\/]/, '')
      setImage(e.target.files[0])

      // setAddRow(state => {
      //   return { ...addRow, [name]: fileName }
      // })
    } else {
      setAddRow(state => {
        return {...addRow, [e.target.name]: e.target.value}
      })
    }
  }

  const onClickSaveBtn = async () => {

    if (title === null) {
        setTitleEmpty(true)
    } 
    if (description === null) {
        setDescriptionEmpty(true)
    }
    if (price === null) {
        setPriceEmpty(true)
    }

    if (title !== null && title !== '') {
      if (description !== null && description !== '') {
        if (price !== null && price !== '') {
          bodyFormData.append('title', title)
          bodyFormData.append('description', description)
          bodyFormData.append('price', price)
          if(image !== undefined) {
            bodyFormData.append('product_image', image)
          } else {
            bodyFormData.append('product_image', '')
          }
          bodyFormData.append('category_id', category_id)
          bodyFormData.append('is_active', is_active)
          
          try{
            await apiPostService('products', 
              bodyFormData
            ).then(res => {
              // console.log('RowEdit',res.data.product_image)
              if(res.response?.status !== 403) {
                setProducts([{ ...addRow, id: res.data.id, product_image: res.data.product_image }, ...products])
                console.log({ addRow })
                setAddRow({})
                setImage(undefined)
                setSnackState(true)
                setSuccessMsg('Success')
              } else {
                setSnackState(true)
                setErrMsg('Time out')
                const timer = handleTimeOut(window.location.replace('/login'))
                return () => clearTimeout(timer)
              }
            })
          } catch(err) {
            console.log({err})
          }
          setAddNewState(false)
        }
      }
    }    
  }
  
  return (
    <TableRow key={''}>
      <TableCell>
        <div style={{ display: 'flex' }}>
          <Tooltip title='Save'>
            <span>
              <IconButton
                disabled={addRow.title === '' || addRow.price === '' || addRow.description === ''}
                onClick={() => 
                  onClickSaveBtn()
                }
              >
                <DoneIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title='Cancel'>
            <IconButton
              onClick={() => onClickCancel('cancelAdd')}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
      <TableCell
        sx={{ color: 'black' }}
        style={{ height: 133 }}
        component="th"
        scope="row"
      >
        <Input
          sx={{ color: 'black' }}
          // value={title}
          placeholder='Title'
          name='title'
          type='text'
          error={title === '' || titleEmpty}
          onChange={(e) => getInputValue(e)}
          size='small'
        />
        { title ==='' || titleEmpty ? (
          <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
        ) : null}
      </TableCell>
      <TableCell 
        sx={{ color: 'black' }}
        style={{ height: 133 }}
      >
        <Input
          sx={{ color: 'black' }}
          // value={description}
          placeholder='Description'
          name='description'
          type='text'
          error={description === '' || desctiptionEmpty }
          size='small'
          onChange={(e) => getInputValue(e)}
        />
        {description === '' || desctiptionEmpty ? (
          <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
        ) : null}
      </TableCell>
      <TableCell 
        sx={{ color: 'black' }}
        style={{ height: 133 }}
      >
        {/* {addRow.product_image === '' || addRow.product_image === null ? */}
        {image === undefined || image === null ?
          (<p className='d-inline-block mx-2'>No image</p>) : (
            <img
              src={URL.createObjectURL(image)}
              // src={window.URL.createObjectURL(new File(image, {type:'image/png'}))}
              // src={preFix + addRow.product_image}
              alt={title}
              style={{ width: 100, height: 100 }}
            />
          )}
        <Button className='mx-1' variant='contained' component='label'>
          Upload
          <Input
            hidden accept='image/*'
            type='file'
            name='product_image'
            size='small'
            onChange={(e) => { getInputValue(e, 'image') }}
          />
        </Button>
      </TableCell>
      <TableCell 
        sx={{ color: 'black' }}
        style={{ height: 133 }}
      >
        <NumberFormat
          customInput={Input}
          name='price'
          thousandSeparator={true}
          error={price === '' || priceEmpty }
          onChange={(e) => getInputValue(e)}
          size='small'
          startAdornment={<InputAdornment position='start'>$</InputAdornment>}
        />
        {price === '' || priceEmpty ? (
          <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
        ) : null}
      </TableCell>
    </TableRow>
    )
}

export default RowEdit