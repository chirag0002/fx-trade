import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { SWAGGER_CONFIG } from './swagger.config';

export function createDocument(app: INestApplication): OpenAPIObject {
    const builder = new DocumentBuilder()
        .setTitle(SWAGGER_CONFIG.title)
        .setDescription(SWAGGER_CONFIG.description)
        .addCookieAuth(SWAGGER_CONFIG.cookie_name)
        .setVersion(SWAGGER_CONFIG.version);


    const options = builder.build();

    return SwaggerModule.createDocument(app, options);
}