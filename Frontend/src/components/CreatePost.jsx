import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Textarea } from './ui/textarea'
import { readFileAsDataUrl } from '@/lib/utils'
import Loader from './Loader'
import { toast } from 'sonner'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import { setPosts } from '@/redux/postSlice'

const CreatePost = ({ open, setOpen }) => {
  const imageref = useRef()
  const [file, setFile] = useState('')
  const [caption, setCaption] = useState('')
  const [imagePreview, setImagePriew] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((store) => store.auth)
  const dispathch = useDispatch()
  const { posts } = useSelector((store) => store.post)
  // console.log(posts)
  const navigat = useNavigate('')
  const fileChangehandler = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
      const dataUrl = await readFileAsDataUrl(file)
      setImagePriew(dataUrl)
    }
  }

  const createPostHandler = async (e) => {
    const formData = new FormData()
    formData.append('caption', caption)
    if (imagePreview) {
      formData.append('image', file)
    }
    try {
      setLoading(true)
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/post/addpost',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form/data' },
        },
      )
      toast.success(data?.message)
      dispathch(setPosts([ data?.post,...posts]))
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} className="z-21 ">
      <DialogContent>
        <DialogHeader className={'font-bold flex items-center text-2xl'}>
          Create New Post
        </DialogHeader>{' '}
        <hr />
        <div className="flex gap-4 items-center">
          <Avatar>
            <AvatarImage
              className="w-10 h-10 rounded-[50px]"
              src={user?.profilePicture}
              alt="img"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-lg">{user?.username}</h1>
            <span className="text-xs">Bio Here..</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="write a caption"
        />
        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview img"
              className="object-contain h-full max-h-full w-full max-w-full rounded-md"
            />
          </div>
        )}
        <input
          ref={imageref}
          type="file"
          className="hidden"
          onChange={fileChangehandler}
        />
        <Button
          onClick={() => imageref.current.click()}
          className="w-fit mx-auto hover:bg-blue-600 bg-blue-500"
        >
          Select from computer
        </Button>
        {imagePreview &&
          (loading ? (
            <Button>
              
              Please wait
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type={'submit'}
              className={'w-full'}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  )
}

export default CreatePost
