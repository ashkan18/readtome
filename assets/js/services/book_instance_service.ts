const { default: axios } = require("axios");
import { UserInterest } from "../models/user_interest";

const FETCH_BOOK_QUERY = `
query UserInterests($lat: Float, $lng: Float, $term: String ) {
  userInterests(lat: $lat, lng: $lng, term: $term) {
    id
    location
  }
}
`;


export const fetchUserInterest = (
  token: string,
  term: string | null,
  lat: number,
  lng: number,
): Promise<Array<UserInterest>> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: FETCH_BOOK_QUERY,
        variables: { term, lat, lng },
      },
    })
      .then((response) => {
        return resolve(response.data.data.userInterests);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};

