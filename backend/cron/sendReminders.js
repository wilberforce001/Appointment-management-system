import cron from 'node-cron';
import nodemailer from 'nodemailer';
import Appointment from '../models/AppointmentDetails.js';

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Function to send email
const sendReminderEmail = (appointment) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: appointment.customerEmail,
    subject: 'Appointment Reminder',
    text: `Dear ${appointment.customerName},\n\nThis is a reminder for your appointment on ${appointment.date}.\n\nThank you.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Cron job to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const appointments = await Appointment.find({
      date: { $gte: new Date(), $lt: new Date(new Date().setDate(new Date().getDate() + 1)) },
    });

    appointments.forEach((appointment) => {
      sendReminderEmail(appointment);
    });
  } catch (error) {
    console.log('Error fetching appointments:', error);
  }
});
