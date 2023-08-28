import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

// load environment variables
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // todo: add app middleware
    app.enableCors();

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
