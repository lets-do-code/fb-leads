import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { API_PREFIX } from '../constants/apiPaths';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Server',
      version: '1.0.0',
      description: 'API documentation for the Eazy-Build backend'
    },
    servers: [
      {
        url: `${API_PREFIX}`,
        description: 'Development server'
      }
    ]
  },
  // where your API routes are defined with Swagger JSDoc comments
  apis: ['./src/routes/*.ts', './src/models/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
