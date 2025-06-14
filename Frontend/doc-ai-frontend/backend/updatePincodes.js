const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting pincode update script...');
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
    
    // Find all users with null pincode
    const users = await User.find({ pincode: null });
    console.log(`Found ${users.length} users with null pincode`);
    
    if (users.length === 0) {
      console.log('No users found with null pincode');
      process.exit(0);
    }
    
    // Update each user's pincode
    for (const user of users) {
      console.log(`Processing user: ${user.username}`);
      user.pincode = '000001';
      await user.save();
      console.log(`Updated pincode for user: ${user.username}`);
    }
    
    console.log('Successfully updated all null pincodes to 000001');
    process.exit(0);
  } catch (error) {
    console.error('Error updating pincodes:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 