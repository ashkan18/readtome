const { default: axios } = require("axios");
import { UnfurledLink, UserInterest } from "../models/user_interest";

export const addInterest = (
  token: string | null,
  title: string,
  ref: string,
  type: string,
  creatorNames: Array<string>
): Promise<UserInterest> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: `
            mutation AddInterest($title: String, $ref: String, $creatorNames: [String], $type: InterestType!) {
              addInterest(title: $title, ref: $ref, creatorNames: $creatorNames, type: $type) {
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
        variables: { title, ref, creatorNames, type },
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
): Promise<UnfurledLink> => {
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
