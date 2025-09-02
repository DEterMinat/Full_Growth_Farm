const express = require('express');
const { body, validationResult } = require('express-validator');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini AI
let genAI = null;
let model = null;

if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });
  } catch (error) {
    console.warn('Gemini AI initialization failed:', error.message);
  }
}

// Mock AI responses for development
const mockResponses = {
  crop_advice: [
    'Based on the current weather conditions, I recommend checking soil moisture levels before the next watering cycle.',
    'Consider applying organic mulch to retain soil moisture and regulate temperature.',
    'The upcoming rain forecast suggests delaying fertilizer application until after the weather clears.'
  ],
  pest_management: [
    'High humidity levels create favorable conditions for fungal diseases. Ensure proper air circulation around plants.',
    'Monitor for signs of aphids and spider mites, which tend to increase during warm, dry periods.',
    'Consider using beneficial insects like ladybugs for natural pest control.'
  ],
  general: [
    'How can I help you with your farming questions today?',
    'I can provide advice on crop management, pest control, weather planning, and agricultural best practices.',
    'What specific farming challenge would you like assistance with?'
  ]
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

    let response;
    let source = 'mock';

    if (model && genAI) {
      try {
        // Prepare context for agricultural AI
        const agriculturalContext = `You are an expert agricultural AI assistant for a smart farming application. 
        User context: ${context || 'General farming inquiry'}
        
        Provide helpful, practical advice for farmers. Focus on:
        - Crop management and optimization
        - Weather-based recommendations  
        - Pest and disease management
        - Soil health and nutrition
        - Sustainable farming practices
        - Technology integration in farming
        
        User question: ${message}`;

        const result = await model.generateContent(agriculturalContext);
        const aiResponse = await result.response;
        response = aiResponse.text();
        source = 'gemini';

      } catch (aiError) {
        console.warn('Gemini AI error, using mock response:', aiError.message);
        
        // Fallback to mock responses
        const category = detectCategory(message);
        const responses = mockResponses[category] || mockResponses.general;
        response = responses[Math.floor(Math.random() * responses.length)];
      }
    } else {
      // Use mock responses when API key is not available
      const category = detectCategory(message);
      const responses = mockResponses[category] || mockResponses.general;
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    // Store conversation history (in a real app, you'd save this to database)
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user.id,
      userMessage: message,
      aiResponse: response,
      context: context,
      timestamp: new Date().toISOString(),
      source: source
    };

    res.json({
      response: response,
      conversation: conversation,
      suggestions: generateSuggestions(message),
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
    features: {
      chat: true,
      recommendations: true,
      conversations: true,
      realTimeAI: model && genAI ? true : false
    },
    provider: model && genAI ? 'Google Gemini' : 'Mock AI',
    lastUpdated: new Date().toISOString()
  });
});

module.exports = router;
