import { NextResponse } from 'next/server';
import { deleteOne, findOne } from '@/app/lib/db/challenges';
import { updateMany } from '@/app/lib/db/lessons';
import { on, nativeId } from '@/app/lib/helpers';

export async function GET(_req: Request, { params }: { params: { challengeId: string } }) {
  try {
    const challenge = await findOne({ _id: nativeId(params.challengeId) })
    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }
    return NextResponse.json(challenge);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch the challenge' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { challengeId: string } }) {
  const { challengeId } = params
  
  try {
    const deletedChallenge = await deleteOne({ _id: nativeId(challengeId) })
    if (!deletedChallenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    const filter = { challenges: challengeId }
    const update = { $pull: { challenges: challengeId } }
    const [err,] = await on(updateMany(filter, update))
    if (err) throw new Error("Error while updating lessons")

    return NextResponse.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete the challenge' }, { status: 500 });
  }
}
