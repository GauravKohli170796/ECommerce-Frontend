import { GoogleOAuthProvider } from '@react-oauth/google';
import '@testing-library/jest-dom';
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import React from "react";
import * as router from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Login from "../../components/auth/Login";
import { AppConst } from '../../constants/AppConst';
import { mockApiFailure } from '../../mocks/mockApiFailure';
import { server } from "../../mocks/server";
import { loginResponseStub } from '../../stubs/authStubs';

const navigate = jest.fn();


describe("Login Component", () => {

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => server.close());

  beforeEach(() => {
    jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
    localStorage.clear();
  })


  test("Should navigate to showProducts page, if already loggedIn", async () => {
    localStorage.setItem(AppConst.storageKeys.accessToken, "test-access-token");
    render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);
    expect(navigate).toHaveBeenCalledWith('/product/showProducts');

  });

  test("Should render email and password input fields if not log in.", () => {
    render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);

    const emailInputElement = screen.getByRole('textbox', {
      name: /email/i
    });
    expect(emailInputElement).toBeInTheDocument();

    const passwordInputElement = screen.getByLabelText(/password/i);
    expect(passwordInputElement).toBeInTheDocument();

    const logInButtonElement = screen.getByRole('button', {
      name: /login/i
    });
    expect(logInButtonElement).toBeInTheDocument();
    expect(navigate).toBeCalledTimes(0);

  });

  test("Login Button should remain Disabled till we enter invalid inputs", async () => {
    const user = userEvent.setup();
    render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);

    const emailInputElement = screen.getByRole('textbox', {
      name: /email/i
    });
    expect(emailInputElement).toBeInTheDocument();
    await act(async () => {
      await user.type(emailInputElement, "xyz@gmail.com");
    });

    const passwordInputElement = screen.getByLabelText(/password/i);
    expect(passwordInputElement).toBeInTheDocument();

    await act(async () => {
      await user.type(passwordInputElement, "12345");
    });

    const logInButtonElement = screen.getByRole('button', {
      name: /login/i
    });
    expect(logInButtonElement).toBeInTheDocument();
    expect(logInButtonElement).toBeDisabled();
  });

  test("LocalStorage should not be set on unsuccessful Login API Failure", async () => {
    const userName = "xyz@gmail.com";
    const password = "test-password";
    const user = userEvent.setup();
    render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);

    const emailInputElement = screen.getByRole('textbox', {
      name: /email/i
    });
    expect(emailInputElement).toBeInTheDocument();
    await act(async () => {
      await user.type(emailInputElement, userName);
    });

    const passwordInputElement = screen.getByLabelText(/password/i);
    expect(passwordInputElement).toBeInTheDocument();

    await act(async () => {
      await user.type(passwordInputElement, password);
    });

    const logInButtonElement = screen.getByRole('button', {
      name: /login/i
    });
    expect(logInButtonElement).toBeInTheDocument();
    expect(logInButtonElement).not.toBeDisabled();
    mockApiFailure(`${AppConst.BackendURL}api/v1/auth/Login`,"post", 403)
    await act(async () => {
      await user.click(logInButtonElement);
    });

    const access_token = localStorage.getItem(AppConst.storageKeys.accessToken);
    const refresh_token = localStorage.getItem(AppConst.storageKeys.refreshToken);

    expect(access_token).toBe(null);
    expect(refresh_token).toBe(null);
    await waitFor(()=> {
      expect(navigate).toBeCalledTimes(0);
    })
  });

  test("LocalStorage should be set and navigation to product page on successful Login", async () => {
    const userName = "xyz@gmail.com";
    const password = "test-password";
    const user = userEvent.setup();
    render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);

    const emailInputElement = screen.getByRole('textbox', {
      name: /email/i
    });
    expect(emailInputElement).toBeInTheDocument();
    await act(async () => {
      await user.type(emailInputElement, userName);
    });

    const passwordInputElement = screen.getByLabelText(/password/i);
    expect(passwordInputElement).toBeInTheDocument();

    await act(async () => {
      await user.type(passwordInputElement, password);
    });

    const logInButtonElement = screen.getByRole('button', {
      name: /login/i
    });
    expect(logInButtonElement).toBeInTheDocument();
    expect(logInButtonElement).not.toBeDisabled();
    await act(async () => {
      await user.click(logInButtonElement);
    });

    const access_token = localStorage.getItem(AppConst.storageKeys.accessToken);
    const refresh_token = localStorage.getItem(AppConst.storageKeys.refreshToken);

    expect(access_token).toBe(loginResponseStub.accessToken);
    expect(refresh_token).toBe(loginResponseStub.refreshToken);
    await waitFor(()=> {
      expect(navigate).toBeCalledWith("/product/showProducts");
    })
  });

test("Checking singnup and shopping links", async()=>{
  render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);
  const signupLink = screen.getByRole('link', {
    name: /signup/i
  });
  expect(signupLink).toHaveAttribute('href', '/auth/signup');

  const shoppingLink = screen.getByRole('link', {
    name: /shopping/i
  });
  expect(shoppingLink).toHaveAttribute('href', '/product/showProducts');

});

test("should render forget password view when click on forget password", async()=>{
  const user = userEvent.setup();
  render(<BrowserRouter><GoogleOAuthProvider clientId="test-client-id"><Login /></GoogleOAuthProvider></BrowserRouter>);

  const forgetPasswordButton = screen.getByRole('button', {
    name: /Forgot Password/i
  });

  await act(async()=>{
    await user.click(forgetPasswordButton);
  });

  const textElement = screen.getByText(/Forgot Password/i);
  expect(textElement).toBeInTheDocument();

  const emailInputElement = screen.getByRole('textbox', {
    name: /email/i
  });
  expect(emailInputElement).toBeInTheDocument();

  const getOtpInputElement = screen.getByRole('button', {
    name: /Get Otp/i
  });
  expect(getOtpInputElement).toBeInTheDocument();
});

});