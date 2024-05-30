import { useContext, useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import {
    Text,
} from "@chakra-ui/react";
import axios from "axios";

// Profile page and useContext setup. Users are redirected here after the login.
const Conversation = () => {
  const { token, setToken, userID, setUserID } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversationData, setConversationData] = useState(null); // Data for the conversation
  const [forbidden, setForbidden] = useState(null); // Determines if the user has permission to view the page
  const [error, setError] = useState(null); // Error handling
  const { id } = useParams();

  useEffect(() => {
    // Check if the user is coming from the login page
    if (!token || !userID) {
      setForbidden(true);
      window.location.href = "/profile/nosessiontoken";
    } else if (id) {
      axios
        .get("http://localhost:8000/messages/conversation?id=" + id)
        .then((res) => {
          if (res.status > 200) {
            setError(true);
          } else {
            setConversationData(res.data);
          }
        })
        .catch((err) => {console.error("Error fetching conversation:", err); setError(true);});
    }
  }, [token, userID, id]);

  if(conversationData) {
        return (
            <div>
            {conversationData.messages.map((message, index) => {
                return (
                    <div key={index}>
                        <Text fontSize='2xl'>{message.text}</Text>
                    </div>
                );
            })}
            </div>
        );
    }
}

export default Conversation;
