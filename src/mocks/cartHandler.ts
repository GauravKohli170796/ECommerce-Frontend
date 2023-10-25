// src/mocks/handlers.js
import { rest } from 'msw';
import { AppConst } from '../constants/AppConst';
import { loginResponseStub } from '../stubs/authStubs';

export const cartHandlers = [
  rest.get(`${AppConst.BackendURL}api/v1/user/getWishListItems`, (req, res, ctx) => {

    return res(
      ctx.status(200),
      ctx.json(loginResponseStub)
    )
  })
];