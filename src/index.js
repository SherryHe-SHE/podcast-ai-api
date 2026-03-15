const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 路由
app.get('/', (req, res) => {
  res.json({
    name: '播客 AI 助手 API',
    version: '1.0.0',
    endpoints: {
      submit: 'POST /api/v1/podcast/submit',
      status: 'GET /api/v1/podcast/status',
      result: 'GET /api/v1/podcast/result',
      history: 'GET /api/v1/podcast/history'
    }
  });
});

const podcastRouter = require('./routes/podcast');
app.use('/api/v1/podcast', podcastRouter);

// 错误处理
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 服务已启动: http://localhost:${PORT}`);
});

module.exports = app;
