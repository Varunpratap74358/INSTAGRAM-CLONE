import { User } from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getDataUri from '../utils/datauri.js'
import cloudinary from '../utils/cloudinary.js'
import { Post } from '../models/postModel.js'

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'Fill all form',
        success: false,
      })
    }
    const isEmail = await User.findOne({ email })
    if (isEmail) {
      return res.status(400).json({
        success: false,
        message: 'This email is already used',
      })
    }
    const isUsername = await User.findOne({ username })
    if (isUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username already exist',
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    let data = await User.create({
      username,
      email,
      password: hashedPassword,
    })
    res.status(201).json({
      success: true,
      message: 'Account Createad successfully...',
      data,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    let user = await User.findOne({ email })
      .populate('followers')
      .populate('following')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not exist',
      })
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      return res.status(404).json({
        success: false,
        message: 'Password is wrong',
      })
    }

    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    })
    const populatePosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId)
        if (post?.author.equals(user._id)) {
          return post
        }
        return null
      }),
    )
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatePosts,
    }

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: 'User login successfully',
        user,
      })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export const logout = async (req, res) => {
  try {
    res.status(200).cookie('token', '', { maxAge: 0 }).json({
      success: true,
      message: 'User logout successfully',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id
    const user = await User.findById(userId)
      .select('-password')
      .populate({ path: 'posts', createdAt: -1 })
      .populate('bookmarks')
      .populate('followers')
      .populate('following')
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not exist',
      })
    }
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const editProfile = async (req, res) => {
  try {
    const userId = req.id
    const { bio, gender } = req.body
    const profilePicture = req.file
    let cloudResponse
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture)
      cloudResponse = await cloudinary.uploader.upload(fileUri)
    }
    let user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      })
    }
    if (bio) user.bio = bio
    if (gender) user.gender = gender
    if (profilePicture) user.profilePicture = cloudResponse.secure_url

    await user.save()
    res.status(200).json({
      success: true,
      message: 'Profile updated',
      user,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getSuggestedUser = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      '-password',
    )
    if (!suggestedUsers) {
      return res.status(400).json({
        success: false,
        message: 'Currentaly do not have any users',
      })
    }
    res.status(200).json({
      success: true,
      suggestedUsers,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const followAndUnfollow = async (req, res) => {
  try {
    const followKarneWala = req.id
    const jiskoFollowkarnaHai = req.params.id
    if (followKarneWala === jiskoFollowkarnaHai) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow and unfollow yourself',
      })
    }
    const user = await User.findById(followKarneWala)
    const targetUser = await User.findById(jiskoFollowkarnaHai)

    if (!user || !targetUser) {
      return res.status(400).json({
        success: false,
        message: 'User Not found',
      })
    }

    const isFollowing = user.following.includes(jiskoFollowkarnaHai)
    if (isFollowing) {
      //unfollow login
      await User.findByIdAndUpdate(jiskoFollowkarnaHai, {
        $pull: { followers: followKarneWala },
      })
      await User.findByIdAndUpdate(followKarneWala, {
        $pull: { following: jiskoFollowkarnaHai },
      })
      res.status(200).json({
        message: 'user unfollowd successfully',
      })
    } else {
      //follow logic
      await User.findByIdAndUpdate(jiskoFollowkarnaHai, {
        $push: { followers: followKarneWala },
      })
      await User.findByIdAndUpdate(followKarneWala, {
        $push: { following: jiskoFollowkarnaHai },
      })

      return res.status(200).json({
        message: 'user followd successfully',
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
