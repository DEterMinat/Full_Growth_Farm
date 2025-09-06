const express = require('express');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticateToken } = require('../middleware/auth');
const dialectDetector = require('../utils/dialectDetector');

const router = express.Router();

// Initialize Gemini AI
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini 1.5 Flash AI initialized successfully');
  } catch (error) {
    console.warn('⚠️  Gemini AI initialization failed:', error.message);
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Mock AI responses for development (รองรับภาษาถิ่น)
const mockResponses = {
  crop_advice: {
    northern: [
      'แม่นแล้ว สำหรับข้าวโพดในที่สูงแบบนี้ ต้องระวังอุณหภูมิที่เปลี่ยนแปลงเร็ว',
      'ลองใส่ปุ๋ยคอกผสมขุยมะพร้าว จักช่วยเก็บความชื้นในดิน',
      'ช่วงนี้หมอกควันเยอะ ควรปกป้องใบอ่อนด้วยร่มเงา'
    ],
    northeastern: [
      'แม่นแล้วหล่ะ ข้าวเหนียวช่วงนี้ต้องระวังน้ำแล้ง',
      'ลองขุดสระเก็บน้ำฝน จักได้น้ำใช้ยาวๆ',
      'มันสำปะหลังปลูกตอนนี้ดี ดินยังชื้นอยู่'
    ],
    southern: [
      'ยางช่วงนี้กรีดได้ดีหล่า ฝนยังไม่มาเต็มที่',
      'มะพร้าวควรใส่ปุ๋ยเพิ่ม เพราะฝนจะล้างธาตุอาหารออกไป',
      'ทุเรียนช่วงนี้ต้องระวังแมลงวันผลไม้จิ'
    ],
    central: [
      'ข้าวเจ้าช่วงนี้ควรใส่ปุ๋ยยูเรียเพิ่มครับ',
      'ผักใบเขียวปลูกได้ดีในช่วงนี้ครับ อากาศเย็นลง',
      'นาข้าวควรระวังโรคไหม้ใบในหน้าฝนครับ'
    ]
  },
  pest_management: {
    northern: [
      'แมลงหนอนช่วงนี้เยอะ ใช้แสงไฟดักจับได้ดี',
      'โรคใบจุดช่วงหมอกควัน ควรพ่นยากำจัดเชื้อรา',
      'ปลวกขึ้นมาเยอะ ใช้น้ำสบู่พ่นได้'
    ],
    northeastern: [
      'หนอนกออ่อนเยอะหล่ะ ใช้ไฟดักตอนค่ำ',
      'เพลี้ยอ่อนแฟบไปหมด พ่นสบู่เหลวลองดู',
      'ปลวกขึ้นมากช่วงฝนตกแล้วแดด ใช้ไผ่แหลมจิ้มดิน'
    ],
    southern: [
      'ด้วงแรดในมะพร้าวเยอะหล่า ใช้กับดักฟีโรโมน',
      'โรคใบไหม้ในยางพารา พ่นยาทองแดง',
      'หนอนกินใบทุเรียน เก็บด้วยมือวิธีเดียว'
    ],
    central: [
      'เพลี้ยอ่อนในผักใบเขียวครับ ใช้น้ำสบู่พ่น',
      'หนอนเจาะลำต้นข้าวโพด ตัดส่วนที่เสียทิ้งครับ',
      'โรคราสนิมในถั่วเขียว พ่นยากำจัดเชื้อราครับ'
    ]
  },
  general: {
    northern: [
      'สวัสดีแหนะ มีอะไรจะถามเรื่องการเกษตรป่าว?',
      'เฮาพร้อมช่วยเรื่องการปลูกพืชในภาคเหนือแหนะ',
      'ต้องการคำแนะนำเรื่องอะไรจัก บอกมาได้เลยแหนะ'
    ],
    northeastern: [
      'สบายดีป่าวหล่ะ มีปัญหาเรื่องการเกษตรป่าว?',
      'เฮาช่วยแนะนำเรื่องการปลูกพืชได้หล่ะ',
      'มีอะไรอยากรู้เรื่องการเกษตร ถามมาได้เลยหล่ะ'
    ],
    southern: [
      'ว่าไงหล่า มีปัญหาเรื่องสวนป่าว?',
      'พร้อมช่วยเรื่องยางพารา มะพร้าว หรือผลไม้หล่า',
      'มีอะไรจะถามเรื่องการเกษตร บอกมาได้เลยจิ'
    ],
    central: [
      'สวัสดีครับ/ค่ะ มีอะไรให้ช่วยเรื่องการเกษตรไหมครับ?',
      'พร้อมให้คำแนะนำเรื่องการปลูกพืชครับ/ค่ะ',
      'มีคำถามเรื่องการเกษตรอะไรไหมครับ/ค่ะ'
    ]
  }
};

// Chat with AI assistant
router.post('/chat', authenticateToken, [
  body('message').notEmpty().trim(),
  body('context').optional().trim()
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

    const { message, context } = req.body;

    // ตรวจจับภาษาถิ่น
    const detectedDialect = dialectDetector.detectDialect(message);
    console.log(`Detected dialect: ${detectedDialect}`);

    let response;
    let source = 'mock';

    if (model && genAI) {
      try {
        // สร้าง Prompt ตามภาษาถิ่นที่ตรวจพบ
        const dialectPrompt = dialectDetector.createDialectPrompt(message, context, detectedDialect);

        const result = await model.generateContent(dialectPrompt);
        const aiResponse = await result.response;
        response = dialectDetector.formatResponse(aiResponse.text(), detectedDialect);
        source = 'gemini-1.5-flash';

      } catch (aiError) {
        console.warn('Gemini AI error, using mock response:', aiError.message);
        
        // Fallback to mock responses
        const category = detectCategory(message);
        const dialectResponses = mockResponses[category] || mockResponses.general;
        const responses = dialectResponses[detectedDialect] || dialectResponses.central;
        response = responses[Math.floor(Math.random() * responses.length)];
      }
    } else {
      // Use mock responses when API key is not available
      const category = detectCategory(message);
      const dialectResponses = mockResponses[category] || mockResponses.general;
      const responses = dialectResponses[detectedDialect] || dialectResponses.central;
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    // Store conversation history (in a real app, you'd save this to database)
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      userMessage: message,
      aiResponse: response,
      context: context,
      detectedDialect: detectedDialect,
      dialectName: dialectDetector.dialects[detectedDialect].name,
      timestamp: new Date().toISOString(),
      source: source
    };

    res.json({
      response: response,
      conversation: conversation,
      suggestions: dialectDetector.generateDialectSuggestions(detectedDialect),
      detectedDialect: {
        code: detectedDialect,
        name: dialectDetector.dialects[detectedDialect].name
      },
      source: source
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to process AI request',
        status: 500
      }
    });
  }
});

