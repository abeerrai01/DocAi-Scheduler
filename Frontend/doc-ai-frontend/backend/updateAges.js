const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting age update script...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get the User model
    const User = require('./models/User');
    
    // Find all users with null age
    const users = await User.find({ age: null });
    console.log(`Found ${users.length} users with null age`);
    
    if (users.length === 0) {
      console.log('No users found with null age');
      process.exit(0);
    }
    
    // Update each user's age
    for (const user of users) {
      console.log(`Processing user: ${user.username}`);
      user.age = 20;
      await user.save();
      console.log(`Updated age for user: ${user.username}`);
    }
    
    console.log('Successfully updated all null ages to 20');
    process.exit(0);
  } catch (error) {
    console.error('Error updating ages:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 