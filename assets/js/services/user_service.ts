const { default: axios } = require('axios');
import { getToken } from './auth_service'
import Reader from '../models/reader';


export const uploadPhoto = (file: any): Promise<Reader> => {
  let formData = new FormData()
  formData.append('file', file);
  return new Promise((resolve, rejected) => {
    axios.post("/api/me/photos", formData, { headers: { 'Authorization': `Bearer ${getToken()}`, 'Content-Type': 'multipart/form-data'} })
    .then( response => resolve(response.data))
    .catch( error => rejected(error))
  })
}
