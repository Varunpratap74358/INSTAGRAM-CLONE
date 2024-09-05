import { setMessages } from '@/redux/chatSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const useGetAllMessage = () => {
  const dispatch = useDispatch()
  const {selectedUser} = useSelector(store=>store.auth)
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const {
          data,
        } = await axios.get(`http://localhost:3000/api/v1/message//all/${selectedUser?._id}`, {
          withCredentials: true,
        })
        // console.log(data)
        dispatch(setMessages(data?.messages))
      } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.message)
      }
    }
    fetchAllMessage()
  },[selectedUser])
}

export default useGetAllMessage