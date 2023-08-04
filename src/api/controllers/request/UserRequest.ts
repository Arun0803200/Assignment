import { IsEmail, IsNotEmpty } from "class-validator";

export class UserRequest {
    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public password: string;

    @IsNotEmpty()
    public role: string;

    @IsNotEmpty()
    @IsEmail()
    public email: string;
}