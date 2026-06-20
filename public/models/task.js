import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  tenant_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  title: {
    type: String,
    required: true,
    default: ""
  },
  description: {
    type: String,
    required: true,
    default: ""
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'blocked', 'done'],
    default: 'pending'
  },
  is_blocked: {
    type: Boolean,
    required: false,
    default: false
  },
  blocker_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  origin: {
    type: String,
    enum: ['whatsapp', 'web', 'voice', 'file_upload'],
    default: 'whatsapp'
  },
  due_date: Date,
  reminder_at: Date,
  files: [String],
  tags: [String],

},
  {
    timestamps: true
  }
);

const Task = new mongoose.model("Task", taskSchema);
export default Task; 
