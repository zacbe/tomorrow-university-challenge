import { MongoClient, Db, Collection, Filter, FindOptions, BSON, } from "mongodb";
import clientPromise from ".";
import { stringId } from "../helpers";


let client: MongoClient
let db: Db
let collection: Collection

async function init() {
  if (db) return

  const collectionName = process.env.CHALLENGES_COLLECTION_NAME
  if (!collectionName) throw new Error('Define CHALLENGES_COLLECTION_NAME')

  try {
    client = await clientPromise
    db = await client.db(process.env.DB_NAME)
    collection = db.collection(collectionName)
  } catch (error) {
    throw new Error('Failed to establish connection')
  }
}

(async () => { await init() })

export async function insertOne(document: Challenge) {
  if (!collection) await init()

  try {
    const { insertedId } = await collection.insertOne(document)
    return stringId(insertedId)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function findOne(
  filter: Filter<BSON.Document>,
  options?: FindOptions<BSON.Document>
) {
  if (!collection) await init()

  try {
    const challenge = await collection.findOne(filter, options)
    if (!challenge) return null
    const { _id, ...rest } = challenge;
    return { id: stringId(_id), ...rest };
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function findMany(
  filter: Filter<BSON.Document>,
  options?: FindOptions<BSON.Document>,
  page: number = 1,
  limit: number = 10
) {
  if (!collection) await init()

  try {
    const challenges = await collection.find(filter, options)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments(filter);

    const formattedChallenges = challenges.map((challenge: BSON.Document) => {
      const { _id, ...rest } = challenge;
      return { id: stringId(_id), ...rest };
    });

    return { challenges: formattedChallenges, total };
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function deleteOne(filter: Filter<BSON.Document>) {
  if (!collection) await init()

  try {
    const { deletedCount } = await collection.deleteOne(filter)
    return deletedCount
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function updateMany(filter: Filter<BSON.Document>, update: any) {
  if (!collection) await init()

  try {
    await collection.updateMany(filter, update)
  } catch (e) {
    console.error(e)
    throw e
  }
}