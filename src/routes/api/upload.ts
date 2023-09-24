import { APIEvent, json } from 'solid-start'
import { Db, MongoClient, ServerApiVersion } from 'mongodb'

const mongoConnectionString =
  'mongodb+srv://edsolater:Zhgy0330%23@personal.yntwbws.mongodb.net/?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const mongoClient = new MongoClient(mongoConnectionString, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function execDBTask(dbName: string, task: (db: Db) => Promise<any> | any) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect()
    const db = mongoClient.db(dbName)
    Promise.resolve(task(db))
  } catch (err) {
    console.error(`connect mongoDB failed: ${err}`)
  }
}

execDBTask('edsolater', (db) => {
  db.collection('images').insertOne({
    'name': 'youtube',
    'url': 'https://www.youtube.com',
    'tags': ['youtube', 'video'],
    keywords: ['youtube', 'video'],
  })
})

export async function POST({ request }: APIEvent) {
  const formDataPromise = request.formData()
  const fd = formDataPromise.then((fd) => {
    fd.forEach((value, key) => {})
  })

  return json({ received: true })
}
