import axios from "axios";
import { describe, expect, it } from "bun:test";
import { BACKEND_URL } from "./config";
import { userDetails } from "./userutil";

describe("SignUp Endpoints", () => {
  it("Is able to signup if everything is correct", async () => {
    try {
      const { username, email, password } = userDetails();

      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe(
        "Signup successful. OTP sent to email."
      );
    } catch (e) {
      //   console.log("Error", e);
      expect(false);
    }
  });

  it("Is not able to signup if anything is incorrect", async () => {
    try {
      const { username, email } = userDetails();

      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
      });
      expect(response.status).toBe(400);
      expect(response.data.message).toBe("Invalid/Incorrect Inputs provided");
    } catch (e) {
      //   console.log("Error", e);
      expect(false);
    }
  });
});

describe("Verify Otp Endpoint", () => {
  it("If OTP is correct", async () => {
    const { username, email, password } = userDetails();
    await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
      username,
      email,
      password,
    });

    const responseBeforeVerification = await axios.post(
      `${BACKEND_URL}/api/v1/user/verify-otp`,
      {
        email,
        otp: "111111",
      }
    );
    expect(responseBeforeVerification.status).toBe(200);
    expect(responseBeforeVerification.data.message).toBe(
      "Verified successfully"
    );
    expect(responseBeforeVerification.data.token).not.toBeNull();
  });

  it("verifying OTP when user is verified", async () => {
    try {
      const { username, email, password } = userDetails();
      await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
      });

      await axios.post(`${BACKEND_URL}/api/v1/user/verify-otp`, {
        email,
        otp: "111111",
      });

      const responseAfterVerification = await axios.post(
        `${BACKEND_URL}/api/v1/user/verify-otp`,
        {
          email,
          otp: "111111",
        }
      );
      expect(responseAfterVerification.status).toBe(400);
      expect(responseAfterVerification.data.message).toBe(
        "User already verified"
      );
    } catch (error) {
      expect(false);
    }
  });

  it("If OTP is not correct", async () => {
    try {
      const { username, email, password } = userDetails();
      await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username,
        email,
        password,
      });

      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/verify-otp`,
        {
          email,
          otp: "222222",
        }
      );

      expect(response.status).toBe(401);
      expect(response.data.message).toBe("Invalid or expired OTP");
    } catch (error) {
      expect(false);
    }
  });
});

describe("SignIn Endpoints", () => {
  it;
});
