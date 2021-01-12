import axios from "axios";
import { Follow } from "../models/follow";
import Inquiry from "../models/inquiry";

const SHOW_INTEREST_QUERY = `
mutation ShowInterest($bookInstanceId: ID!, $offering: Offering) {
  showInterest(bookInstanceId: $bookInstanceId, offering: $offering) {
    id
  } 
}`;

const ACCEPT_INQUIRY_QUERY = `
mutation AcceptInquiry($inquiryId: ID!) {
  acceptInquiry(inquiryId: $inquiryId) {
    id
  } 
}`;


const REJECT_INQUIRY_QUERY = `
mutation RejectInquiry($inquiryId: ID!) {
  rejectInquiry(inquiryId: $inquiryId) {
    id
  } 
}`;


const FOLLOW_QUERY = `
mutation Follow($userId: ID!) {
  follow(userId: $userId) {
    id
  } 
}`;


export const showInterest = (
  token: string | null,
  bookInstanceId: string,
  offering: string
): Promise<Inquiry> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: SHOW_INTEREST_QUERY,
        variables: { bookInstanceId, offering },
      },
    })
      .then((response) => {
        return resolve(response.data.data.showInterest);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};


export const accept = (
  token: string | null,
  inquiryId: string
): Promise<Inquiry> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: ACCEPT_INQUIRY_QUERY,
        variables: { inquiryId },
      },
    })
      .then((response) => {
        return resolve(response.data.data.acceptInquiry);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};


export const reject = (
  token: string | null,
  inquiryId: string
): Promise<Inquiry> => {
  return new Promise((resolve, rejected) =>
    axios({
      url: "/api/graph",
      method: "post",
      headers: { Authorization: `Bearer ${token}` },
      data: {
        query: REJECT_INQUIRY_QUERY,
        variables: { inquiryId },
      },
    })
      .then((response) => {
        return resolve(response.data.data.rejectInquiry);
      })
      .catch((error) => {
        return rejected(error);
      })
  );
};


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
