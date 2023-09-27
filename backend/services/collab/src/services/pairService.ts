import { Pair } from "../schemas/pair";

/**
 * Returns the partnerId or undefined if the pairId / userId is invalid
 * @param pairId 
 * @param userId 
 */
export async function getPartnerId(pairId: string, userId: string): Promise<string|undefined> {
  const pair = await Pair.findOne({ id: pairId }).exec();

  if (pair?.user1 === userId) {
    return pair?.user2;
  } else if (pair?.user2 === userId) {
    return pair?.user1;
  }
  return undefined;
}