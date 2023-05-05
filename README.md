# FacetoFace

Facetoface is a a face detection ReactJS app that takes an URL with an image containing one face, and automatically drawing a square around the face of the model. The website uses a PostgreSQL database to manage a user database, and an Express nodeJS server to handle the requests and responses between the front-end and back-end.

## FRONT-END
The front-end is rendered using ReactJS.
### Sign in
First we have a Sign In form, with a "Register" and a "I forgot my password" route. The form will return an error message in case of wrong credentials.


![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/Sign%20in.png)


### Register
The register form will ask for the name, email and password of the new user. However, the email and password have to have a specific format to be valid, otherwise the form will display an error.
Those conditions are :
- Email must have "@" and "." in it
- Password must have 1 special character, 1 number, 1 lower AND upper case character, and have a length between 6 and 64 characters.


![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/Register.png)


Those conditions are implemented using regular expressions, or "Regex".

```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const specialCharRegex = /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const numberRegex = /(?=.*?[0-9])/;
const caseRegex = /^(?=.*[a-z])(?=.*[A-Z])/;
const isLongEnough = (password.length >= 6 && password.length <= 64);
```

If all the conditions are respected, it is possible to send the form, and a new user will be created in the database.

### Forgotten password
It is possible to set a new password for an existing user, by clicking on the "I forgot my password" link, and writing the user's email.

If the user exists, will send a URL to the email containing a link to access the Reset Password page. This feature is done by the library "nodemailer" (see BACK END section).


![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/Forgotten%20password.png)


### Reset password
This is the page accessed when clicking the link sent by email when forgetting your password. Same as the register form, the new password must follow the password format, and be typed twice to become acceptable. The URL contains the user's mail adress.


![](url_image)


If the password is successfully changed, the database is updated with the new password, and the user is redirected to the Sign in section.


### Home page
The home page contains the core of the app, which is the face detection tool. By copy-pasting the URL inside the input field, and clicking detect (or pressing Enter), the image will show up with a square in the face area ONLY IF the url is acceptable. Otherwise, will display an error message to the user.


![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/Home.png)


The app uses an API called [Clarifai](https://www.clarifai.com/use-cases/facial-recognition) for the face detection box. The API call is made by the back-end, but the front-end receives an object with the coordinates of the square. The front-end then makes the calculation to make it fit our image size. More about that on the BACK-END section.

The number of entries is also updated dynamically with the database.

### My Page
The My Page section contains everything about the user's information, such as the joining date, name, email, number or entries and last URL loaded.


![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/My%20page.png)


The user also has the possibility to change name, which will modify the database consequently.

### Background effect
The animated particles background is generated using the [particles-bg](https://www.npmjs.com/package/particles-bg) library.

```javascript
//Particles BG settings
let config = {
  num: [20, 30],
  rps: 0.1,
  radius: 1.2,
  life: [5, 6],
  v:[0.2, 0.5],
  tha: [-90, 90],
  alpha: 0.3,
  position: "all",
  color: "#ffffff",
  cross: "dead",
  random: 1, 
  g: 0, 
}
```

## BACK-END
The website is built with ExpressJS.

For better safety regarding personal information handling such as passwords, we are using the [bcryptjs](https://www.npmjs.com/package/bcryptjs) library, encrypting passwords before storing them in the database.

Also for safety reasons, the sensitive data such as API keys, or email credentials are passed as environmental variables:
```javascript
const PASSWORD = process.env.EMAILMDP;
const EMAIL = process.env.EMAILMDP;
```

The communication with the database is also made possible with the [knex](https://www.npmjs.com/package/knex) library.


### Sign in
```javascript
// signin
app.post('/signin', (req, res) => {signinHandler(req, res, bcrypt, db)})
```
The sign in form will send an email and a password to the back-end, who will compare the newly received password with the correct one inside the database, in the "login" table.
The bcrypt library will compare the two passwords using encrypted data, to tell us if they match or not.



### Register
```javascript
// register
app.post('/register', (req,res) => {registerHandler(req, res, bcrypt, db)})
```
The Register form will send the email, name and password to the server, who will create a new entry in the database, with the password hashed by bcrypt. A new entry will first be created in the "user" table, with non-sensitive information such as the id, number of entries, name, last loaded url and email. 

![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/db%20entry.png)

Then another entry will be created in the "login" table, having only the email and hashed passwords. (Don't mind the different id's)

![](https://raw.githubusercontent.com/Fly0w/facetoface/main/Media/db%20entry%20login.png)



### Forgotten password
```javascript
// forgot password
app.post('/forgotPassword', (req,res) => {checkExistingEmail(req, res, db)})
app.put('/resetPassword/:email/:token', (req,res) => {resetPassword(req, res, bcrypt, db)})
```
The forgotten password will have 2 endpoints:
- Checking if the user's email provided by the front-end exists in the database. If it exists, then it will send an email using the library nodemailer with a link to the new password form.

```javascript
const resetPasswordLink = `https://fly0w.github.io/facetoface/reset-password/email=${email}/`;
// email Body
let mailOptions = {
   from: 'XXXXXX@hotmail.com',
   to: email,
   subject: 'Forgot your password ?',
   text: 'Click below to reset your password:',
   html: `<a href="${resetPasswordLink}">Reset password</a>`
};
// send e-mail
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
   console.log(error);
} else {
   console.log('E-mail sent: ' + info.response);
}
```

- Modifying the database with the freshly reset password. Same as the register form, the password has to obey the different Regex rules. That endpoints reads the data in the provided URL to know who's user it is about to change the password.


### Home page
```javascript
// Home Page
app.put('/image', (req, res) => {imageHandler(req, res, db)})
app.post('/imageurl', (req, res) => {imageurlHandler(req, res)})
app.put('/imageupdate', (req, res) => {imageLastUrl(req, res, db)})
```
The home page will have 3 different endpoints:
- /image will take care of incrementing the user's number of entries by 1 in the database, and returning that amount to the front-end
- /imageurl sends the url received from the front-end, to the Clarifai API. It will then get the response with the coordinates of the image's face, and send it back to the front-end in order to draw the square

```javascript
const value = fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
  .then(response => response.json())
  .then(response => res.json(response))
  .catch(err => res.status("400").json("error while loading the url"))
```

- The /imageupdate will replace the "last_url" of the user by the lastest url, before sending it back to the front-end

### My Page
```javascript
// myPage
app.put('/changeName', (req, res) => {changeName(req, res, db)})
app.get('/profile/:id', (req, res) => {idHandler(req, res, db)})
```
Finally, the My Page page has 2 endpoints:
- /changeName, which allows the user to change his/her name in the database
- /profile/:id, which takes the id in parameters and use it as a key to get the user's information. It will then send it to the front-end to be displayed in the My Page page


## DATABASE
The App uses a postgreSQL relational database, with only 2 tables:
- users : contains the id, name, email address, joining date, number of entries and last_url
- login : contains the id, hashed password and email


# What's next ?
- Enabling picture imports from smarphones/laptops --> local import
- Enabling multi-faces detection
- Adding a "remember me" feature in the login page
- Addind a "delete profile" in the My page page
- Adding a logout confirmation
- Dynamic background color change depending on user's interaction with the forms (bad password, forgot password, login...)

## License

[MIT](https://choosealicense.com/licenses/mit/)
