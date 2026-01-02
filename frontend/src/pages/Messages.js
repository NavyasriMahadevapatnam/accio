import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PackageSearch, Send } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Messages = ({ token, user }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      organizeConversations(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const organizeConversations = (msgs) => {
    const convMap = {};
    msgs.forEach(msg => {
      const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
      const otherUserEmail = msg.sender_id === user.id ? msg.receiver_email : msg.sender_email;
      
      if (!convMap[otherUserId]) {
        convMap[otherUserId] = {
          userId: otherUserId,
          userEmail: otherUserEmail,
          lastMessage: msg,
          unread: 0
        };
      }
      
      if (msg.receiver_id === user.id && !msg.read) {
        convMap[otherUserId].unread++;
      }
    });
    
    setConversations(Object.values(convMap));
  };

  const selectConversation = async (userId, userEmail) => {
    setSelectedUser({ userId, userEmail });
    
    try {
      const response = await axios.get(`${BACKEND_URL}/api/messages/thread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load conversation');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await axios.post(
        `${BACKEND_URL}/api/messages/send`,
        { receiver_id: selectedUser.userId, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewMessage('');
      selectConversation(selectedUser.userId, selectedUser.userEmail);
      toast.success('Message sent');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <PackageSearch className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-outfit text-primary">ACCIO</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 font-outfit">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Conversations</h3>
            </div>
            <div className="overflow-y-auto h-[calc(600px-60px)]">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-slate-500">No conversations yet</div>
              ) : (
                conversations.map(conv => (
                  <div
                    key={conv.userId}
                    data-testid="conversation-item"
                    onClick={() => selectConversation(conv.userId, conv.userEmail)}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedUser?.userId === conv.userId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-900">{conv.userEmail}</p>
                        <p className="text-sm text-slate-600 truncate">{conv.lastMessage.content}</p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Thread */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 flex flex-col">
            {selectedUser ? (
              <>
                <div className="p-4 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">{selectedUser.userEmail}</h3>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      data-testid="message-item"
                      className={`mb-4 flex ${
                        msg.sender_id === user.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          msg.sender_id === user.id
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 text-slate-900'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_id === user.id ? 'text-blue-100' : 'text-slate-500'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={sendMessage} className="p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <Textarea
                      data-testid="message-input"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 resize-none"
                      rows={2}
                    />
                    <Button
                      type="submit"
                      data-testid="send-btn"
                      className="bg-primary text-white hover:bg-primary/90 h-auto px-6 rounded-full"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
