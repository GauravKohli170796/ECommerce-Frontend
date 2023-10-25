import { rest } from 'msw';
import { server } from "./server";

export const mockApiFailure = (url:string,method:string,returnStatus = 500)=>{
    if(method === "get"){
        server.use(rest.get(url, (req, res, ctx) => {
            return res(
              ctx.status(returnStatus || 500)
            )
          }));
    }
    else if(method === "post"){
        server.use(rest.post(url, (req, res, ctx) => {
            return res(
              ctx.status(returnStatus || 500)
            )
          }));
    }
    else if(method === "put"){
        server.use(rest.put(url, (req, res, ctx) => {
            return res(
              ctx.status(returnStatus || 500)
            )
          }));
    }
    else {
        server.use(rest.delete(url, (req, res, ctx) => {
            return res(
              ctx.status(returnStatus || 500)
            )
          }));
    }

};