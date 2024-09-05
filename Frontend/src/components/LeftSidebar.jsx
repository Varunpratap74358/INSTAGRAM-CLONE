import { setAuthUser } from '@/redux/authSlice'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import axios from 'axios'
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  Menu,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import CreatePost from './CreatePost'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const LeftSidebar = () => {
  const navigate = useNavigate()
  const [userAvatar, setUserAvatar] = useState('')
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification,
  )
  // console.log(likeNotification)
  const sidebarItems = [
    { icon: <Home className="w-6 h-6" />, text: 'Home' },
    { icon: <Search className="w-6 h-6" />, text: 'Search' },
    { icon: <TrendingUp className="w-6 h-6" />, text: 'Explore' },
    { icon: <MessageCircle className="w-6 h-6" />, text: 'Messages' },
    { icon: <Heart className="w-6 h-6" />, text: 'Notifications' },
    { icon: <PlusSquare className="w-6 h-6" />, text: 'Create' },
    {
      icon: (
        <Avatar>
          <AvatarImage
            src={user?.profilePicture}
            className="rounded-full border border-gray-300 w-14 h-10"
          />
          <AvatarFallback className="">
            <img
              src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
              alt="pro"
            />
          </AvatarFallback>
        </Avatar>
      ),
      text: 'Profile',
    },
    { icon: <LogOut className="w-6 h-6" />, text: 'Logout' },
  ]

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(
        'http://localhost:3000/api/v1/user/logout',
        {
          withCredentials: true,
        },
      )
      dispatch(setAuthUser(null))
      dispatch(setSelectedPost(null))
      dispatch(setPosts([]))
      toast.success(data?.message)
      setUserAvatar(data?.user?.profilePicture)
      navigate('/login')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  const sidebarHandler = (texttype) => {
    if (texttype === 'Logout') {
      logoutHandler()
    } else if (texttype === 'Create') {
      setOpen(true)
    } else if (texttype === 'Profile') {
      navigate(`/profile/${user?._id}`)
    } else if (texttype === 'Home') {
      navigate('/')
    } else if (texttype === 'Messages') {
      navigate('/chat')
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="z-30">
      {/* Toggle Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg w-64 md:w-20 lg:w-64 sm:w-16 transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-center pt-8">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center bg-transparent">
              <img
                src="https://cdn2.downdetector.com/static/uploads/logo/Instagram_Logo_Large.png"
                alt="logo"
                className="hidden md:block"
                width={140}
              />
              <img
                src="https://cdn2.downdetector.com/static/uploads/logo/Instagram_Logo_Large.png"
                alt="logo"
                className="md:hidden"
                width={40}
              />
            </div>
            {sidebarItems.map((v, i) => (
              <div
                key={i}
                onClick={() => sidebarHandler(v.text)}
                className="flex items-center w-full px-2 py-2 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <div className="flex items-center justify-center w-10 h-10 text-gray-600">
                  {v.icon}
                </div>
                <span className="ml-4 text-gray-800 font-medium hidden lg:block">
                  {v.text}
                </span>
                {v.text === 'Notifications' && likeNotification.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="rounded-full h-8 w-5 bg-red-600 hover:bg-red-500 relative left-2">
                        {likeNotification.length}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div>
                        {likeNotification.length === 0 ? (
                          <p>No new notification</p>
                        ) : (
                          likeNotification.map((notification) => {
                            return (
                              <div
                                key={notification?.userId}
                                className="flex items-center gap-2 my-2"
                              >
                                <Avatar>
                                  <AvatarImage
                                    className="w-12 rounded-full h-12"
                                    src={
                                      notification?.userDetails?.profilePicture
                                    }
                                  />
                                  <AvatarFallback className="">
                                    <img
                                      src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                                      alt="pro"
                                    />
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-sm">
                                  <span className="font-bold">
                                    {notification?.userDetails?.username}
                                  </span>{' '}
                                  liked your post
                                </p>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            ))}
          </div>
        </div>
        <CreatePost open={open} setOpen={setOpen} />
      </div>
    </div>
  )
}

export default LeftSidebar
