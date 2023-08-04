import { IsEmail, IsNotEmpty } from "class-validator";

export class AdminRequest {
    @IsNotEmpty()
    public name: string;

    public role: number;

    @IsNotEmpty()
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    public password: string;
}
