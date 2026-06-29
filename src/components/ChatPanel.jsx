import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { useAppAuth } from '@/lib/appAuth.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

export default function ChatPanel({ otherUser, onBack }) {
  const { currentUser } = useAppAuth();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const intervalRef = useRef(null);

  const fetchMessages = async () => {
    if (!currentUser || !otherUser) return;
    const [sent, received] = await Promise.all([
      base44.entities.Message.filter({ sender_id: currentUser.id, receiver_id: otherUser.id }, 'created_date', 100),
      base44.entities.Message.filter({ sender_id: otherUser.id, receiver_id: currentUser.id }, 'created_date', 100),
    ]);
    const all = [...sent, ...received].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    setMessages(all);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    intervalRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(intervalRef.current);
  }, [otherUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await base44.entities.Message.create({
      sender_id: currentUser.id,
      receiver_id: otherUser.id,
      sender_name: currentUser.full_name,
      content: newMsg.trim(),
    });
    setNewMsg('');
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        {onBack && (
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
          {otherUser?.full_name?.[0]}
        </div>
        <div>
          <p className="text-sm font-medium">{otherUser?.full_name}</p>
          <p className="text-xs text-muted-foreground">{otherUser?.role}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-5 h-5 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">No messages yet. Start the conversation!</p>
        ) : (
          messages.map(msg => {
            const isMine = msg.sender_id === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMine ? 'bg-cyan-500 text-black rounded-br-md' : 'bg-white/5 rounded-bl-md'
                }`}>
                  <p>{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-black/50' : 'text-muted-foreground'}`}>
                    {moment(msg.created_date).format('h:mm A')}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-white/5">
        <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Input
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder="Type a message..."
            className="bg-background border-white/10 text-sm"
          />
          <Button type="submit" size="icon" className="bg-cyan-500 hover:bg-cyan-400 text-black flex-shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}