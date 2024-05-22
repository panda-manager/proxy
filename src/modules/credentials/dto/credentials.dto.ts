import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDTO {
  @ApiProperty({ type: String, example: 'Facebook' })
  readonly display_name: string;

  @ApiProperty({ type: String, example: 'doesnt.matter.il' })
  readonly host: string;

  @ApiProperty({ type: String, example: 'username' })
  readonly login: string;
}
