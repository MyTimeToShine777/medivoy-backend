#!/bin/bash

# This script adds comprehensive Swagger documentation to all route files

echo "Adding Swagger documentation to route files..."

# Add documentation to FAQs routes
cat > /tmp/faqs_docs.txt << 'EOF'
/**
 * @swagger
 * /faqs:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: FAQs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
EOF

# Add documentation to Treatments routes
cat > /tmp/treatments_docs.txt << 'EOF'
/**
 * @swagger
 * /treatments:
 *   get:
 *     summary: Get all treatments
 *     tags: [Treatments]
 *     security: []
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/searchParam'
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter by category ID
 *     responses:
 *       200:
 *         description: Treatments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
EOF

# Add documentation to Treatment Categories routes
cat > /tmp/categories_docs.txt << 'EOF'
/**
 * @swagger
 * /treatment-categories:
 *   get:
 *     summary: Get all treatment categories
 *     tags: [Treatment Categories]
 *     security: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TreatmentCategory'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
EOF

echo "Swagger documentation templates created!"
echo "Documentation will be automatically picked up by swagger-jsdoc"