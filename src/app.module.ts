import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RidesModule } from "./rides/rides.module";
import { UsersModule } from "./users/users.module";

@Module({
    imports: [
        MongooseModule.forRoot(process.env.DB_URI), // connect to db
        UsersModule,
        RidesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
