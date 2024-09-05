import { setSuggestedUsers } from '@/redux/authSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchAllSuggestedUsers = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:3000/api/v1/user/suggested',
          {
            withCredentials: true,
          },
        )
        // console.log(data)
        dispatch(setSuggestedUsers(data?.suggestedUsers))
      } catch (error) {
        console.log(error)
      }
    }
    fetchAllSuggestedUsers()
  }, [])
}

export default useGetSuggestedUsers
