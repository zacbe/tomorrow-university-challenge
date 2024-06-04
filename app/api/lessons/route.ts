import { NextResponse } from 'next/server';
import { insertOne, findMany } from '@/app/lib/db/lessons';
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
    const [err, result] = await on(findMany(filter, {}, page, limit));
    if (err) throw new Error("Error while fetching");
    const { lessons, total } = result;

    return NextResponse.json({
      lessons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    return NextResponse.json({ error: 'No lessons found' }, { status: 404 });
  }
}


export async function POST(req: Request) {
  try {

    const body = await req.json();
    const [err, lessonId] = await on(insertOne(body))
    if (err) throw new Error("Error while creating")

    return NextResponse.json(lessonId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

