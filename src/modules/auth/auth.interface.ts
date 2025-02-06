import { ApiProperty } from '@nestjs/swagger';

export class AuthenticationResponse {
  @ApiProperty({
    type: String,
    description: 'The users access token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlNDEyZjVlMi0wNTEzLTRjMDktYTI3NC1kODNlNDg0NWRkMDQiLCJlbWFpbCI6ImRldkB0cmVsbG8tY2xvbmUuY29tIiwiaWF0IjoxNzA2MjMwMzE0LCJleHAiOjE3MDYyMzAzNzR9.wH_JT2UWBjpFItCKTEM2J56STjPhCAHPSnbYN4ueIpg',
  })
  public readonly access_token: string;
}
