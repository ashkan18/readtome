const { default: axios } = require("axios");
import { UserInterest } from "../models/user_interest";

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
