import { apiWithToken } from "./api";
import useAuthStore from "@/store/useAuthStore";

export const checkAuth = () => {
  const login = useAuthStore.useLogin();
  const token = localStorage.getItem("token");

  if (token) {
    apiWithToken(token)
      .get("/secured/me")
      .then((response) => {
        login({
          name: response.data.data.name,
          email: response.data.data.email,
          data: token,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
};
