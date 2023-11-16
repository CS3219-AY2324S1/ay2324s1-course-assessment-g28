import express, { Request, Response } from "express";
import { v4 as uuidv4 } from 'uuid';
import { Pair } from '../schemas/pair';
const router = express.Router();


/**
 * Query String: ?user1=<string>&user2=<string>&complexity=<number>&questionId=<number>
 */
router.get('/getWebsocketUrl', (req: Request, res: Response) => {

  const user1 = req.query.user1;
  const user2 = req.query.user2;
  const complexity = req.query.complexity;
  const questionId = req.query.questionId;
  
  console.log("/getWebsocketUrl with query params: ", user1, user2, complexity, questionId);

  if (user1 === undefined || user2 === undefined
    || complexity === undefined || questionId === undefined) {
    return res.status(400).send({
      message: "Query format is ?user1=...&user2=...&complexity=...&questionId=..."
    });
  }

  const pairId = uuidv4();

  const websocketUrl1 = encodeURIComponent(process.env.WEBSOCKET_URL + ":" + process.env.WEBSOCKET_PORT + "?pairId=" + pairId + "&userId=" + user1);
  const websocketUrl2 = encodeURIComponent(process.env.WEBSOCKET_URL + ":" + process.env.WEBSOCKET_PORT + "?pairId=" + pairId + "&userId=" + user2);

  Pair.create({ 
    id: pairId,
    user1: user1,
    user2: user2,
    currTurn: user1,
    wsUrl1: websocketUrl1,
    wsUrl2: websocketUrl2,
    complexity: complexity,
    questionId: questionId
  });

  res.status(200).json({ 
    user1: websocketUrl1, 
    user2: websocketUrl2
  });
});

/**
 * Query String: ?userId=<userId>
 */
router.get('/getActiveSessions', async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const pairDetails1 = await Pair.find({ user1: userId }, { user2: 1, wsUrl1: 1, questionId: 1 }).exec();
  const pairDetails2 = await Pair.find({ user2: userId }, { user1: 1, wsUrl2: 1, questionId: 1 }).exec();

  const activeSessions: { 
    wsUrl: string, 
    otherUser: string, 
    questionId: number, 
    complexity: number 
  }[] = [];

  pairDetails1.forEach(pair => {
    activeSessions.push({ 
      wsUrl: pair.wsUrl1!, 
      otherUser: pair.user2!, 
      questionId: pair.questionId!, 
      complexity: pair.complexity! 
    });
  });
  pairDetails2.forEach(pair => {
    activeSessions.push({ 
      wsUrl: pair.wsUrl2!, 
      otherUser: pair.user1!, 
      questionId: pair.questionId!, 
      complexity: pair.complexity!
    });
  });

  res.status(200).json({
    activeSessions: activeSessions
  });
});

module.exports = router;