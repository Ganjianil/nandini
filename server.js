const express = require("express");
const app = express();
const port = 10406;
const mysql = require("mysql2");
const multer = require("multer");
const upload = multer({ dest: 'upload/' });
const jwt = require("jsonwebtoken");
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const cors = require('cors');
const dotenv = require("dotenv");
const db = require('./db');
const bcrypt = require('bcryptjs');

dotenv.config();

async function testQuery() {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        console.log(rows);
    } catch (err) {
        console.error('Query error:', err);
    }
}
testQuery();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();

app.use(express.json());
app.use(cors({
    origin: 'https://nandhinibrass.netlify.app' // Allow your frontend origin
})));
app.use('/upload', express.static('upload'));

app.listen(port, () => {
    console.log(`Server running under ${port}`);
});

app.get("/", (req, res) => {
    res.send("welcome to website");
});

app.post('/products', upload.array('images'), async (req, res) => {
    try {
        const { product_name, product_price, descripition } = req.body;
        const [result] = await db.query(
            `INSERT INTO products (product_name, product_price, descripition) VALUES (?, ?, ?)`,
            [product_name, product_price, descripition]
        );
        const product_id = result.insertId;
        const imageinsert = req.files.map(file => [product_id, file.path]);
        await db.query(
            `INSERT INTO product_img (product_id, image_path) VALUES ?`,
            [imageinsert]
        );
        res.send('Products with images saved successfully');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.get('/viewproducts', async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT products.*, product_img.image_path 
             FROM products 
             JOIN product_img ON products.id = product_img.product_id`
        );
        res.json(results);
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/deleteproducts/:id', async (req, res) => {
    try {
        const product_id = req.params.id;
        await db.query(`DELETE FROM product_img WHERE product_id = ?`, [product_id]);
        const [result] = await db.query(`DELETE FROM products WHERE id = ?`, [product_id]);
        if (result.affectedRows === 0) {
            return res.status(400).send('Not found');
        }
        res.send('Product deleted successfully');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.delete('/deleteallproducts', async (req, res) => {
    try {
        await db.query('DELETE FROM product_img');
        await db.query('DELETE FROM products');
        res.send('All products and their images deleted successfully');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

const SECRET = 'your_secret_key'; // Store securely in environment variables
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access denied, no token provided');
    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
}

app.post('/cart', verifyToken, async (req, res) => {
    try {
        const { product_id } = req.body;
        const user_id = req.user.id;
        if (!Array.isArray(product_id)) {
            return res.status(400).send('product_id must be an array');
        }
        const values = product_id.map(pid => [user_id, pid]);
        await db.query('INSERT INTO cart (user_id, product_id) VALUES ?', [values]);
        res.send('Products added to cart for authenticated user');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.get('/viewcart', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await db.query(
            `SELECT c.id, p.product_name, p.product_price
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        res.json(results);
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.delete('/cart/user/:user_id', async (req, res) => {
    try {
        const userId = req.params.user_id;
        const [result] = await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('No cart items found for this user');
        }
        res.send('All cart items deleted for user');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
        res.send('User registered successfully');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const [results] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (results.length === 0) return res.status(401).send('User not found');
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('Invalid password');
        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.post('/checkout', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { address } = req.body;
        if (!address || !address.name || !address.email || !address.street) {
            return res.status(400).send('Missing address details');
        }
        const [orderResult] = await db.query(
            `INSERT INTO orders (user_id, name, email, phone, street, city, zip, country)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId, address.name, address.email, address.phone,
                address.street, address.city, address.zip, address.country
            ]
        );
        const orderId = orderResult.insertId;
        const [cartItems] = await db.query(
            `SELECT c.product_id, p.product_name, p.product_price
             FROM cart c
             JOIN products p ON c.product_id = p.id
             WHERE c.user_id = ?`,
            [userId]
        );
        if (cartItems.length === 0) return res.status(400).send('Cart is empty');
        const orderItems = cartItems.map(item => [orderId, item.product_id]);
        await db.query('INSERT INTO order_items (order_id, product_id) VALUES ?', [orderItems]);
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        res.send('Order placed successfully');
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.get('/myorders', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [results] = await db.query(
            `SELECT o.id AS order_id, o.order_date, p.product_name, p.product_price
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = ?
             ORDER BY o.order_date DESC`,
            [userId]
        );
        res.json(results);
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.get('/admin/orders', async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT o.id AS order_id, o.order_date, u.username, p.product_name, p.product_price
             FROM orders o
             JOIN users u ON o.user_id = u.id
             JOIN order_items oi ON o.id = oi.order_id
             JOIN products p ON oi.product_id = p.id
             ORDER BY o.order_date DESC`
        );
        res.json(results);
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});

app.put('/order/:order_id/status', async (req, res) => {
    try {
        const orderId = req.params.order_id;
        const { status } = req.body;
        const validStatuses = ['processing', 'shipped', 'delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).send('Invalid status value');
        }
        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, orderId]
        );
        if (result.affectedRows === 0) return res.status(404).send('Order not found');
        res.send(`Order ${orderId} status updated to ${status}`);
    } catch (err) {
        console.error('Query error:', err);
        res.status(500).send(err);
    }
});
app.use('/upload', express.static('upload'));
