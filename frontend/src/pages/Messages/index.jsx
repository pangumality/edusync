import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Send, 
  MoreVertical, 
  Phone, 
  Video, 
  Check,
  CheckCheck,
  ChevronDown,
  User as UserIcon,
  Shield,
  GraduationCap,
  Book
} from 'lucide-react';
import { seedAll } from '../../utils/seed';

// --- Mock Auth Context (Expanded for Demo) ---
const useMockAuth = () => {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  
  useEffect(() => {
    const loadUsers = () => {
      let teachers = JSON.parse(localStorage.getItem('teachers:doonites') || '[]');
      let students = JSON.parse(localStorage.getItem('students:doonites') || '[]');
      let admins = JSON.parse(localStorage.getItem('admins:doonites') || '[]');
      let librarians = JSON.parse(localStorage.getItem('librarians:doonites') || '[]');
      let parents = JSON.parse(localStorage.getItem('parents:doonites') || '[]');

      // If no data, seed it immediately
      if (teachers.length === 0 || admins.length === 0) {
        seedAll();
        teachers = JSON.parse(localStorage.getItem('teachers:doonites') || '[]');
        students = JSON.parse(localStorage.getItem('students:doonites') || '[]');
        admins = JSON.parse(localStorage.getItem('admins:doonites') || '[]');
        librarians = JSON.parse(localStorage.getItem('librarians:doonites') || '[]');
        parents = JSON.parse(localStorage.getItem('parents:doonites') || '[]');
      }

      const all = [...admins, ...teachers, ...librarians, ...students, ...parents];
      setAllUsers(all);

      // Default to Super Admin or first available user if not set
      const savedUserId = localStorage.getItem('current_demo_user_id');
      if (savedUserId) {
        const savedUser = all.find(u => u.id === savedUserId);
        if (savedUser) {
          setUser(savedUser);
          return;
        }
      }
      
      // Default fallback
      if (admins.length > 0) setUser(admins[0]);
      else if (teachers.length > 0) setUser(teachers[0]);
    };

    loadUsers();
    window.addEventListener('storage', loadUsers);
    return () => window.removeEventListener('storage', loadUsers);
  }, []);

  const switchUser = (userId) => {
    const newUser = allUsers.find(u => u.id === userId);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('current_demo_user_id', userId);
      // Trigger a reload of conversations for the new user
      window.dispatchEvent(new Event('storage')); 
    }
  };

  return { user, allUsers, switchUser };
};

// --- Utils ---
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getRoleIcon = (role) => {
  switch(role) {
    case 'SUPER_ADMIN':
    case 'ADMIN': return <Shield size={14} className="text-red-500" />;
    case 'TEACHER': return <UserIcon size={14} className="text-blue-500" />;
    case 'STUDENT': return <GraduationCap size={14} className="text-green-500" />;
    case 'LIBRARIAN': return <Book size={14} className="text-purple-500" />;
    default: return <UserIcon size={14} className="text-gray-500" />;
  }
};

// --- Components ---

const ConversationItem = ({ conversation, isActive, onClick, currentUserId }) => {
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId) || conversation.participants[0];
  const lastMsg = conversation.messages[conversation.messages.length - 1];
  
  return (
    <div 
      onClick={() => onClick(conversation)}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50 border-l-4 border-transparent'
      }`}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
          {otherParticipant.name.charAt(0)}
        </div>
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-gray-800 truncate flex items-center gap-1">
            {otherParticipant.name}
          </h4>
          <span className="text-xs text-gray-400 whitespace-nowrap">{lastMsg ? formatTime(lastMsg.createdAt) : ''}</span>
        </div>
        <div className="flex items-center gap-1 mb-1">
           <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-medium">
             {otherParticipant.role}
           </span>
        </div>
        <p className="text-sm text-gray-500 truncate">
          {lastMsg ? lastMsg.content : 'No messages yet'}
        </p>
      </div>
    </div>
  );
};

const ChatMessage = ({ message, isOwn }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${
        isOwn 
          ? 'bg-blue-600 text-white rounded-tr-none' 
          : 'bg-gray-100 text-gray-800 rounded-tl-none'
      }`}>
        <p className="text-sm">{message.content}</p>
        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
          {formatTime(message.createdAt)}
          {isOwn && (
            message.read ? <CheckCheck size={12} /> : <Check size={12} />
          )}
        </div>
      </div>
    </div>
  );
};

