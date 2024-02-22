// user.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import * as nodemailer from 'nodemailer';
import * as schedule from 'node-schedule';
import moment from 'moment-timezone';

// Mongoose model interface
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  priorities: number[];
  tasks: Array<Schema.Types.ObjectId | ITask>;
  // Add any additional fields as needed
}

interface ITask extends Document {
  title: string;
  description: string;
  priority: number;
  dueDate: string; 
  timeZone: string;// Add the dueDate property
  // Add any additional fields as needed
}

const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: Number, required: true },
  dueDate: { type: String, required: true },
  timeZone: { type: String, default: 'UTC' }
  // Add any additional fields as needed
});

// Mongoose user schema
const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  priorities: { type: [Number], default: [1] },
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  // Add any additional fields as needed
});

// Mongoose user model
const Users = mongoose.model<IUser>('Users', userSchema);
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
const sendEmail = async (user: IUser) => {
  const mailOptions = {
    from: 'datapirates0411@gmail.com',
    to: user.email,
    subject: `Welcome, ${user.username}!`,
    text: `Thank you for signing up, ${user.username}!\nYour email: ${user.email}`,
  };
 console.log("hello");
  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Function to schedule emails with a specific time zone and priority
const scheduleEmail = (user: IUser, scheduleTime: string, timeZone: string) => {
  console.log("User",user,"scheduleTime",scheduleTime,"timeZone",timeZone)
  const scheduledDateString=new Date(Date.parse(scheduleTime))
  schedule.scheduleJob(scheduledDateString,() => {
    console.log(`Scheduling email for ${user.username} at ${scheduleTime}`);
    // Send the scheduled email
    sendEmail(user);
  });
  
};

// Function to schedule tasks with priority
const scheduleTasksWithPriority = async (user: IUser, tasks: { title: string, description: string, priority: number }[]) => {
  // Sort tasks based on priority in ascending order (lower priority first)
  const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);

  // Iterate through the sorted tasks and schedule them
  for (const task of sortedTasks) {
    const { title, description, priority } = task;

    // Schedule the task with a specific time based on priority
    const scheduleTime = moment().add(priority, 'hours').toDate();

    // Schedule the task to be executed
    schedule.scheduleJob(scheduleTime, async () => {
      console.log(`Scheduling task for ${user.username} with title: ${title} at ${scheduleTime} with priority ${priority}`);
      // Add your logic to perform the task action here
    });

    console.log(`Task scheduled for ${user.username} with title: ${title} at ${scheduleTime} with priority ${priority}`);

    // Schedule the email with a specific time based on priority
    const emailScheduleTime = moment().add(priority + 1, 'hours').toDate(); // Example: Email scheduled 1 hour after the task

    // Schedule the email to be sent
    schedule.scheduleJob(emailScheduleTime, async () => {
      console.log(`Scheduling email for ${user.username} with title: ${title} at ${emailScheduleTime} with priority ${priority}`);
      // Add your logic to send the email here
    });

    console.log(`Email scheduled for ${user.username} with title: ${title} at ${emailScheduleTime} with priority ${priority}`);

  }
};


// const scheduleTasksWithPriority = async (user: IUser, tasks: { title: string; description: string; priority: number; dueDate: Date }[]) => {
//   const sortedTasks = tasks.sort((a, b) => a.priority - b.priority);

//   for (const task of sortedTasks) {
//     const { title, description, priority, dueDate } = task;

//     // Schedule the task
//     const scheduleTime = moment(dueDate).add(priority, 'hours').toDate();
//     schedule.scheduleJob(scheduleTime, async () => {
//       console.log(`Executing task for ${user.username} with title: ${title} at ${scheduleTime} with priority ${priority}`);
//       // Add your logic to perform the task action here
//     });

//     // Schedule the email reminder
//     const emailScheduleTime = moment(dueDate).subtract(priority, 'hours').toDate();
//     schedule.scheduleJob(emailScheduleTime, async () => {
//       console.log(`Scheduling email reminder for ${user.username} with title: ${title} at ${emailScheduleTime} with priority ${priority}`);
//       await sendEmail(user);
//     });

//     // Save the task to the user's tasks array
//     const createdTask: ITask = await Task.create({ title, description, priority, dueDate });
//     user.tasks.push(createdTask);
//   }

//   await user.save();
// };


export { Users, sendEmail,IUser, scheduleTasksWithPriority,ITask,Task,scheduleEmail};

