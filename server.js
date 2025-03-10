const express = require('express');
const path = require('path');
const app = express();

// EJS Template Engine Ayarı
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // views klasörünü belirt

// Middleware'ler
app.use(express.static(path.join(__dirname, 'public'))); // Public klasörünü statik hale getir
app.use(express.urlencoded({ extended: true })); // Form verilerini alabilmek için
app.use(express.json()); // JSON verileri alabilmek için

// Routers
const guestRouter = require('./routes/guest');
app.use('/', guestRouter);
const userRouter = require('./routes/user');
app.use('/user', userRouter);

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
