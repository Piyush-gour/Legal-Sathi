import { MongoClient } from 'mongodb';
import 'dotenv/config';

async function dropProblematicIndex() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('legalsathi');
    const collection = db.collection('lawyers');
    
    // List current indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:');
    indexes.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    // Drop all problematic indexes
    const problematicIndexes = ['barRegistrationNumber_1', 'barNumber_1', 'specializations_1_user.address.city_1_rating_-1'];
    
    for (const indexName of problematicIndexes) {
      try {
        await collection.dropIndex(indexName);
        console.log(`✅ Successfully dropped ${indexName} index`);
      } catch (error) {
        if (error.message.includes('index not found')) {
          console.log(`Index ${indexName} not found (already dropped)`);
        } else {
          console.log(`Error dropping ${indexName}:`, error.message);
        }
      }
    }
    
    // List indexes after drop
    const indexesAfter = await collection.indexes();
    console.log('\nIndexes after drop:');
    indexesAfter.forEach(index => {
      console.log(`- ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

dropProblematicIndex();
