declare global {
  var _mongoClientPromise: Promise<MongoClient>;

  interface Challenge {
    id?: string;
    title: string;
    description: string;
    content: string;
    lessons: string[];
  }

  interface Lesson {
    id?: string;
    title: string;
    description: string;
    content: string;
    challenges: string[];
  }
}

export { };