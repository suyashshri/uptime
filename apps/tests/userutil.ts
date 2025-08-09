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
