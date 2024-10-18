import express from 'express'
import { Router } from 'express'
import returnController from '../controllers/returnController'

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
 *     Returned:
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
 *  name: Returned
 *  description : The Returned managing API
*/

//POST
/**
 * @swagger
 * /api/library/return:
 *   post:
 *     summary: Create a return data
 *     description: |
 *                  - The returned book is a book that the member has borrowed.
 *                  - If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days.
 *                  - When a member returns a book, the stock for that book_code is updated by adding 1.
 *     tags: [Returned]
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
 *             $ref: '#/components/schemas/Returned'
 *     responses:
 *       200:
 *         description: Return created successfully
 *       500:
 *         description: Error Inserting return data
 */

router.route('/')
    .post(returnController.postReturn)


export default router