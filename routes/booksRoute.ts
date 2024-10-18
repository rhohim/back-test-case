import express from 'express'
import { Router } from 'express'
import booksController from "../controllers/booksController"

const router: Router = express.Router()
 
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: The code of the book
 *         title:
 *           type: string
 *           description: The title of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         stock:
 *           type: number
 *           description: The stock of the book
 *       required:
 *         - code
 *         - title
 *         - author
 *         - stock
 */

/** 
 *  @swagger
 * tags:
 *  name: Book
 *  description : The books managing API
*/

//POST
/**
 * @swagger
 * /api/library/book:
 *   post:
 *     summary: Create a new book
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book created successfully
 *       500:
 *         description: Error Inserting Books
 */

//GET
/**
 * @swagger
 * /api/library/book:
 *   get:
 *     summary: Read all books
 *     description: |
 *                  - Shows all existing books and quantities.
 *                  - Books that are being borrowed are not counted. 
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination (optional)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 15
 *         description: The number of books to return per page (optional)
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user
 *     responses:
 *       200:
 *         description: A list of all books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Internal server error
 */

//DELETE
/**
 * @swagger
 * /api/library/book:
 *   delete:
 *     summary: Delete all books
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     responses:
 *       200:
 *         description: All books deleted successfully
 *       500:
 *         description: Internal server error
 */

router.route('/')
    .post(booksController.postBooks)
    .get(booksController.getallBooks)
    .delete(booksController.deleteBooks)

//GET by ID
/**
 * @swagger
 * /api/library/book/{id}:
 *   get:
 *     summary: Read a book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to retrieve
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

//DELETE by ID
/**
 * @swagger
 * /api/library/book/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to delete
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

//PUT by ID
/**
 * @swagger
 * /api/library/book/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the book to update
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal server error
 */

router.route('/:id')
    .get(booksController.getBooksbyID)
    .delete(booksController.deleteBooksbyID)
    .put(booksController.putBooksbyID)






export default router