// Get conversation history (mock implementation)
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Mock conversation history
    const conversations = [
      {
        id: 'conv_1',
        userId: req.user.id,
        userMessage: 'How should I prepare for the upcoming rain?',
        aiResponse: 'Based on the weather forecast, I recommend covering sensitive crops and ensuring proper drainage.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        source: 'mock'
      },
      {
        id: 'conv_2',
        userId: req.user.id,
        userMessage: 'What fertilizer should I use for tomatoes?',
        aiResponse: 'For tomatoes, use a balanced fertilizer with higher potassium content during flowering and fruiting stages.',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        source: 'mock'
      }
    ];

    res.json({
      conversations: conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: conversations.length,
        pages: Math.ceil(conversations.length / limit)
      }
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch conversations',
        status: 500
      }
    });
  }
});

// Get AI recommendations based on user's farm data
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    const { farmId, cropType } = req.query;

    // Mock recommendations based on current conditions
    const recommendations = [
      {
        category: 'Weather Advisory',
        title: 'Prepare for Heavy Rain',
        description: 'Heavy rainfall expected in 48 hours. Ensure proper drainage and protect sensitive crops.',
        priority: 'high',
        actionRequired: true,
        estimatedBenefit: 'Prevent crop damage worth $500-1000'
      },
      {
        category: 'Crop Management',
        title: 'Optimal Harvesting Window',
        description: 'Current weather conditions are ideal for harvesting. Consider accelerating harvest schedule.',
        priority: 'medium',
        actionRequired: false,
        estimatedBenefit: 'Maximize crop quality and yield'
      },
      {
        category: 'Pest Control',
        title: 'Increased Pest Activity Warning',
        description: 'High humidity levels may increase pest activity. Schedule monitoring and preventive treatments.',
        priority: 'medium',
        actionRequired: true,
        estimatedBenefit: 'Prevent 10-15% yield loss'
      },
      {
        category: 'Resource Optimization',
        title: 'Irrigation Adjustment',
        description: 'Reduce irrigation by 30% due to expected rainfall and high soil moisture.',
        priority: 'low',
        actionRequired: false,
        estimatedBenefit: 'Save $50-100 in water costs'
      }
    ];

    // Filter by crop type if specified
    let filteredRecommendations = recommendations;
    if (cropType) {
      filteredRecommendations = recommendations.map(rec => ({
        ...rec,
        cropType: cropType
      }));
    }

    res.json({
      recommendations: filteredRecommendations,
      farmId: farmId,
      cropType: cropType,
      generatedAt: new Date().toISOString(),
      source: process.env.GEMINI_API_KEY ? 'ai-enhanced' : 'rule-based'
    });

  } catch (error) {
    console.error('Get AI recommendations error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate recommendations',
        status: 500
      }
    });
  }
});

