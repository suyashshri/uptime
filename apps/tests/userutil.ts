import axios from "axios";
import { BACKEND_URL } from "./config";

export function userDetails(): {
  username: string;
  email: string;
  password: string;
} {
  const username = `USER_${Math.floor(Math.random() * 1000)}`;
  const email = `${username}@gmail.com`;
  const password = "password";

  return { username, email, password };
}

export async function signedupVerifiedUserDetail(): Promise<{
  email: string;
  password: string;
}> {
  const username = `USER_${Math.floor(Math.random() * 1000)}`;
  const email = `${username}@gmail.com`;
  const password = "password";

  await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
    username,
    email,
    password,
  });

  await axios.post(`${BACKEND_URL}/api/v1/user/verify-otp`, {
    email,
    otp: "111111",
  });
  return { email, password };
}

export async function signedupNotVerifiedUserDetail(): Promise<{
  email: string;
  password: string;
}> {
  const username = `USER_${Math.floor(Math.random() * 1000)}`;
  const email = `${username}@gmail.com`;
  const password = "password";

  await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
    username,
    email,
    password,
  });

  return { email, password };
}
