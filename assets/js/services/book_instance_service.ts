import axios, { AxiosResponse } from 'axios'
import AuthService from './auth_service';
import BookInstance from 'js/models/book_instance';
import Inquiry from 'js/models/inquiry';



export default class BookInstanceService {
  private Auth: AuthService;
  // Initializing important variables
  constructor() {
    this.Auth = new AuthService()
    this.fetchBooks = this.fetchBooks.bind(this)
  }

  public fetchBooks(term: string, lat: number, lng: number, offerings: Array<string>): Promise<Array<BookInstance>>{
    return new Promise((resolve, rejected) =>

      axios({
        url: "/api/",
        method: "post",
        data: {
          query: `
            query bookInstances($lat: Float, $lng: Float, $term: String, $offerings: [String] ) {
              bookInstances(lat: $lat, lng: $lng, term: $term, offerings: $offerings) {
                id
                reader {
                  id
                  name
                  photos
                }
                book {
                  id
                  title
                  authors {
                    name
                    id
                    bio
                  }
                }
                location
              }
            }
          `,
          variables: {term, lat, lng, offerings },
          headers: { 'Authorization': `Bearer ${this.Auth.getToken()}`} }
        })
      .then( response => {
        console.log(response.data.data.bookInstances)
        return resolve(response.data.data.bookInstances)
      })
      .catch( error => {
        return rejected(error)
      })
    )
  }

  public inquiry(bookInstanceId: string, type: string): Promise<Inquiry> {
    return new Promise((resolve, rejected) =>
      axios.post("/api/inquiries", {book_instance_id: bookInstanceId, type}, { headers: { 'Authorization': `Bearer ${this.Auth.getToken()}`}})
        .then( response => {
          return resolve(response.data)
        })
        .catch( error => {
          return rejected(error)
        })
    )
  }
}
