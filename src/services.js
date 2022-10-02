import axios from 'axios'
import { BaseUrl } from './environment'
import { axiosInterceptor } from './interceptor'

const reqInstance = axiosInterceptor(axios.create({
  headers: {
    'Authorization': `Bearer ${window.localStorage.getItem('token')}`
    // 'token': window.localStorage.getItem('token')
  }
}))


export const apiGetService = (path) => reqInstance.get(`${BaseUrl}${path}`)
export const apiPostService = (path, data) => reqInstance.post(`${BaseUrl}${path}`, data)
export const apiPutService = (path, data) => reqInstance.post(`${BaseUrl}${path}`, data)
export const apiDeleteService = (path) => reqInstance.delete(`${BaseUrl}${path}`)

export const handleTimeOut = (action) =>setTimeout(() => {
  return action
}, 1100)



