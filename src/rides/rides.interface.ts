import { IsNotEmpty, IsNumber, IsString } from "class-validator";

/**
 * class to represent a location
 */
export class Location {
    @IsNotEmpty()
    @IsNumber()
    public readonly latitude: number;

    @IsNotEmpty()
    @IsNumber()
    public readonly longitude: number;

    @IsNotEmpty()
    @IsString()
    public readonly locationName: string;

    @IsNotEmpty()
    @IsString()
    public readonly country: string;
}
