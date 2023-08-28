import {
    IsAlpha,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    readonly firstName: string;

    @IsNotEmpty()
    @IsString()
    @IsAlpha()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(64)
    readonly password: string;

    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber("UG")
    readonly phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(["driver", "passenger"])
    readonly role: string;
}

export class UpdateDriverStatusDto {
    @IsNotEmpty()
    @IsString()
    @IsEnum(["available", "unavailable"])
    readonly driverStatus: "available" | "unavailable";
}
