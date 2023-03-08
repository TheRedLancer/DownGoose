/*
  Author: Zach Burnaby
  Project: DownGoose
  Date: 10.15.2022
*/
import React from 'react'
import GooseCardArea from './components/GooseCardArea'
import PlayerButtons from './PlayerButtons';
import colorCardData from './colorCardData.json';

const playerNames = ["player1", "player2", "player3"];
const playerCardRotations = [3, 0, 0];
const numPlayers = playerNames.length;
const activePlayer = "player3";
const playerColorCardColors = ["blue", "pink", "orange", "yellow"];
const playerColorCard = colorCardData[
    playerColorCardColors[0] + "_" +
    playerColorCardColors[1] + "_" +
    playerColorCardColors[2] + "_" +
    playerColorCardColors[3]];
const calledColor = "orange";
const numberQuacked = 3;

/**
 * 
 * @param {Object} props 
 * @param props.roomCode
 * @param props.isHost
 * @param props.currentPlayer
 * @param props.playerNames
 * @returns 
 */
export default function Game(props) {    
    const notification = () => {
        if (activePlayer === playerNames[0]) {
            return "It's your turn!"
        } else if (calledColor === "quack") {
            return "Active Player Quacked!";
        } else {
            return "Called color: " + calledColor;
        }
    }

    return (
        <div className='game'>
            <h2>
                Notification: {notification()}
            </h2>
            <GooseCardArea
                playerNames={playerNames.slice(1, numPlayers)}
                playerCardRotations={playerCardRotations.slice(1, numPlayers)}
                activePlayer={activePlayer}
            />
            {playerNames[0]}
            <Card
                playerName={playerNames[0]}
                rotation={playerCardRotations[0]}
                active={activePlayer === playerNames[0]}
                image={playerColorCard}
            />
            <PlayerButtons
                currentColor={playerColorCardColors[playerCardRotations[0]]}
                calledColor={calledColor}
                active={activePlayer === playerNames[0]}
                numberQuacked={numberQuacked}
            />
        </div>
    )
}