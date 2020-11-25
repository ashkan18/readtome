const { default: axios } = require('axios');
import AuthService from './auth_service'
import Reader from '../models/reader';


export default class UserService {
  private Auth: AuthService;
  // Initializing important variables
  constructor(authService: AuthService) {
    this.Auth = authService
    this.uploadPhoto = this.uploadPhoto.bind(this)
  }

  public uploadPhoto(file: any): Promise<Reader>{
    let formData = new FormData()
    formData.append('file', file);
    return new Promise((resolve, rejected) => {
      axios.post("/api/me/photos", formData, { headers: { 'Authorization': `Bearer ${this.Auth.getToken()}`, 'Content-Type': 'multipart/form-data'} })
      .then( response => resolve(response.data))
      .catch( error => rejected(error))
    })
  }
}
