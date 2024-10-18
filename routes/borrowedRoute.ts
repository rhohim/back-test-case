import express from 'express'
import { Router } from 'express'
import borrowedController from '../controllers/borrowedController'

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
 *     Borrowed:
 *       type: object
 *       properties:
 *         member_code:
 *           type: string
 *           description: The code of the member borrowing the book
 *         book_code:
 *           type: string
 *           description: code for the book borrowed
 *       required:
 *         - book_code
 *         - member_code
 */

/** 
 *  @swagger
 * tags:
 *  name: Borrowed
 *  description : The borrowed managing API
*/

//GET
/**
 * @swagger
 * /api/library/borrow:
 *   get:
 *     summary: Read all borrowed data
 *     tags: [Borrowed]
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
 *         description: The number of members to return per page (optional)
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user
 *     responses:
 *       200:
 *         description: A list of all borrowed data
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Borrowed'
 *       500:
 *         description: Internal server error
 */

//POST
/**
 * @swagger
 * /api/library/borrow:
 *   post:
 *     summary: Create a new borrowed data
 *     description: |
 *                  - Members may not borrow more than 2 books.
 *                  - Borrowed books are not borrowed by other members.
 *                  - Member is currently not being penalized.
 *     tags: [Borrowed]
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
 *             $ref: '#/components/schemas/Borrowed'
 *     responses:
 *       200:
 *         description: borrowed created successfully
 *       500:
 *         description: Error Inserting borrowed
 */

//DELETE
/**
 * @swagger
 * /api/library/borrow:
 *   delete:
 *     summary: Delete all borrows
 *     tags: [Borrowed]
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
 *         description: All borrowed data deleted successfully
 *       500:
 *         description: Internal server error
 */

router.route('/')
    .get(borrowedController.getallBorrow)
    .post(borrowedController.postBorrow)
    .delete(borrowedController.deleteBorrow)


export default router