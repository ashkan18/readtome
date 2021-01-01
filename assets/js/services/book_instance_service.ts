const { default: axios } = require("axios");
import BookInstance from "../models/book_instance";

const FETCH_BOOK_QUERY = `
query bookInstances($lat: Float, $lng: Float, $term: String, $offerings: [String] ) {
  bookInstances(lat: $lat, lng: $lng, term: $term, offerings: $offerings) {
    id
    medium
    reader {
      id
      name
      photos
    }
    book {
      id
      title
      tags
      creators(first: 10) {
        edges {
          node {
            name
            id
            bio
          }
        }
      }
      smallCoverUrl
      mediumCoverUrl
    }
    location
  }
}
`;
const POST_BOOK_QUERY = `
mutation PostBook($lat: Float!, $lng: Float!, $bookId: ID!, $medium: Medium!, $offerings: [Offering]) {
  postBook(bookId: $bookId, lat: $lat, lng: $lng, medium: $medium, offerings: $offerings) {
    id
    reader{
      id
      name
    }
    book {
      id
      title
      isbn
      creators(first: 10) {
        edges {
          node {
            name
            id
            bio
          }
        }
      }
    }
  } 
}
`;


export const submitOffering = (
  token: string | null,
  bookId: string,
  lat: number,
  lng: number,
  offerings: Array<string>,
  medium: string
): Promise<BookInstance> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: POST_BOOK_QUERY,
        variables: { bookId, lat, lng, offerings, medium },
      },
    })
      .then((response) => {
        return resolve(response.data.data.bookInstances);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};

export const fetchBooks = (
  token: string,
  term: string | null,
  lat: number,
  lng: number,
  offerings: Array<string> | null
): Promise<Array<BookInstance>> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: FETCH_BOOK_QUERY,
        variables: { term, lat, lng, offerings },
      },
    })
      .then((response) => {
        return resolve(response.data.data.bookInstances);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};

