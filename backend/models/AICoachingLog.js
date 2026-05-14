import mongoose from 'mongoose';

const aiCoachingLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advice_type: { type: String, required: true },
  advice_content: { type: String, required: true },
  agro_score_at_time: { type: Number },
  created_at: { type: Date, default: Date.now }
});

const AICoachingLog = mongoose.model('AICoachingLog', aiCoachingLogSchema);
export default AICoachingLog;
