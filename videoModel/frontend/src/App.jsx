import React, { useState } from 'react';
import CreationForm from './components/CreationForm';
// import ConversationList from './components/ConversationList'; // Hiding as per request
import axios from 'axios';
import { Player } from "@remotion/player";
import { MyComposition } from './components/RemotionVideo';

function App() {
  const [formData, setFormData] = useState({
    voice1: 'Adam',
    voice2: 'Rachel',
    theme: 'Casual',
    inputType: 'text',
    text: '',
    image: null,
    avatar1: null,
    avatar2: null
  });

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle Context Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        setFormData(prev => ({ ...prev, image: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Avatar Uploads
  const handleAvatarUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        text: formData.inputType === 'text' ? formData.text : undefined,
        image: formData.inputType === 'image' ? formData.image : undefined,
        voice1: formData.voice1,
        voice2: formData.voice2,
        theme: formData.theme,
        generateAudio: true
      };

      const response = await axios.post('http://localhost:4000/api/chat/generate', payload);

      if (response.data.success) {
        // Attach avatars to messages
        const newConversation = response.data.conversation.map(msg => ({
          ...msg,
          avatar: msg.speaker === 'A' ? formData.avatar1 : formData.avatar2
        }));

        setConversations(prev => [...prev, newConversation]);

        // Reset text/context image but keep settings
        setFormData(prev => ({ ...prev, text: '', image: null }));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate conversation. Check backend console.');
    } finally {
      setLoading(false);
    }
  };

  // Get the most recent conversation (flattened or just the last batch)
  // Since we are showing "one" video for the generated content, we'll pick the latest conversation block.
  const latestConversation = conversations.length > 0 ? conversations[conversations.length - 1] : [];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
              AI Audio Chat Gen
            </span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">
            Turn text or images into lifelike dual-speaker podcasts
          </p>
        </header>

        <main className="space-y-16">
          <CreationForm
            formData={formData}
            setFormData={setFormData}
            handleImageUpload={handleImageUpload}
            handleAvatarUpload={handleAvatarUpload}
            loading={loading}
            handleSubmit={handleSubmit}
          />


          <div className=" flex items-center justify-center  ">



            <Player
              component={MyComposition}
              durationInFrames={Math.max(120, latestConversation.length * 120)}
              compositionWidth={520}
              compositionHeight={780}
              fps={30}
              controls
              inputProps={{
                conversation: latestConversation,
                avatar1: formData.avatar1,
                avatar2: formData.avatar2
              }}
            />


          </div>
          {/* Hidden Conversation Lis    
             <ConversationList conversations={conversations} /> 
          */}
        </main>
      </div>
    </div>
  );
}

export default App;
