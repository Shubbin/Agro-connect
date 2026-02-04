import { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const dummyConversations = [
  { id: '1', name: 'Adamu Musa', lastMessage: 'The tomatoes are ready', unread: 2, product: 'Fresh Tomatoes' },
  { id: '2', name: 'Chioma Okafor', lastMessage: 'I can offer 15% discount', unread: 0, product: 'Organic Rice' },
];

const dummyMessages = [
  { id: '1', sender: 'other', name: 'Adamu Musa', content: 'Hello! Thank you for your interest in my tomatoes.', time: '10:30 AM' },
  { id: '2', sender: 'me', name: 'You', content: 'Hi! Can you do 50kg at ₦600 per kg?', time: '10:32 AM' },
  { id: '3', sender: 'other', name: 'Adamu Musa', content: "For 50kg, I can offer ₦620 per kg. That's my best price.", time: '10:35 AM' },
];

export const ChatPage = () => {
  const [selectedConv, setSelectedConv] = useState(dummyConversations[0]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: 'me', name: 'You', content: message, time: 'Now' }]);
    setMessage('');
  };

  return (
    <MainLayout hideFooter>
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversations List */}
        <div className="w-80 border-r border-border bg-card hidden md:block">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Messages</h2>
          </div>
          <div className="divide-y divide-border">
            {dummyConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={cn("w-full p-4 text-left hover:bg-muted transition-colors", selectedConv.id === conv.id && "bg-secondary")}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">{conv.name}</span>
                  {conv.unread > 0 && <span className="w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">{conv.unread}</span>}
                </div>
                <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                <p className="text-xs text-primary mt-1">{conv.product}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border bg-card flex items-center gap-3">
            <button className="md:hidden p-2 hover:bg-muted rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-semibold">{selectedConv.name.charAt(0)}</div>
            <div>
              <p className="font-semibold text-foreground">{selectedConv.name}</p>
              <p className="text-xs text-primary">{selectedConv.product}</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sender === 'me' ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[75%] px-4 py-2.5 rounded-2xl", msg.sender === 'me' ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md")}>
                  <p>{msg.content}</p>
                  <p className={cn("text-xs mt-1", msg.sender === 'me' ? "text-primary-foreground/70" : "text-muted-foreground")}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-muted rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Button onClick={handleSend} className="px-6"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
