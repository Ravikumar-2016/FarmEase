import { MongoClient, MongoClientOptions } from "mongodb";

declare global {
  // Allow global variable for hot reloads in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI as string;
const options: MongoClientOptions = {};

if (!uri) {
  throw new Error("❌ Please add your Mongo URI to .env.local as MONGODB_URI");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse connection in development to avoid too many connections
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // Create a new client for production
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
