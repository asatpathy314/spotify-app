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
} from '@chakra-ui/react';
import { FaSpotify } from 'react-icons/fa';
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


  const fetchComments = async (postId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/forum/posts/${postId}/comments`);
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


  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
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
      await axios.post(`http://localhost:8000/forum/posts/${selectedPost.id}/comments`, {
        text: newComment,
        userId: 'spotify_user_id',
      });
      setNewComment('');
      alert('Comment created successfully!');
      fetchComments(selectedPost.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment.');
    }
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
      <Container minHeight="100vh" display="grid" gap={4}>
        <Button onClick={() => setSelectedPost(null)} colorScheme="teal" mb={4}>
          Back to Posts
        </Button>
        <Box mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {selectedPost.title}
          </Text>
          <Text color="white">{selectedPost.description}</Text>
          <Text color="white" fontSize="sm">
            Posted by {selectedPost.userId} on {new Date(selectedPost.date).toLocaleDateString()}
          </Text>
        </Box>
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
          <Button type="submit" colorScheme="teal" mb={4} leftIcon={<FaSpotify />}>
            Post Comment
          </Button>
        </form>
        <VStack spacing={4} align="start">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id} p={4} bg="gray.700" borderRadius="md" width="100%">
                <Text color="white">{comment.text}</Text>
                <Text color="gray.500" fontSize="sm">
                  Commented by {comment.userId} on {new Date(comment.date).toLocaleDateString()}
                </Text>
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
      <Container minHeight="100vh" display="grid" gap={4}>
        <Button onClick={() => setSelectedForum(null)} colorScheme="teal" mb={4}>
          Back to Forums
        </Button>
        <Box mb={4}>
          <Text fontSize="2xl" fontWeight="bold" color="white">
            {selectedForum.name}
          </Text>
        </Box>
        <form onSubmit={handleSubmitPost}>
          <FormControl id="title" mb={4}>
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
          <Button type="submit" colorScheme="teal" mb={4} leftIcon={<FaSpotify />}>
            Create Post
          </Button>
        </form>
        <VStack spacing={4} align="start">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card
                key={post.id}
                p={4}
                bg="gray.700"
                borderRadius="md"
                width="100%"
                onClick={() => handlePostClick(post)}
                cursor="pointer"
              >
                <Text fontSize="xl" fontWeight="bold" color="white">
                  {post.title}
                </Text>
                <Text color="white">{post.description}</Text>
                <Text color="white" fontSize="sm">
                  Posted by {post.userId} on {new Date(post.date).toLocaleDateString()}
                </Text>
              </Card>
            ))
          ) : (
            <Text color="white">No posts available</Text>
          )}
        </VStack>
      </Container>
    );
  }


  return (
    <Container minHeight="100vh" display="grid" gap={4}>
      <form onSubmit={handleCreateForum}>
        <FormControl id="new-forum-name" mb={4}>
          <FormLabel color="white">Create New Forum</FormLabel>
          <Input
            type="text"
            color="white"
            value={newForumName}
            onChange={(e) => setNewForumName(e.target.value)}
            required
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" mb={4} leftIcon={<FaSpotify />}>
          Create Forum
        </Button>
      </form>
      <VStack spacing={4} align="start">
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
    </Container>
  );
};


export default Forum;


