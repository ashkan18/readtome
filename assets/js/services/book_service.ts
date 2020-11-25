const { default: axios } = require('axios');
import Book from '../models/book'

export const findByISBN = (token: string | null, isbn: string): Promise<Book> => {
  return new Promise((resolve, rejected) =>
      axios({
        url: "/api/",
        method: "post",
        data: {
          query: `
            query bookInstances($isbn: String) {
              book(isbn: $isbn) {
                id
                title
                authors {
                  name
                  id
                  bio
                }
                tags
                small_cover_url
              }
            }
          `,
          variables: {isbn},
          headers: { 'Authorization': `Bearer ${token}`} }
        })
      .then( response => {
        return resolve(response.data.data.book)
      })
      .catch( error => {
        return rejected(error)
      })
    )
  }