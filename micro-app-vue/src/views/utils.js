import axios from 'axios'

axios.create({
  baseURL: process.env.VUE_API, // url = base url + request url
  timeout: 5000 // request timeout
})
