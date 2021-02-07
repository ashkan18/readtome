import axios from "axios";
import { Follow } from "../models/follow";


const FOLLOW_QUERY = `
mutation Follow($userId: ID!) {
  follow(userId: $userId) {
    id
  }
}`;


export const follow = (
  token: string | null,
  userId: string
): Promise<Follow> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: FOLLOW_QUERY,
        variables: { userId },
      },
    })
      .then((response) => {
        return resolve(response.data.data.follow);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
