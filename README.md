# Appointment-management-system
**A software that can be used by companies and service providers to streamline their service appointments**  

The Appointment Management System is a web application designed to help users schedule, manage, and keep track of their appointments. This project features user authentication, appointment creation, and appointment listing functionalities. It is built using Node.js and Vue.js, with a MongoDB database for data storage.

**Features**  
**User Authentication:** Secure login and registration for users  
**Appointment Management:** Create, view, and manage appointments  
**Responsive Design:** Accessible on various devices. 

# Technologies Used
**Frontend:** Vue.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Tokens), bcrypt

# Installation
**Prerequisites**  
Node.js and npm (Node Package Manager) installed  
MongoDB installed and running

# Setup  
**1. Clone the Repository:**  
git clone git@github.com:wilberforce001/Appointment-management-system.git
cd Appointment-management-system  

**2. Install Backend Dependencies:**  
cd backend  
npm install  

**3. Configure Environment Variables:**  
Create a `.env` file in the backend directory and add the following:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

**4. Fire up MongoDB with the following:**  
***sudo docker start mongodb***  
***sudo systemctl status docker:*** to check the status of MongoDB  
***sudo docker exec -it mongodb mongo:*** to connect to MongoDB shell 

**5. Start the Backend Server:**  
node server.js  

**6. Install Frontend Dependencies:**
cd ../frontend  
npm install  

**7. Start the Frontend Development Server:**  
npm run serve  
**The application should now be running on http://localhost:8080.** 

# Usage 
**1. Register a New User:**  
Navigate to the registration page and fill in the required fields to create a new account.

**2. Log In - either as a User or Admin:**  
Use the login page to authenticate with your credentials.

**3. For users, they can log in and Create an aApointment**
After logging in, go to the appointment management section to create a new appointment.  

**4. For Admins, they can log in and View Appointments**
Your appointments will be listed in the dashboard. You can view details and manage them from this interface. 

# Contact
For any questions or feedback, please contact:  
- **Email:** kipyegonwilber@gmail.com  
- **GitHub:** wilberforce001











