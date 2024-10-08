import { WebSocket as WsWebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Lobby {
  clients: Map<string, WsWebSocket>;
  playerCount: number;
  playerReadyStatus: Map<string, boolean>;
  playersConnected: number;
  playersReady: number;
  level: number;
  win: boolean;
  loss: boolean;
  playerCards: Map<string, Array<number>>;
  otherPlayersCards: Map<string, Array<Array<number>>>;
  lastPlayedCard: number;
  playedCardsHistory: Array<number>;
  streamerMode: boolean;
  timeConstraint: boolean;
  highScore: number;
  inGame: boolean;
  countdown: number;
}

interface LobbyOptions {
  playerCount: number;
  streamerMode: boolean;
  timeConstraint: boolean;
}

const lobbies: { [key: string]: Lobby } = {};

export const createLobby = ({
  playerCount,
  streamerMode,
  timeConstraint,
}: LobbyOptions): string => {
  const lobbyCode = uuidv4().slice(0, 5);
  const playerCards = new Map<string, Array<number>>();
  const otherPlayersCards = new Map<string, Array<Array<number>>>();

  lobbies[lobbyCode] = {
    clients: new Map<string, WsWebSocket>(),
    playersConnected: 0,
    playerReadyStatus: new Map<string, boolean>(),
    playersReady: 0,
    playerCount,
    level: 1,
    win: false,
    loss: false,
    playerCards,
    otherPlayersCards,
    lastPlayedCard: 0,
    playedCardsHistory: [],
    streamerMode,
    timeConstraint,
    highScore: 0,
    inGame: false,
    countdown: 0,
  };

  assignCardsToPlayers(lobbyCode);

  return lobbyCode;
};

export const resetLobby = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.playersConnected = 0;
    lobby.playersReady = 0;
    lobby.level = 1;
    lobby.win = false;
    lobby.loss = false;
    lobby.playerCards.clear();
    lobby.otherPlayersCards.clear();
    lobby.lastPlayedCard = 0;
    lobby.playedCardsHistory = [];
    lobby.highScore = 0;
    lobby.inGame = false;
    lobby.countdown = 0;

    sendResetLobby(lobbyCode);
  } else {
  }
};

export const assignCardsToPlayers = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const totalCards = Array.from({ length: 100 }, (_, i) => i + 1);
    const shuffledCards = totalCards.sort(() => Math.random() - 0.5);

    const numCardsPerPlayer = lobby.level;
    const playerIds = [...lobby.clients.keys()];

    playerIds.forEach((clientId, index) => {
      const start = index * numCardsPerPlayer;
      const end = start + numCardsPerPlayer;
      const clientCards = shuffledCards.slice(start, end);
      lobby.playerCards.set(clientId, clientCards);
    });

    playerIds.forEach((clientId) => {
      const otherCards = playerIds
        .filter((id) => id !== clientId)
        .map((id) => lobby.playerCards.get(id) || []);
      lobby.otherPlayersCards.set(clientId, otherCards);
    });
  }
};

export const sendResetLobby = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.clients.forEach((client, clientId) => {
      const myCards = lobby.playerCards.get(clientId);
      const otherPlayersCards = lobby.otherPlayersCards.get(clientId);

      const fullState = {
        type: 'resetLobby',
        payload: {
          connectedPlayers: lobby.clients.size,
          playersReady: lobby.playersReady,
          playerCount: lobby.playerCount,
          playersConnected: lobby.playersConnected,
          level: lobby.level,
          win: lobby.win,
          loss: lobby.loss,
          myCards,
          otherPlayersCards,
          lastPlayedCard: lobby.lastPlayedCard,
          playedCardsHistory: lobby.playedCardsHistory,
          streamerMode: lobby.streamerMode,
          timeConstraint: lobby.timeConstraint,
          highScore: lobby.highScore,
          countdown: lobby.countdown,
          inGame: lobby.inGame,
        },
      };

      const updateData = JSON.stringify(fullState);

      if (client.readyState === WsWebSocket.OPEN) {
        client.send(updateData);
      }
    });
  }
};

