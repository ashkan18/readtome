const { default: axios } = require("axios");
import { getToken } from "./auth_service";
import Reader from "../models/reader";
import {UserInterest} from "../models/user_interest";
import { Connection } from "../models/connection";

const ME_QUERY = `
query Me {
  me {
    id
    name
    email
    photos
  }
}`;

const MY_FEED_QUERY = `
query Me {
  me {
    id
    feed(first:100) {
      edges{
        node {
          id
          title
          ref
          type
          thumbnail
          insertedAt
          user {
            id
            name
            username
          }
          creators(first: 3){
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
}`;

const MY_FEED = `
query Me {
  me {
    interests(first: 10) {
      edges {
        node {
          id
          title
          type
          ref
          creators(first: 3){
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
}
`;


const READER_QUERY = `
query Reader($id: ID!) {
  reader(id: $id) {
    name
    username
    amIFollowing
    interests(first: 20) {
      edges {
        node {
          id
          title
          type
          ref
          thumbnail
          insertedAt
          creators(first: 3){
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
}
`;

const UPDATE_PROFILE = `
  mutation UpdateProfile($photo: Upload){
    updateProfile(photo: $photo){
      id
      name
      email
      photos
    }
  }
`

export const uploadPhoto = (token: string, photoFile: any): Promise<Reader> => {
  let formData = new FormData();
  formData.append("photoFile", photoFile);
  formData.append("query", UPDATE_PROFILE)
  formData.append("variables", JSON.stringify({photo: "photoFile"}))
  return new Promise((resolve, rejected) => {
    axios
      .post("/api/graph", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response: any) => resolve(response.data.data.updateProfile))
      .catch((error: any) => rejected(error));
  });
};

export const getMe = (): Promise<Reader> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: ME_QUERY,
      },
    })
      .then((response: any) => {
        return resolve(response.data.data.me);
      })
      .catch((error: any) => {
        if (error.response) {
          if(error.response.status === 401) return rejected("unauthorized")
        }
        return rejected(error);
      })
  );
};

export const myFeed = (): Promise<Connection<UserInterest>> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: MY_FEED_QUERY,
      },
    })
      .then((response: any) =>
        resolve(response.data.data.me.feed)
      )
      .catch((error: any) => {
        if (error.response) {
          if(error.response.status === 401) return rejected("unauthorized")
        }
        return rejected(error);
      })
  );
}

export interface MeResponse {
  interests: Connection<UserInterest>
}

export const myActivity = (): Promise<MeResponse> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: MY_FEED,
      },
    })
      .then((response: any) => {
        return resolve(response.data.data.me)
      })
      .catch((error: any) => {
        return rejected(error);
      })
  );
};


export const getReader = (userId: string): Promise<Reader> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: READER_QUERY,
        variables: {id: userId}
      },
    })
      .then((response: any) => {
        return resolve(
          response.data.data.reader
        );
      })
      .catch((error: any) => {
        return rejected(error);
      })
  );
};
