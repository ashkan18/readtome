const { default: axios } = require("axios");
import { Connection } from "../models/connection";
import { FetchedSource, UserInterest } from "../models/user_interest";


const USER_INTERESTS_QUERY = `
query UserInterests($lat: Float, $lng: Float, $term: String ) {
  userInterests(lat: $lat, lng: $lng, term: $term, first: 100) {
    edges{
      node {
        id
        location
        title
        type
        ref
        insertedAt
        thumbnail
        user {
          id
          name
          username
        }
        creators(first:10) {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
}
`;


export const fetchUserInterest = (
  token: string,
  term: string | null,
  lat: number,
  lng: number,
): Promise<Connection<UserInterest>> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: USER_INTERESTS_QUERY,
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


export const addInterest = (
  token: string | null,
  title: string,
  ref: string,
  type: string,
  creatorNames: Array<string>,
  thumbnail: string,
  lookingFor: boolean,
  lat: number,
  lng: number,
  externalId: string,
  _metadata: any
): Promise<UserInterest> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: `
            mutation AddInterest($title: String, $ref: String, $creatorNames: [String], $type: InterestType!, $thumbnail: String, $lookingFor: Boolean, $lat: Float, $lng: Float, $externalId: String ) {
              addInterest(title: $title, ref: $ref, creatorNames: $creatorNames, type: $type, thumbnail: $thumbnail, lookingFor: $lookingFor, lat: $lat, lng: $lng, externalId: $externalId) {
                id
                title
                creators(first: 10) {
                  edges {
                    node {
                      name
                      id
                    }
                  }
                }
              }
            }
          `,
        variables: { title, ref, creatorNames, type, thumbnail, lookingFor, lat, lng, externalId },
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        return resolve(response.data.data.addInterest);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};


export const unfurlLink = (
  token: string | null,
  url: string
): Promise<FetchedSource> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: `
            query Unfurl($url: String!) {
              unfurl(url: $url) {
                title
                type
                creatorNames
                image
              }
            }
          `,
        variables: { url },
      },
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.data.errors) {
          return rejected(response.data.errors[0].message)
        }
        return resolve(response.data.data.unfurl);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
