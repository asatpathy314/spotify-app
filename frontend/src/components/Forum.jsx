import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../components/AuthProvider";
import { useNavigate } from 'react-router-dom';

import {
  Container,
  Card,
  Box,
  Text,
  Spinner,
  VStack,
  Button,
  FormControl,
  FormLabel,
  Input,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { FaSpotify, FaThumbsUp } from 'react-icons/fa';
import axios from 'axios';




const Forum = () => {
  const { token, userID } = useContext(AuthContext);
  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newForumName, setNewForumName] = useState('');
  const [newComment, setNewComment] = useState('')
  const navigate = useNavigate();


  useEffect(() => {

    if (!token || !userID) {
      navigate('/login');
      return;
    }

    const fetchForums = async () => {
      try {
        const response = await axios.get('http://localhost:8000/forum/forums', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
        setForums(response.data.forums);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [token, userID, navigate]);




  const fetchPosts = async (forumId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/forum/forums/${forumId}/posts`);
      setPosts(response.data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };




  const fetchComments = async (forumId, postId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };




  const handleForumClick = (forum) => {
    setSelectedForum(forum);
    setSelectedPost(null);
    fetchPosts(forum.id);
  };




  const handlePostClick = (forum, post) => {
    setSelectedPost(post);
    fetchComments(forum.id, post.id);
  };



// const handleLikeComment = async (forumId, postId, commentId) => {
//     try {
//       await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}/like`);
//       // Update the likes count for the selected comment directly
//       setComments(prevComments => prevComments.map(comment =>
//         comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
//       ));
//     } catch (error) {
//       console.error('Error liking comment:', error);
//     }
//   };

const handleLikeComment = async (forumId, postId, commentId) => {
    try {
      await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}/like`, {
        userId: userID
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      ));
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('You have already liked this comment.');
      }
      console.error('Error liking comment:', error);
    }
  };

//   const handleLikePost = async (forumId, postId) => {
//     try {
//       await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/like`);
//       // Update the likes count for the selected post directly
//        setSelectedPost(prevPost => ({
//          ...prevPost,
//          likes: prevPost.likes + 1
//        }));
//       // Update the likes count in the posts array
//       setPosts(prevPosts => prevPosts.map(post =>
//         post.id === postId ? { ...post, likes: post.likes + 1 } : post
//       ));
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
// };

const handleLikePost = async (forumId, postId) => {
    try {
      await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/like`, {
        userId: userID
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSelectedPost(prevPost => ({
        ...prevPost,
        likes: prevPost.likes + 1
      }));
      setPosts(prevPosts => prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
};


  const handleCreateForum = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/forum/forum', { name: newForumName });
      setNewForumName('');
      alert('Forum created successfully!');
      const response = await axios.get('http://localhost:8000/forum/forums');
      setForums(response.data.forums);
    } catch (error) {
      console.error('Error creating forum:', error);
      alert('Failed to create forum.');
    }
  };




  const handleSubmitPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/forum/forums/${selectedForum.id}/posts`, {
        title,
        description,
        userId: userID,
      });
      setTitle('');
      setDescription('');
      alert('Post created successfully!');
      fetchPosts(selectedForum.id);
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Failed to submit post.');
    }
  };




  const handleSubmitComment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/forum/forums/${selectedForum.id}/posts/${selectedPost.id}/comments`, {
        text: newComment,
        userId: userID,
      });
      setNewComment('');
      alert('Comment created successfully!');
      fetchComments(selectedForum.id, selectedPost.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment.');
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };




  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }




  if (selectedPost) {
    return (
      <Container minHeight="100vh" display="flex" flexDirection="column" gap={4}>
        <Button 
        bg="#a7a9be"
        _hover={{ bg: "#ff8906" }}
        onClick={() => setSelectedPost(null)}
        >
          Back to Posts
        </Button>
        <Card mb={1} bg="gray.700" padding={"3"}  p={6}>
          <Text color="gray.500" fontSize="sm">
            Posted by {selectedPost.userId} on {formatDate(selectedPost.date)}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color="white" >
            {selectedPost.title}
          </Text>
          <Text color="white">{selectedPost.description}</Text>
          <HStack justifyContent="right">
            <Text color="gray.500" fontSize="sm">
              {selectedPost.likes} likes
            </Text>
            <IconButton
              aria-label="Like post"
              icon={<FaThumbsUp />}
              onClick={() => handleLikePost(selectedForum.id, selectedPost.id)}
            //   colorScheme="teal"
              bg="#a7a9be"
              _hover={{ bg: "#ff8906" }}
            />
          </HStack>
        </Card>
        <form onSubmit={handleSubmitComment}>
          <FormControl id="new-comment" mb={4}>
            <FormLabel color="white">Add a Comment</FormLabel>
            <Input
              color="white"
              type="text"
              value={newComment}
              focusBorderColor="#ff8906"
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" mb={0} textColor="black" bg="#a7a9be"
        _hover={{ bg: "#ff8906" }} leftIcon={<FaSpotify />}>
            Post Comment
          </Button>
        </form>
        <VStack spacing={4} align="stretch">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id} p={6} bg="gray.700" borderRadius="md" width="100%">
                <Text color="gray.500" fontSize="sm">
                Posted by {comment.userId} on {formatDate(comment.date)}
                </Text>
                <Text color="white">{comment.text}</Text>
                <HStack justifyContent="right">
                  <Text color="gray.500" fontSize="sm">
                    {comment.likes} likes
                  </Text>
                  <IconButton
                    aria-label="Like comment"
                    icon={<FaThumbsUp />}
                    onClick={() => handleLikeComment(selectedForum.id, selectedPost.id, comment.id)}
                    bg="#a7a9be"
                    _hover={{ bg: "#ff8906" }}
                  />
                </HStack>

              </Card>
            ))
          ) : (
            <Text color="gray.300" align="center"  mt={4}>No comments yet!</Text>
          )}
        </VStack>
      </Container>
    );
  }




  if (selectedForum) {
    return (
      <Container minHeight="100vh" display="flex" flexDirection="column" gap={4}>
        <Button bg="#a7a9be"
                _hover={{ bg: "#ff8906" }}
                onClick={() => setSelectedForum(null)} 
                >
          Back to Forums
        </Button>
        <Box mb={1}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {"Posts From Forum: " + selectedForum.name}
          </Text>
        </Box>
        <Box mb={4}>
            <form onSubmit={handleSubmitPost}>
            <FormControl id="title" mb={1} focusB>
                <FormLabel color="white">Title</FormLabel>
                <Input color="white" type="text" value={title} focusBorderColor="#ff8906" onChange={(e) => setTitle(e.target.value)} required />
            </FormControl>
            <FormControl id="description" mb={4}>
                <FormLabel color="white">Description</FormLabel>
                <Input
                color="white"
                type="text"
                value={description}
                focusBorderColor="#ff8906"
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            </FormControl>
            <Button type="submit" textColor="black" bg="#a7a9be"
        _hover={{ bg: "#ff8906" }} mb={1} leftIcon={<FaSpotify />}>
                Create Post
            </Button>
            </form>
        </Box>
        <Box>
        <VStack spacing={4} align="stretch">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                p={6}
                bg="gray.700"
                borderRadius="md"
                width="100%"
                onClick={() => handlePostClick(selectedForum, post)}
                cursor="pointer"
              >
                <Text color="gray.500" fontSize="sm">
                  Posted by {post.userId} on {formatDate(post.date)}
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="white" mb={4}>
                  {post.title}
                </Text>
                <Text fontSize="sm" color="white">{post.description}</Text>
              </Card>
            ))
          ) : (
            <Text color="white">No posts available</Text>
          )}
        </VStack>
        </Box>
      </Container>
    );
  }




  return (
    <Container minHeight="100vh" display="flex" flexDirection="column" gap={4}>
    <form onSubmit={handleCreateForum}>
        <FormControl id="new-forum-name" mb={4}>
        <FormLabel color="white">Create New Forum</FormLabel>
        <Input
            maxLength={15}
            type="text"
            color="white"
            value={newForumName}
            focusBorderColor="#ff8906"
            onChange={(e) => setNewForumName(e.target.value)}
            required
        />
        </FormControl>
        <Button type="submit" textColor="black" bg="#a7a9be"
        _hover={{ bg: "#ff8906" }} mb={2} color="black" leftIcon={<FaSpotify />}>
        Create Forum
        </Button>
    </form>
    <Box>
        <VStack spacing={4} align="stretch">
        {forums.length > 0 ? (
            forums.map((forum) => (
            <Card
                key={forum.id}
                p={6}
                bg="gray.700"
                borderRadius="md"
                width="100%"
                onClick={() => handleForumClick(forum)}
                cursor="pointer"
            >
                <Text fontSize="xl" fontWeight="bold" color="white">
                {forum.name}
                </Text>
            </Card>
            ))
        ) : (
            <Text color="white">No forums available</Text>
        )}
        </VStack>
    </Box>
    </Container>


  );
};


export default Forum;






