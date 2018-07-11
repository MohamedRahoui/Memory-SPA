import axios from 'axios'

let headers = {
  baseURL: 'http://127.0.0.1:8000/api',
  Authorization: `Bearer ${localStorage.token}`
}

export default axios.create(headers)