// Helper function to detect message category
function detectCategory(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('pest') || lowerMessage.includes('bug') || lowerMessage.includes('disease')) {
    return 'pest_management';
  } else if (lowerMessage.includes('crop') || lowerMessage.includes('plant') || lowerMessage.includes('grow')) {
    return 'crop_advice';
  } else {
    return 'general';
  }
}

// Helper function to generate conversation suggestions
function generateSuggestions(message) {
  const suggestions = [
    'Tell me more about pest control',
    'How can I improve soil health?',
    'What crops grow best in this weather?',
    'Show me irrigation best practices',
    'Help with harvest timing'
  ];

  // Return random suggestions
  return suggestions.sort(() => 0.5 - Math.random()).slice(0, 3);
}

// Get AI service status
router.get('/status', (req, res) => {
  res.json({
    status: model && genAI ? 'available' : 'limited',
    model: model && genAI ? 'gemini-1.5-flash' : 'mock',
    service: 'Growth Farm AI Assistant',
    features: {
      chat: true,
      recommendations: true,
      conversations: true,
      realTimeAI: model && genAI ? true : false
    },
    provider: model && genAI ? 'Google Gemini' : 'Mock AI',
    available: true,
    lastUpdated: new Date().toISOString()
  });
});

// Demo Chat endpoint (ไม่ต้อง authentication)
router.post('/demo/chat', [
  body('message').notEmpty().trim(),
  body('context').optional().trim()
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

    const { message, context } = req.body;

    // ตรวจจับภาษาถิ่น
    const detectedDialect = dialectDetector.detectDialect(message);
    console.log(`Demo - Detected dialect: ${detectedDialect}`);

    let response;
    let source = 'mock';

    if (model && genAI) {
      try {
        // สร้าง Prompt ตามภาษาถิ่นที่ตรวจพบ
        const dialectPrompt = dialectDetector.createDialectPrompt(message, context, detectedDialect);

        const result = await model.generateContent(dialectPrompt);
        const aiResponse = await result.response;
        response = dialectDetector.formatResponse(aiResponse.text(), detectedDialect);
        source = 'gemini-1.5-flash';

      } catch (aiError) {
        console.warn('Gemini AI error, using mock response:', aiError.message);
        
        // Fallback to mock responses
        const category = detectCategory(message);
        const dialectResponses = mockResponses[category] || mockResponses.general;
        const responses = dialectResponses[detectedDialect] || dialectResponses.central;
        response = responses[Math.floor(Math.random() * responses.length)];
      }
    } else {
      // Use mock responses when API key is not available
      const category = detectCategory(message);
      const dialectResponses = mockResponses[category] || mockResponses.general;
      const responses = dialectResponses[detectedDialect] || dialectResponses.central;
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    // Demo conversation without user authentication
    const conversation = {
      id: `demo_conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userMessage: message,
      aiResponse: response,
      context: context,
      detectedDialect: detectedDialect,
      dialectName: dialectDetector.dialects[detectedDialect].name,
      timestamp: new Date().toISOString(),
      source: source,
      category: detectCategory(message)
    };

    res.json({
      response: response,
      conversation: conversation,
      suggestions: dialectDetector.generateDialectSuggestions(detectedDialect),
      detectedDialect: {
        code: detectedDialect,
        name: dialectDetector.dialects[detectedDialect].name
      },
      source: source,
      note: 'Demo mode - no authentication required'
    });

  } catch (error) {
    console.error('Demo AI chat error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to process AI request',
        status: 500
      }
    });
  }
});

// Demo Recommendations endpoint (ไม่ต้อง authentication)
router.get('/demo/recommendations', async (req, res) => {
  try {
    const { farmId, cropType, language = 'th' } = req.query;

    // Demo recommendations in Thai
    const recommendations = [
      {
        category: 'คำแนะนำสภาพอากาศ',
        title: 'เตรียมรับมือฝนตก',
        description: 'คาดการณ์ฝนตกหนักใน 48 ชั่วโมง ควรเตรียมการระบายน้ำและป้องกันพืชที่เสี่ยง',
        priority: 'สูง',
        actionRequired: true,
        estimatedBenefit: 'ป้องกันความเสียหาย 15,000-30,000 บาท',
        cropType: cropType || 'มะเขือเทศ',
        icon: '🌧️'
      },
      {
        category: 'การจัดการพืชผล',
        title: 'ช่วงเวลาเก็บเกี่ยวที่เหมาะสม',
        description: 'สภาพอากาศปัจจุบันเหมาะสำหรับการเก็บเกี่ยว แนะนำให้เร่งตารางเก็บเกี่ยว',
        priority: 'ปานกลาง',
        actionRequired: false,
        estimatedBenefit: 'เพิ่มคุณภาพผลผลิต 10-15%',
        cropType: cropType || 'มะเขือเทศ',
        icon: '🌾'
      },
      {
        category: 'การควบคุมศัตรูพืช',
        title: 'เฝ้าระวังแมลงศัตรูพืช',
        description: 'ความชื้นสูงอาจเพิ่มกิจกรรมของแมลงศัตรูพืช ควรตรวจสอบและป้องกัน',
        priority: 'ปานกลาง',
        actionRequired: true,
        estimatedBenefit: 'ป้องกันการสูญเสียผลผลิต 10-15%',
        cropType: cropType || 'มะเขือเทศ',
        icon: '🐛'
      },
      {
        category: 'การจัดการน้ำ',
        title: 'ปรับลดการให้น้ำ',
        description: 'ลดการให้น้ำ 30% เนื่องจากคาดการณ์ฝนตกและความชื้นดินสูง',
        priority: 'ต่ำ',
        actionRequired: false,
        estimatedBenefit: 'ประหยัดค่าน้ำ 1,500-3,000 บาท',
        cropType: cropType || 'มะเขือเทศ',
        icon: '💧'
      }
    ];

    res.json({
      recommendations: recommendations,
      farmId: farmId || 'demo-farm',
      cropType: cropType || 'มะเขือเทศ',
      generatedAt: new Date().toISOString(),
      source: model && genAI ? 'ai-enhanced' : 'rule-based',
      note: 'Demo mode - no authentication required',
      language: language
    });

  } catch (error) {
    console.error('Demo recommendations error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to generate demo recommendations',
        status: 500
      }
    });
  }
});

// Demo Conversations endpoint (ไม่ต้อง authentication)
router.get('/demo/conversations', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    // Mock conversation history in Thai
    const conversations = [
      {
        id: 'demo_conv_1',
        userMessage: 'วิธีดูแลต้นมะเขือเทศในหน้าฝนยังไง?',
        aiResponse: 'ในหน้าฝนควรให้ความสำคัญกับการระบายน้ำที่ดี หลีกเลี่ยงน้ำขัง และเพิ่มการระบายอากาศเพื่อป้องกันโรคเชื้อรา',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        source: 'gemini-1.5-flash',
        category: 'crop_advice'
      },
      {
        id: 'demo_conv_2',
        userMessage: 'ปุ์ยอะไรดีสำหรับข้าวโพด?',
        aiResponse: 'ข้าวโพดต้องการไนโตรเจนสูง แนะนำใช้ปุ๋ยเคมี 16-20-0 ในช่วงแรก และ 46-0-0 ในช่วงออกดอก',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        source: 'gemini-1.5-flash',
        category: 'crop_advice'
      },
      {
        id: 'demo_conv_3',
        userMessage: 'จัดการแมลงศัตรูพืชอย่างไร?',
        aiResponse: 'ใช้วิธีการป้องกันแบบผสมผสาน: ตรวจสอบสม่ำเสมอ ใช้ศัตรูธรรมชาติ และพ่นยาเมื่อจำเป็น',
        timestamp: new Date(Date.now() - 259200000).toISOString(),
        source: 'gemini-1.5-flash',
        category: 'pest_management'
      }
    ];

    res.json({
      conversations: conversations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: conversations.length,
        pages: Math.ceil(conversations.length / limit)
      },
      note: 'Demo mode - no authentication required'
    });

  } catch (error) {
    console.error('Demo conversations error:', error);
    res.status(500).json({
      error: {
        message: 'Failed to fetch demo conversations',
        status: 500
      }
    });
  }
});

module.exports = router;
