import { Pair } from "../schemas/pair";

/**
 * Returns the Pair document corresponding to the pairId and userId
 * @param pairId 
 * @param userId 
 */
export async function getPairAndStoreQuestionId(pairId: string, userId: string, questionId: number): Promise<any> {
  const pairDoc = await Pair.findOne({ id: pairId }).exec();

  if (pairDoc?.user1 === userId || pairDoc?.user2 === userId) {
    console.log("pairDoc:", pairDoc);
    console.log(pairId, userId, questionId, pairDoc.user1);
    
    pairDoc.questionId = questionId;
    await pairDoc.save();

    return pairDoc;
  }

  return null;
}