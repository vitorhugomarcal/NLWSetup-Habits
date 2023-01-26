import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://18.228.203.68:3333'
})