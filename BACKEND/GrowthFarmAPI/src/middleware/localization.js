// Middleware สำหรับจัดการภาษาไทย
const localization = {
  // ข้อความสำหรับ API responses
  messages: {
    // Success messages
    success: {
      created: 'สร้างข้อมูลสำเร็จ',
      updated: 'อัพเดทข้อมูลสำเร็จ',
      deleted: 'ลบข้อมูลสำเร็จ',
      fetched: 'ดึงข้อมูลสำเร็จ',
      login: 'เข้าสู่ระบบสำเร็จ',
      logout: 'ออกจากระบบสำเร็จ',
      register: 'สมัครสมาชิกสำเร็จ'
    },
    
    // Error messages
    error: {
      notFound: 'ไม่พบข้อมูล',
      unauthorized: 'ไม่มีสิทธิ์เข้าถึง',
      forbidden: 'ไม่อนุญาตให้เข้าถึง',
      validation: 'ข้อมูลไม่ถูกต้อง',
      duplicate: 'ข้อมูลซ้ำ',
      server: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
      database: 'เกิดข้อผิดพลาดของฐานข้อมูล',
      timeout: 'หมดเวลาการเชื่อมต่อ'
    },
    
    // Field-specific messages
    fields: {
      email: {
        required: 'กรุณากรอกอีเมล',
        invalid: 'รูปแบบอีเมลไม่ถูกต้อง',
        exists: 'อีเมลนี้มีอยู่ในระบบแล้ว'
      },
      password: {
        required: 'กรุณากรอกรหัสผ่าน',
        minLength: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
        weak: 'รหัสผ่านต้องมีความปลอดภัยมากขึ้น'
      },
      username: {
        required: 'กรุณากรอกชื่อผู้ใช้',
        minLength: 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร',
        exists: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว'
      },
      firstName: {
        required: 'กรุณากรอกชื่อ'
      },
      lastName: {
        required: 'กรุณากรอกนามสกุล'
      },
      phoneNumber: {
        invalid: 'หมายเลขโทรศัพท์ไม่ถูกต้อง'
      }
    },
    
    // Entity names
    entities: {
      user: 'ผู้ใช้',
      farm: 'ฟาร์ม',
      crop: 'พืชผล',
      product: 'สินค้า',
      order: 'คำสั่งซื้อ',
      notification: 'การแจ้งเตือน',
      report: 'รายงาน',
      device: 'อุปกรณ์',
      sensor: 'เซ็นเซอร์',
      weather: 'สภาพอากาศ',
      activity: 'กิจกรรม'
    },
    
    // Status messages
    status: {
      active: 'ใช้งานอยู่',
      inactive: 'ไม่ใช้งาน',
      pending: 'รออนุมัติ',
      approved: 'อนุมัติแล้ว',
      rejected: 'ปฏิเสธ',
      completed: 'เสร็จสิ้น',
      cancelled: 'ยกเลิก',
      processing: 'กำลังดำเนินการ'
    }
  },

  // HTTP status code messages in Thai
  httpMessages: {
    200: 'สำเร็จ',
    201: 'สร้างข้อมูลสำเร็จ',
    400: 'ข้อมูลไม่ถูกต้อง',
    401: 'ไม่มีสิทธิ์เข้าถึง',
    403: 'ไม่อนุญาตให้เข้าถึง',
    404: 'ไม่พบข้อมูล',
    409: 'ข้อมูลซ้ำ',
    422: 'ข้อมูลไม่สามารถประมวลผลได้',
    500: 'เกิดข้อผิดพลาดของเซิร์ฟเวอร์',
    503: 'บริการไม่พร้อมใช้งาน'
  },

  // Format Thai response
  formatResponse: (success, message, data = null, errors = null) => {
    const response = {
      success,
      message,
      timestamp: new Date().toISOString()
    };

    if (data !== null) {
      response.data = data;
    }

    if (errors !== null) {
      response.errors = errors;
    }

    return response;
  },

  // Format error response
  formatError: (statusCode, message, details = null) => {
    const response = {
      success: false,
      message: message || localization.httpMessages[statusCode] || 'เกิดข้อผิดพลาด',
      statusCode,
      timestamp: new Date().toISOString()
    };

    if (details) {
      response.details = details;
    }

    if (process.env.NODE_ENV === 'development' && details) {
      response.debug = details;
    }

    return response;
  },

  // Format validation errors
  formatValidationErrors: (errors) => {
    return errors.map(error => ({
      field: error.path || error.param,
      message: localization.getFieldMessage(error.path || error.param, error.msg) || error.msg,
      value: error.value
    }));
  },

  // Get field-specific message
  getFieldMessage: (field, type) => {
    return localization.messages.fields[field]?.[type] || type;
  },

  // Middleware function
  middleware: () => {
    return (req, res, next) => {
      // Add localization helper to response object
      res.success = (message, data = null, statusCode = 200) => {
        return res.status(statusCode).json(
          localization.formatResponse(true, message, data)
        );
      };

      res.error = (message, statusCode = 500, details = null) => {
        return res.status(statusCode).json(
          localization.formatError(statusCode, message, details)
        );
      };

      // Add Thai messages to request object
      req.thai = localization.messages;
      
      next();
    };
  }
};

module.exports = localization;
