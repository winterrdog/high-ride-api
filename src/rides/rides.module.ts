import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RidesService } from "./rides.service";
import { Ride, RideSchema } from "./schemas/rides.schema";
import { RidesController } from './rides.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Ride.name, schema: RideSchema }]),
    ],
    providers: [RidesService],
    controllers: [RidesController],
})
export class RidesModule {}
