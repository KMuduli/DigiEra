// DigitalEra - Swagger Configuration
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DigitalEra Blog CMS API',
      version: '1.0.0',
      description: 'REST API documentation for DigitalEra - A modern blogging & content management system.',
      contact: { name: 'DigitalEra Team' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development Server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
