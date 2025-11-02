const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Payment Service API',
      version: '1.0.0',
      description: 'Digital Payment E-Wallet - Transaction & Payment Service (Express.js)',
      contact: {
        name: 'API Support',
        email: 'admin@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8002',
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'Transactions',
        description: 'Transaction management endpoints'
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Payment Service API Documentation'
  }));

  // JSON endpoint for swagger spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger documentation available at http://localhost:8002/api-docs');
};

module.exports = setupSwagger;


