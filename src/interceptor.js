 export const axiosInterceptor = (instance) => {

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if(token) {
        config.headers['Authorization'] = `Bearer ${token}`
        // config.headers['token'] = token
      } else {
        config.headers['Authorization'] = ''
        // config.headers['token'] = ''
      }
      return config
    },
    (error) => {
      console.log('Interceptor request error',{error})
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      console.log('Interceptor response error',{error})
      // if (error.response.config.url.includes('login')) {
      //   if (error.response.status === 422) {
      //     return error
      //   }
        if (error.response.status === 403) {
          // window.location.replace('/login')
          window.alert('Time out')
        }
      return error
    }
  )
  return instance
}





