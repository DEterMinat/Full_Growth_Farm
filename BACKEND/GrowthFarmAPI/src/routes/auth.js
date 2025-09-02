const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3 }).trim(),
  body('password').isLength({ min: 6 })
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

    const { email, username, password, firstName, lastName, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: 'User with this email or username already exists',
          status: 409
        }
      });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
      phoneNumber
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
      tokenType: 'Bearer'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to register user',
        status: 500
      }
    });
  }
});

// Login
router.post('/login', [
  body('login').notEmpty().trim(), // can be email or username
  body('password').notEmpty()
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

    const { login, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      where: {
        $or: [{ email: login }, { username: login }]
      }
    });

    if (!user || !await user.checkPassword(password)) {
      return res.status(401).json({
        error: {
          message: 'Invalid credentials',
          status: 401
        }
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: {
          message: 'Account is deactivated',
          status: 401
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.json({
      message: 'Login successful',
      user,
      token,
      tokenType: 'Bearer'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to login',
        status: 500
      }
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to get user information',
        status: 500
      }
    });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logged out successfully. Please remove the token from client storage.'
  });
});

// Update profile
router.put('/profile', authenticateToken, [
  body('email').optional().isEmail().normalizeEmail(),
  body('username').optional().isLength({ min: 3 }).trim(),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phoneNumber').optional().trim()
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

    const { email, username, firstName, lastName, phoneNumber } = req.body;

    // Check if email or username is already taken by another user
    if (email || username) {
      const existingUser = await User.findOne({
        where: {
          $or: [
            email ? { email } : null,
            username ? { username } : null
          ].filter(Boolean),
          id: { $ne: req.user.id }
        }
      });

      if (existingUser) {
        return res.status(409).json({
          error: {
            message: 'Email or username already exists',
            status: 409
          }
        });
      }
    }

    // Update user
    await req.user.update({
      email: email || req.user.email,
      username: username || req.user.username,
      firstName: firstName !== undefined ? firstName : req.user.firstName,
      lastName: lastName !== undefined ? lastName : req.user.lastName,
      phoneNumber: phoneNumber !== undefined ? phoneNumber : req.user.phoneNumber
    });

    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to update profile',
        status: 500
      }
    });
  }
});

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 })
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

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    if (!await req.user.checkPassword(currentPassword)) {
      return res.status(400).json({
        error: {
          message: 'Current password is incorrect',
          status: 400
        }
      });
    }

    // Update password
    await req.user.update({ password: newPassword });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to change password',
        status: 500
      }
    });
  }
});

module.exports = router;
