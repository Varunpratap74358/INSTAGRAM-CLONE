// const { default: axios } = require("axios")
// const { useEffect } = require("react")
// const { useDispatch } = require("react-redux")
// const { toast } = require("sonner")

import { setPosts } from '@/redux/postSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

const useGetAllPosts = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const {
          data,
        } = await axios.get('http://localhost:3000/api/v1/post/all', {
          withCredentials: true,
        })
        // console.log(data)
        dispatch(setPosts(data?.posts))
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
      }
    }
    fetchAllPosts()
  },[])
}

export default useGetAllPosts