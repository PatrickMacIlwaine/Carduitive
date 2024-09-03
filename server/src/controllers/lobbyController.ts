import { Request, Response } from "express";
import { createLobby } from "../services/lobbyService";

export const createLobbyHandler = (req: Request, res: Response) => {
  const { playerCount, streamerMode, timeConstraint } = req.body;

  const lobbyCode = createLobby({
    playerCount,
    streamerMode,
    timeConstraint,
  });

  res.json({ lobbyCode });
};
