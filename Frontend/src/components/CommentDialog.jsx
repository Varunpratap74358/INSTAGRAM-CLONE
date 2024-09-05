import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState('')
  const { selectedPost,posts } = useSelector((store) => store.post)
  const dispatch = useDispatch()
  const [comment, setComment] = useState([])
 
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost?.comments)
    }
  },[selectedPost])

  const changeHandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText('')
    }
  }
  //for comment
  const sendMessageHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      toast.success(data?.message)
      const updatedcommentData = [...comment, data?.comment]
      setComment(updatedcommentData)
      const updatedPostData = posts.map((p) =>
        p._id === selectedPost._id ? { ...p, comments: updatedcommentData } : p,
      )
      dispatch(setPosts(updatedPostData))
      setText('')
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.messsage)
    }
  }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="max-w-5xl p-0 flex flex-col"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                alt="comment"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex  justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage
                        src={selectedPost?.author.profilePicture}
                        alt="userphoto"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">
                      {selectedPost?.author.username}
                    </Link>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer w-full text-red-500 hover:bg-gray-400 py-2">
                      unfollow
                    </div>
                    <div className="cursor-pointer w-full  hover:bg-gray-400 py-2">
                      Add to favrat
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {comment.map((v, i) => {
                  return <Comment key={i} comment={v} />
                })}
              </div>
              <div className="p-4">
                <div>
                  <form
                    className="flex items-center gap-2"
                    onSubmit={sendMessageHandler}
                  >
                    <input
                      type="text"
                      className="outline-none w-full border border-gray-300 p-2 rounded"
                      value={text}
                      onChange={changeHandler}
                      placeholder="add a comment...."
                    />
                    <Button
                      disabled={!text.trim()}
                      type="submit"
                      variant="outline"
                    >
                      send
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CommentDialog