const NewMessageModal = ({ isOpen, onClose, currentUser, onStartChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    if (!isOpen || !currentUser) return;

    // Load all potential users
    const teachers = JSON.parse(localStorage.getItem('teachers:doonites') || '[]');
    const students = JSON.parse(localStorage.getItem('students:doonites') || '[]');
    const admins = JSON.parse(localStorage.getItem('admins:doonites') || '[]');
    const librarians = JSON.parse(localStorage.getItem('librarians:doonites') || '[]');
    const parents = JSON.parse(localStorage.getItem('parents:doonites') || '[]');

    let allowedUsers = [];

    // --- Permission Logic ---
    switch (currentUser.role) {
      case 'SUPER_ADMIN':
        // Super Admins share messages with Admins (and implicitly can likely message anyone, but let's follow spec strictly: "share messages with admins")
        // "allows super admins to share messages with admins"
        allowedUsers = [...admins]; 
        // Usually Super Admins can message everyone, adding everyone just in case for a better demo, 
        // but let's prioritize the specific request. 
        // "and admins to share meassges with everyone"
        break;
      
      case 'ADMIN':
        // Admins share messages with everyone
        allowedUsers = [...teachers, ...students, ...parents, ...librarians, ...admins.filter(a => a.id !== currentUser.id)];
        break;

      case 'TEACHER':
        // Teachers with parents and students
        allowedUsers = [...students, ...parents];
        break;

      case 'LIBRARIAN':
        // Librarians with students and teachers
        allowedUsers = [...students, ...teachers];
        break;

      case 'STUDENT':
        // (Inferred) Students need to message Teachers and Librarians
        allowedUsers = [...teachers, ...librarians];
        break;

      case 'PARENT':
        // (Inferred) Parents need to message Teachers
        allowedUsers = [...teachers];
        break;

      default:
        allowedUsers = [];
    }

    // Remove self
    allowedUsers = allowedUsers.filter(u => u.id !== currentUser.id);

    setAvailableUsers(allowedUsers);
  }, [isOpen, currentUser]);

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-800">New Message</h3>
            <p className="text-xs text-gray-500">As {currentUser.role}, you can message: {availableUsers.length} people</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
        </div>
        
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto p-2 space-y-1">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div 
                key={user.id} 
                onClick={() => onStartChat(user)}
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-800">{user.name}</p>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 group-hover:bg-white transition-colors">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p> 
                </div>
              </div>
            ))
          ) : (
             <div className="p-8 text-center text-gray-400">
               <p>No users found.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- User Switcher Component ---
const UserSwitcher = ({ currentUser, allUsers, onSwitch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group users by role for better list
  const groupedUsers = allUsers.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  }, {});

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
      >
        <span>Viewing as: {currentUser.name} ({currentUser.role})</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-[80vh] overflow-y-auto">
          <div className="p-3 border-b border-gray-100 bg-gray-50">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Switch Demo User</h4>
          </div>
          {Object.entries(groupedUsers).map(([role, users]) => (
            <div key={role} className="p-2">
              <h5 className="text-xs font-semibold text-gray-400 mb-1 px-2">{role}</h5>
              {users.slice(0, 3).map(user => ( // Limit to 3 per role to keep list manageable
                <button
                  key={user.id}
                  onClick={() => {
                    onSwitch(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-sm flex items-center justify-between group ${
                    currentUser.id === user.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="truncate">{user.name}</span>
                  {currentUser.id === user.id && <Check size={14} />}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Messages() {
  const { user: currentUser, allUsers, switchUser } = useMockAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversations when user changes
  useEffect(() => {
    if (!currentUser) return;

    const loadConversations = () => {
      let storedConvos = JSON.parse(localStorage.getItem('conversations:doonites') || '[]');
      
      // Filter conversations where current user is a participant
      const userConvos = storedConvos.filter(c => 
        c.participants.some(p => p.id === currentUser.id)
      );
      
      // Sort by updated at
      userConvos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

      setConversations(userConvos);
      
      // Reset selected conversation if it's not in the new list
      if (selectedConversation && !userConvos.find(c => c.id === selectedConversation.id)) {
        setSelectedConversation(null);
      }
    };

    loadConversations();
    window.addEventListener('storage', loadConversations);
    return () => window.removeEventListener('storage', loadConversations);
  }, [currentUser]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    const msg = {
      id: Math.random().toString(36).substr(2, 9),
      content: newMessage,
      senderId: currentUser.id,
      createdAt: new Date().toISOString(),
      read: false
    };

    const updatedConvo = {
      ...selectedConversation,
      messages: [...selectedConversation.messages, msg],
      updatedAt: msg.createdAt
    };

    // Update global storage
    const allConvos = JSON.parse(localStorage.getItem('conversations:doonites') || '[]');
    const updatedAllConvos = allConvos.map(c => 
      c.id === selectedConversation.id ? updatedConvo : c
    );
    
    localStorage.setItem('conversations:doonites', JSON.stringify(updatedAllConvos));
    
    // Trigger update (since we are listening to storage event in same window, we might need manual update or dispatch)
    setConversations(prev => prev.map(c => c.id === selectedConversation.id ? updatedConvo : c).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
    setSelectedConversation(updatedConvo);
    setNewMessage('');
    window.dispatchEvent(new Event('storage'));
  };

  const startNewChat = (targetUser) => {
    // Check global storage for existing conversation
    const allConvos = JSON.parse(localStorage.getItem('conversations:doonites') || '[]');
    
    const existing = allConvos.find(c => 
      c.participants.some(p => p.id === targetUser.id) && 
      c.participants.some(p => p.id === currentUser.id)
    );

    if (existing) {
      setSelectedConversation(existing);
      // Ensure it's in our local list (it should be picked up by effect, but let's be safe)
      if (!conversations.find(c => c.id === existing.id)) {
        setConversations([existing, ...conversations]);
      }
    } else {
      // Create new
      const newConvo = {
        id: Math.random().toString(36).substr(2, 9),
        participants: [currentUser, targetUser],
        messages: [],
        updatedAt: new Date().toISOString()
      };
      
      const newAllConvos = [newConvo, ...allConvos];
      localStorage.setItem('conversations:doonites', JSON.stringify(newAllConvos));
      
      setConversations([newConvo, ...conversations]);
      setSelectedConversation(newConvo);
      window.dispatchEvent(new Event('storage'));
    }
    setIsModalOpen(false);
  };

  if (!currentUser) return (
    <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Initializing demo data...</p>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Sidebar */}
      <div className="w-80 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* User Switcher for Demo */}
          <div className="mb-4">
             <UserSwitcher currentUser={currentUser} allUsers={allUsers} onSwitch={switchUser} />
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length > 0 ? (
            conversations.map(convo => (
              <ConversationItem 
                key={convo.id} 
                conversation={convo} 
                isActive={selectedConversation?.id === convo.id}
                onClick={setSelectedConversation}
                currentUserId={currentUser.id}
              />
            ))
          ) : (
            <div className="text-center p-8 text-gray-400">
              <p>No conversations.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-blue-500 hover:underline mt-2">Start a chat</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  {selectedConversation.participants.find(p => p.id !== currentUser.id)?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    {selectedConversation.participants.find(p => p.id !== currentUser.id)?.name}
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 font-normal">
                       {selectedConversation.participants.find(p => p.id !== currentUser.id)?.role}
                    </span>
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-green-500">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-2 hover:bg-gray-50 rounded-full"><Phone size={20} /></button>
                <button className="p-2 hover:bg-gray-50 rounded-full"><Video size={20} /></button>
                <button className="p-2 hover:bg-gray-50 rounded-full"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
              {selectedConversation.messages.map(msg => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  isOwn={msg.senderId === currentUser.id} 
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-300 ml-1" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600">Your Messages</h3>
            <p className="mt-2">Select a conversation to start chatting</p>
          </div>
        )}
      </div>

      <NewMessageModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        currentUser={currentUser}
        onStartChat={startNewChat}
      />
    </div>
  );
}
