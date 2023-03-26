// create api config react query

import axios from "axios";

export const api = axios.create({
  baseURL: "https://dompet-api-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// create config to get data from api with bearer token

export const apiWithToken = (token: string) => {
  return axios.create({
    baseURL: "https://dompet-api-production.up.railway.app",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: false,
  });
};
