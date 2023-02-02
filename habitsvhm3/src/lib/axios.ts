import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://15.229.18.157:3333'
})