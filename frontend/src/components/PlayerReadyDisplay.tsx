/*
  Author: Zach Burnaby
  Project: DownGoose
*/

type props = {
    players: LobbyPlayers
}

export default function PlayerReadyDisplay(props: props) {
    return (
        <div>
            {Object.entries(props.players).map(p => {
                return <li key={p[1].id}>
                    {p[1].nickname}: {p[1].ready.toString()}
                </li>
            })}
        </div>
    )
}