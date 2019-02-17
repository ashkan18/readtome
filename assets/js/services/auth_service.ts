import axios, { AxiosResponse } from 'axios'
import Reader from 'js/models/reader';

export default class AuthService {
  // Initializing important variables
  constructor() {
    this.login = this.login.bind(this)
  }

  public login(username: string, pass: string): Promise<string>{
    return new Promise((resolve, rejected) =>
      axios.post("/api/login", { user: { username: username, password: pass } })
      .then( response => {
        this.setToken(response.data.data.token)
        return resolve(response.data.data.token)
      })
      .catch( error => {
        return rejected(error)
      })
    )
  }

  public me(): Promise<Reader> {
    return new Promise((resolve, rejected) =>
      axios.get("/api/me", { headers: { 'Authorization': `Bearer ${this.getToken()}` }})
      .then( response => resolve(response.data))
      .catch( error => {
        return rejected(error)
      })
    )
  }

  setToken = (idToken) => {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken)
  }

  getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('id_token')
  }
}