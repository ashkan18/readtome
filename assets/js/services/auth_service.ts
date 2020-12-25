const { default: axios } = require('axios');
import Reader from '../models/reader';

export const getToken = ():string|null => {
  // Retrieves the user token from localStorage
  return localStorage.getItem('id_token')
}

export const login = (username: string, pass: string): Promise<string> => {
  return new Promise((resolve, rejected) =>
    axios.post("/api/login", { user: { username: username, password: pass } })
    .then( response => {
      setToken(response.data.data.token)
      return resolve(response.data.data.token)
    })
    .catch( error => {
      return rejected(error)
    })
  )
}


const setToken = (idToken: string) => {
  // Saves user token to localStorage
  localStorage.setItem('id_token', idToken)
}
