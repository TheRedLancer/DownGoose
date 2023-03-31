/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import * as server from '../server.js';
import './Home.css';
import {DGERROR} from '../types/DGERROR';

export default function Home() {
    const [nickname, setNickname] = useState('');
    const [roomCode, setRoomCode] = useState('');

    const navigate = useNavigate();

    const joinRoom = async () => {
        let joinRes = await server.putPlayerInRoom(roomCode, nickname);
        if (!joinRes) {
            return;
        }
        if (joinRes.status === 201) {
            joinRes.json().then((data) => {
                // console.log('Sending data:', data);
                const nav_data = {
                    statePlayer: data.player,
                    stateRoomId: data.roomId,
                };
                navigate(`/${nav_data.statePlayer.roomCode}/lobby`, {
                    state: nav_data,
                });
            });
        } else {
            console.log(`Error: could not join room ${roomCode}`);
            await joinRes.json().then((data) => {
                switch (data.message) {
                    case DGERROR.RoomNotFound:
                        roomExists(data);
                        break;
                    default:
                        console.log('UNKNOWN ERROR', data);
                        break;
                }
            });
        }
    };

    const onHostButton = async () => {
        if (!nickname || !roomCode) {
            console.log('FILL IN NAME OR ROOMCODE');
            return;
        }
        let createRes = await server.putRoom(roomCode);
        if (!createRes) {
            return;
        }
        // console.log(createRes);
        if (createRes.status === 201) {
            joinRoom();
        } else {
            console.log(`Error: could not create room ${roomCode}`);
            await createRes.json().then((data) => {
                switch (data.message) {
                    case DGERROR.RoomExists:
                        roomExists(data);
                        break;
                    case DGERROR.FailCreateRoom:
                        failCreateRoom(data);
                    default:
                        console.log('UNKNOWN ERROR', data);
                        break;
                }
            });
        }
    };

    const roomExists = (data: {message: string}) => {
        console.log(data.message);
    };

    const failCreateRoom = (data: {message: string}) => {
        console.log(data.message);
    };

    const onJoinButton = async () => {
        if (!nickname || !roomCode) {
            console.log('FILL IN NAME OR ROOMCODE');
            return;
        }
        joinRoom();
    };

    return (
        <div>
            <div className="title">
                <h1>DownGoose!</h1>
            </div>
            <div className="goose-image">
                <img
                    className="home-goose-image"
                    src="/goose/goose.png"
                    alt="Card"
                    width={100}
                    height={100}
                />
            </div>
            <div className="lobby-form">
                <p>Nickname:</p>
                <textarea
                    className="nickname"
                    style={{
                        resize: 'none',
                    }}
                    value={nickname}
                    onChange={(e) => {
                        const value = e.target.value.replace(
                            /[\r\n\v" "]+/g,
                            ''
                        );
                        setNickname(value);
                    }}
                    rows={1}
                    maxLength={16}
                />
                <p>Join Code</p>
                <textarea
                    className="gameJoinCode"
                    style={{
                        resize: 'none',
                    }}
                    value={roomCode}
                    onChange={(e) => {
                        const value = e.target.value.replace(
                            /[\r\n\v" "]+/g,
                            ''
                        );
                        setRoomCode(value);
                    }}
                    rows={1}
                    maxLength={16}
                />
                <p></p>
                <button className="host-button" onClick={onHostButton}>
                    Host
                </button>
                <button className="join-button" onClick={onJoinButton}>
                    Join
                </button>
            </div>
        </div>
    );
}
