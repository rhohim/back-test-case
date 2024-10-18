import swaggerJsDoc from 'swagger-jsdoc'

const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend Test Case API',
      version: '1.0.0',
      description: 'API documentation',
      contact: {
        name : "Abdhul Rhohim",
        url : "https://abdl-portfolio.vercel.app/",
        email : "abdl.rhohim@gmail.com",
      },
    },
    servers: [
      {
        url: 'http://localhost:' + process.env.PORT,
      },
    ],
    components: {
      },
    },
    apis: ['./routes/*.ts'],
}
const swaggerDocs = swaggerJsDoc(swaggerOptions);


export default swaggerDocs;