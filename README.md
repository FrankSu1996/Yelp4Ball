# Yelp4Ball
A NodeJS web application allowing users to share their favorite outdoor basketball courts across the world.
This project was created as part of- [Udemy's Web Developer bootcamp course](https://www.udemy.com/course/the-web-developer-bootcamp/)

## Live Demo
Please note: there are API keys protected as secrets, so cloning the project locally will not yield all the features of the application.

Instead, to see the app in action, go to [https://yelp4ball.herokuapp.com/](https://yelp4ball.herokuapp.com/)

## Features
* Follows RESTful routing protocol

* Authentication:
  
  * User registration/login with username and password.
  * Click [here](https://yelp4ball.herokuapp.com/register) to sign up.


* Authorization:

  * One cannot manage posts and view user profile without being authenticated

  * One cannot edit or delete posts and comments created by other users
  
* Password reset:
  * User can request to reset password. When signed in, click on "Reset Password" on navigation bar.
  
  * User will receive email with reset link


* Manage ball court posts with basic functionalities:

  * Create, edit and delete posts and comments

  * Upload ball court photos

  * Display ball court location on Google Maps
  
  * Update number of current people playing

* Flash messages responding to users' interaction with the app

* Responsive web design using bootstraps grid system

## Built with

### Front-end

* [ejs](http://ejs.co/)
* [Google Maps APIs](https://developers.google.com/maps/)
* [Bootstrap](https://getbootstrap.com/docs/3.3/)

### Back-end

* [express](https://expressjs.com/)
* [mongoDB](https://www.mongodb.com/)
* [mongoose](http://mongoosejs.com/)
* [express-session](https://github.com/expressjs/session#express-session)
* [method-override](https://github.com/expressjs/method-override#method-override)
* [geocoder](https://github.com/wyattdanger/geocoder#geocoder)
* [connect-flash](https://github.com/jaredhanson/connect-flash#connect-flash)
* [bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme)
* [client-sessions](https://github.com/mozilla/node-client-sessions)
* [google-maps](https://developers.google.com/maps/documentation/javascript/tutorial)
* [momentJS](https://github.com/moment/moment)
* [nodemailer](https://github.com/nodemailer/nodemailer)
* [async](https://github.com/caolan/async)
* [multer](https://github.com/expressjs/multer)
* [cloudinary](https://cloudinary.com/)

### Platforms

* [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
* [Heroku](https://www.heroku.com/)
