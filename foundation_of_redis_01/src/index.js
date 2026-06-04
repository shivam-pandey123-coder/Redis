import express from 'express';
import redis from 'ioredis';
import mongoose from 'mongoose';

const app = express();

const redisClient = new redis(process.env.REDIS_URL || 'redis://localhost:6379');

redisClient.on('error', (error) => {
    console.error('Redis connection error:', error.message);
});

app.get('/redis', async (req, res) => {
    try {
        const reply = await redisClient.ping();
        res.json({ redis: reply });
    } catch (error) {
        res.status(503).json({ error: 'Redis is unavailable' });
    }
});
app.get('/mongo', async (req, res) => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/learning-redis';
   try {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri);
    }

    res.json({ mongo: 'connected', database: mongoose.connection.name });
   } catch (error) {
    res.status(503).json({ error: 'MongoDB is unavailable' });
   }
    
});
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})