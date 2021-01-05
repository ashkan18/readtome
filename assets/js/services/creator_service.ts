const { default: axios } = require("axios");
import { getToken } from "./auth_service";
import { Creator } from "../models/creator";



const CREATOR_QUERY = `
query Creator($id: ID!) {
  creator(id: $id) {
    id
    name
    userInterests(first: 10) {
      edges {
        node {
          id
          title
          type
          ref
          thumbnail
          user {
            id
            name
          }
        }
      }
    }
  }
}
`;


export const getCreator = (creatorId: string): Promise<Creator> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: CREATOR_QUERY,
        variables: {id: creatorId}
      },
    })
      .then((response) => {
        return resolve(
          response.data.data.creator
        );
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
