import {
  TableCell,
  TableRow,
  Button,
  IconButton,
  Input
} from "@mui/material"
import EditIcon from '@mui/icons-material/Edit'
import DoneIcon from '@mui/icons-material/Done'
import ClearIcon from '@mui/icons-material/Clear'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import FormHelperText from '@mui/material/FormHelperText'
import NumberFormat from 'react-number-format'
import InputAdornment from '@mui/material/InputAdornment'


const Product = ({ 
  product, 
  product: { id, title, description, product_image, price }, 
  isEditing, 
  isDelete, 
  editRow, 
  deleteRow, 
  captureEdit,
  handleChange, 
  handleChangeImage,
  changeEditState, 
  changeDeleteState, 
  onClickSaveBtn,
  onClickCancel,
  addNewState,
  image
}) => {
  const preFix = `http://127.0.0.1:8000/storage/images/`
  // const preFix = `https://app.spiritx.co.nz/storage/`
 
  if (isEditing && editRow.id === id) {
    return (
      <TableRow key={id}>
        <TableCell>
          <div style={{ display: 'flex' }}>
            <Tooltip title='Save'>
              <div>
                <IconButton
                  disabled={title === '' || price === '' || description === ''}
                  onClick={() => onClickSaveBtn('edit', product)}
                >
                  <DoneIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title='Cancel'>
              <div>
                <IconButton
                  onClick={() => onClickCancel('cancelEdit', product)}
                >
                  <ClearIcon />
                </IconButton>
              </div>
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
            value={title}
            name='title'
            type='text'
            error={title === ''}
            onChange={(e) => handleChange(e, product)}
            size='small'
          />
          {title === '' ? (
            <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
          ): null}
        </TableCell>
        <TableCell 
          sx={{ color: 'black' }}
          style={{ height: 133 }}
        >
          <Input
            sx={{ color: 'black' }}
            value={description}
            name='description'
            type='text'
            error={description === ''}
            size='small'
            onChange={(e) => handleChange(e, product)}
          />
          {description === '' ? (
            <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
          ) : null}
        </TableCell>
        <TableCell 
          sx={{ color: 'black' }}
          style={{ height: 133 }}
        >
          {(product_image === '' || product_image === null) && image === undefined ?
            (<p className='d-inline-block mx-2'>No image</p>) : (
              <img
                src={image !== undefined ? (URL.createObjectURL(image)) : (preFix + product_image)}
                alt={title}
                style={{ width: 100, height: 100 }}
              />
            )}
          <Button className='mx-1' variant='contained' component='label'>
            Upload
            <Input 
              hidden accept='image/*'
              multiple type='file'
              name='product_image'
              size='small'
              onChange={(e) => handleChangeImage(e, product)}
            />
          </Button>
        </TableCell>
        <TableCell 
          sx={{ color: 'black' }}
          style={{ height: 133 }}
        >
          <NumberFormat 
            customInput={Input} 
            value={price}
            name='price'
            thousandSeparator={true} 
            error={price === ''}
            onChange={(e) => handleChange(e, product)}
            size='small'
            startAdornment={<InputAdornment position='start'>$</InputAdornment>}
          />
          {price === '' ? (
            <FormHelperText style={{ color: 'red' }}>Field required</FormHelperText>
          ) : null}
        </TableCell>
      </TableRow>
    )
  } else if (isDelete && deleteRow.id === id) {
     return (
      <TableRow key={id}>
         <TableCell>
           <div style={{ display: 'flex' }}>
             <Tooltip title='Save'>
               <div>
                 <IconButton
                   onClick={() => onClickSaveBtn('delete', product)}
                 >
                   <DoneIcon />
                 </IconButton>
               </div>
             </Tooltip>
             <Tooltip title='Cancel'>
               <div>
                 <IconButton
                   onClick={() => onClickCancel('cancelDelete')}
                 >
                   <ClearIcon />
                 </IconButton>
               </div>
             </Tooltip>
           </div>
         </TableCell>
         <TableCell
           style={{ height: 133 }}
           sx={{ fontSize: '22px', fontWeight: '450', color: '#8383af'}}
           colSpan={6}
         >
           Are you sure you want to delete this row?
         </TableCell>
      </TableRow>
     )
 } else {
    return (
      <TableRow key={id}>
        {/* Edit & Delete Icon in Table Cell */}
        <TableCell>
          <div style={{ display: 'flex' }}>
            <Tooltip title='Edit'>
              <div>
                <IconButton
                  disabled={isEditing || isDelete || addNewState ? true : false}
                  onClick={() => {
                    captureEdit('edit', product);
                    changeEditState(product)
                  }}
                >
                  <EditIcon />
                </IconButton>
              </div>
            </Tooltip>
            <Tooltip title='Delete'>
              <div>
                <IconButton
                  disabled={isEditing || isDelete || addNewState ? true : false}
                  onClick={() => {
                    captureEdit('delete', product);
                    changeDeleteState(product)
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </Tooltip>
          </div>
        </TableCell>
        <TableCell 
          sx={(isEditing || isDelete || addNewState) ? { color: '#adb5bd' } : { color: 'black'} }
          style={{ height: 133 }}
          component='th' 
          scope='row'
        >
          {title}
        </TableCell>
        <TableCell 
          sx={(isEditing || isDelete || addNewState) ? { color: '#adb5bd' } : { color: 'black'} }
          style={{ height: 133 }}
        >
          {description}
        </TableCell>
        <TableCell
          sx={(isEditing || isDelete || addNewState) ? { color: '#adb5bd' } : { color: 'black'} }
          style={{ height: 133 }}
        >
          {product_image === '' || product_image === null ?
            (<p>No image</p>) : (
              <img
                src={preFix + product_image}
                alt={title}
                style={{ width: 100, height: 100 }}
              />
            )}
        </TableCell>
        <TableCell
          sx={(isEditing || isDelete || addNewState) ? { color: '#adb5bd' } : { color: 'black'} }
          style={{ height: 133 }}
        >
          {price}
        </TableCell>
      </TableRow>
    )
 }
}

export default Product