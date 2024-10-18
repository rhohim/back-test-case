import express, { Request, Response } from "express";
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'

if (!process.env.NODE_ENV || process.env.NODE_ENV === "") {
  dotenv.config()
}

const app = express();

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

import authenticateAndAuthorize from "./config/authHandling" 

import booksRoute from './routes/booksRoute'
import membersRoute from './routes/membersRoute'
import borrowedRouter from './routes/borrowedRoute'
import returnedRouter from './routes/returnRoute'
import swaggerRouter from "./routes/swaggerRoute"


app.use('/api/library/book', authenticateAndAuthorize, booksRoute)
app.use('/api/library/member', authenticateAndAuthorize, membersRoute)
app.use('/api/library/borrow', authenticateAndAuthorize, borrowedRouter)
app.use('/api/library/return',authenticateAndAuthorize, returnedRouter)


// Swagger definition
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerRouter));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello, world!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on http://localhost:" + process.env.PORT);
});
