import { Pair } from "../schemas/pair";

/**
 * Returns the Pair document corresponding to the pairId and userId
 * @param pairId 
 * @param userId 
 */
export async function getPairByPairId(pairId: string, userId: string): Promise<any> {
  const pairDoc = await Pair.findOne({ id: pairId }).exec();

  if (pairDoc?.user1 === userId || pairDoc?.user2 === userId) {
    return pairDoc;
  }

  return null;
}

export async function getComplexityByPairId(pairId: string) {
  const pairDoc = await Pair.findOne({ id: pairId }).exec();

  return pairDoc?.complexity ?? 0;
}

export async function updatePairNextQuestion(pairId: string, questionId: number) {
  const pairDoc = await Pair.findOneAndUpdate({ id: pairId }, { $set: { questionId } });
}

export async function setExpiryByPairId(pairId: string, expiry: number) {
  const pairDoc = await Pair.findOne({ id: pairId }).exec();

  if (pairDoc === null) {
    throw new Error("Cannot find pair in DB!");
  }

  pairDoc.expireAt = new Date(Date.now() + expiry);
}