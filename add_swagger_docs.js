#!/usr/bin/env node

/**
 * Script to add Swagger documentation to route files
 * This will add comprehensive OpenAPI 3.0 documentation
 */

const fs = require('fs');
const path = require('path');

// Template for Swagger documentation
const swaggerTemplate = {
  health: `
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 message:
 *                   type: string
 *                   example: Medivoy Healthcare API is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
`,
  
  listEndpoint: (resource, tag) => `
/**
 * @swagger
 * /${resource}:
 *   get:
 *     summary: Get all ${resource}
 *     description: Retrieve a paginated list of ${resource}
 *     tags: [${tag}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *     responses:
 *       200:
 *         description: ${tag} retrieved successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
`,

  getByIdEndpoint: (resource, tag) => `
/**
 * @swagger
 * /${resource}/{id}:
 *   get:
 *     summary: Get ${resource.slice(0, -1)} by ID
 *     description: Retrieve a single ${resource.slice(0, -1)} by ID
 *     tags: [${tag}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: ${tag.slice(0, -1)} retrieved successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
`,

  createEndpoint: (resource, tag) => `
/**
 * @swagger
 * /${resource}:
 *   post:
 *     summary: Create new ${resource.slice(0, -1)}
 *     description: Create a new ${resource.slice(0, -1)}
 *     tags: [${tag}]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: ${tag.slice(0, -1)} created successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
`,

  updateEndpoint: (resource, tag) => `
/**
 * @swagger
 * /${resource}/{id}:
 *   put:
 *     summary: Update ${resource.slice(0, -1)}
 *     description: Update an existing ${resource.slice(0, -1)}
 *     tags: [${tag}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: ${tag.slice(0, -1)} updated successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
`,

  deleteEndpoint: (resource, tag) => `
/**
 * @swagger
 * /${resource}/{id}:
 *   delete:
 *     summary: Delete ${resource.slice(0, -1)}
 *     description: Delete a ${resource.slice(0, -1)}
 *     tags: [${tag}]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/idParam'
 *     responses:
 *       200:
 *         description: ${tag.slice(0, -1)} deleted successfully
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
`
};

console.log('Swagger documentation template created');
console.log('This script can be used to add docs to route files');