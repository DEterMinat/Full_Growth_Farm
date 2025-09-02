const express = require('express');
const { body, validationResult } = require('express-validator');
const { MarketplaceProduct, Order, OrderItem } = require('../models/Marketplace');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status = 'available' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status };
    if (category) {
      whereClause.category = category;
    }

    const { count, rows: products } = await MarketplaceProduct.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch products',
        status: 500
      }
    });
  }
});

// Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await MarketplaceProduct.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }

    res.json({ product });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch product',
        status: 500
      }
    });
  }
});

// Create product
router.post('/products', authenticateToken, [
  body('name').notEmpty().trim(),
  body('category').notEmpty().trim(),
  body('price').isNumeric().isFloat({ min: 0 }),
  body('unit').notEmpty().trim(),
  body('quantity').isInt({ min: 0 }),
  body('description').optional().trim(),
  body('imageUrl').optional().isURL()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const productData = {
      ...req.body,
      sellerId: req.user.id
    };

    const product = await MarketplaceProduct.create(productData);

    // Fetch the created product with seller info
    const createdProduct = await MarketplaceProduct.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json({
      message: 'Product created successfully',
      product: createdProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create product',
        status: 500
      }
    });
  }
});

// Update product
router.put('/products/:id', authenticateToken, [
  body('name').optional().notEmpty().trim(),
  body('category').optional().notEmpty().trim(),
  body('price').optional().isNumeric().isFloat({ min: 0 }),
  body('unit').optional().notEmpty().trim(),
  body('quantity').optional().isInt({ min: 0 }),
  body('description').optional().trim(),
  body('imageUrl').optional().isURL(),
  body('status').optional().isIn(['available', 'out_of_stock', 'discontinued'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const product = await MarketplaceProduct.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }

    // Check if user owns the product
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to update this product',
          status: 403
        }
      });
    }

    await product.update(req.body);

    // Fetch updated product with seller info
    const updatedProduct = await MarketplaceProduct.findByPk(product.id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update product',
        status: 500
      }
    });
  }
});

// Delete product
router.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await MarketplaceProduct.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: {
          message: 'Product not found',
          status: 404
        }
      });
    }

    // Check if user owns the product
    if (product.sellerId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to delete this product',
          status: 403
        }
      });
    }

    await product.destroy();

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to delete product',
        status: 500
      }
    });
  }
});

// Get user's orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { buyerId: req.user.id };
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: MarketplaceProduct,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'username', 'firstName', 'lastName']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ],
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch orders',
        status: 500
      }
    });
  }
});

// Create order
router.post('/orders', authenticateToken, [
  body('items').isArray().notEmpty(),
  body('items.*.productId').isInt(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('shippingAddress').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const { items, shippingAddress, notes } = req.body;

    // Validate products and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await MarketplaceProduct.findByPk(item.productId);
      
      if (!product) {
        return res.status(400).json({
          error: {
            message: `Product with ID ${item.productId} not found`,
            status: 400
          }
        });
      }

      if (product.status !== 'available') {
        return res.status(400).json({
          error: {
            message: `Product "${product.name}" is not available`,
            status: 400
          }
        });
      }

      if (product.quantity < item.quantity) {
        return res.status(400).json({
          error: {
            message: `Insufficient stock for product "${product.name}". Available: ${product.quantity}, Requested: ${item.quantity}`,
            status: 400
          }
        });
      }

      const subtotal = parseFloat(product.price) * item.quantity;
      totalAmount += subtotal;

      validatedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        subtotal: subtotal
      });
    }

    // Create order
    const order = await Order.create({
      buyerId: req.user.id,
      totalAmount: totalAmount,
      shippingAddress,
      notes
    });

    // Create order items
    const orderItems = await OrderItem.bulkCreate(
      validatedItems.map(item => ({
        ...item,
        orderId: order.id
      }))
    );

    // Update product quantities
    for (const item of items) {
      await MarketplaceProduct.decrement('quantity', {
        by: item.quantity,
        where: { id: item.productId }
      });
    }

    // Fetch complete order with items
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: MarketplaceProduct,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'username', 'firstName', 'lastName']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    res.status(201).json({
      message: 'Order created successfully',
      order: createdOrder
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to create order',
        status: 500
      }
    });
  }
});

// Get single order
router.get('/orders/:id', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: MarketplaceProduct,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'username', 'firstName', 'lastName']
                }
              ]
            }
          ]
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'username', 'firstName', 'lastName']
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404
        }
      });
    }

    // Check if user owns the order
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to view this order',
          status: 403
        }
      });
    }

    res.json({ order });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch order',
        status: 500
      }
    });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateToken, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          details: errors.array(),
          status: 400
        }
      });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: {
          message: 'Order not found',
          status: 404
        }
      });
    }

    // Check if user owns the order
    if (order.buyerId !== req.user.id) {
      return res.status(403).json({
        error: {
          message: 'You do not have permission to update this order',
          status: 403
        }
      });
    }

    await order.update({ status: req.body.status });

    res.json({
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update order status',
        status: 500
      }
    });
  }
});

module.exports = router;
