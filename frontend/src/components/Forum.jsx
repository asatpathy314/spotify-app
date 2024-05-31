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
  Flex,
  IconButton,
  useToast
} from '@chakra-ui/react';
import { FaSpotify, FaThumbsUp, FaTrashAlt } from 'react-icons/fa';
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
  const [newComment, setNewComment] = useState('');
  const [commentLikedStatus, setCommentLikedStatus] = useState(false);
  const [postLikedStatus, setPostLikedStatus] = useState(false);
  const [filteredForums, setFilteredForums] = useState("")
  const [searchQuery, setSearchQuery] = useState("");

  
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!token || !userID) {
      navigate('/profile/nosessiontoken');
      return;
    }

    const fetchForums = async () => {
      try {
        const response = await axios.get('http://localhost:8000/forum/forums', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setForums(response.data.forums);
        setFilteredForums(response.data.forums); // Initialize filteredForums

      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchForums();
  }, [token, userID, navigate]);

  useEffect(() => {
    const results = forums.filter(forum =>
      forum.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredForums(results);
  }, [searchQuery, forums]);

  const fetchPosts = async (forumId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/forum/forums/${forumId}/posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
      const response = await axios.get(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (forumId, postId, commentId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
      toast({
        title: 'Comment deleted',
        description: 'The comment has been deleted successfully',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Failed to delete comment',
        description: 'An error occurred',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  };

  const handleForumClick = (forum) => {
    setSelectedForum(forum);
    setSelectedPost(null);
    fetchPosts(forum.id);
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    fetchComments(selectedForum.id, post.id);
  };

  const handleLikeComment = async (forumId, postId, commentId, e) => {
    e.stopPropagation();  // Prevent the event from bubbling up to the card click
    try {
      const response = await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/comments/${commentId}/like`, {
        userId: userID
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setComments(prevComments => prevComments.map(comment =>
        comment.id === commentId ? { ...comment, likes: response.data.likes, userLikes: response.data.userLikes } : comment
      ));
      if (response.data.userLikes.includes(userID)) {
        setCommentLikedStatus(true);
      } else {
        setCommentLikedStatus(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('You have already liked this comment.');
      }
      console.error('Error liking comment:', error);
    }
  };

  const handleLikePost = async (forumId, postId, e) => {
    e.stopPropagation();  // Prevent the event from bubbling up to the card click
    try {
      const response = await axios.post(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}/like`, {
        userId: userID
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prevPost => ({
          ...prevPost,
          likes: response.data.likes,
          userLikes: response.data.userLikes
        }));
      } else {
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === postId ? { ...post, likes: response.data.likes, userLikes: response.data.userLikes } : post
        ));
      }
      if (response.data.userLikes.includes(userID)) {
        setPostLikedStatus(true);
      } else {
        setPostLikedStatus(false);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


  const handleDeletePost = async (forumId, postId, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/forum/forums/${forumId}/posts/${postId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      toast({
        title: 'Post deleted',
        description: 'The post has been deleted successfully',
        status: 'success',
        position: 'bottom-right',
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Failed to delete post',
        description: 'An error occurred',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  };

  const handleCreateForum = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch the list of existing forums
      const response = await axios.get('http://localhost:8000/forum/forums', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const existingForums = response.data.forums;
  
      // Check if a forum with the same name already exists
      const forumExists = existingForums.some(forum => forum.name.toLowerCase() === newForumName.toLowerCase());
  
      if (forumExists) {
        // Show an error toast if the forum already exists
        toast({
          title: 'Forum already exists',
          description: 'A forum with this name already exists. Please choose a different name.',
          status: 'error',
          position: 'bottom-right',
          isClosable: true,
        });
        return;
      }
  
      // Proceed with creating the new forum if it doesn't already exist
      const createForumPromise = axios.post('http://localhost:8000/forum/forum', { name: newForumName }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      toast.promise(createForumPromise, {
        success: { 
          title: 'Forum created', 
          description: 'The forum has been created successfully', 
          position: 'bottom-right', 
          isClosable: true 
        },
        error: { 
          title: 'Failed to create forum', 
          description: 'An error occurred', 
          position: 'bottom-right', 
          isClosable: true 
        },
        loading: { 
          title: 'Creating forum', 
          description: 'Please wait', 
          position: 'bottom-right', 
          isClosable: true 
        },
      });
  
      await createForumPromise;
      setNewForumName('');
  
      // Fetch the updated list of forums
      const updatedResponse = await axios.get('http://localhost:8000/forum/forums', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setForums(updatedResponse.data.forums);
  
    } catch (error) {
      console.error('Error creating forum:', error);
      toast({
        title: 'Failed to create forum',
        description: 'An error occurred',
        status: 'error',
        position: 'bottom-right',
        isClosable: true,
      });
    }
  };

  const handleSubmitPost = async (e) => {
    e.preventDefault();
    const createPostPromise = axios.post(`http://localhost:8000/forum/forums/${selectedForum.id}/posts`, {
      title,
      description,
      userId: userID,
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    toast.promise(createPostPromise, {
      success: { title: 'Post created', description: 'The post has been created successfully', position: 'bottom-right', isClosable: true },
      error: { title: 'Failed to upload post', description: 'An error occurred', position: 'bottom-right', isClosable: true },
      loading: { title: 'Uploading post', description: 'Please wait', position: 'bottom-right', isClosable: true },
    });
    try {
      await createPostPromise;
      setTitle('');
      setDescription('');
      fetchPosts(selectedForum.id);
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const createCommentPromise = axios.post(`http://localhost:8000/forum/forums/${selectedForum.id}/posts/${selectedPost.id}/comments`, {
      text: newComment,
      userId: userID,
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    toast.promise(createCommentPromise, {
      success: { title: 'Comment posted', description: 'The comment has been posted successfully', position: 'bottom-right', isClosable: true },
      error: { title: 'Failed to post comment', description: 'An error occurred', position: 'bottom-right', isClosable: true },
      loading: { title: 'Posting comment', description: 'Please wait...', position: 'bottom-right', isClosable: true },
    });
    try {
      await createCommentPromise;
      setNewComment('');
      fetchComments(selectedForum.id, selectedPost.id);
    } catch (error) {
      console.error('Error submitting comment:', error);
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
          Back to Posts From "{selectedForum.name}"
        </Button>
        <Card mb={1} bg="gray.700" padding={"3"} p={6}>
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.500" fontSize="sm">
            Posted by {selectedPost.userId} on {formatDate(selectedPost.date)}
          </Text>
          {selectedPost.userId === userID && (
            <IconButton
              aria-label="Delete post"
              icon={<FaTrashAlt />}
              onClick={(e) => handleDeletePost(selectedForum.id, selectedPost.id, e)}
              bg="red.600"
              _hover={{ bg: "red.800" }}
            />
          )}
      </Flex>

          <Text fontSize="2xl" fontWeight="bold" color="white">
            {selectedPost.title}
          </Text>
          <Text color="white">{selectedPost.description}</Text>
          <HStack justifyContent="right">
            <Text color="gray.500" fontSize="sm">
              {selectedPost.likes} {selectedPost.likes !== 1 ? "likes" : "like"}
            </Text>
            <IconButton
              aria-label="Like post"
              icon={<FaThumbsUp />}
              onClick={(e) => handleLikePost(selectedForum.id, selectedPost.id, e)}
              bg={selectedPost.userLikes?.includes(userID) ? "#ff8906" : "#a7a9be"}
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
    comments.sort((a, b) => b.likes - a.likes).map((comment) => (
      <Card 
        key={comment.id} 
        p={6} 
        bg="gray.700" 
        borderRadius="md" 
        width="100%"
        _hover={{ boxShadow: 'dark-lg' }}
      >
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.500" fontSize="sm">
            Posted by {comment.userId} on {formatDate(comment.date)}
          </Text>
          {comment.userId === userID && (
            <IconButton
              aria-label="Delete comment"
              icon={<FaTrashAlt />}
              onClick={(e) => handleDeleteComment(selectedForum.id, selectedPost.id, comment.id, e)}
              bg="red.600"
              _hover={{ bg: "red.800" }}
            />
          )}
        </Flex>
        <Text color="white">{comment.text}</Text>
        <HStack justifyContent="right">
          <Text color="gray.500" fontSize="sm">
            {comment.likes} {comment.likes !== 1 ? "likes" : "like"}
          </Text>
          <IconButton
            aria-label="Like comment"
            icon={<FaThumbsUp />}
            onClick={(e) => handleLikeComment(selectedForum.id, selectedPost.id, comment.id, e)}
            bg={comment.userLikes?.includes(userID) ? "#ff8906" : "#a7a9be"}
            _hover={{ bg: "#ff8906" }}
          />
        </HStack>
      </Card>
        ))
      ) : (
        <Text color="gray.300" align="center" mt={4}>No comments yet!</Text>
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
            Posts From "{selectedForum.name}"
          </Text>
        </Box>
        <Box mb={0}>
          <form onSubmit={handleSubmitPost}>
            <FormControl id="title" mb={1} focusB>
              <FormLabel color="white">Title</FormLabel>
              <Input maxLength={100} color="white" type="text" value={title} focusBorderColor="#ff8906" onChange={(e) => setTitle(e.target.value)} required />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel color="white">Description</FormLabel>
              <Input
                maxLength={200}
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
              posts.sort((a, b) => b.likes - a.likes).map((post) => (
                <Card
                  key={post.id}
                  p={6}
                  bg="gray.700"
                  borderRadius="md"
                  width="100%"
                  onClick={() => handlePostClick(post)}
                  cursor="pointer"
                  _hover={{ boxShadow: 'dark-lg' }}
                  >
                  <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray.500" fontSize="sm">
            Posted by {post.userId} on {formatDate(post.date)}
          </Text>
          {post.userId === userID && (
            <IconButton
              aria-label="Delete post"
              icon={<FaTrashAlt />}
              onClick={(e) => handleDeletePost(selectedForum.id, post.id, e)}
              bg="red.600"
              _hover={{ bg: "red.800" }}
            />
          )}
      </Flex>
                  <Text fontSize="2xl" fontWeight="bold" color="white" mb={3}>
                    {post.title}
                  </Text>
                  <Text fontSize="md" color="white">{post.description}</Text>
                  <HStack justifyContent="right">
                    <Text color="gray.500" fontSize="sm">
                      {post.likes} {post.likes !== 1 ? "likes" : "like"}
                    </Text>
                    <IconButton
                      aria-label="Like post"
                      icon={<FaThumbsUp />}
                      onClick={(e) => handleLikePost(selectedForum.id, post.id, e)}
                      bg={post.userLikes?.includes(userID) ? "#ff8906" : "#a7a9be"}
                      _hover={{ bg: "#ff8906" }}
                    />
                  </HStack>
                </Card>
              ))
            ) : (
              <Text color="gray.300" align="center" mt={4}>No posts yet!</Text>
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
        <FormControl id="search-forum-name" mb={4}>
    <FormLabel color="white">Find Forum By Name</FormLabel>
    <Input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      color="white"
      focusBorderColor="#ff8906"
    />
  </FormControl>
      <Box>
        <VStack spacing={4} align="stretch">
          {forums.length > 0 ? (
            filteredForums.map((forum) => (
              <Card
                key={forum.id}
                p={6}
                bg="gray.700"
                borderRadius="md"
                width="100%"
                onClick={() => handleForumClick(forum)}
                cursor="pointer"
                _hover={{ boxShadow: 'dark-lg' }}
              >
                <Text fontSize="xl" color="white">
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
