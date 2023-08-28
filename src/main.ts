import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";

// load environment variables
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // todo: add app middleware
    app.enableCors();
    app.use(helmet());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
