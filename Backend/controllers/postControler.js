import sharp from 'sharp'
import cloudinary from '../utils/cloudinary.js'
import { Post } from '../models/postModel.js'
import { User } from '../models/userModel.js'
import { Comment } from '../models/commentModel.js'
import { getReciverSocketId } from '../socket/socket.js'
import { io } from '../socket/socket.js'

export const addNewPost = async (req, res) => {
  try {
      const { caption } = req.body;
      const image = req.file;
      const authorId = req.id;

      if (!image) return res.status(400).json({ message: 'Image required' });

      // image upload 
      const optimizedImageBuffer = await sharp(image.buffer)
          .resize({ width: 800, height: 800, fit: 'inside' })
          .toFormat('jpeg', { quality: 80 })
          .toBuffer();

      // buffer to data uri
      const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      const post = await Post.create({
          caption,
          image: cloudResponse.secure_url,
          author: authorId
      });
      const user = await User.findById(authorId);
      if (user) {
          user.posts.push(post._id);
          await user.save();
      }

      await post.populate({ path: 'author', select: '-password' });

      return res.status(201).json({
          message: 'New post added',
          post,
          success: true,
      })

  } catch (error) {
      console.log(error);
  }
}

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username profilePicture' })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: { path: 'author', select: 'username profilePicture' },
      })

    res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export const getPostOfUser = async (req, res) => {
  try {
    const authorId = req.id
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', select: 'username, profilePicture' })
      .populate({
        path: 'author',
        select: 'username, profilePicture',
      })
      .populate({
        path: 'comments',
        sort: { createdAt: -1 },
        populate: { path: 'author', select: 'username, profilePicture' },
      })
    res.status(200).json({
      success: true,
      posts,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.id
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(400).json({ message: 'Post not found...' })
    }

    await post.updateOne({ $addToSet: { likes: userId } })
    await post.save()
    //   sockiet io for real time data

    const user = await User.findById(userId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if(postOwnerId !== userId){
      //emit a notification
      const notification = {
        type:'like',
        userId,
        userDetails:user,
        postId,
        message:"Your Post was liked"
      }
      const postownerSocketId = getReciverSocketId(postOwnerId)
      io.to(postownerSocketId).emit('notification', notification)
    }

    return res.status(200).json({ message: 'Post liked successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

export const dislike = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.id
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(400).json({ message: 'Post not found...' })
    }

    await post.updateOne({ $pull: { likes: userId } })
    await post.save()
    //   sockiet io

    const user = await User.findById(userId).select('username profilePicture')
    const postOwnerId = post.author.toString()
    if(postOwnerId !== userId){
      //emit a notification
      const notification = {
        type:'dislike',
        userId,
        userDetails:user,
        postId,
        message:"Your Post was disliked"
      }
      const postownerSocketId = getReciverSocketId(postOwnerId)
      io.to(postownerSocketId).emit('notification', notification)
    }

    return res.status(200).json({ message: 'Post disliked successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id
    const userId = req.id

    const { text } = req.body
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      })
    }
    if (!text)
      return res.status(500).json({ message: 'Text is required for commebnt' })

    const comment = await Comment.create({
      text,
      author: userId,
      post: postId,
    })

    await comment.populate({
      path: 'author',
      select: 'username profilePicture',
    })

    post.comments.push(comment._id)
    await post.save()

    res.status(201).json({
      success: true,
      message: 'Comment addded',
      comment,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}


export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Fetch comments and populate the author field
    const comments = await Comment.find({ post: postId }).populate({
      path: 'author',
      select: 'username profilePicture',
    });

    if (!comments || comments.length === 0) {
      return res.status(404).json({ success: false, message: 'No comments' });
    }

    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id
    const authorId = req.id
    const post = await Post.findById(postId)
    if (!post) {
      return res.status(400).json({
        success: false,
        message: 'Post not found',
      })
    }

    if (post.author.toString() !== authorId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can delete only your post',
      })
    }

    await Post.findByIdAndDelete(postId)

    // remove the postId from user db
    let user = await User.findById(authorId)
    user.posts = user.posts.filter((id) => id.toString() !== postId)
    await user.save()

    // delete associated comments
    await Comment.deleteMany({ post: postId })

    res.status(200).json({
      success: true,
      message: 'Post Deleted',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const bookmarkPost = async(req,res)=>{
    try {
        const postId = req.params.id;
        const authorId = req.id
        const post = await Post.findById(postId)
        if (!post) {
            return res.status(400).json({
              success: false,
              message: 'Post not found',
            })
        }
        const user = await User.findById(authorId)
        if(user.bookmarks.includes(post._id)){
            // already bookmark 
            // remove bookmark
            await user.updateOne({$pull:{bookmarks:post._id}})
            await user.save()
            return res.status(200).json({
                success:true,
                type:"unsaved",
                message:"Post removed from bookmarked"
            })
        } else{
            // book mark method
            await user.updateOne({$addToSet:{bookmarks:post._id}})
            await user.save()
            return res.status(200).json({
                success:true,
                type:"saved",
                message:"Post bookmarked"
            })

        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}