import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// load environment variables
import * as dotenv from "dotenv";
dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    // security headers
    app.use(helmet());

    // rate limiting
    const limiter = rateLimit({
        windowMs: 20 * 60 * 1000, // 20 minutes
        max: 100, // limit each IP to 100 requests per windowMs
        message:
            "Too many requests from this IP, please try again later in 20 minutes",
    });
    app.use(limiter);

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
