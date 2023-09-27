import { Pair } from "../schemas/pair";

/**
 * Returns the Pair document corresponding to the pairId and userId
 * @param pairId 
 * @param userId 
 */
export async function getPair(pairId: string, userId: string): Promise<any> {
  const pair = await Pair.findOne({ id: pairId }).exec();

  if (pair?.user1 === userId || pair?.user2 === userId) {
    return pair;
  }

  return null;
}