export const startGameCountdown = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.countdown = 3;
    sendCardsToClients(lobbyCode);

    const countdownInterval = setInterval(() => {
      if (lobby.countdown > 0) {
        lobby.countdown -= 1;

        if (lobby.countdown === 0) {
          lobby.inGame = true;
          clearInterval(countdownInterval);
        }

        sendCardsToClients(lobbyCode);
      }
    }, 1000);
  }
};

export const sendCardsToClients = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.clients.forEach((client, clientId) => {
      const myCards = lobby.playerCards.get(clientId);
      const otherPlayersCards = lobby.otherPlayersCards.get(clientId);

      const fullState = {
        type: 'fullStateUpdate',
        payload: {
          connectedPlayers: lobby.clients.size,
          playersReady: lobby.playersReady,
          playerCount: lobby.playerCount,
          playersConnected: lobby.playersConnected,
          level: lobby.level,
          win: lobby.win,
          loss: lobby.loss,
          myCards,
          otherPlayersCards,
          lastPlayedCard: lobby.lastPlayedCard,
          playedCardsHistory: lobby.playedCardsHistory,
          streamerMode: lobby.streamerMode,
          timeConstraint: lobby.timeConstraint,
          highScore: lobby.highScore,
          countdown: lobby.countdown,
          inGame: lobby.inGame,
        },
      };

      const updateData = JSON.stringify(fullState);

      if (client.readyState === WsWebSocket.OPEN) {
        client.send(updateData);
      }
    });
  }
};

export const addClientToLobby = (
  lobbyCode: string,
  client: WsWebSocket,
  clientId: string
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.clients.set(clientId, client);
    lobby.playersConnected = lobby.clients.size;
    sendCardsToClients(lobbyCode);
  }
};

export const sendInGameStateToClients = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const inGameState = {
      type: 'inGameUpdate',
      payload: {
        inGame: lobby.inGame,
      },
    };

    const updateData = JSON.stringify(inGameState);

    lobby.clients.forEach((client) => {
      if (client.readyState === WsWebSocket.OPEN) {
        client.send(updateData);
      }
    });
  }
};

export const updateReadyCount = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];

  if (lobby) {
    lobby.playersReady++;

    if (lobby.playersReady === lobby.playerCount) {
      assignCardsToPlayers(lobbyCode);
      startGameCountdown(lobbyCode);
      lobby.inGame = true;
    }

    sendCardsToClients(lobbyCode);
  }
};

export const handlePlayCard = (
  lobbyCode: string,
  clientId: string,
  card: number
) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const playerCards = lobby.playerCards.get(clientId) || [];
    const otherPlayersCards = lobby.otherPlayersCards.get(clientId) || [];

    const allRemainingCards = [...playerCards, ...otherPlayersCards.flat()];

    const cardIndex = playerCards.indexOf(card);
    if (cardIndex > -1) {
      playerCards.splice(cardIndex, 1);
      lobby.playerCards.set(clientId, playerCards);
    } else {
      return;
    }

    lobby.playedCardsHistory.push(card);
    lobby.lastPlayedCard = card;

    let playerLoses = false;

    for (const remainingCard of allRemainingCards) {
      if (card > remainingCard) {
        playerLoses = true;
        break;
      }
    }

    if (playerLoses) {
      lobby.loss = true;
      sendCardsToClients(lobbyCode);
      return;
    }

    const allCardsPlayed = [...lobby.playerCards.values()].every(
      (cards) => cards.length === 0
    );

    if (allCardsPlayed) {
      lobby.win = true;
    }

    sendCardsToClients(lobbyCode);
  }
};

export const nextRound = (lobbyCode: string, win: boolean, loss: boolean) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    if (win || loss) {
      lobby.win = false;
      lobby.loss = false;
      lobby.playersReady = 0;
      lobby.lastPlayedCard = 0;
      lobby.playedCardsHistory = [];

      if (win) {
        if (lobby.level >= lobby.highScore) {
          lobby.highScore = lobby.level;
        }
        lobby.level += 1;
      } else if (loss) {
        lobby.level = 1;
      }

      lobby.inGame = false;
      lobby.countdown = 0;

      assignCardsToPlayers(lobbyCode);
      sendCardsToClients(lobbyCode);
    }
  }
};

export const getLobby = (lobbyCode: string): Lobby | undefined => {
  return lobbies[lobbyCode];
};
