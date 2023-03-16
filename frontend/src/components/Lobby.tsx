/*
  Author: Zach Burnaby
  Project: DownGoose
*/
type props = {
    playerList: string[]
    isHost: boolean
    roomCode: string
}

export default function Lobby(props: props) {
    return (
        <div className='lobby'>
            <h1>
                Join Code: {props.roomCode || "No room code"}
            </h1>
            {(props.playerList || []).map((playerName: string) => 
                <li key={playerName}>
                    {playerName}
                </li>
            )}
            {/* <button onClick={props.onStartGame} disabled={!props.isHost}>Start game</button> */}
        </div>
    )
}

