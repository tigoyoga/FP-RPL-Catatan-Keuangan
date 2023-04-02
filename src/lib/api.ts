// create api config react query

import axios from "axios";

export const api = axios.create({
  baseURL: "https://dompet-api-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// config to handle bearer token
export const apiWithToken = () => {
  const token = localStorage.getItem("token");

  return axios.create({
    baseURL: "https://dompet-api-production.up.railway.app",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: false,
  });
};
