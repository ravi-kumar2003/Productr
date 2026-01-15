const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    phone: '1234567890',
    address: '123 Main St, City, State',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    phone: '0987654321',
    address: '456 Oak Ave, City, State',
    role: 'admin',
  },
];

const sampleProducts = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    stock: 50,
    rating: 4.5,
    numReviews: 120,
    featured: true,
  },
  {
    name: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 199.99,
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=SmartWatch',
    stock: 30,
    rating: 4.8,
    numReviews: 85,
    featured: true,
  },
  {
    name: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=LaptopStand',
    stock: 100,
    rating: 4.2,
    numReviews: 45,
    featured: false,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with cherry switches',
    price: 129.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=Keyboard',
    stock: 75,
    rating: 4.6,
    numReviews: 200,
    featured: true,
  },
  {
    name: 'USB-C Hub',
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
    price: 39.99,
    category: 'Accessories',
    image: 'https://via.placeholder.com/300x300?text=USBCHub',
    stock: 150,
    rating: 4.0,
    numReviews: 60,
    featured: false,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orufy_assignment', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Insert sample users
    const users = await User.insertMany(sampleUsers);
    console.log(`Inserted ${users.length} users`);

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${products.length} products`);

    // Create sample orders
    if (users.length > 0 && products.length > 0) {
      const sampleOrders = [
        {
          user: users[0]._id,
          items: [
            { product: products[0]._id, quantity: 1, price: products[0].price },
            { product: products[2]._id, quantity: 2, price: products[2].price },
          ],
          totalAmount: products[0].price + products[2].price * 2,
          shippingAddress: {
            street: '123 Main St',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            country: 'Country',
          },
          paymentMethod: 'credit_card',
          paymentStatus: 'paid',
          orderStatus: 'delivered',
        },
        {
          user: users[0]._id,
          items: [
            { product: products[1]._id, quantity: 1, price: products[1].price },
          ],
          totalAmount: products[1].price,
          shippingAddress: {
            street: '123 Main St',
            city: 'City',
            state: 'State',
            zipCode: '12345',
            country: 'Country',
          },
          paymentMethod: 'paypal',
          paymentStatus: 'paid',
          orderStatus: 'shipped',
        },
      ];

      const orders = await Order.insertMany(sampleOrders);
      console.log(`Inserted ${orders.length} orders`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
