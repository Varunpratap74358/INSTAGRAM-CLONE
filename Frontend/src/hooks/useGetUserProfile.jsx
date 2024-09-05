import { setUserProfile } from '@/redux/authSlice'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/api/v1/user/${userId}/profile`,
          {
            withCredentials: true,
          },
        )
        // console.log(data)
        dispatch(setUserProfile(data?.user))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUserProfile()
  }, [userId])
}

export default useGetUserProfile
