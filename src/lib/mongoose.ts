import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  const cacheObject = {
    conn: null,
    promise: null,
  };

  global.mongooseCache = cacheObject;
  cached = cacheObject;
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error(
      "Failed to connect to MongoDB. Please check your MONGODB_URI and ensure that your database is running.",
    );
  }

  return cached.conn;
};

/**
 * Returns the native MongoDB `Db` instance for Better Auth adapter
 */

export const getNativeDb = async () => {
  const mongooseInstance = await connectToDatabase();
  const db = mongooseInstance.connection.db;

  if (!db) {
    throw new Error("Failed to retrieve native MongoDB database instance");
  }

  return {
    db,
    client: mongoose.connection.getClient(),
  };
};
