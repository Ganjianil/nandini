const express= require("express")
const app=express();
const port =8085
const mysql= require("mysql2")
const multer= require("multer")
const upload=multer({dest:'upload/'})
const jwt= require("jsonwebtoken")
const easyinvoice = require('easyinvoice');
const fs = require('fs');
const cors=require('cors')
const dotenv=require("dotenv")
dotenv.config()
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

app.use(express.json())
app.use(cors())
app.listen(port,()=>{
    console.log(`Server running under ${port}`)
})
const db = require('./your-db-file');

db.query('SELECT * FROM products')
  .then(([rows]) => {
    console.log(rows);
  })
  .catch(err => {
    console.error('Query error:', err);
  });
app.post('/products',upload.array('images'),(req,res)=>
    {
        const {product_name,product_price,descripition}=req.body;
        connection.query(`insert into products (product_name,product_price,descripition) values (?,?,?)`,[product_name,product_price,descripition],(err,result)=>{
            if(err){
                return res.status(500).send(err)
            }
            else{
                const product_id=result.insertId
                const imageinsert=req.files.map(file=>[product_id,file.path])
                connection.query(`Insert into product_img(product_id,image_path) values ?`,[imageinsert],(err2)=>{
                    if(err2)
                       return res.status(500).send(err2)
                      res.send('products with images saved sucessfully')
                })
                
          
            }
        })
        

})
app.get('/viewproducts', (req, res) => {
  connection.query(
    `SELECT products.*, product_img.image_path 
     FROM products 
     JOIN product_img ON products.id = product_img.product_id`,
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});
app.delete('/deleteproducts/:id',(req,res)=>{
    const product_id=req.params.id
    connection.query(`delete from product_img where id=?`,[product_id],(err)=>{
        if(err)
            return res.status(500).send(err)
        connection.query(`delete from products where id=?`,[product_id],(err,result)=>{
        if(err)
            return res.status(500).send(err)
        if(result.affectedRows===0){
            return res.status(400).send("not found")
        }
        res.send("products deleted sucessfully")
    })
    })
})
app.delete('/deleteallproducts', (req, res) => {
  // First delete all images
  connection.query('DELETE FROM product_img', (err1) => {
    if (err1) return res.status(500).send(err1);

    // Then delete all products
    connection.query('DELETE FROM products', (err2, result) => {
      if (err2) return res.status(500).send(err2);

      res.send('All products and their images deleted successfully');
    });
  });
});
app.post('/cart', verifyToken, (req, res) => {
  const { product_id } = req.body;
  const user_id = req.user.id;

  if (!Array.isArray(product_id)) {
    return res.status(400).send('product_id must be an array');
  }

  const values = product_id.map(pid => [user_id, pid]);

  connection.query(
    'INSERT INTO cart (user_id, product_id) VALUES ?',
    [values],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('Products added to cart for authenticated user');
    }
  );
});
app.get('/viewcart', verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT c.id, p.product_name, p.product_price
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.delete('/cart/user/:user_id', (req, res) => {
  const userId = req.params.user_id;

  connection.query('DELETE FROM cart WHERE user_id = ?', [userId], (err, result) => {
    if (err) return res.status(500).send(err);

    if (result.affectedRows === 0) {
      return res.status(404).send('No cart items found for this user');
    }

    res.send('All cart items deleted for user');
  });
});
const bcrypt = require('bcryptjs');

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  connection.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashed],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send('User registered successfully');
    }
  );
});
const SECRET = 'your_secret_key'; // store this securely

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(401).send('User not found');

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).send('Invalid password');

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    }
  );
});


function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).send('Access denied, no token provided');

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user; // Save user data for the next middleware or route
    next();
  });
}


      // Step 2: Get cart items and continue as before...


app.post('/checkout', verifyToken, (req, res) => {
  const userId = req.user.id;
  const { address } = req.body;

  if (!address || !address.name || !address.email || !address.street) {
    return res.status(400).send('Missing address details');
  }

  // Step 1: Insert into orders with address
  const insertOrderQuery = `
    INSERT INTO orders (user_id, name, email, phone, street, city, zip, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    insertOrderQuery,
    [
      userId,
      address.name,
      address.email,
      address.phone,
      address.street,
      address.city,
      address.zip,
      address.country
    ],
    (err, orderResult) => {
      if (err) return res.status(500).send(err);

      const orderId = orderResult.insertId;

      // Step 2: Fetch cart items with product info
      const cartQuery = `
        SELECT c.product_id, p.product_name, p.product_price
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `;

      connection.query(cartQuery, [userId], (err, cartItems) => {
        if (err) return res.status(500).send(err);
        if (cartItems.length === 0) return res.status(400).send('Cart is empty');

        const orderItems = cartItems.map(item => [orderId, item.product_id]);

        // Step 3: Insert into order_items
        connection.query(
          'INSERT INTO order_items (order_id, product_id) VALUES ?',
          [orderItems],
          (err) => {
            if (err) return res.status(500).send(err);

            // Step 4: Clear cart
            connection.query('DELETE FROM cart WHERE user_id = ?', [userId], (err) => {
              if (err) return res.status(500).send(err);

              // Step 5: Prepare invoice (PDF/email optional)
              const invoiceData = {
                sender: {
                  company: "Nandhini brass and metals",
                  address: "Uppal",
                  zip: "500036",
                  city: "Hyderabad",
                  country: "India"
                },
                client: {
                  company: address.name,
                  address: address.street,
                  zip: address.zip,
                  city: address.city,
                  country: address.country
                },
                invoiceNumber: "INV-" + orderId,
                invoiceDate: new Date().toISOString().split('T')[0],
                products: cartItems.map(item => ({
                  quantity: 1,
                  description: item.product_name,
                  price: item.product_price
                }))
              };

              // Optional: You can enable this when ready
              // easyinvoice.createInvoice(invoiceData, result => {
              //   fs.writeFileSync(`invoices/invoice-${orderId}.pdf`, result.pdf, 'base64');
              //   console.log('Invoice generated!');
              // });

              res.send('Order placed successfully');
            });
          }
        );
      });
    }
  );
});

app.get('/myorders', verifyToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT o.id AS order_id, o.order_date, p.product_name, p.product_price
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.order_date DESC
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});


app.get('/invoice/:order_id', (req, res) => {
  const filePath = `invoices/invoice-${req.params.order_id}.pdf`;
  res.download(filePath);
});
app.get('/admin/orders', (req, res) => {
  const query = `
    SELECT o.id AS order_id, o.order_date, u.username, p.product_name, p.product_price
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ORDER BY o.order_date DESC
  `;

  connection.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.put('/order/:order_id/status', (req, res) => {
  const orderId = req.params.order_id;
  const { status } = req.body;

  const validStatuses = ['processing', 'shipped', 'delivered'];
  if (!validStatuses.includes(status)) {
    return res.status(400).send('Invalid status value');
  }

  connection.query(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, orderId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      if (result.affectedRows === 0) return res.status(404).send('Order not found');
      res.send(`Order ${orderId} status updated to ${status}`);
    }
  );
});
app.use('/upload', express.static('upload'));