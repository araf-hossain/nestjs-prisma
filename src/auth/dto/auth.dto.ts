// Purpose: DTO for AuthController
// using class instead of interface because Nest Doc recommends it. 

import { IsEmail, IsNotEmpty, IsString } from "class-validator";

// https://docs.nestjs.com/controllers#request-payloads
export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}