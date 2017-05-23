<h1 align="center">
  <img width="50%" src="media/main.jpg" alt="demo">
  <br>
  <br>
  Instahate
</h1>
<br>

## Instahate
With this webapp you can rate pictures of everyone who uses Instahate.. in a bad way! Once you log in your latest photo gets imported real-time. Judge people by their photo's and gain new ranks of scumbaggery. This is obviously a satirical version of Instagram.

<img width="50%" src="media/title.jpg" alt="demo">

## Live version
<a href="https://secure-plains-50292.herokuapp.com/">Live demo here</a>

## Features
-  [x] the app remembers who you are by using <a href="https://www.mongodb.com/">MongoDB</a>!
-  [x] displays your information, dislikes and title!
-  [x] adding Instagram pictures real-time using <a href="https://socket.io/">socket.io</a> everytime you make a picture!
-  [x] rate pictures!
-  [x] get new titles real-time the more you rate!
-  [x] notifications when the client/server is offline!

## Build
To run the application:
```bash
git clone
```

In order to get this app working you need to fill in the following <a href="https://www.npmjs.com/package/dotenv">dotenv</a> variables:  

```bash
CLIENT_ID={your client id here}
```  
```bash
CLIENT_SECRET={your client secret here}
```  
```bash
REDIRECT_URI={your redirect uri here}
```  

You can receive theses variables by making a new "Sandbox" on the Instagram development site:  
<a href="https://www.instagram.com/developer/authentication/">https://www.instagram.com/developer/authentication/</a>  
  
Now you only have to make sure to pass in your <a href="https://www.mongodb.com/">MongoDB</a> database. Simply place your database link inside the mongoose.connect braces:

```javascript
mongoose.connect({your link here});
```  

Finally, to use the app you need to run the following commands:  
```bash
npm install
```
To install the Node dependencies.

```bash
npm start
```  

To start the server.
  
## Using MongoDB & Mongoose
To make sure data is stored I decided to use <a href="https://www.mongodb.com/">MongoDB</a> as my database because the documents are saved as JSON. To use this in Node.js I used the <a href="http://mongoosejs.com/">Mongoose</a> package. This package provides a more straight-forward OOP way of using MongoDB.  
  
Here is how I set up my user schema:  
```javascript
mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASS}@ds131041.mlab.com:31041/instabase`);
```
To connect to my database.

```javascript
const Schema = mongoose.Schema;
```

```javascript
const userSchema = new Schema({
	user_id: String,
	name: String
});
```
The schema maps to the MongoDB collection and defines the shape of the documents within that collection.

```javascript
const User = mongoose.model('User', userSchema);
```

Create an instance of that model for easier use.  

```javascript
const newUser = new User({
	user_id: '2309482309',
	name: 'Luuk'
});

newUser.save((err) => {
	if (err) throw err;
	console.log('new user saved succesfully!');
});
```
Create a new user with an id and a name and save it to the database.

## OAuth with Instagram
<img width="50%" src="media/instagram.jpg" alt="demo">

In order to use the <a href="https://www.instagram.com/developer/">Instagram API</a> I had to set up an OAuth.

Once you start up the app I make a link with the following URL:  
```javascript
const auth_url = `https://api.instagram.com/oauth/authorize/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
```

This URL needs the following variables to redirect properly:
```javascript
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
const response_type = 'code';
const scope = 'basic+public_content';
```

Once you accept to the terms I use a POST request:

```javascript
request.post({
	uri: 'https://api.instagram.com/oauth/access_token',
	form: {
		client_id: client_id,
		client_secret: client_secret,
		grant_type: 'authorization_code',
		redirect_uri: redirect_uri,
		code: req.query.code
	}
}, (err, response, body) => {
	data = JSON.parse(body);
}
```  

Which will return an acces token that I can use to make calls to the API.

## Socket.io
To make my app real-time I needed a websocket connection that speaks between the client and the server. The easiest way to achieve this was by using the <a href="https://socket.io/">socket.io</a> package.

Here's an example of how I used the sockets from __server side to client side__  
__Server side__  

```javascript
setInterval(() => {
		request(`https://api.instagram.com/v1/users/${req.session.userId}/media/recent/?access_token=${req.session.token}`, (err, response, body) => {
			data = JSON.parse(body)
			imageData = data.data[0].images.low_resolution.url

			Image.find({ image: imageData }, (err, image) => {
				if (!image.length > 0) {
					const img = new Image({
						image: imageData
					})

					img.save(err => {
						if (err) throw err
						console.log('new image saved succesfully!')
					})

					// get the img and dislikes to send to the client
					const obj = {
						img: img,
						dislikes: dislikes
					}

					io.sockets.emit('newPic', obj)
				}
			})
		})
	}, 4000)
```
Here I used the access token we talked of earlier to do an API request. The API sends back the most recent image the logged in user has taken. If the image doesn't exist yet, I save the picture in the database. And send the img variable to the client. In order to get the latest pictures I used a setInterval function to keep the sockets updated.

__Client side__  
```javascript
const addNewPic = document.querySelector('.pics')

socket.on('newPic', (data) => {
	addNewPic.insertAdjacentHTML('afterbegin', `
		<div class="pic">
			<div>
				<img class="instagram" src="${data.img.image}"/>
			</div>
			<form method="POST" action="/main/${data.img._id}/rating">
				<button type="submit" name="dislike" class="<%= ratingClass %>">Terrible</button>
			</form>
		</div>
	`)
});
```
The client receives the image data from the socket and uses it create a new element (the new picture) on the page.  

## When the server is down
Once the server is down it sends the following 'disconnect' socket to the client that makes sure the client knows its down and makes the rating buttons unusable until the server runs again:

```javascript
socket.on('disconnect', () => {
	alert('server is offline! Your input will not work anymore, please try to login again later')
})
```

## When the client is down
Once the client is down I use <a href="http://github.hubspot.com/offline/docs/welcome/">offline.js</a>. This way I can notify the user that they are offline and suggest them to try and reconnect.

## Tooling
In order to use 'require' client side I used <a href="http://browserify.org/">Browserify</a> to make 1 bundle.js which combines all the Javascript files.

For example, in a random.js file you can use:  

```javascript
const random = 'wow this is random';
module.exports = random;
```

And in the app.js file you require the exported file:

```js  
require('./random');  
```
  
```js 
console.log(random);
``` 
Here you can use the const made in the random.js file.
  
To complete this you run `npm run build` which compiles the app.js (with all the required files) file into the bundle.js.

## Wishlist
-  [ ] loading indicator for new images
-  [ ] see how many times a picture has been rated
-  [ ] ranking list of users

## Sources

<a href="https://www.instagram.com/developer/">https://www.instagram.com/developer/</a>  
<a href="http://browserify.org/">http://browserify.org/</a>  
<a href="https://www.npmjs.com/package/dotenv">https://www.npmjs.com/package/dotenv</a>  
<a href="https://expressjs.com/">https://expressjs.com/</a>  
<a href="https://www.mongodb.com/">https://www.mongodb.com/</a>  
<a href="http://mongoosejs.com/">http://mongoosejs.com/</a>  
<a href="http://github.hubspot.com/offline/docs/welcome/">http://github.hubspot.com/offline/docs/welcome/</a>  

## License

MIT License  

Copyright © 2017 Luuk Hafkamp
