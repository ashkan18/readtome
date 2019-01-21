import axios, { AxiosResponse } from 'axios'
import AuthService from './auth_service'
import Reader from 'js/models/reader';


export default class UserService {
  private Auth: AuthService;
  // Initializing important variables
  constructor() {
    this.Auth = new AuthService()
    this.uploadPhoto = this.uploadPhoto.bind(this)
  }

  public uploadPhoto(file): Promise<Reader>{
    let formData = new FormData()
    formData.append('file', file);
    return new Promise((resolve, rejected) => {
      axios.post("/api/me/photos", formData, { headers: { 'Authorization': `Bearer ${this.Auth.getToken()}`, 'Content-Type': 'multipart/form-data'} })
      .then( response => {
        console.log("===>", response)
        return resolve(response.data)
      })
      .catch( error => {
        return rejected(error)
      })
    })
  }
}
