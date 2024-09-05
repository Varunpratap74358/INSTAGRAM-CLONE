import { Label } from '@radix-ui/react-label'
import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { useSelector } from 'react-redux'

const Signup = () => {
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: '',
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setInput({ ...input, [name]: value })
  }

  const [loading, setLoading] = useState(false)
  const {user} = useSelector(store=>store.auth)
  const navigate = useNavigate("")
  const SubmitHandler = async (e) => {
    e.preventDefault()
    try {
      // console.log(input)
      setLoading(true)
      const { data } = await axios.post(
        'http://localhost:3000/api/v1/user/register',
        input,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      console.log(data)
      toast.success(data?.message)
      navigate("/")
      setInput({
        username: '',
        email: '',
        password: '',
      })
    } catch (error) {
      //   console.log(error)
      toast.error(error?.response?.data?.message)
    } finally {
      setLoading(false)
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
            <p className="">Signup to see photos and videos</p>
          </div>
          <div>
            <Label className="font-medium">username:</Label>
            <Input
              type="text"
              name="username"
              value={input.username}
              onChange={onChangeHandler}
              className="focus-visible:ring-transparent my-1"
              required
            />
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
          {
            loading ? (
              <Loader />
            ) : ('')
          }
            <Button type="submit" className="bg-blue-600 ">
              Signup
            </Button>
            <span className='mt-[-10px]'>Already have an account?: <Link to={'/login'} className='text-blue-500'>Login</Link></span>
        </form>
      </div>
    </>
  )
}

export default Signup
