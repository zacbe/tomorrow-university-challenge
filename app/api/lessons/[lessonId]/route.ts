import { NextResponse } from 'next/server';
import { deleteOne, findOne } from '@/app/lib/db/lessons';
import { updateMany } from '@/app/lib/db/challenges';
import { on, nativeId } from '@/app/lib/helpers';

export async function GET(_req: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params

  try {
    const lesson = await findOne({ _id: nativeId(lessonId) })
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch the lesson' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { lessonId: string } }) {
  const { lessonId } = params
  try {
    const deletedLesson = await deleteOne({ _id: nativeId(lessonId) })
    if (!deletedLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const filter = { lessons: lessonId }
    const update = { $pull: { lessons: lessonId } }
    const [err,] = await on(updateMany(filter, update))
    if (err) throw new Error("Error while updating challenges")

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete the lesson' }, { status: 500 });
  }
}
