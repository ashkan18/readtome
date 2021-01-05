const { default: axios } = require("axios");
import { getToken } from "./auth_service";
import Reader from "../models/reader";
import Inquiry from "../models/inquiry";
import {UserInterest} from "../models/user_interest";
import { Connection } from "../models/connection";

const ME_QUERY = `
query Me {
  me {
    id
    name
    photos
  }
}`;

const MY_INQUIRIES = `
query Me {
  me {
    inquiries(first: 10) {
      edges {
        node {
          id
          offering
          user {
            name
          }
          bookInstance {
            reader {
              id
              name
            }
            book {
              title
              mediumCoverUrl
            }
          }
        }
      }
    }

    requests(first: 10) {
      edges {
        node {
          id
          offering
          user {
            id
            name
          }
          bookInstance {
            reader {
              id
              name
            }
            book {
              title
              mediumCoverUrl
            }
          }
        }
      }
    }

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
    interests(first: 20) {
      edges {
        node {
          id
          title
          type
          ref
          thumbnail
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

export const uploadPhoto = (file: any): Promise<Reader> => {
  let formData = new FormData();
  formData.append("file", file);
  return new Promise((resolve, rejected) => {
    axios
      .post("/api/me/photos", formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => resolve(response.data))
      .catch((error) => rejected(error));
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
      .then((response) => {
        return resolve(response.data.data.me);
      })
      .catch((error) => {
        if (error.response) {
          if(error.response.status === 401) return rejected("unauthorized")
        }
        return rejected(error);
      })
  );
};

export interface MeResponse {
  inquiries: Connection<Inquiry>
  requests: Connection<Inquiry>
  interests: Connection<UserInterest>
}

export const myActivity = (): Promise<MeResponse> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${getToken()}` },
      data: {
        query: MY_INQUIRIES,
      },
    })
      .then((response) => {
        return resolve(response.data.data.me)
      })
      .catch((error) => {
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
      .then((response) => {
        return resolve(
          response.data.data.reader
        );
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
