import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'

const Comment = ({ comment }) => {
  //   console.log(comment)

  return (
    <div className="my-2">
      <div className="gap-3 items-center flex">
        <Link to={`/profile/${comment?.author._id}`}>
          <Avatar>
            <AvatarImage src={comment?.author?.profilePicture} ale={'pro'} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="font-bold">
          {comment?.author?.username}{' '}
          <span className="font-normal">{comment?.text}</span>
        </h1>
      </div>
    </div>
  )
}

export default Comment
