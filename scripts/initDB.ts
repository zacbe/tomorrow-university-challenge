import clientPromise from '@/app/lib/db';

async function initDB() {
  try {
    const client = await clientPromise;
    const db = await client.db(process.env.DB_NAME);

    // Initial data
    const lessons = [
      {
        title: 'Lesson 1',
        description: 'This is a short description',
        content: 'This is the content of the lesson. It can be a long text.',
        challenges: [],
      },
      {
        title: 'Lesson 2',
        description: 'This is a short description',
        content: 'This is the content of the lesson. It can be a long text.',
        challenges: [],
      },
    ];

    const challenges = [
      {
        title: 'Challenge 1',
        description: 'This is a short description',
        content: 'This is the content of the lesson. It can be a long text.',
        lessons: [],
      },
      {
        title: 'Challenge 2',
        description: 'This is a short description',
        content: 'This is the content of the lesson. It can be a long text.',
        lessons: [],
      },
    ]

    // Insert initial data
    if (process.env.LESSONS_COLLECTION_NAME === undefined) {
      throw new Error('Define LESSONS_COLLECTION_NAME');
    }

    if (process.env.CHALLENGES_COLLECTION_NAME === undefined) {
      throw new Error('Define CHALLENGES_COLLECTION_NAME');
    }

    await db.collection(process.env.LESSONS_COLLECTION_NAME).insertMany(lessons);
    await db.collection(process.env.CHALLENGES_COLLECTION_NAME).insertMany(challenges);

    console.info('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    process.exit();
  }
}

initDB();
