import express from 'express'
import { Router } from 'express'
import membersController from '../controllers/membersController'

const router : Router = express.Router()

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Member:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *           description: The code of the member
 *         name:
 *           type: string
 *           description: The title of the member
 *       required:
 *         - code
 *         - name
 */

/** 
 *  @swagger
 * tags:
 *  name: Member
 *  description : The members managing API
*/

//POST
/**
 * @swagger
 * /api/library/member:
 *   post:
 *     summary: Create a new member
 *     tags: [Member]
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
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: member created successfully
 *       500:
 *         description: Error Inserting members
 */

//GET
/**
 * @swagger
 * /api/library/member:
 *   get:
 *     summary: Read all members
 *     description: |
 *                  - Shows all existing members.
 *                  - The number of books being borrowed by each member.
 *     tags: [Member]
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
 *         description: A list of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *       500:
 *         description: Internal server error
 */

//DELETE
/**
 * @swagger
 * /api/library/member:
 *   delete:
 *     summary: Delete all members
 *     tags: [Member]
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
 *         description: All members deleted successfully
 *       500:
 *         description: Internal server error
 */

router.route('/')
    .get(membersController.getallMembers)
    .post(membersController.postMembers)
    .delete(membersController.deleteMembers)

//GET by ID
/**
 * @swagger
 * /api/library/member/{id}:
 *   get:
 *     summary: Read a member by ID
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the member to retrieve
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     responses:
 *       200:
 *         description: member retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Member'
 *       404:
 *         description: member not found
 *       500:
 *         description: Internal server error
 */

//DELETE by ID
/**
 * @swagger
 * /api/library/member/{id}:
 *   delete:
 *     summary: Delete a member by ID
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the member to delete
 *       - in: header
 *         name: x-user-role
 *         schema:
 *           type: string
 *           default: admin
 *         required: true
 *         description: Role of the user (should be 'admin')
 *     responses:
 *       200:
 *         description: member deleted successfully
 *       404:
 *         description: member not found
 *       500:
 *         description: Internal server error
 */

//PUT by ID
/**
 * @swagger
 * /api/library/member/{id}:
 *   put:
 *     summary: Update a member by ID
 *     tags: [Member]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the member to update
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
 *             $ref: '#/components/schemas/Member'
 *     responses:
 *       200:
 *         description: member updated successfully
 *       404:
 *         description: member not found
 *       500:
 *         description: Internal server error
 */
router.route('/:id')
    .get(membersController.getMembersbyID)
    .delete(membersController.deleteMembersbyID)
    .put(membersController.putMembersbyID)


export default router