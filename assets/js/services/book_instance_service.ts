import axios, { AxiosResponse } from 'axios'
import AuthService from './auth_service';
import BookInstance from 'js/models/book_instance';



export default class BookInstanceService {
  Auth: AuthService;
  // Initializing important variables
  constructor() {
    this.Auth = new AuthService()
    this.fetchBooks = this.fetchBooks.bind(this)
  }

  public fetchBooks(term: string, lat: number, lng: number, offerings: Array<string>): Promise<Array<BookInstance>>{
    return new Promise((resolve, rejected) =>
      axios.get("/api/book_instances", { params: {term, lat, lng, offerings }, headers: { 'Authorization': `Bearer ${this.Auth.getToken()}`} })
      .then( response => {
        return resolve(response.data.book_instances)
      })
      .catch( error => {
        return rejected(error)
      })
    )
  }
}
