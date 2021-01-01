const { default: axios } = require("axios");

export const getToken = (): string | null => {
  // Retrieves the user token from localStorage
  return localStorage.getItem("id_token");
};

const setToken = (idToken: string) => {
  // Saves user token to localStorage
  localStorage.setItem("id_token", idToken);
};


const LOGIN_QUERY = `
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
  } 
}`;


export const login = (username: string, password: string): Promise<string> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: LOGIN_QUERY,
        variables: { username, password },
      },
    }).then((response) => {
        console.log("HERE 1")
        if (response.data?.errors?.length > 0) {
          console.log("HERE 2")
          return rejected(response.data.errors[0].message)
        } else {
          setToken(response.data.data.login.token);
          return resolve(response.data.data.login.token);
        }
      })
      .catch((error) => {
        return rejected(error);
      }));
};


const SIGNUP_QUERY = `
mutation Signup($name: String!, $email: String!, $username: String!, $password: String!) {
  signup(name: $name, email: $email, username: $username, password: $password) {
    token
  } 
}`;


export const signUp = (name: string, username: string, email: string, password: string): Promise<string> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      data: {
        query: SIGNUP_QUERY,
        variables: { name, email, username, password },
      },
    }).then((response) => {
        if (response.data.errors.length > 0) {
          return rejected(response.data.errors[0].message)
        }
        return resolve(response.data.data.signup.token);
      })
      .catch((error) => {
        return rejected(error);
      }));
}