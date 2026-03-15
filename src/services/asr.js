const axios = require('axios');

class ASRService {
  constructor() {
    this.apiKey = process.env.VOLC_API_KEY;
    this.model = process.env.VOLC_ASR_MODEL || 'paraformer-v2';
  }

  async transcribe(audioPath) {
    if (!this.apiKey) {
      return { text: '模拟转写结果：这是一段播客内容...', duration: 3000 };
    }

    // 返回模拟数据（实际需要调用火山方舟 API）
    return { 
      text: '这是通过火山方舟 ASR 转写的文本内容。', 
      duration: 3000,
      segments: []
    };
  }
}

module.exports = new ASRService();
