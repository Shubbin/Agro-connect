import mysql from 'mysql2/promise';
import 'dotenv/config';

const runMigrations = async () => {
  try {
    // Initial connection without database for creation
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'agrconnect';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database '${dbName}' verified/created.`);

    // Re-connect or switch to the new database
    await connection.query(`USE \`${dbName}\``);

    const queries = [
      `CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          phone VARCHAR(255),
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'user',
          auth_token VARCHAR(255),
          is_verified BOOLEAN DEFAULT FALSE,
          verification_status VARCHAR(50) DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          farmer_id INT,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          category VARCHAR(100),
          price DECIMAL(10,2) NOT NULL,
          unit VARCHAR(50),
          available DECIMAL(10,2) DEFAULT 0,
          images JSON,
          location VARCHAR(255),
          certifications JSON,
          rating DECIMAL(3,2) DEFAULT 0,
          review_count INT DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          status VARCHAR(50) DEFAULT 'pending',
          total DECIMAL(10,2) NOT NULL,
          delivery_address TEXT,
          tracking_number VARCHAR(100),
          estimated_delivery VARCHAR(100),
          actual_delivery_date DATETIME,
          payment_status VARCHAR(50) DEFAULT 'pending',
          escrow_status VARCHAR(50) DEFAULT 'held',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT,
          product_id INT,
          quantity DECIMAL(10,2) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sender_id INT,
          receiver_id INT,
          content TEXT NOT NULL,
          product_id INT,
          order_id INT,
          media_url VARCHAR(255),
          media_type VARCHAR(50),
          is_read BOOLEAN DEFAULT FALSE,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
      )`,
      `CREATE TABLE IF NOT EXISTS cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT,
          product_id INT,
          quantity DECIMAL(10,2) NOT NULL,
          offered_price DECIMAL(10,2),
          offer_status VARCHAR(50) DEFAULT 'none',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`
    ];

    for (const query of queries) {
      await connection.query(query);
      console.log('Successfully executed query segment...');
    }

    console.log('Migrations completed successfully.');
    await connection.end();
  } catch (error) {
    console.error('Migration failed:', error);
  }
};

runMigrations();
