const path = require('path')

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

// Importing routes
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const sharedRoutes = require('./routes/sharedRoutes')
const pupilRoutes = require('./routes/pupilRoutes')

// Enabling .env variables
const dotenv = require('dotenv');
dotenv.config();

// Inicializing app
const app = express();

// Enabling access to body of requests
app.use(bodyParser.json())

// Handeling CORS
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

// Enable static serving from public folder
app.use(express.static(path.join('public')))

// Using Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pupil', pupilRoutes);
app.use('/api', sharedRoutes);

// Serving react app
app.use((req, res) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// Handeling errors
app.use((error, req, res, next) => {
	console.log(error);
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({ msg: error.message || 'Nastala neznámá chyba' });
});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.orv11.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true`)
.then(() => {
	app.listen(process.env.PORT)
	return console.log('Aplikace běží na portu: ', process.env.PORT)
})
.catch((error) => {
	console.log("Aplikace se nepřipojila k databázi")
	console.log(error)
});
