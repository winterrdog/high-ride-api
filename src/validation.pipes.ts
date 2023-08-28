import {
    PipeTransform,
    BadRequestException,
    ArgumentMetadata,
    Injectable,
} from "@nestjs/common";

// validation pipe for hexadecimal strings
@Injectable()
export class IsHexadecimalStringPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata) {
        if (!this.isHexadecimal(value)) {
            throw new BadRequestException("Invalid identifier provided");
        }

        return value;
    }

    // method that checks if a string is a hexadecimal string
    private isHexadecimal(value: string) {
        const hexRegex = /^[0-9a-fA-F]+$/;
        return hexRegex.test(value);
    }
}

@Injectable()
export class IsRideStatusOkPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata) {
        if (!this.isRideStatus(value)) {
            throw new BadRequestException(
                "ride status must be one of: accepted, completed, canceled",
            );
        }

        return value;
    }

    private isRideStatus(value: string) {
        enum RideStatus {
            accepted = "accepted",
            completed = "completed",
            canceled = "canceled",
        }

        if (value in RideStatus) return true;

        return false;
    }
}

@Injectable()
export class IsBodyEmptyPipe implements PipeTransform<any> {
    transform(value: any, metadata: ArgumentMetadata) {
        if (Object.keys(value).length === 0) {
            throw new BadRequestException("Request body cannot be empty");
        }

        return value;
    }
}
