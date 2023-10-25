// src/mocks/server.js
import { setupServer } from 'msw/node';
import { authHandlers } from './authHandlers';
import { cartHandlers } from './cartHandler';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...authHandlers,...cartHandlers);