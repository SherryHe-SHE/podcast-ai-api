const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ASRService = require('../services/asr');
const TaskManager = require('../services/task-manager');

const router = express.Router();

// 配置上传
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// POST /api/v1/podcast/submit
router.post('/submit', upload.single('audio'), async (req, res) => {
  const taskId = uuidv4();
  const audioUrl = req.body.audio_url;
  const audioFile = req.file;

  if (!audioUrl && !audioFile) {
    return res.status(400).json({ error: '请提供音频文件或音频URL' });
  }

  TaskManager.createTask(taskId, {
    audioUrl,
    audioFile: audioFile ? audioFile.path : null,
    status: 'pending',
    progress: 0
  });

  // 异步处理
  processTask(taskId).catch(console.error);

  res.json({ task_id: taskId, message: '任务已提交' });
});

// GET /api/v1/podcast/status
router.get('/status', (req, res) => {
  const task = TaskManager.getTask(req.query.task_id);
  if (!task) return res.status(404).json({ error: '任务不存在' });
  res.json(task);
});

// GET /api/v1/podcast/result
router.get('/result', (req, res) => {
  const task = TaskManager.getTask(req.query.task_id);
  if (!task) return res.status(404).json({ error: '任务不存在' });
  if (task.status !== 'done') return res.status(400).json({ error: '任务未完成' });
  res.json({ transcript: task.transcript, summary: task.summary });
});

// GET /api/v1/podcast/history
router.get('/history', (req, res) => {
  res.json({ tasks: [] });
});

// 处理任务
async function processTask(taskId) {
  const task = TaskManager.getTask(taskId);
  TaskManager.updateTask(taskId, { status: 'transcribing', progress: 20 });
  
  const transcript = await ASRService.transcribe(task.audioFile || task.audioUrl);
  TaskManager.updateTask(taskId, { progress: 60, transcript });
  
  TaskManager.updateTask(taskId, { status: 'done', progress: 100, summary: { title: '播客摘要', text: transcript.text } });
}

module.exports = router;
