import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './components/signup'
import Login from './components/Login'
import Home from './components/Home'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Loader from './components/Loader'
import EditProfile from './components/EditProfile'
import CheatPage from './components/CheatPage'
import { io } from 'socket.io-client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/RTNSlice'
import ProtectedRoute from './components/ProtectedRoute'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            {' '}
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile/:id',
        element: (
          <ProtectedRoute>
            {' '}
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/account/edit',
        element: (
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: '/chat',
        element: (
          <ProtectedRoute>
            <CheatPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
])

const App = () => {
  const { user } = useSelector((store) => store.auth)
  const { socket } = useSelector((store) => store.socketio)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:3000', {
        query: {
          userId: user?._id,
        },
        transports: ['websocket'],
      })
      dispatch(setSocket(socketio))
      // listing event
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers))
      })
      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification))
      })

      return () => {
        socketio.close()
        dispatch(setSocket(null))
      }
    } else if (socket) {
      socket?.close()
      dispatch(setSocket(null))
    }
  }, [user, dispatch])
  return (
    <RouterProvider router={browserRouter} />
    // <Loader />
  )
}

export default App
