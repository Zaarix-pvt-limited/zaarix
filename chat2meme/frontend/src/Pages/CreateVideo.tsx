import { useState, useRef } from 'react';
import {
    ChevronLeft, User, Music, Layout, Wand2, CheckCircle2,
    MessageSquare, Upload, Type, X, Loader2, Sparkles, Users, Settings, Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const avatars = [
    { id: 1, name: 'Professional Man', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, name: 'Creative Woman', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 4, name: 'Marketing Guru', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const audios = [
    { id: 1, name: 'Professional Male', type: 'Voiceover', description: 'Deep, authoritative voice for corporate videos.' },
    { id: 2, name: 'Friendly Female', type: 'Voiceover', description: 'Warm, engaging voice for tutorials.' },
    { id: 3, name: 'Upbeat Corporate', type: 'Background', description: 'Energetic track for marketing.' },
    { id: 4, name: 'Lo-fi Chill', type: 'Background', description: 'Relaxing music for creative content.' },
];

const themes = [
    { id: 1, name: 'Modern Minimal', color: 'bg-indigo-500' },
    { id: 2, name: 'HighTech Glow', color: 'bg-blue-600' },
    { id: 3, name: 'Vibrant Pop', color: 'bg-pink-500' },
    { id: 4, name: 'Cyber Dark', color: 'bg-slate-900' },
];

interface Speaker {
    id: string;
    name: string;
    color: string;
    avatarId?: number;
    gender?: 'male' | 'female';
    voiceId?: number;
}

interface Message {
    speakerId: string;
    text: string;
}

const videoLengths = [
    { id: '30', name: '30 Seconds', desc: 'Quick summary' },
    { id: '60', name: '60 Seconds', desc: 'Standard depth' },
    { id: '90', name: '90 Seconds', desc: 'Detailed deep dive' },
];

const CreateVideo = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
    const [selectedVideoLength, setSelectedVideoLength] = useState<string>('60');
    const [mode, setMode] = useState("image");

    // Chat Input State
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [chatText, setChatText] = useState('');

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ speakers: Speaker[], messages: Message[] } | null>(null);
    const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setScreenshotPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
            setAnalysisResult(null); // Reset analysis if input changes
        }
    };

    const clearScreenshot = () => {
        setScreenshot(null);
        setScreenshotPreview(null);
        setAnalysisResult(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (mode === 'image' && !screenshot) return alert('Upload a screenshot first');
        if (mode === 'text' && !chatText.trim()) return alert('Enter chat text first');

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            if (mode === 'image' && screenshot) {
                formData.append('image', screenshot);
            } else {
                formData.append('text', chatText);
            }

            const response = await fetch('http://localhost:3000/api/video/analyze', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.success) {
                // Initialize speakers with default avatars/genders/voices if missing
                const speakers = result.data.speakers.map((s: Speaker) => ({
                    ...s,
                    avatarId: s.avatarId || 1,
                    gender: s.gender || 'male',
                    voiceId: s.voiceId || (s.gender === 'female' ? 2 : 1)
                }));
                setAnalysisResult({ ...result.data, speakers });
            } else {
                alert(result.message || 'Analysis failed');
            }
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Failed to connect to analysis service');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const updateSpeaker = (id: string, updates: Partial<Speaker>) => {
        if (!analysisResult) return;
        setAnalysisResult({
            ...analysisResult,
            speakers: analysisResult.speakers.map((s: Speaker) => s.id === id ? { ...s, ...updates } : s)
        });
    };

    const handleGenerate = () => {
        if (!analysisResult) {
            alert('Please analyze your chat content first.');
            return;
        }
        if (!selectedTheme) {
            alert('Please select a theme before generating.');
            return;
        }
        console.log('Generating video with:', {
            analysisResult,
            selectedTheme,
            selectedVideoLength
        });
        alert('Video generation started!');
    };

    return (
        <div className="flex h-full w-full bg-white dark:bg-[#0B0F19] overflow-hidden">
            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-500 ${editingSpeakerId ? 'pr-0' : ''}`}>
                <div className="p-6 h-full overflow-y-auto w-full pb-20 custom-scrollbar">
                    {/* Header */}
                    <div className="mb-24 max-w-5xl mx-auto flex items-center">
                        <button
                            onClick={() => navigate('/service/video')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className='mt-4'>
                            <h1 className="text-2xl font-bold">Create New Video</h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Configure your AI video settings.</p>
                        </div>
                    </div>

                    <div className="max-w-5xl mx-auto space-y-12">
                        {/* 1. Chat Content Selection */}
                        <div className="w-full mx-auto bg-white dark:bg-transparent rounded-2xl">
                            {/* Switch Buttons */}
                            <div className='flex justify-between items-center mb-4'>
                                <div className="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                    <button
                                        onClick={() => { setMode("image"); setAnalysisResult(null); }}
                                        className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === "image"
                                            ? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        Image
                                    </button>
                                    <button
                                        onClick={() => { setMode("text"); setAnalysisResult(null); }}
                                        className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === "text"
                                            ? "bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        Text
                                    </button>
                                </div>

                                <button
                                    onClick={handleAnalyze}
                                    disabled={isAnalyzing || (mode === 'image' ? !screenshot : !chatText.trim())}
                                    className="px-6 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? 'Analyzing...' : 'Continue'}
                                </button>
                            </div>

                            {/* Input Area */}
                            <div className="border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50 dark:bg-white/[0.02]">
                                {mode === "image" ? (
                                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-gray-400 dark:hover:border-gray-600 transition">
                                        <span className="text-gray-500 text-sm">
                                            {screenshot ? `Selected: ${screenshot.name}` : 'Upload chat screenshot'}
                                        </span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <textarea
                                        value={chatText}
                                        onChange={(e) => { setChatText(e.target.value); setAnalysisResult(null); }}
                                        placeholder="Paste chat text here..."
                                        className="w-full h-40 bg-transparent outline-none resize-none text-sm text-gray-700 dark:text-gray-300"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Analysis & Speaker Review */}
                        {analysisResult && (
                            <div className="space-y-12">
                                <section className="animate-in slide-in-from-bottom duration-500">
                                    <div className="flex items-center gap-2 mb-6 text-orange-500">
                                        <Users size={20} />
                                        <h2 className="text-xl font-bold">2. Review Speakers</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {analysisResult.speakers.map((speaker: Speaker) => (
                                            <div
                                                key={speaker.id}
                                                onClick={() => setEditingSpeakerId(editingSpeakerId === speaker.id ? null : speaker.id)}
                                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer group bg-white dark:bg-gray-800/20 hover:shadow-lg ${editingSpeakerId === speaker.id ? 'border-orange-500 shadow-xl shadow-orange-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-orange-200'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={avatars.find(a => a.id === speaker.avatarId)?.url}
                                                            alt={speaker.name}
                                                            className="w-14 h-14 rounded-2xl object-cover border-2"
                                                            style={{ borderColor: speaker.color }}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-gray-100 dark:border-gray-700 shadow-sm">
                                                            <span className="text-[10px]">{speaker.gender === 'male' ? '♂️' : '♀️'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-lg group-hover:text-orange-500 transition-colors uppercase tracking-tight truncate">{speaker.name}</p>
                                                        <p className="text-[10px] text-gray-400 font-medium uppercase truncate">{audios.find(a => a.id === speaker.voiceId)?.name}</p>
                                                    </div>
                                                    <Settings className={`text-gray-400 transition-transform duration-500 group-hover:text-orange-500 ${editingSpeakerId === speaker.id ? 'rotate-90 text-orange-500' : ''}`} size={18} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Theme Selection */}
                        <section className="animate-in slide-in-from-bottom duration-700">
                            <div className="flex items-center gap-2 mb-6 text-blue-500">
                                <Layout size={20} />
                                <h2 className="text-xl font-bold">{analysisResult ? '3' : '2'}. Select Theme</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {themes.map((theme) => (
                                    <div
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme.id)}
                                        className={`p-4 rounded-xl cursor-pointer border-2 transition-all text-center ${selectedTheme === theme.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                            }`}
                                    >
                                        <div className={`w-full aspect-video rounded-lg mb-3 ${theme.color} opacity-80`} />
                                        <h3 className="text-sm font-semibold">{theme.name}</h3>
                                        {selectedTheme === theme.id && (
                                            <div className="mt-2 flex justify-center">
                                                <CheckCircle2 size={18} className="text-blue-500" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Select Video Length */}
                        <section className="animate-in slide-in-from-bottom duration-700">
                            <div className="flex items-center gap-2 mb-6 text-rose-500">
                                <Clock size={20} />
                                <h2 className="text-xl font-bold">{analysisResult ? '4' : '3'}. Select Video Length</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {videoLengths.map((length) => (
                                    <div
                                        key={length.id}
                                        onClick={() => setSelectedVideoLength(length.id)}
                                        className={`p-6 rounded-2xl cursor-pointer border-2 transition-all flex items-center gap-4 ${selectedVideoLength === length.id ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedVideoLength === length.id ? 'bg-rose-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                            <Clock size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold">{length.name}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{length.desc}</p>
                                        </div>
                                        {selectedVideoLength === length.id && (
                                            <CheckCircle2 size={24} className="text-rose-500" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Action Section */}
                        {analysisResult && (
                            <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                <button
                                    onClick={handleGenerate}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-indigo-500/20"
                                >
                                    <Wand2 size={20} />
                                    Generate Video
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Speaker Sidebar Editor (Integrated) */}
            <AnimatePresence>
                {analysisResult && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 320, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="h-full bg-gray-50/50 dark:bg-white/[0.02] border-l border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden whitespace-nowrap"
                    >
                        <div className="w-80 flex flex-col h-full">
                            {editingSpeakerId ? (
                                <>
                                    {/* Sidebar Header for Profile Editor */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
                                                <Users size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold uppercase tracking-tight">Edit Performer</h3>
                                        </div>
                                        <button
                                            onClick={() => setEditingSpeakerId(null)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Sidebar Content: Profile Editor */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                        {(() => {
                                            const speaker = analysisResult.speakers.find(s => s.id === editingSpeakerId);
                                            if (!speaker) return null;

                                            return (
                                                <>
                                                    {/* Preview Card */}
                                                    <div className="p-6 rounded-3xl bg-white dark:bg-black/20 border border-gray-100 dark:border-white/5 flex flex-col items-center text-center gap-4 shadow-sm">
                                                        <div className="relative">
                                                            <img
                                                                src={avatars.find(a => a.id === speaker.avatarId)?.url}
                                                                alt={speaker.name}
                                                                className="w-24 h-24 rounded-[2rem] object-cover border-4 shadow-lg"
                                                                style={{ borderColor: speaker.color }}
                                                            />
                                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 shadow-xl">
                                                                <span>{speaker.gender === 'male' ? '♂️' : '♀️'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className="text-xl font-black uppercase tracking-tight truncate">{speaker.name}</h4>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{audios.find(a => a.id === speaker.voiceId)?.name}</p>
                                                        </div>
                                                    </div>

                                                    {/* Name Input */}
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 tracking-[0.2em]">
                                                            <User size={12} />
                                                            Stage Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={speaker.name}
                                                            onChange={e => updateSpeaker(speaker.id, { name: e.target.value })}
                                                            className="w-full bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold"
                                                        />
                                                    </div>

                                                    {/* Gender Toggle */}
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 tracking-[0.15em]">
                                                            Identity
                                                        </label>
                                                        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-black/40 rounded-2xl border border-gray-100 dark:border-white/5">
                                                            <button
                                                                onClick={() => updateSpeaker(speaker.id, { gender: 'male' })}
                                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${speaker.gender === 'male' ? 'bg-white dark:bg-indigo-600 text-indigo-500 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                Masculine
                                                            </button>
                                                            <button
                                                                onClick={() => updateSpeaker(speaker.id, { gender: 'female' })}
                                                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${speaker.gender === 'female' ? 'bg-white dark:bg-pink-600 text-pink-500 dark:text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                                                            >
                                                                Feminine
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* 3D Avatars */}
                                                    <div className="space-y-3">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 tracking-[0.2em]">
                                                            3D Persona
                                                        </label>
                                                        <div className="grid grid-cols-4 gap-2">
                                                            {avatars.map(avatar => (
                                                                <button
                                                                    key={avatar.id}
                                                                    onClick={() => updateSpeaker(speaker.id, { avatarId: avatar.id })}
                                                                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all group/avatar ${speaker.avatarId === avatar.id ? 'border-orange-500 scale-105 shadow-sm' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                                >
                                                                    <img src={avatar.url} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Voice Selection */}
                                                    <div className="space-y-3 pb-8">
                                                        <label className="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2 tracking-[0.2em]">
                                                            <Music size={12} />
                                                            Voice Synthesis
                                                        </label>
                                                        <div className="grid grid-cols-1 gap-2">
                                                            {audios.filter(a => a.type === 'Voiceover').map(audio => (
                                                                <button
                                                                    key={audio.id}
                                                                    onClick={() => updateSpeaker(speaker.id, { voiceId: audio.id })}
                                                                    className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${speaker.voiceId === audio.id ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/10' : 'border-gray-50 dark:border-white/5 bg-white/50 dark:bg-black/20 hover:border-indigo-200'}`}
                                                                >
                                                                    <div className="flex-1 overflow-hidden">
                                                                        <p className="text-[11px] font-black uppercase tracking-tight truncate">{audio.name}</p>
                                                                        <p className="text-[9px] text-gray-400 mt-0.5 truncate">{audio.description}</p>
                                                                    </div>
                                                                    {speaker.voiceId === audio.id && (
                                                                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300 flex-shrink-0">
                                                                            <CheckCircle2 size={12} />
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Sidebar Footer for Profile Editor */}
                                    <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
                                        <button
                                            onClick={() => setEditingSpeakerId(null)}
                                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all hover:bg-black dark:hover:bg-gray-100"
                                        >
                                            Finish Editing
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Sidebar Header for Script Review */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                                                <MessageSquare size={20} />
                                            </div>
                                            <h3 className="text-xl font-bold uppercase tracking-tight">Review Script</h3>
                                        </div>
                                    </div>

                                    {/* Sidebar Content: Conversation Flow */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/30 dark:bg-black/10">
                                        {analysisResult.messages.map((msg: Message, idx: number) => {
                                            const speaker = analysisResult.speakers.find((s: Speaker) => s.id === msg.speakerId);
                                            return (
                                                <div key={idx} className={`flex flex-col gap-2 ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: speaker?.color || '#6366f1' }}>{speaker?.name || 'Unknown'}</span>
                                                    </div>
                                                    <div className={`p-4 rounded-2xl max-w-[90%] text-sm shadow-sm border ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900 rounded-tl-none border-gray-100 dark:border-gray-800' : 'bg-indigo-500 text-white rounded-tr-none border-indigo-400'}`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Sidebar Footer for Script Review (Optional, can be empty or have a tip) */}
                                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20 text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Select a persona to customize</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CreateVideo;
