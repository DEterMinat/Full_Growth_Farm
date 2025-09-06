// ระบบตรวจจับและรองรับภาษาถิ่นไทย
const thaiDialectDetector = {
  // คำศัพท์ภาษาถิ่นต่างๆ
  dialects: {
    northern: {
      name: 'ภาคเหนือ',
      keywords: [
        'แล้วจัก', 'จั่งใด', 'แม่น', 'บ่', 'จั่ง', 'หน่อย', 'แหนะ', 'เจ้า',
        'เฮา', 'นำ้', 'ขนม', 'กิน', 'ปาก', 'หูว', 'บ้าน', 'เมื่อง',
        'แล้วก็', 'ลูก', 'พ่อ', 'แม่', 'น้อง', 'พี่', 'ลุง', 'ป้า',
        'ข้าว', 'น้ำ', 'ไฟ', 'ดิน', 'ลม', 'ฝน', 'แดด', 'หนาว'
      ],
      greetings: ['สวัสดีครับ/ค่ะ', 'เป็นจั่งใดบ้าง', 'สบายดีป่าว'],
      responses: {
        friendly: 'แล้วจักเป็นจั่งใด',
        confirmation: 'แม่นแล้ว',
        negation: 'บ่แม่น',
        suggestion: 'ลองเฮ็ดแบบนี้ดูสิ'
      }
    },
    
    northeastern: {
      name: 'ภาคอีสาน',
      keywords: [
        'แล้วหล่ะ', 'ป่าว', 'บ่', 'เจ้า', 'เฮา', 'มัน', 'เด็ก', 'ผู้',
        'บ้าน', 'เมือง', 'ข้าว', 'น้ำ', 'แปง', 'กิน', 'นอน', 'ฮัก',
        'หลาย', 'น้อย', 'ใหญ่', 'เล็ก', 'สวย', 'งาม', 'ดี', 'เลว',
        'เร็ว', 'ช้า', 'ไป', 'มา', 'อยู่', 'นั่ง', 'ยืน', 'เฮ็ด'
      ],
      greetings: ['สบายดีป่าว', 'เป็นจั่งใดบ้าง', 'มีแฮงป่าว'],
      responses: {
        friendly: 'สบายดีหล่ะ',
        confirmation: 'แม่นแล้ว',
        negation: 'บ่แม่น',
        suggestion: 'ลองเฮ็ดแบบนี้ดูสิ'
      }
    },
    
    southern: {
      name: 'ภาคใต้',
      keywords: [
        'หลา', 'จิ', 'กะ', 'กิ๊', 'แล๊ะ', 'โจ', 'พุ่น', 'ตี๋',
        'บ้าน', 'เมือง', 'ข้าว', 'น้ำ', 'ปลา', 'กุ้ง', 'ปู', 'หอย',
        'ยาง', 'ปาล์ม', 'มะพร้าว', 'ทุเรียน', 'ลองกอง', 'เงาะ',
        'เรือ', 'ทะเล', 'หาด', 'คลื่น', 'ลม', 'ฝน', 'แดด', 'ร้อน'
      ],
      greetings: ['ว่าไง', 'เป็นไงบ้าง', 'สบายดีมั้ย'],
      responses: {
        friendly: 'ดีหล่า',
        confirmation: 'ใช่หล่า',
        negation: 'บ่ใช่',
        suggestion: 'ลองทำแบบนี้ดูสิ'
      }
    },
    
    central: {
      name: 'ภาคกลาง',
      keywords: [
        'ครับ', 'ค่ะ', 'คะ', 'จ้ะ', 'นะ', 'ล่ะ', 'เนอะ', 'เหรอ',
        'บ้าน', 'เมือง', 'ข้าว', 'น้ำ', 'ปลา', 'ไก่', 'หมู', 'เป็ด',
        'ผัก', 'ผลไม้', 'ต้นไม้', 'ดอกไม้', 'ใบไม้', 'ราก', 'ก้าน',
        'นา', 'สวน', 'ไร่', 'ป่า', 'ภูเขา', 'แม่น้ำ', 'ลำธาร'
      ],
      greetings: ['สวัสดีครับ/ค่ะ', 'เป็นไงบ้างครับ/ค่ะ'],
      responses: {
        friendly: 'ดีครับ/ค่ะ',
        confirmation: 'ใช่ครับ/ค่ะ',
        negation: 'ไม่ใช่ครับ/ค่ะ',
        suggestion: 'ลองทำแบบนี้ดูครับ/ค่ะ'
      }
    }
  },

  // ตรวจจับภาษาถิ่น
  detectDialect: function(message) {
    const lowerMessage = message.toLowerCase();
    const scores = {};
    
    // คำนวณคะแนนสำหรับแต่ละภาษาถิ่น
    for (const [dialectKey, dialectData] of Object.entries(this.dialects)) {
      scores[dialectKey] = 0;
      
      dialectData.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          scores[dialectKey]++;
        }
      });
    }
    
    // หาภาษาถิ่นที่มีคะแนนสูงสุด
    const maxScore = Math.max(...Object.values(scores));
    if (maxScore === 0) {
      return 'central'; // ค่าเริ่มต้นเป็นภาคกลาง
    }
    
    return Object.keys(scores).find(key => scores[key] === maxScore);
  },

  // สร้าง AI Prompt ตามภาษาถิ่น
  createDialectPrompt: function(message, context, detectedDialect) {
    const dialect = this.dialects[detectedDialect];
    const dialectName = dialect.name;
    
    return `คุณเป็นผู้เชี่ยวชาญด้านเกษตรกรรม AI ที่สามารถสื่อสารได้หลายภาษาถิ่นในประเทศไทย

ภาษาถิ่นที่ตรวจพบ: ${dialectName}
บริบทของผู้ใช้: ${context || 'คำถามเกี่ยวกับการเกษตรทั่วไป'}

ให้คำแนะนำที่เป็นประโยชน์และปฏิบัติได้จริงสำหรับเกษตรกร โดยเน้น:
- การจัดการพืชผลและการเพิ่มประสิทธิภาพ
- คำแนะนำตามสภาพอากาศและภูมิประเทศ
- การจัดการศัตรูพืชและโรคพืช
- สุขภาพดินและธาตุอาหาร
- การเกษตรที่ยั่งยืน
- การใช้เทคโนโลยีในการเกษตร
- ความรู้เกษตรกรรมที่เหมาะกับแต่ละภาค

คำถามของผู้ใช้: "${message}"

ข้อกำหนดการตอบ:
1. ตอบเป็นภาษาไทยที่เข้าใจง่าย โดยใช้คำศัพท์ที่เหมาะสมกับ${dialectName}
2. ใช้ภาษาที่เป็นมิตรและใกล้ชิด เหมือนกับคนในพื้นที่
3. ใส่คำทักทายและปิดท้ายตามสไตล์${dialectName}
4. ให้คำแนะนำที่เฉพาะเจาะจงกับสภาพภูมิอากาศและพืชพันธุ์ในภาคนั้นๆ
5. ใช้ตัวอย่างที่เข้าใจง่ายและใกล้ตัว
6. หลีกเลี่ยงคำศัพท์ทางวิชาการที่ซับซ้อน
7. แสดงความเข้าใจและเห็นอกเห็นใจต่อปัญหาของเกษตรกร

รูปแบบการตอบที่ต้องการ:
- ทักทาย: ใช้คำทักทายที่เหมาะกับ${dialectName}
- เนื้อหา: คำแนะนำที่เป็นประโยชน์
- ปิดท้าย: ให้กำลังใจหรือเสนอความช่วยเหลือเพิ่มเติม

พืชและสภาพอากาศที่เหมาะกับ${dialectName}:
${this.getRegionalContext(detectedDialect)}`;
  },

  // ข้อมูลเฉพาะภาค
  getRegionalContext: function(dialectKey) {
    const regionalInfo = {
      northern: `
- สภาพอากาศ: หนาวเย็นในฤดูหนาว ฝนตกในฤดูฝน
- พืชเด่น: ข้าวโพด ถั่วเหลือง กาแฟ ลิ้นจี่ ลำไย
- ปัญหาทั่วไป: อุณหภูมิต่ำ หมอกควัน ดินเป็นกรด
- เทคนิคเด่น: การเกษตรบนที่สูง ระบบชลประทานแบบดั้งเดิม`,
      
      northeastern: `
- สภาพอากาศ: แห้งแล้ง ฝนน้อย ร้อนจัด
- พืชเด่น: ข้าวเหนียว มันสำปะหลัง อ้อย ยางพารา
- ปัญหาทั่วไป: ขาดน้ำ ดินเค็ม ศัตรูพืช
- เทคนิคเด่น: การเก็บน้ำฝน เกษตรทฤษฎีใหม่`,
      
      southern: `
- สภาพอากาศ: ชื้น ฝนตกตลอดปี ร้อนชื้น
- พืชเด่น: ยางพารา ปาล์มน้ำมัน มะพร้าว ทุเรียน
- ปัญหาทั่วไป: น้ำท่วม โรคเชื้อรา แมลงศัตรูพืช
- เทคนิคเด่น: การระบายน้ำ เกษตรผสมผสาน`,
      
      central: `
- สภาพอากาศ: ร้อนชื้น ฝนตกเฉลี่ย
- พืชเด่น: ข้าวเจ้า ผักใบเขียว ไก่ ปลา
- ปัญหาทั่วไป: น้ำท่วม แล้ง มลพิษ
- เทคนิคเด่น: การเกษตรอินทรีย์ เกษตรกรรมสมัยใหม่`
    };
    
    return regionalInfo[dialectKey] || regionalInfo.central;
  },

  // คำศัพท์เฉพาะภาคสำหรับการเกษตร
  getAgricultureTerms: function(dialectKey) {
    const terms = {
      northern: {
        rice: 'ข้าวโพด',
        water: 'น้ำ',
        field: 'นา',
        farmer: 'ชาวนา',
        plant: 'ปลูก',
        harvest: 'เก็บเกี่ยว'
      },
      northeastern: {
        rice: 'ข้าวเหนียว', 
        water: 'น้ำ',
        field: 'นา',
        farmer: 'ชาวนา',
        plant: 'ปลูก',
        harvest: 'เก็บเกี่ยว'
      },
      southern: {
        rubber: 'ยาง',
        coconut: 'มะพร้าว',
        water: 'น้ำ',
        field: 'สวน',
        farmer: 'ชาวสวน',
        plant: 'ปลูก',
        harvest: 'เก็บผล'
      },
      central: {
        rice: 'ข้าว',
        water: 'น้ำ',
        field: 'นา',
        farmer: 'เกษตรกร',
        plant: 'ปลูก',
        harvest: 'เก็บเกี่ยว'
      }
    };
    
    return terms[dialectKey] || terms.central;
  },

  // สร้าง Response ตามภาษาถิ่น
  formatResponse: function(aiResponse, detectedDialect) {
    const dialect = this.dialects[detectedDialect];
    const greeting = dialect.greetings[Math.floor(Math.random() * dialect.greetings.length)];
    
    // เพิ่มคำทักทายและปรับภาษา
    let formattedResponse = `${greeting} `;
    
    // ปรับ tone ให้เหมาะกับภาษาถิ่น
    switch(detectedDialect) {
      case 'northern':
        formattedResponse += aiResponse.replace(/ครับ|ค่ะ/g, 'แหนะ');
        formattedResponse += '\n\nหากมีข้อสงสัยเพิ่มเติม ถามมาได้เลยแหนะ';
        break;
        
      case 'northeastern':
        formattedResponse += aiResponse.replace(/ครับ|ค่ะ/g, 'หล่ะ');
        formattedResponse += '\n\nมีอะไรจะถามต่อ ถามมาได้เลยหล่ะ';
        break;
        
      case 'southern':
        formattedResponse += aiResponse.replace(/ครับ|ค่ะ/g, 'หล่า');
        formattedResponse += '\n\nมีอะไรสงสัยอีก ถามมาได้เลยจิ';
        break;
        
      default: // central
        formattedResponse += aiResponse;
        formattedResponse += '\n\nหากมีคำถามเพิ่มเติม สามารถถามได้เลยครับ/ค่ะ';
    }
    
    return formattedResponse;
  },

  // สร้าง Suggestions ตามภาษาถิ่น
  generateDialectSuggestions: function(detectedDialect) {
    const suggestions = {
      northern: [
        'วิธีปลูกข้าวโพดในที่สูง',
        'การดูแลสวนลิ้นจี่ในหน้าหนาว',
        'เทคนิคการป้องกันหมอกควัน'
      ],
      northeastern: [
        'วิธีประหยัดน้ำในฤดูแล้ง',
        'การปรับปรุงดินเค็ม',
        'เทคนิคการปลูกมันสำปะหลัง'
      ],
      southern: [
        'การดูแลสวนยางในฤดูฝน',
        'วิธีป้องกันโรคเชื้อราในมะพร้าว',
        'เทคนิคการเพาะปลาในนาข้าว'
      ],
      central: [
        'วิธีปลูกผักปลอดสารพิษ',
        'การจัดการน้ำในนาข้าว',
        'เทคนิคการเลี้ยงไก่ไข่'
      ]
    };
    
    return suggestions[detectedDialect] || suggestions.central;
  }
};

module.exports = thaiDialectDetector;
