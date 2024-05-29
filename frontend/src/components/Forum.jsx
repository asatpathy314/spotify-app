import React, { useState, useEffect } from 'react';
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
  const [forums, setForums] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForum, setSelectedForum] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newForumName, setNewForumName] = useState('');
  const [newComment, setNewComment] = useState('');




  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await axios.get('http://localhost:8000/forum/forums');
        setForums(response.data.forums);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setLoading(false);
      }
    };




    fetchForums();
  }, []);




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

//   const handleLikePost = async (forumId, postId) => {
//     try {
//       await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/like`);
//     } catch (error) {
//       console.error('Error liking post:', error);
//     }
//     fetchPosts(forumId);
//   };



//   const handleLikeComment = async (forumId, postId, commentId) => {
//     try {
//       await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}/like`);
//     } catch (error) {
//       console.error('Error liking comment:', error);
//     }
//     fetchComments(forumId, postId);
//   };

const handleLikeComment = async (forumId, postId, commentId) => {
    try {
      await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}/like`);
      // Update the likes count for the selected comment directly
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
      ));
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };


  const handleLikePost = async (forumId, postId) => {
    try {
      await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/like`);
      // Update the likes count for the selected post directly
       setSelectedPost(prevPost => ({
         ...prevPost,
         likes: prevPost.likes + 1
       }));
      // Update the likes count in the posts array
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
        userId: 'spotify_user_id',
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
        userId: 'spotify_user_id',
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
        <Button onClick={() => setSelectedPost(null)} colorScheme="teal" mb={0}>
          Back to Posts
        </Button>
        <Card mb={1} bg="gray.700" padding={"3"}>
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
              colorScheme="teal"
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
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
          </FormControl>
          <Button type="submit" mb={0} colorScheme="teal" leftIcon={<FaSpotify />}>
            Post Comment
          </Button>
        </form>
        <VStack spacing={4} align="stretch">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id} p={4} bg="gray.700" borderRadius="md" width="100%">
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
                    colorScheme="teal"
                  />
                </HStack>

              </Card>
            ))
          ) : (
            <Text color="gray.300">No comments available</Text>
          )}
        </VStack>
      </Container>
    );
  }




  if (selectedForum) {
    return (
      <Container minHeight="100vh" display="flex" flexDirection="column" gap={4}>
        <Button onClick={() => setSelectedForum(null)} colorScheme="teal" mb={2}>
          Back to Forums
        </Button>
        <Box mb={1}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {"Posts From Forum: " + selectedForum.name}
          </Text>
        </Box>
        <Box mb={4}>
            <form onSubmit={handleSubmitPost}>
            <FormControl id="title" mb={1}>
                <FormLabel color="white">Title</FormLabel>
                <Input color="white" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </FormControl>
            <FormControl id="description" mb={4}>
                <FormLabel color="white">Description</FormLabel>
                <Input
                color="white"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                />
            </FormControl>
            <Button type="submit" colorScheme="teal" mb={1} leftIcon={<FaSpotify />}>
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
                p={4}
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
            onChange={(e) => setNewForumName(e.target.value)}
            required
        />
        </FormControl>
        <Button type="submit" colorScheme="teal" mb={2} leftIcon={<FaSpotify />}>
        Create Forum
        </Button>
    </form>
    <Box>
        <VStack spacing={4} align="stretch">
        {forums.length > 0 ? (
            forums.map((forum) => (
            <Card
                key={forum.id}
                p={4}
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






