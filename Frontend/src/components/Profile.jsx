import React, { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Heart, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { setUserProfile } from '@/redux/authSlice'

const Profile = () => {
  const params = useParams()
  const userId = params.id
  useGetUserProfile(userId)
  const { userProfile, user } = useSelector((store) => store.auth)
  const [activeTab, setActiveTab] = useState('posts')
  const navigate = useNavigate()

  // `isFollowing` ko initial state set karne ke liye useEffect ka use karenge
  const [isFollowing, setisFollowing] = useState(false)

  useEffect(() => {
    if (userProfile && user) {
      // Agar logged in user follow karta hai to initial state set karenge
      setisFollowing(userProfile?.followers?.some(follower => follower._id === user._id))
    }
  }, [userProfile, user])

  const isLogiedInUserProfile = user?._id === userProfile?._id

  const handleTypeChange = (tab) => {
    setActiveTab(tab)
  }

  const displayedPost =
    activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks

  const followAndUnfollowHandler = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/v1/user/followorunfollow/${userProfile?._id}`,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        },
      )
      setisFollowing(prev => !prev) // Follow/Unfollow hone par state ko toggle karna
      toast.success(data?.message)
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        <section className="flex justify-center md:justify-start">
          <Avatar className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48">
            <AvatarImage src={userProfile?.profilePicture} alt="profile" />
            <AvatarFallback>
              <img
                src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
                alt="profile"
              />
            </AvatarFallback>
          </Avatar>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold">
              {userProfile?.username}
            </span>
            {isLogiedInUserProfile ? (
              <div className="flex gap-2">
                <Link to={'/account/edit'}>
                  <Button
                    variant="secondary"
                    className="h-8 text-sm md:text-base hover:bg-gray-400"
                  >
                    Edit profile
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  className="h-8 text-sm md:text-base hover:bg-gray-400"
                >
                  View archive
                </Button>
                <Button
                  variant="secondary"
                  className="h-8 text-sm md:text-base hover:bg-gray-400"
                >
                  Ad tools
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                {isFollowing ? (
                  <>
                    <Button
                      onClick={followAndUnfollowHandler}
                      variant="secondary"
                      className="h-8 text-sm md:text-base hover:bg-gray-300"
                    >
                      Unfollow
                    </Button>
                    <Button
                      onClick={()=>navigate("/chat")}
                      variant="secondary"
                      className="h-8 text-sm md:text-base hover:bg-gray-300"
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={followAndUnfollowHandler}
                    className="h-8 text-sm md:text-base bg-blue-500 hover:bg-blue-700"
                  >
                    Follow
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4 items-center mt-4">
            <p className="font-bold text-base md:text-xl">
              {userProfile?.posts.length}{' '}
              <span className="font-normal">posts</span>
            </p>
            <p className="font-bold text-base md:text-xl">
              {userProfile?.followers.length}{' '}
              <span className="font-normal">Followers</span>
            </p>
            <p className="font-bold text-base md:text-xl">
              {userProfile?.following.length}{' '}
              <span className="font-normal">Following</span>
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <span className="font-semibold text-sm md:text-base">
              {userProfile?.bio || 'bio-here'}
            </span>
            <Badge className="w-fit" variant="secondary">
              @{userProfile?.username}
            </Badge>
            <span className="text-sm md:text-base">
              🤣 Lorem ipsum dolor sit amet, consectetur 🤣
            </span>
            <span className="text-sm md:text-base">
              💋 Lorem ipsum dolor sit amet, consectetur 💋
            </span>
            <span className="text-sm md:text-base">
              💖 Lorem ipsum dolor sit amet, consectetur 💖
            </span>
          </div>
        </section>
      </div>

      <div className="border-t border-t-gray-400 mt-8">
        <div className="flex items-center justify-center gap-10 text-sm md:text-base">
          <span
            className={`py-3 cursor-pointer ${
              activeTab === 'posts' ? 'font-bold' : ''
            }`}
            onClick={() => handleTypeChange('posts')}
          >
            POSTS
          </span>
          <span
            className={`py-3 cursor-pointer ${
              activeTab === 'saved' ? 'font-bold' : ''
            }`}
            onClick={() => handleTypeChange('saved')}
          >
            Saved
          </span>
          <span className="py-3 cursor-pointer">REELS</span>
          <span className="py-3 cursor-pointer">TAGS</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        {displayedPost.map((post, i) => (
          <div key={i} className="relative group cursor-pointer">
            <img
              src={post?.image}
              alt="post"
              className="rounded-sm my-2 w-full aspect-square object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 group-hover:opacity-100 opacity-0 transition-opacity duration-300">
              <div className="flex items-center text-white space-x-4">
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <Heart />
                  <span>{post?.likes.length}</span>
                </button>
                <button className="flex items-center gap-2 hover:text-gray-300">
                  <MessageCircle />
                  <span>{post?.likes.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Profile
