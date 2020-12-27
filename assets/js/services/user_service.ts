const { default: axios } = require("axios");
import { getToken } from "./auth_service";
import Reader from "../models/reader";
import Inquiry from "../models/inquiry";

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
            name
          }
          bookInstance {
            reader {
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
        return rejected(error);
      })
  );
};

export interface MyActivityResponse {
  inquiries: Array<Inquiry>
  requests: Array<Inquiry>
}

export const myActivity = (): Promise<MyActivityResponse> => {
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
        return resolve(
          { 
            inquiries: response.data.data.me.inquiries.edges.map((edge) => edge.node),
            requests: response.data.data.me.requests.edges.map((edge) => edge.node)
          }
        );
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};
