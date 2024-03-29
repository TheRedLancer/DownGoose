/**
  Author: Zach Burnaby
  Project: DownGoose
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './index.css';
import Game from './pages/Game';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import ErrorPage from './pages/error-page';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/:roomCode/lobby',
        element: <Lobby />,
    },
    {
        path: '/:roomCode/game',
        element: <Game />,
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
