import { AuthenticationResponse } from '../../src/modules/auth/auth.interface';
import { AuthenticatedRequest } from '../../src/shared/interfaces/request.interface';
import { mockUserFactory } from './user.mock';

export const mockPassword: string = 'mock-password';

export const mockAuthenticatedRequest: AuthenticatedRequest = {
  user: mockUserFactory(),
} as AuthenticatedRequest;

export const mockAuthenticationResponse: AuthenticationResponse = {
  access_token: 'mock-access-token',
};
