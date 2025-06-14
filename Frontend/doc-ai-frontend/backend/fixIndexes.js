const mongoose = require('mongoose');

// MongoDB connection
mongoose.connect('mongodb+srv://pushpendratri9:6ZC1fr6xZ30gWHsC@cluster0.rdsf7tb.mongodb.net/docai?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB Atlas');
  
  try {
    // Get the users collection
    const usersCollection = mongoose.connection.collection('users');
    
    // Drop all existing indexes
    console.log('Dropping all existing indexes...');
    await usersCollection.dropIndexes();
    console.log('All indexes dropped successfully');
    
    // Create new index for username only
    console.log('Creating new index for username...');
    await usersCollection.createIndex({ username: 1 }, { unique: true });
    console.log('New index created successfully');
    
    console.log('Index fix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing indexes:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 