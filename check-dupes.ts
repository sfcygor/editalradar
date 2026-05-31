import { db } from './lib/db';
import { flashcardReviews, flashcards } from './lib/db/schema';
import { inArray } from 'drizzle-orm';

async function run() {
  const ids = [
    'cc50b605-0f45-49ab-8f5f-157869db1d49',
    'f6fddfa9-fa07-4594-8c86-fb81071c5872',
    'd9b5398a-0281-4cce-a98c-60eb67361141'
  ];

  const cards = await db().select().from(flashcards).where(inArray(flashcards.id, ids));
  console.log('Cards:', cards);

  const reviews = await db().select().from(flashcardReviews).where(inArray(flashcardReviews.flashcardId, ids));
  console.log('Reviews:', reviews);
}
run();
