import mongoose, { Document, Schema } from 'mongoose';
import * as nodemailer from 'nodemailer';

// Mongoose model interface
interface ITask extends Document {
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  recurring: boolean;
  interval: string;
  priority: number;
}

// Mongoose task schema
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  recurring: { type: Boolean, default: false },
  interval: { type: String, default: '' },
  priority: { type: Number, default: 1 },
});

// Mongoose task model
const Task = mongoose.model<ITask>('Task', taskSchema);

// Nodemailer configuration with 2FA
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'datapirates0411@gmail.com',
    pass: 'caqe rvjs rgzy fdbb',
  },
});

// Function to send email
const sendEmail = async (task: ITask) => {
  const mailOptions = {
    from: 'datapirates0411@gmail.com',
    to: 'datapirates0411@gmail.com',
    subject: `Task Scheduled: ${task.title}`,
    text: `A new task has been scheduled:\nTitle: ${task.title}\nDescription: ${task.description}\nStart Time: ${task.startTime}\nEnd Time: ${task.endTime}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export { Task, sendEmail }; 