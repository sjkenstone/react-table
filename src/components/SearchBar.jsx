import React, { useRef } from 'react'
import { Button, IconButton, Input, FormControl } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import AddBoxIcon from '@mui/icons-material/AddBox'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import InputAdornment from '@mui/material/InputAdornment'
import Tooltip from '@mui/material/Tooltip'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import { CSVLink } from 'react-csv'
import {read, utils} from 'xlsx'

const SearchBar = ({ setQuery, resetSearch, onClickAdd, products, setProducts, isEditing}) => {
  const textInput = useRef(null)

  const headers= [
    {label: 'Title', key: 'title'},
    {label: 'Description', key: 'description'},
    {label: 'Image', key: 'product_image'},
    {label: 'Price', key: 'price'}
  ]

  const handleFileUpload = (e) => {
    const files = e.target.files
    if(files.length) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        const wb = read(event.target.result)
        const sheets = wb.SheetNames
        console.log({wb, sheets})
        if(sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]])
          
          const newRows = rows.map(item => {
            if (!item.product_image) {
              return { ...item, product_image: '' }
            }
            return item
          })
          console.log({newRows,rows})
          setProducts(newRows)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <div className='d-flex justify-content-between mb-2'>
      <h2 className='me-auto'>Dynamic Data Table</h2>
      <div>
        <FormControl>
          <Tooltip title='Add CSV'>        
           <Button
            className='mx-2'
            variant='contained'
            component='label'
            endIcon={<FileUploadIcon/>}
           >
              Upload CSV
              <Input
                hidden accept='.csv'
                type='file'
                name='upload_csv'
                disabled={isEditing}
                onChange={(e) => { handleFileUpload(e) }}
              />
           </Button>
          </Tooltip>
        </FormControl>
        <FormControl>
          <Button
            className='mx-2'
            variant='contained'
            endIcon={<FileDownloadIcon />}
          >
            <CSVLink
              headers={headers}
              data={products}
              disabled={isEditing}
              className='text-white text-decoration-none'
            >
              Export to CSV
            </CSVLink>
          </Button>
        </FormControl>
        
        <FormControl className='mt-1' variant='standard'>
          <Input
            id='search-bar'
            disabled={isEditing}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            inputRef={textInput}
            size='small'
            startAdornment={
              <InputAdornment position='start'>
                <Tooltip title='Search'>
                  <IconButton>
                    <SearchIcon style={{ fill: 'black' }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position='end'>
                <IconButton 
                  disabled={isEditing}
                  onClick={
                    () => { 
                      resetSearch() 
                      textInput.current.value = '' 
                    }} 
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            }
          />

        </FormControl>
        <Tooltip title='Add'>
          <IconButton
            disabled={isEditing}
            onClick={() => onClickAdd()}
          >
            <AddBoxIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  )
}

export default SearchBar