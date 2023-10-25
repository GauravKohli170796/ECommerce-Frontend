import { render } from "@testing-library/react";
import React from "react";
import * as router from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import CartList from "../../components/cart/CartList";
import { server } from "../../mocks/server";
import * as NotificationMsg from '../../services/createNotification';
const navigate = jest.fn();

describe("CartList Component",()=>{
    beforeAll(() => server.listen());

    afterEach(() => {
      server.resetHandlers();
    });
  
    afterAll(() => server.close());
  
    beforeEach(() => {
      jest.spyOn(router, 'useNavigate').mockImplementation(() => navigate)
      localStorage.clear();
    });

    test("should redirect to login if not loggedIn",()=>{
       const mockedShowNotificationMsg = jest.spyOn(NotificationMsg, 'showNotificationMsg').mockImplementation(() => jest.fn()) 
       render(<BrowserRouter><CartList/></BrowserRouter>);
       expect(navigate).toBeCalledWith("/auth/login");
       expect(mockedShowNotificationMsg).toBeCalledWith("You need to login first.", "warning");
    });

    // test("should  to login if not loggedIn",()=>{
    //    localStorage.setItem(AppConst.storageKeys.accessToken, "test-access-token");
    //    render(<BrowserRouter><CartList/></BrowserRouter>);
    //    expect(navigate).toBeCalledTimes(0);
    // });

});