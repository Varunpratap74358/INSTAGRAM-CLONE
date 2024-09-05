import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback } from './ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { setSelectedUser } from '@/redux/authSlice'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { MessageCircleCode } from 'lucide-react'
import Messages from './Messages'
import { toast } from 'sonner'
import axios from 'axios'
import { setMessages } from '@/redux/chatSlice'

const CheatPage = () => {
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth,
  )
  const { onlineUsers, messages } = useSelector((store) => store.chat)
//   console.log(messages)
  const dispatch = useDispatch()
  const [textMessage, setTextMessage] = useState([])

  const sendMessageHandler = async (reciverId) => {
    // console.log(reciverId)
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/message/send/${reciverId}`,
        { textMessage },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    //   console.log(messages)
      dispatch(setMessages([...messages, data.newMessage]))
     setTextMessage('')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null))
    }
  }, [])

  return (
    <div className="flex ml-24 md:ml-[100px] lg:ml-[320px] h-screen ">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-400" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((v, i) => {
            // sockit io logic
            const isOnline = onlineUsers.includes(v?._id)
            return (
              <div
                key={i}
                onClick={() => dispatch(setSelectedUser(v))}
                className="flex gap-3 items-center p-3 hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={v?.profilePicture} />
                  <AvatarFallback className="">
                    <img
                      src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                      alt="pro"
                    />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{v?.username}</span>
                  <span
                    className={`text-xs font-bold ${
                      isOnline ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isOnline ? 'Online' : 'Ofline'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l-gray-300 flex flex-col bg-gray-100">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-400 sticky top-0 bg-gray-200">
            <Avatar>
              <AvatarImage src={selectedUser?.profilePicture} />
              <AvatarFallback className="">
                <img
                  src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                  alt="pro"
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          {/* messages */}

          <Messages selectedUser={selectedUser} />

          {/* input */}
          <div className="flex items-center p-4 border-t  border-t-gray-400 bg-red-50">
            <Input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Message....."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 mt-4" />
          <h1 className="font-medium text-xl">Your Messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  )
}

export default CheatPage
