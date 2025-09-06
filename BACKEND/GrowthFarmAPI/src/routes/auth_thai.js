const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Helper function for Thai validation messages
function getValidationMessage(field, type) {
  const messages = {
    email: {
      invalid: 'อีเมลไม่ถูกต้อง',
      required: 'กรุณากรอกอีเมล'
    },
    username: {
      too_short: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร',
      required: 'กรุณากรอกชื่อผู้ใช้'
    },
    password: {
      too_short: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
      required: 'กรุณากรอกรหัสผ่าน'
    },
    firstName: {
      required: 'กรุณากรอกชื่อ'
    },
    lastName: {
      required: 'กรุณากรอกนามสกุล'
    },
    login: {
      required: 'กรุณากรอกอีเมลหรือชื่อผู้ใช้'
    }
  };

  return messages[field]?.[type] || 'ข้อมูลไม่ถูกต้อง';
}

// สมัครสมาชิก
router.post('/register', [
  body('email')
    .isEmail()
    .withMessage('อีเมลไม่ถูกต้อง')
    .normalizeEmail(),
  body('username')
    .isLength({ min: 3 })
    .withMessage('ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .trim(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
  body('firstName')
    .notEmpty()
    .withMessage('กรุณากรอกชื่อ')
    .trim(),
  body('lastName')
    .notEmpty()
    .withMessage('กรุณากรอกนามสกุล')
    .trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }

    const { email, username, password, firstName, lastName, phoneNumber } = req.body;

    // ตรวจสอบว่ามีผู้ใช้นี้แล้วหรือไม่
    const existingUser = await User.findOne({
      where: {
        $or: [{ email }, { username }]
      }
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'อีเมล' : 'ชื่อผู้ใช้';
      return res.status(409).json({
        success: false,
        message: `${field}นี้มีผู้ใช้แล้ว`,
        field: existingUser.email === email ? 'email' : 'username'
      });
    }

    // สร้างผู้ใช้ใหม่
    const user = await User.create({
      email,
      username,
      password,
      firstName,
      lastName,
      phoneNumber: phoneNumber || null,
      role: 'FARMER',
      isActive: true
    });

    // สร้าง JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // ไม่ส่งรหัสผ่านกลับไป
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt
    };

    res.status(201).json({
      success: true,
      message: 'สมัครสมาชิกสำเร็จ',
      data: {
        user: userResponse,
        token,
        tokenType: 'Bearer',
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// เข้าสู่ระบบ
router.post('/login', [
  body('login')
    .notEmpty()
    .withMessage('กรุณากรอกอีเมลหรือชื่อผู้ใช้')
    .trim(),
  body('password')
    .notEmpty()
    .withMessage('กรุณากรอกรหัสผ่าน')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }

    const { login, password } = req.body;

    // หาผู้ใช้จากอีเมลหรือชื่อผู้ใช้
    const user = await User.findOne({
      where: {
        $or: [{ email: login }, { username: login }]
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือชื่อผู้ใช้ไม่ถูกต้อง'
      });
    }

    // ตรวจสอบว่าบัญชีเปิดใช้งานหรือไม่
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'บัญชีของคุณถูกปิดใช้งาน กรุณาติดต่อผู้ดูแลระบบ'
      });
    }

    // ตรวจสอบรหัสผ่าน
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านไม่ถูกต้อง'
      });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    // อัพเดทเวลาเข้าสู่ระบบล่าสุด
    await user.update({ 
      lastLoginAt: new Date() 
    });

    // ไม่ส่งรหัสผ่านกลับไป
    const userResponse = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt
    };

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      data: {
        user: userResponse,
        token,
        tokenType: 'Bearer',
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ข้อมูลผู้ใช้ปัจจุบัน
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    res.json({
      success: true,
      message: 'ดึงข้อมูลผู้ใช้สำเร็จ',
      data: {
        user: user
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// อัพเดทข้อมูลผู้ใช้
router.put('/profile', authenticateToken, [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('ชื่อต้องไม่เป็นค่าว่าง')
    .trim(),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('นามสกุลต้องไม่เป็นค่าว่าง')
    .trim(),
  body('phoneNumber')
    .optional()
    .isMobilePhone('th-TH')
    .withMessage('หมายเลขโทรศัพท์ไม่ถูกต้อง'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('อีเมลไม่ถูกต้อง')
    .normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    const { firstName, lastName, phoneNumber, email, address, dateOfBirth } = req.body;

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่ (ถ้ามีการแก้ไข)
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'อีเมลนี้มีผู้ใช้แล้ว'
        });
      }
    }

    // อัพเดทข้อมูล
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (email !== undefined) updateData.email = email;
    if (address !== undefined) updateData.address = address;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;

    await user.update(updateData);

    // ส่งข้อมูลผู้ใช้ที่อัพเดทแล้วกลับไป (ไม่รวมรหัสผ่าน)
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      success: true,
      message: 'อัพเดทข้อมูลสำเร็จ',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการอัพเดทข้อมูล',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// เปลี่ยนรหัสผ่าน
router.put('/change-password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('กรุณากรอกรหัสผ่านปัจจุบัน'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('รหัสผ่านยืนยันไม่ตรงกัน');
      }
      return true;
    })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'ข้อมูลไม่ถูกต้อง',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg,
          value: err.value
        }))
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    // ตรวจสอบรหัสผ่านปัจจุบัน
    const isValidPassword = await user.validatePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง'
      });
    }

    // อัพเดทรหัสผ่านใหม่
    await user.update({ password: newPassword });

    res.json({
      success: true,
      message: 'เปลี่ยนรหัสผ่านสำเร็จ'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ออกจากระบบ
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // ในกรณีที่ต้องการเก็บ blacklist token สามารถเพิ่มได้ที่นี่
    
    res.json({
      success: true,
      message: 'ออกจากระบบสำเร็จ'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการออกจากระบบ',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ตรวจสอบสถานะ token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'บัญชีของคุณถูกปิดใช้งาน'
      });
    }

    res.json({
      success: true,
      message: 'Token ถูกต้อง',
      data: {
        user: user
      }
    });

  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({
      success: false,
      message: 'เกิดข้อผิดพลาดในการตรวจสอบ Token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
