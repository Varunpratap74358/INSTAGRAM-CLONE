// import { Avatar, AvatarFallback } from '@radix-ui/react-avatar'
import React, { useState } from 'react'
import { AvatarImage, Avatar, AvatarFallback } from './ui/avatar'
import { Dialog, DialogTrigger, DialogContent } from './ui/dialog'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { FcLike } from 'react-icons/fc'
import { FaRegHeart } from 'react-icons/fa'
import { LuMessageCircle } from 'react-icons/lu'
import { FiSend } from 'react-icons/fi'
import { FaRegBookmark } from 'react-icons/fa6'
import { FaBookmark } from 'react-icons/fa6'
import CommentDialog from './CommentDialog'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { toast } from 'sonner'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const { posts } = useSelector((store) => store.post)
  const dispatch = useDispatch()
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false)
  const [postlike, setPostLike] = useState(post.likes.length)
  const [comment, setComment] = useState(post.comments)
  // console.log(post);
  const [saved, setSaved] = useState('unsaved')

  const onChangeHandler = (e) => {
    const inputText = e.target.value
    if (inputText.trim()) {
      setText(inputText)
    } else {
      setText('')
    }
  }

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true },
      )
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id,
        )
        dispatch(setPosts(updatedPostData))
        toast.success(res?.data?.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  const likeOrDislikleHandler = async (postId) => {
    try {
      const action = liked ? 'dislike' : 'like'

      const {
        data,
      } = await axios.get(
        `http://localhost:3000/api/v1/post/${postId}/${action}`,
        { withCredentials: true },
      )
      toast.success(data?.message)
      const updatedLikes = liked ? postlike - 1 : postlike + 1
      setPostLike(updatedLikes)
      setLiked(!liked)
      const updatedpostData = posts.map((p) =>
        p._id === postId
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user?._id)
                : [...p.likes, user._id],
            }
          : p,
      )

      dispatch(setPosts(updatedpostData))
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.messsage)
    }
  }

  const commentHandler = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/v1/post/${post._id}/comment`,
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
        p._id === post._id ? { ...p, comments: updatedcommentData } : p,
      )
      setText('') //ye clear kyu nhi ho raha hai???????????
      dispatch(setPosts(updatedPostData))
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.messsage)
    }
  }

  const bookMarkHandler = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/post/${post?._id}/bookmark`,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      toast.success(data?.message)
      // console.log(data)
      setSaved(data?.type)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <div className="my-8 w-full max-w-sm mx-auto border p-2 rounded-sm shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="z-[-10]">
            <AvatarImage src={post?.author.profilePicture} alt="postimage" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex gap-3">
            <h1 className="font-bold">{post?.author.username}</h1>
            {user?._id === post?.author._id ? (
              <Badge variant={'secondary'}>Author</Badge>
            ) : (
              ''
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center justify-center">
            {user && user?._id === post?.author._id ? (
              <Button
                onClick={deletePostHandler}
                className="cursor-pointer w-fit text-gray-500 border  bg-transparent  hover:bg-slate-200"
              >
                Delete
              </Button>
            ) : (
              <>
                <Button className="cursor-pointer w-40 text-red-500 font-bold bg-transparent border-2 hover:bg-slate-200">
                  Unfollow{' '}
                </Button>
                {saved === 'unsaved' ? (
                  <Button
                    onClick={bookMarkHandler}
                    className="cursor-pointer w-fit bg-transparent text-gray-600 hover:bg-slate-200"
                  >
                    Add to favorites
                  </Button>
                ) : (
                  <Button
                    onClick={bookMarkHandler}
                    className="cursor-pointer w-fit bg-transparent text-gray-600 hover:bg-slate-200"
                  >
                    remove to favorites
                  </Button>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-sm my-2 w-full aspect-square object-center"
        src={post?.image}
        alt=""
      />
      <div className="flex my-3 mt-5 justify-between px-3">
        <div className="flex gap-4 ">
          {!liked ? (
            <FaRegHeart
              onClick={() => likeOrDislikleHandler(post._id)}
              size={25}
              className="cursor-pointer"
            />
          ) : (
            <FcLike
              onClick={() => likeOrDislikleHandler(post._id)}
              size={25}
              className="cursor-pointer"
            />
          )}
          <LuMessageCircle
            size={25}
            onClick={() => {
              dispatch(setSelectedPost(post))
              setOpen(true)
            }}
            className="cursor-pointer hover:text-gray-400"
          />
          <FiSend size={25} className="cursor-pointer hover:text-gray-400" />
        </div>
        {saved === 'unsaved' ? (
          <FaRegBookmark
            onClick={bookMarkHandler}
            size={25}
            className="cursor-pointer hover:text-gray-400"
          />
        ) : (
          <FaBookmark
            onClick={bookMarkHandler}
            size={25}
            className="cursor-pointer hover:text-gray-400"
          />
        )}
      </div>
      <span className="font-medium text-sm block ">{postlike} likes</span>
      {post?.caption && (
        <p className="">
          <span className="font-medium mr-1">{post?.author.username}:</span>
          {post?.caption}
        </p>
      )}

      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post))
            setOpen(true)
          }}
          className="cursor-pointer text-gray-500"
        >
          <span className="font-bold text-black">view all:</span>{' '}
          {comment.length} comments
        </span>
      )}

      <CommentDialog open={open} setOpen={setOpen} />
      <div>
        <form
          onSubmit={commentHandler}
          className="flex justify-between mt-3 px-3"
        >
          <input
            type="text"
            placeholder="add a comment"
            name="text"
            value={text}
            onChange={onChangeHandler}
            className="outline-none text-sm w-full"
          />
          {text && (
            <button type="submit" className="text-blue-400">
              Post
            </button>
          )}
        </form>
      </div>
    </div>
  )
}

export default Post
