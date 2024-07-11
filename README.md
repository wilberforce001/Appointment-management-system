# Appointment-management-system
**A software that can be used by companies and service providers to streamline their service appointments**  

By using the system, potential customers can know and  
choose their preferred appointment times according to the companies and service providers' available time slots.  
This project does not include a B2C marketplace-like interface for customers to browse different service providers.

**Steps followed in the project**  
**<u>1. Setting up the Backend</u>**  
This will carry the functionalities of user registration and login.  
**npm init -y**: Initiliazed the project by setting up a new Node.js project with Express for the backend. 

Installed the necessary packages: **MongoDB** for the database, and **Passport.js** for authentication. 

**Database configuration**  
**Installed MongoDB and used Docker container to run it**  
I did this because I was facing compatibility issues installing MongoDB in my laptop. By running MongoDB inside a container,  
it was possible to abstract away hardware compatibility issues.  
Used **MongoDB** for storing user and appointment data  
Ran these commands to start MongoDB and use it:  
***sudo docker start mongodb***  
***sudo systemctl status docker:*** to check the status of MongoDB  
***sudo docker exec -it mongodb mongo:*** to connect to MongoDB shell 

**Create Appointment Model**  
Defined a Mongoose schema for storing appointment data  
**Extended Routes**  
Added routes for creating, viewing, and managing appointments.  

The basic setup of the backend was implemented with Express, MongoDB and Passport.js for authentication. The setup includes  the functionalities for registration and logging-in. 

**<u>2. Setting up the Frontend</u>**  
***npm install -g @vue/cli:*** Global installtion of CLI  
***vue create frontend:*** Create new Vue project(frontend)  
***cd frontend: npm run serve*** - start the developement server

**Installed Tailwind CSS for purposes of styling**  
***npm install -D tailwindcss postcss autoprefixe:*** to install Tailwind CSS and its dependencies.  
***npx tailwindcss init -p:*** Initialize Tailwind CSS

**Set Up Routing**  
Vue Router was used for navigation between components: Login.vue, Register.vue, Dashboard.vue and Calender.vue.  
***npm install vue-router@4:*** to install Vue Router
Configured Vue Router










