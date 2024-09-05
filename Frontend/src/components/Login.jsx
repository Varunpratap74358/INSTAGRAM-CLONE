import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'


const Login = () => {
  const [input, setInput] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user} = useSelector(store=>store.auth)

  

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }

  const SubmitHandler = async (e) => {
    e.preventDefault()
    setLoading(true) // Start loading state

    try {
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/user/login',
        input,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      // console.log('API response:', data) // Debug log
      toast.success(data?.message)

      dispatch(setAuthUser(data.user)) // Action dispatch

      // console.log('Dispatched user data to Redux:', data.user) // Debug log
      navigate('/')

      setInput({
        email: '',
        password: '',
      })
    } catch (error) {
      console.error('Error during login:', error) // More detailed error log
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false) // End loading state
    }
  }

  useEffect(()=>{
    if(user){
     navigate("/")
    }
  },[])

  return (
    <>
      <div className="flex items-center w-screen h-screen justify-center">
        <form
          onSubmit={SubmitHandler}
          className="shadow-2xl border-[3px] rounded-lg flex flex-col gap-5 p-8 "
        >
          <div className="mt-4">
            <div className="flex justify-center bg-transparent">
              <img
                src="https://cdn2.downdetector.com/static/uploads/logo/Instagram_Logo_Large.png"
                alt="logo"
                width={200}
                className="outline-none"
              />
            </div>
            <p className="">Login to see photos and videos</p>
          </div>

          <div>
            <Label className="font-medium">email:</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={onChangeHandler}
              className="focus-visible:ring-transparent my-1"
              required
            />
          </div>
          <div>
            <Label className="font-medium">password:</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={onChangeHandler}
              className="focus-visible:ring-transparent my-1"
              required
            />
          </div>
          {loading ? <Loader /> : ''}
          <Button type="submit" className="bg-blue-600 ">
            Login
          </Button>
          <span className="mt-[-10px]">
            You have no account?:{' '}
            <Link to={'/signup'} className="text-blue-500">
              Signup
            </Link>
          </span>
        </form>
      </div>
    </>
  )
}

export default Login
