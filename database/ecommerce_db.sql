DROP DATABASE IF EXISTS ecommerce_db;
CREATE DATABASE ecommerce_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE ecommerce_db;


CREATE TABLE admin( admin_id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(15),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE sellers(
seller_id INT AUTO_INCREMENT PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(15) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
shop_name VARCHAR(150) NOT NULL,
gst_number VARCHAR(50),
address TEXT NOT NULL,
city VARCHAR(100) NOT NULL,
state VARCHAR(100) NOT NULL,
pincode VARCHAR(10) NOT NULL,
status ENUM('Pending', 'Approved', 'Rejected', 'Blocked') DEFAULT 'Pending',
approved_by INT NULL,
approved_at DATETIME NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_seller_admin FOREIGN KEY (approved_by) REFERENCES admin(admin_id) ON DELETE SET NULL
);




CREATE TABLE customers(
customer_id INT AUTO_INCREMENT PRIMARY KEY,
full_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
phone VARCHAR(15) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE customer_addresses (
address_id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
receiver_name VARCHAR(100) NOT NULL,
phone VARCHAR(15) NOT NULL,
address_line TEXT NOT NULL,
landmark VARCHAR(150),
city VARCHAR(100) NOT NULL,
state VARCHAR(100) NOT NULL,
pincode VARCHAR(10) NOT NULL,
is_default BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_customer_address FOREIGN KEY(customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);


CREATE TABLE categories(category_id INT AUTO_INCREMENT PRIMARY KEY, 
category_name VARCHAR(100) NOT NULL UNIQUE,
description TEXT,
category_image VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE TABLE products(product_id INT AUTO_INCREMENT PRIMARY KEY,
seller_id INT NOT NULL,
category_id INT NOT NULL,
product_name VARCHAR(200) NOT NULL,
description TEXT NOT NULL,
brand VARCHAR(100),
price DECIMAL(10,2) NOT NULL,
discount DECIMAL(5,2) DEFAULT 0.00,
final_price DECIMAL(10,2) GENERATED ALWAYS AS(price - ((price * discount)/100)) STORED,
stock INT NOT NULL DEFAULT 0,
sku VARCHAR(50) UNIQUE,
status ENUM('Available', 'Out of Stock','Hidden') DEFAULT 'Available',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_product_seller FOREIGN KEY (seller_id) REFERENCES sellers(seller_id) ON DELETE CASCADE,
CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(category_id)
);


CREATE TABLE product_images(image_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT NOT NULL,
image_path VARCHAR(255) NOT NULL,
is_primary BOOLEAN DEFAULT FALSE,
uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_product_image FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
);


CREATE TABLE wishlist(wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
product_id INT NOT NULL,
added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uq_customer_product UNIQUE(customer_id,product_id),
CONSTRAINT fk_wishlist_customer FOREIGN KEY(customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
CONSTRAINT fk_wishlist_product FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
);


CREATE INDEX idx_product_name ON products(product_name);

CREATE INDEX idx_product_brand ON products(brand);

CREATE INDEX idx_product_price ON products(price);

CREATE INDEX idx_product_category ON products(category_id);

CREATE INDEX idx_product_seller ON products(seller_id);

CREATE INDEX idx_product_stock ON products(stock);

CREATE INDEX idx_product_status ON products(status);


CREATE TABLE cart(cart_id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_cart_customer FOREIGN KEY(customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);


CREATE TABLE cart_items(cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
cart_id INT NOT NULL,
product_id INT NOT NULL,
quantity INT NOT NULL DEFAULT 1,
price DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) GENERATED ALWAYS AS(quantity * price) STORED,
added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_cartitem_cart FOREIGN KEY(cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
CONSTRAINT fk_cartitem_product FOREIGN KEY(product_id) REFERENCES products(product_id),
CONSTRAINT uq_cart_product UNIQUE(cart_id,product_id)
);


CREATE TABLE orders(order_id INT AUTO_INCREMENT PRIMARY KEY,
customer_id INT NOT NULL,
address_id INT NOT NULL,
subtotal DECIMAL(10,2) NOT NULL,
delivery_charge DECIMAL(10,2) DEFAULT 0.00,
discount DECIMAL(10,2) DEFAULT 0.00,
total_amount DECIMAL(10,2) NOT NULL,
payment_status ENUM('Pending','Success','Failed','Refunded') DEFAULT 'Pending',
order_status ENUM('Placed','Packed','Dispatched','Delivered','Cancelled','Refunded')DEFAULT 'Placed',
order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_order_customer FOREIGN KEY(customer_id) REFERENCES customers(customer_id),
CONSTRAINT fk_order_address FOREIGN KEY(address_id) REFERENCES customer_addresses(address_id)
);


CREATE TABLE order_items(order_item_id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL,
product_id INT NOT NULL,
seller_id INT NOT NULL,
quantity INT NOT NULL,
price DECIMAL(10,2) NOT NULL,
subtotal DECIMAL(10,2) GENERATED ALWAYS AS(quantity * price) STORED,
seller_status ENUM('Pending','Packed','Dispatched','Delivered','Cancelled') DEFAULT 'Pending',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_orderitem_order FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
CONSTRAINT fk_orderitem_product FOREIGN KEY(product_id) REFERENCES products(product_id),
CONSTRAINT fk_orderitem_seller FOREIGN KEY(seller_id) REFERENCES sellers(seller_id)
);


CREATE INDEX idx_order_customer ON orders(customer_id);

CREATE INDEX idx_order_status ON orders(order_status);

CREATE INDEX idx_order_payment ON orders(payment_status);

CREATE INDEX idx_order_date ON orders(order_date);

CREATE INDEX idx_orderitem_product ON order_items(product_id);

CREATE INDEX idx_orderitem_seller ON order_items(seller_id);

CREATE INDEX idx_orderitem_status ON order_items(seller_status);


CREATE TABLE payments(payment_id INT AUTO_INCREMENT PRIMARY KEY,
order_id INT NOT NULL UNIQUE,
payment_method ENUM('COD','UPI','Card') DEFAULT 'COD',
transaction_id VARCHAR(100),
paid_amount DECIMAL(10,2) NOT NULL,
payment_status ENUM('Pending','Success','Failed','Refunded') DEFAULT 'Pending',
payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_payment_order FOREIGN KEY(order_id) REFERENCES orders(order_id) ON DELETE CASCADE
);


CREATE TABLE refunds(refund_id INT AUTO_INCREMENT PRIMARY KEY,
order_item_id INT NOT NULL,
customer_id INT NOT NULL,
refund_amount DECIMAL(10,2) NOT NULL,
seller_amount DECIMAL(10,2) NOT NULL,
refund_reason TEXT,
refund_status ENUM('Pending','Approved','Rejected','Completed') DEFAULT 'Pending',
refund_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_refund_item FOREIGN KEY(order_item_id) REFERENCES order_items(order_item_id) ON DELETE CASCADE,
CONSTRAINT fk_refund_customer FOREIGN KEY(customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);


CREATE TABLE reviews(review_id INT AUTO_INCREMENT PRIMARY KEY,
product_id INT NOT NULL,
customer_id INT NOT NULL,
rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
review TEXT,
review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT uq_review UNIQUE(product_id, customer_id),
CONSTRAINT fk_review_product FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE,
CONSTRAINT fk_review_customer FOREIGN KEY(customer_id)REFERENCES customers(customer_id) ON DELETE CASCADE
);


CREATE INDEX idx_payment_status ON payments(payment_status);

CREATE INDEX idx_payment_method ON payments(payment_method);

CREATE INDEX idx_refund_status ON refunds(refund_status);

CREATE INDEX idx_review_rating ON reviews(rating);


INSERT INTO admin(username,password,full_name,email,phone)VALUES(
'admin',
'admin123',
'System Administrator',
'admin@ecommerce.com',
'9876543210'
);



INSERT INTO categories(category_name,description) VALUES('Electronics','Electronic gadgets'),
('Fashion','Clothing & Accessories'),
('Books','Educational & Story Books'),
('Furniture','Home & Office Furniture'),
('Groceries','Daily Essentials'),
('Sports','Sports Accessories'),
('Beauty','Beauty Products'),
('Toys','Kids Toys');

USE ecommerce_db;
SHOW TABLES;
SELECT * FROM admin;
SELECT * FROM admin;
SELECT * FROM customers;
SELECT * FROM categories;
SELECT * FROM products;