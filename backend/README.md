
# Project Stracture and Execution
**<u>1. Setting up the Backend</u>**  
**npm init -y**: Initiliazed the project by setting up a new Node.js project with Express for the backend. 

**Installed the necessary packages:**  
**MongoDB** for the database, and  
**Passport.js** for authentication. 

**Database configuration**  
**Installed MongoDB and used Docker container to run it**  
I did this because I was facing compatibility issues installing MongoDB. By running MongoDB inside a container, it was possible to abstract away hardware compatibility issues. Used **MongoDB** for storing user and appointment data  
Ran these commands to start MongoDB and use it:  
**sudo docker start mongodb**  
**sudo systemctl status docker:** to check the status of MongoDB  
**sudo docker exec -it mongodb mongo:** to connect to MongoDB shell 
On deployment to render, there was need to set MongoDb to connect to Render and therefore this led to a change in the command to connect to MongoDB shell. Therefore, connect to the shell with; **mongosh "mongodb://localhost:27017"**

The basic setup of the backend was implemented with Express, MongoDB and Passport.js for authentication. 

**Checking User details in the Database - MongoDB**  
**use appointment-system**: to connect to the Database  
**db.users.find().pretty()**: to query the Users collection 
**db.users.deleteMany({})**: to delete all documents in the users collection  
**db.users.dropIndex('username_1')**: remove an index in MongoDB database  
**db.users.getIndexes()**: check indexes in MongoDB database  
**db.users.find({ email: null })**: verify that no documents with null values in fields like email are left in your collection.  
**db.users.deleteMany({ email: null })**: clean up any documents with `null` values for required fields. 
