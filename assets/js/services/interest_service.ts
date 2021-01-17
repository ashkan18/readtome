const { default: axios } = require("axios");
import { FetchedSource, UserInterest } from "../models/user_interest";

export const addInterest = (
  token: string | null,
  title: string,
  ref: string,
  type: string,
  creatorNames: Array<string>,
  thumbnail: string,
  lookingFor: boolean,
  lat: number,
  lng: number
): Promise<UserInterest> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: `
            mutation AddInterest($title: String, $ref: String, $creatorNames: [String], $type: InterestType!, $thumbnail: String, $lookingFor: Boolean, $lat: Float, $lng: Float ) {
              addInterest(title: $title, ref: $ref, creatorNames: $creatorNames, type: $type, thumbnail: $thumbnail, lookingFor: $lookingFor, lat: $lat, lng: $lng) {
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
        variables: { title, ref, creatorNames, type, thumbnail, lookingFor, lat, lng },
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
                authorName
                thumbnail
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
