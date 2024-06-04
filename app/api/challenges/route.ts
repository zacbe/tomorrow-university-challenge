import { NextResponse } from 'next/server';
import { insertOne, findMany } from '@/app/lib/db/challenges';
import { updateMany } from '@/app/lib/db/lessons';
import { on, nativeId } from '@/app/lib/helpers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get('filter[ids]');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    let filter = {};
    if (idsParam) {
      const ids = idsParam.split(',').map(nativeId);
      filter = { _id: { $in: ids } };
    }

    const options = {};
    const [err, result] = await on(findMany(filter, options, page, limit));
    if (err) throw new Error("Error while fetching");
    const { challenges, total } = result;

    return NextResponse.json({
      challenges,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: 'No challenges found' }, { status: 404 });
  }
}


export async function POST(req: Request) {
  try {

    const body = await req.json();
    let lessons = body?.lessons?.length !== 0 ? body.lessons : null;
    const [err, challengeId] = await on(insertOne(body))
    if (err) throw new Error("Error while creating")

    if (lessons) {
      const filter = { _id: { $in: lessons.map(nativeId) } }
      const update = { $push: { challenges: challengeId } }
      const [err,] = await on(updateMany(filter, update))
      if (err) throw new Error("Error while updating lessons")
    }

    return NextResponse.json(challengeId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}