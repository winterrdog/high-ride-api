import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RidesModule } from "./rides/rides.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";

// load environment variables
import * as dotenv from "dotenv";
dotenv.config();

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URI), // connect to db
        UsersModule,
        RidesModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
