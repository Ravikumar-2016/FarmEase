import { MongoClient } from 'mongodb'

declare global {
  // Allow global variable usage in development for HMR
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI as string
const options = {}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // Reuse the client in development for hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  // Create a new client in production
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise
