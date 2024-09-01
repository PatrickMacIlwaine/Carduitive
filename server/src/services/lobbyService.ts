import { WebSocket as WsWebSocket } from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface Lobby {
  clients: Map<string, WsWebSocket>;
  playerCount: number;
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
  console.log('Creating lobby with options:', {
    playerCount,
    streamerMode,
    timeConstraint,
  });

  const lobbyCode = uuidv4().slice(0, 5);
  const playerCards = new Map<string, Array<number>>();
  const otherPlayersCards = new Map<string, Array<Array<number>>>();

  lobbies[lobbyCode] = {
    clients: new Map<string, WsWebSocket>(),
    playersConnected: 0,
    playersReady: 0,
    playerCount,
    level: 1,
    win: false,
    loss: false,
    playerCards,
    otherPlayersCards,
    lastPlayedCard: 0,
    playedCardsHistory: [], // Initialize the history array
    streamerMode,
    timeConstraint,
    highScore: 0,
  };

  assignCardsToPlayers(lobbyCode);

  console.log(`Lobby created with code: ${lobbyCode}`, lobbies[lobbyCode]);
  return lobbyCode;
};

export const assignCardsToPlayers = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    const totalCards = Array.from({ length: 100 }, (_, i) => i + 1); // Generate cards 1 to 100
    const shuffledCards = totalCards.sort(() => Math.random() - 0.5); // Shuffle the cards

    const numCardsPerPlayer = lobby.level; // Number of cards each player gets based on the level

    const playerIds = [...lobby.clients.keys()];

    // First, assign the cards to each player
    playerIds.forEach((clientId, index) => {
      const start = index * numCardsPerPlayer;
      const end = start + numCardsPerPlayer;
      const clientCards = shuffledCards.slice(start, end);
      lobby.playerCards.set(clientId, clientCards);
    });

    // Then, assign other players' cards to each player
    playerIds.forEach((clientId) => {
      const otherCards = playerIds
        .filter((id) => id !== clientId)
        .map((id) => lobby.playerCards.get(id) || []);
      lobby.otherPlayersCards.set(clientId, otherCards);
    });
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
          playedCardsHistory: lobby.playedCardsHistory, // Include the history
          streamerMode: lobby.streamerMode,
          timeConstraint: lobby.timeConstraint,
          highScore: lobby.highScore,
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

export const updateReadyCount = (lobbyCode: string) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    lobby.playersReady++;

    if (lobby.playersReady === lobby.playerCount) {
      if (lobby.playerCards.size === 0 ){
        assignCardsToPlayers(lobbyCode);
      }

      sendCardsToClients(lobbyCode); 
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

    // Remove the played card from the player's hand
    const cardIndex = playerCards.indexOf(card);
    if (cardIndex > -1) {
      playerCards.splice(cardIndex, 1);
      lobby.playerCards.set(clientId, playerCards);
    } else {
      console.log(`Card ${card} not found in player ${clientId}'s hand.`);
      return; // Card not found, something went wrong
    }

    // Add the played card to the history
    lobby.playedCardsHistory.push(card);
    lobby.lastPlayedCard = card;

    // Determine if the player loses
    let playerLoses = false;
    for (const otherCards of otherPlayersCards) {
      if (otherCards.some((otherCard) => card > otherCard)) {
        playerLoses = true;
        break;
      }
    }

    if (playerLoses) {
      lobby.loss = true;
      console.log(
        `Player ${clientId} loses because they played a higher card.`
      );
      // Send the updated state indicating the player has lost
      sendCardsToClients(lobbyCode);
      return;
    }

    console.log(`Player ${clientId} played a valid card ${card}.`);

    // Check if the player played the lowest card in the game
    const allCards = [...playerCards, ...otherPlayersCards.flat()];
    const lowestCard = Math.min(...allCards);

    if (card === lowestCard) {
      console.log(
        `Player ${clientId} played the lowest card. The game continues.`
      );
    } else {
      console.log(
        `Player ${clientId} played ${card}, which is not the lowest.`
      );
    }

    // Check if all players have successfully played all their cards
    const allCardsPlayed = [...lobby.playerCards.values()].every(
      (cards) => cards.length === 0
    );

    if (allCardsPlayed) {
      lobby.win = true;
      console.log(`All cards have been successfully played. Players win!`);
    }

    sendCardsToClients(lobbyCode);
  }
};

export const nextRound = (lobbyCode: string, win:boolean, loss:boolean) => {
  const lobby = lobbies[lobbyCode];
  if (lobby) {
    
    if (win) {
      lobby.win = false;
      lobby.playersReady = 0;
      if (lobby.level >= lobby.highScore) {
        lobby.highScore = lobby.level
      }
      lobby.level += 1;
      assignCardsToPlayers(lobbyCode);
    }
    if (loss) {
      lobby.loss = false;
      lobby.playersReady = 0;
      lobby.level = 1;
      assignCardsToPlayers(lobbyCode);
    }
    sendCardsToClients(lobbyCode);
    }
  }

export const getLobby = (lobbyCode: string): Lobby | undefined => {
  return lobbies[lobbyCode];
};
