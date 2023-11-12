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
  console.log("+++ Next question id:", questionId, "+++");
  const pairDoc = await Pair.findOneAndUpdate({ id: pairId }, { $set: { questionId: questionId } });
}

export async function deletePairByPairId(pairId: string) {
  const pairDoc = await Pair.findOneAndDelete({ id: pairId }).exec();

  if (pairDoc === undefined) {
    throw new Error("Trying to delete pair but cannot find in DB: " + pairId);
  }
}

// export async function setExpiryByPairId(pairId: string, expiry: number) {
//   const pairDoc = await Pair.findOne({ id: pairId }).exec();

//   if (pairDoc === null) {
//     throw new Error("Setting expiry. Cannot find pair in DB: " + pairId);
//   }

//   pairDoc.expireAt = new Date(Date.now() + expiry);
// }