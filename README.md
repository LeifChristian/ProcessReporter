# Process Reporter - PM2 Remote API with Ping
Start, stop, restart and get Pm2 info from any system remotely. 
Also includes zabbix watcher and problem reporter, and a route to ping any server.

# What is it?

An express server with API routes and functions designed to trigger those routes,
either locally or from a remote machine.

Routes trigger calls to PM2 and Zabbix processes, and can be triggered from either the localhost machine or a remote location, assuming ports are accessible and permissions granted. A ping route is included to allow
any server address sent as a param to be ping'd.

# To Run:
npm or yarn install.  

Nodemon server-POST.js  -- (node works, nodemon preferred).

Can be started as a Pm2 process, but triggering the stop route via the API will stop the app! Lol.

Routes are served on port 3800, all routes are contained within server-POST.js

`PM2_API - POST setup.json` contains the postman routes collection. 

# Functionality:

/pm2Auth - Get entire PM2 object containing all Pm2 data from the host computer.

/pm2GetProcesses - Get all processes available through Pm2. Returns running, errored and stopped processes.

/restart/:id - Restart a process by it's Pm2 Id. Can start and stop processes from a remote machine.

/getStoppedProcess - Returns all processes in a stopped or errored state

/stopProcess/:id - Stop a process by it's Pm2 Id. Use with caution!

/loginZabbix - logs into Zabbix and returns the full zabbix object.

/getProblems - get all problems reported by zabbix

/sendPingGeneric - Ping any server sent as the request param "server"

# GET vs POST
The current setup uses POST routes, though GET routes are included.
See `.env variables` section for current param setup

# ProcessReporter.js
Autoresponder that monitors PM2 processes and reports if a process is stopped or errored. 
Reporter is currently set up to send an email thru the Gmail API, when a new process is stopped or errored.

The Gmail API uses token.json and credentials.json to authenticate. 
The included "sendEmail" function is from Gmail's documentation, and currently sends text information about recently stopped or errored processes. 

View documentation - https://developers.google.com/gmail/api/quickstart/nodejs
** This could be easily adapted to use any other email service**

# pm2GetRemote.js
Simple function that gets all pm2 data from a remote machine where server-POST.js is running. 
It is called via http://domain-or-ip.address/pm2Auth:3800/
This function POSTS to /pm2Auth route. Use this to monitor any Pm2 data from a remote machine.
Includes an interval variable to select desired "watch" length.

# ProbemsReporter.js
This function gets problems from Zabbix agent and sends an email with any new problems, on a set interval.

# compareArraysofObjects.js
Handy little function that compares objects inside of arrays.

# findDuplicateObjectInArray.js
Find duplicate objects within the same array.

# .env Variables

add Twilio Sid and auth token to .env variables in frontend directory, and backend directories.

The .env file contains hard coded strings which correspond to route params.
It's a simple auth system for dev purposes.

The PASSWORD environment variable is a simple hashed string (P@ssw0rd), and is accessed via ${process.env.PASSWORD}
The same .env file lives on both the server and the local machine. If the passwords match, the route is triggered.

The POST routes send a sha256 hash of "password": "b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342".
The password is passed in the request body and is stored in the .env file on both the local and remote machines.

# /localhost-functions
Functions in this directory trigger routes on the same machine

# /remote-functions
Functions in this directory trigger routes remotely (from a separate machine). 


# Twilio API
Twilio API is included with this build, though currently unused. Easily send text or voice notifications. Just add your account SID and token in the .env file. 

Bring in twilio with:
const client = require("twilio")(accountSid, authToken);

Add your SID and token:
const accountSid = process.env.MY_ACCT_SID
const authToken = process.env.MY_TOKEN

Create a voice call with:
client.calls.create({
  twiml: `<Response><Pause length="1"/><Say voice="woman"> ${message}</Say></Response>`,
  to: "+15555555",
  from: "+555555555",
})
.then((call) => console.log(call.sid));

Create a text message with:
client.messages
.create({
    body: message,
    messagingServiceSid: "",
    to: "+14065390742",
})
.then((message) => console.log(message.sid))
.done();

# Enjoy!

                    ░░▒█░░░░█▀▀░░▀░░█▀▀░░░
                    ░░▒█░░░░█▀▀░░█▀░█▀░░░░
                    ░░▒█▄▄█░▀▀▀░▀▀▀░▀░░░░░
                          





