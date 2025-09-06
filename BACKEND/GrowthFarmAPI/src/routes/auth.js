const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail().withMessage('กรุณาใส่อีเมลที่ถูกต้อง'),
  body('username').isLength({ min: 3 }).trim().withMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
  body('password').isLength({ min: 6 }).withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'ข้อมูลไม่ถูกต้อง',
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
        success: false,
        error: {
          message: 'อีเมลหรือชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว',
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
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      },
      token,
      tokenType: 'Bearer'
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'ไม่สามารถสมัครสมาชิกได้',
        status: 500
      }
    });
  }
});

// Login
router.post('/login', [
  body('login').notEmpty().trim().withMessage('กรุณาใส่อีเมลหรือชื่อผู้ใช้'), // can be email or username
  body('password').notEmpty().withMessage('กรุณาใส่รหัสผ่าน')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'ข้อมูลไม่ถูกต้อง',
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
        success: false,
        error: {
          message: 'อีเมล/ชื่อผู้ใช้ หรือรหัสผ่านไม่ถูกต้อง',
          status: 401
        }
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'บัญชีผู้ใช้ถูกปิดใช้งาน',
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
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      },
      token,
      tokenType: 'Bearer'
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'ไม่สามารถเข้าสู่ระบบได้',
        status: 500
      }
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'ข้อมูลผู้ใช้',
      user: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'ไม่สามารถดึงข้อมูลผู้ใช้ได้',
        status: 500
      }
    });
  }
});

// Logout (client-side token invalidation)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'ออกจากระบบสำเร็จ กรุณาลบ token ออกจากเครื่องลูกข่าย'
  });
});

// Update profile
router.put('/profile', authenticateToken, [
  body('email').optional().isEmail().normalizeEmail().withMessage('กรุณาใส่อีเมลที่ถูกต้อง'),
  body('username').optional().isLength({ min: 3 }).trim().withMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
  body('firstName').optional().trim(),
  body('lastName').optional().trim(),
  body('phoneNumber').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'ข้อมูลไม่ถูกต้อง',
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
          success: false,
          error: {
            message: 'อีเมลหรือชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว',
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
      success: true,
      message: 'อัปเดตข้อมูลส่วนตัวสำเร็จ',
      user: req.user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'ไม่สามารถอัปเดตข้อมูลส่วนตัวได้',
        status: 500
      }
    });
  }
});

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('กรุณาใส่รหัสผ่านปัจจุบัน'),
  body('newPassword').isLength({ min: 6 }).withMessage('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'ข้อมูลไม่ถูกต้อง',
          details: errors.array(),
          status: 400
        }
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    if (!await req.user.checkPassword(currentPassword)) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง',
          status: 400
        }
      });
    }

    // Update password
    await req.user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'ไม่สามารถเปลี่ยนรหัสผ่านได้',
        status: 500
      }
    });
  }
});

module.exports = router;
