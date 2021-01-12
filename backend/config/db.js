import mongoose from 'mongoose'

export default async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan);
    }
    catch (error) {
        console.error(`Error: ${error.message}`.red.bold);
        process.exit(1); // 1 = failure
    }
}