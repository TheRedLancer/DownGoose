import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import Lobby from './Lobby';
import ErrorPage from './pages/error-page';
import DownGoose from './routes/DownGoose';

const router = createBrowserRouter([
    {
        path: "/",
        element: <DownGoose/>,
        errorElement: <ErrorPage/>
    },
    {
        path: 'game/:roomCode',
        element: <Lobby />
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
)
