import colors from 'colors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import connectDB from '#config/db.config.js';
import { errorHandler } from '#middlewares/error.middleware.js';
import orderRoutes from '#routes/order.routes.js';
import productRoutes from '#routes/product.routes.js';
import uploadRoutes from '#routes/upload.route.js';
import userRoutes from '#routes/user.routes.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(express.json()); // Request body parsing
app.use(cookieParser()); // Cookies parsing

app.use(morgan('dev'));

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/uploads', uploadRoutes);

app.use('/api/v1/config/paypal', (req, res) => {
	res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Make the uploads folder 'static'
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '/client/dist')));

	app.use('/*splat', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
	});
} else {
	app.get('/', (req, res) => {
		res.send('API is running...');
	});
}

app.use(errorHandler);

app.listen(port, () => {
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${port}`.yellow
			.bold,
	);
});
