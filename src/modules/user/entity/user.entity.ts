import { CreateDateColumn, ObjectId } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceDTO } from '../dto/device.dto';
import { IsEmail } from 'class-validator';

export class UserEntity {
  @ApiProperty({ description: "User's ObjectId" })
  _id: ObjectId;

  @ApiProperty({ type: String, example: 'John' })
  first_name: string;

  @ApiProperty({ type: String, example: 'Johnson' })
  last_name: string;

  @ApiProperty({ type: String, example: 'that@doesnt.matter.il ' })
  @IsEmail()
  email: string;

  @Exclude()
  master_password: string;

  @ApiProperty({ type: [DeviceDTO] })
  devices: DeviceDTO[];

  @ApiProperty({ type: Date, description: 'User creation UTC epoch' })
  @CreateDateColumn()
  created_at: Date;
}
