import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality wireless earbuds with noise cancellation and 24-hour battery life.",
    price: 79.99,
    originalPrice: 99.99,
    discount: 20,
    category: "Electronics",
    brand: "SoundMax",
    sku: "SM-WB100",
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500",
        alt: "Wireless Bluetooth Earbuds",
        isPrimary: true
      }
    ],
    stock: 50,
    specifications: {
      weight: 0.05,
      dimensions: { length: 5, width: 2, height: 2 },
      color: ["Black", "White"],
      material: "Plastic",
      warranty: "1 year"
    },
    features: ["Noise Cancellation", "Water Resistant", "Long Battery"],
    rating: { average: 4.5, count: 120 },
    isActive: true,
    isFeatured: true,
    tags: ["wireless", "audio", "earbuds"]
  }
  // Add more sample products...
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    // Insert sample data
    await Product.insertMany(sampleProducts);
    console.log('Sample data inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();