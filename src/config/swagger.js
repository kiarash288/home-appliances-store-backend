const swaggerJsdoc = require('swagger-jsdoc');

/**
 * OpenAPI 3.0 configuration for the Store e-commerce API.
 * Route-level docs are loaded from JSDoc annotations under src/routes.
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Store E-Commerce API',
      version: '1.0.0',
      description:
        'RESTful API for an e-commerce platform: authentication, catalog, basket, orders, and ZarinPal payments.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.APP_URL || 'http://localhost:3000',
        description: 'Current environment',
      },
    ],
    tags: [
      { name: 'Auth', description: 'Registration, login, and token refresh' },
      { name: 'Users', description: 'User profile and account management' },
      { name: 'Products', description: 'Product (Item) catalog' },
      { name: 'Categories', description: 'Product category tree' },
      { name: 'Basket', description: 'Shopping cart operations' },
      { name: 'Orders', description: 'Order creation and history' },
      { name: 'Payments', description: 'ZarinPal payment initiation and callback' },
      { name: 'Addresses', description: 'Shipping addresses' },
      { name: 'Reviews', description: 'Product reviews and moderation' },
      { name: 'Favorites', description: 'User wishlist / favorite products' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'JWT access token from login/refresh. Send as: `Authorization: Bearer <token>`.',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Order not found',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Validation failed',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Invalid email' },
                },
              },
            },
          },
        },

        // ---------- User ----------
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              example: 'user',
            },
            firstName: { type: 'string', example: 'Ali' },
            lastName: { type: 'string', example: 'Rezaei' },
            email: {
              type: 'string',
              format: 'email',
              example: 'ali@example.com',
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '09121234567',
            },
            isVerified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Product (Item) ----------
        Product: {
          type: 'object',
          description: 'Catalog product (Item model)',
          properties: {
            id: { type: 'integer', example: 12 },
            user_id: {
              type: 'integer',
              description: 'Seller user id',
              example: 3,
            },
            category_id: {
              type: 'integer',
              nullable: true,
              example: 2,
            },
            name: { type: 'string', example: 'Wireless Headphones' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Noise-cancelling Bluetooth headphones',
            },
            price: {
              type: 'number',
              format: 'float',
              example: 1299000,
            },
            stock: { type: 'integer', example: 25 },
            main_image: {
              type: 'string',
              nullable: true,
              example: '/uploads/products/headphones.jpg',
            },
            gallery: {
              type: 'array',
              nullable: true,
              items: { type: 'string' },
              example: ['/uploads/products/h1.jpg', '/uploads/products/h2.jpg'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Basket ----------
        BasketItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 5 },
            basket_id: { type: 'integer', example: 1 },
            item_id: { type: 'integer', example: 12 },
            quantity: { type: 'integer', example: 2 },
            item: { $ref: '#/components/schemas/Product' },
          },
        },
        Basket: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            basketItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/BasketItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Order ----------
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 8 },
            order_id: { type: 'integer', example: 4 },
            item_id: { type: 'integer', example: 12 },
            quantity: { type: 'integer', example: 2 },
            unit_price: {
              type: 'number',
              format: 'float',
              description: 'Price snapshot at checkout',
              example: 1299000,
            },
            item: { $ref: '#/components/schemas/Product' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 4 },
            tracking_code: {
              type: 'string',
              example: 'ORD-1710000000-1-A1B2C3',
            },
            user_id: { type: 'integer', example: 1 },
            address_id: {
              type: 'integer',
              nullable: true,
              example: 2,
            },
            total_amount: {
              type: 'number',
              format: 'float',
              example: 2598000,
            },
            status: {
              type: 'string',
              enum: [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
              ],
              example: 'pending',
            },
            orderItems: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' },
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Payment ----------
        Payment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 10 },
            order_id: { type: 'integer', example: 4 },
            amount: {
              type: 'number',
              format: 'float',
              example: 2598000,
            },
            gateway_name: {
              type: 'string',
              example: 'zarinpal',
            },
            tracking_code: {
              type: 'string',
              nullable: true,
              description: 'ZarinPal authority code',
              example: 'A000000000000000000000000000000000000',
            },
            ref_id: {
              type: 'string',
              nullable: true,
              description: 'ZarinPal reference id after successful verify',
              example: '123456789',
            },
            status: {
              type: 'string',
              enum: ['pending', 'success', 'failed'],
              example: 'pending',
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PaymentInitResponse: {
          type: 'object',
          properties: {
            payment: { $ref: '#/components/schemas/Payment' },
            authority: {
              type: 'string',
              example: 'A000000000000000000000000000000000000',
            },
            redirectUrl: {
              type: 'string',
              format: 'uri',
              example:
                'https://www.zarinpal.com/pg/StartPay/A000000000000000000000000000000000000',
            },
          },
        },

        // ---------- Favorite ----------
        Favorite: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 7 },
            user_id: { type: 'integer', example: 1 },
            item_id: { type: 'integer', example: 12 },
            item: { $ref: '#/components/schemas/Product' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Category ----------
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 2 },
            name: { type: 'string', example: 'Electronics' },
            description: {
              type: 'string',
              nullable: true,
              example: 'Phones, laptops, and accessories',
            },
            parentId: {
              type: 'integer',
              nullable: true,
              example: null,
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Address ----------
        Address: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 3 },
            userId: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Home' },
            city: { type: 'string', example: 'Tehran' },
            state: { type: 'string', example: 'Tehran' },
            postalCode: { type: 'string', example: '1234567890' },
            fullAddress: {
              type: 'string',
              example: 'Valiasr St, No. 12, Unit 5',
            },
            phone: { type: 'string', example: '09121234567' },
            isDefault: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // ---------- Review ----------
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 15 },
            user_id: { type: 'integer', example: 1 },
            item_id: { type: 'integer', example: 12 },
            rating: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: 'string',
              nullable: true,
              example: 'Excellent quality and fast shipping.',
            },
            is_approved: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
