import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
  const {posts} = useSelector(store=>store.post)
  return (
    <div className=''>
        {
             posts.map((post,i)=>{
                return(
                    <Post key={i} post={post} />
                )
            })
        }
    </div>
  )
}

export default Posts
