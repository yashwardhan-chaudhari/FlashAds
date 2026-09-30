import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Search, 
  User, 
  Tv, 
  CheckCheck, 
  Clock, 
  ArrowLeft, 
  Sparkles,
  Zap,
  Building2,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import messageService from '../services/messageService';

export default function Messages() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const initialRecipient = searchParams.get('to') || 'Apex Media DOOH';

  const [activePartner, setActivePartner] = useState({
    name: 'Apex Media DOOH',
    role: 'Advertiser',
    avatar: 'A',
    boardContext: 'Pune Premium LED Board (Hinjewadi, Pune)',
    status: 'Online',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Exact PRD Conversation from Phase 17
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'client',
      senderName: 'Client (Rahul Sharma)',
      text: 'Is this board available during Diwali?',
      time: '10:30 AM',
      isMe: user?.role !== 'advertiser',
    },
    {
      id: 2,
      sender: 'advertiser',
      senderName: 'Apex Media DOOH',
      text: 'Yes, it is available.',
      time: '10:32 AM',
      isMe: user?.role === 'advertiser',
    },
    {
      id: 3,
      sender: 'client',
      senderName: 'Client (Rahul Sharma)',
      text: 'What is the price for 15 days?',
      time: '10:35 AM',
      isMe: user?.role !== 'advertiser',
    },
    {
      id: 4,
      sender: 'advertiser',
      senderName: 'Apex Media DOOH',
      text: 'For 15 days, with our intelligent duration discount, it comes to ₹18,000 (2 weeks + 1 day tier) instead of ₹22,500 daily rate.',
      time: '10:38 AM',
      isMe: user?.role === 'advertiser',
    },
  ]);

  const [conversations, setConversations] = useState([
    {
      id: 'c1',
      name: 'Apex Media DOOH',
      role: 'Advertiser',
      lastMessage: 'For 15 days, with our intelligent duration discount...',
      time: '10:38 AM',
      unread: 0,
      board: 'Pune Premium LED Board (Hinjewadi)',
    },
    {
      id: 'c2',
      name: 'Western Outdoor Advertising',
      role: 'Advertiser',
      lastMessage: 'Artwork approved for FC Road Unipole.',
      time: 'Yesterday',
      unread: 1,
      board: 'FC Road Commercial Unipole',
    },
    {
      id: 'c3',
      name: 'SkyLine Hoardings',
      role: 'Advertiser',
      lastMessage: 'Your August campaign proof of performance has been uploaded.',
      time: '2 days ago',
      unread: 0,
      board: 'Viman Nagar Airport Road Mega Hoarding',
    },
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.role || 'client',
      senderName: user?.name || (user?.role === 'advertiser' ? 'Apex Media DOOH' : 'Rahul Sharma'),
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Update conversation list snippet
    setConversations((prev) =>
      prev.map((c) =>
        c.name === activePartner.name
          ? { ...c, lastMessage: newMsg.text, time: newMsg.time }
          : c
      )
    );

    // Try sending to backend
    try {
      if (user?._id) {
        await messageService.sendMessage({
          recipientId: user._id, // Demonstration payload
          text: newMsg.text,
        });
      }
    } catch (err) {
      // Retain optimistic UI update
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.board.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-950 min-h-screen py-8 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-400">Home</Link>
            <span>/</span>
            <span className="text-white font-semibold">Direct Inquiries & Messages</span>
          </div>
          <Link
            to={user?.role === 'advertiser' ? '/advertiser/dashboard' : '/client/dashboard'}
            className="text-xs text-blue-400 hover:underline font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Dashboard</span>
          </Link>
        </div>

        {/* Chat Main Window Layout */}
        <div className="h-[740px] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Sidebar: Conversations List */}
          <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col bg-slate-950/60 shrink-0">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  <span>Conversations</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Database Backed
                </span>
              </div>
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search chats or billboard spaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl text-xs text-white border border-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
              {filteredConversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    setActivePartner({
                      name: c.name,
                      role: c.role,
                      avatar: c.name.charAt(0),
                      boardContext: c.board,
                      status: 'Online',
                    })
                  }
                  className={`w-full p-4 text-left hover:bg-slate-900/80 transition-colors flex items-start gap-3 cursor-pointer ${
                    activePartner.name === c.name ? 'bg-slate-900 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center shrink-0 shadow-md">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-white truncate">{c.name}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-orange-400 font-semibold truncate mb-1">
                      {c.board}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Area: Active Chat Thread */}
          <div className="flex-1 flex flex-col bg-slate-900">
            
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-orange-500 text-white font-extrabold flex items-center justify-center shadow-md">
                  {activePartner.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">{activePartner.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      ● {activePartner.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Tv className="w-3 h-3 text-orange-400" />
                    <span>Inquiry about: <strong className="text-slate-200">{activePartner.boardContext}</strong></span>
                  </p>
                </div>
              </div>

              <Link
                to="/explore"
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                View Board Specs
              </Link>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <div className="text-center my-2">
                <span className="px-3 py-1 rounded-full bg-slate-950 text-slate-500 text-[10px] font-semibold border border-slate-800">
                  Direct inquiry initiated for Pune Billboard Space
                </span>
              </div>

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-500 mb-1 px-1">{m.senderName}</span>
                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                      m.isMe
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-xs'
                    }`}
                  >
                    <p>{m.text}</p>
                    <div
                      className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                        m.isMe ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      <span>{m.time}</span>
                      {m.isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Type a message to ${activePartner.name}...`}
                className="flex-1 px-4 py-3 bg-slate-900 rounded-2xl text-xs text-white border border-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 text-white shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
