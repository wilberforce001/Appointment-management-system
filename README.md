# Appointment-management-system
**A software that can be used by companies and service providers to streamline their service appointments**  

By using the system, potential customers can know and  
choose their preferred appointment times according to the companies and service providers' available time slots. This project does not include a B2C marketplace-like interface for customers to browse different service providers.

**Steps followed in the project**  
**1. Setting up the Backend**  
This will carry the functionalities of user registration and login.  
**npm init -y**: Initiliazed the project by setting up a new Node.js project with Express for the backend. 

Installed the necessary packages: **MongoDB** for the database, and **Passport.js** for authentication. 

**2. Database configuration**  
**Installed MongoDB and used Docker container to run it**  
I did this because I was facing compatibility issues installing MongoDB in my laptop. By running MongoDB inside a container, it was possible to abstract away hardware compatibility issues.  
Used **MongoDB** for storing user and appointment data  
Ran these commands to start MongoDB and use it:  
sudo docker start mongodb  
sudo systemctl status docker: to check the status of MongoDB  
sudo docker exec -it mongodb mongo: to connect to MongoDB shell 

- Created a connection in Node.js application to a MongoDB database








