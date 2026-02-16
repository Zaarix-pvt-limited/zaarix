import { useState, useRef } from 'react';
import {
    ChevronLeft, User, Music, Layout, Wand2, CheckCircle2,
    MessageSquare, X, Users, Settings, Clock, ChevronDown, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const avatars = [
    { id: 1, name: 'Professional Man', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, name: 'Creative Woman', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, name: 'Tech Lead', url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 4, name: 'Marketing Guru', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 5, name: 'Casual Gamer', url: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 6, name: 'Crypto Enthusiast', url: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 7, name: 'Digital Artist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 8, name: 'Business Mogul', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
];

const audios = [
    { id: 1, name: 'Professional Male', type: 'Voiceover', description: 'Deep, authoritative voice for corporate videos.' },
    { id: 2, name: 'Friendly Female', type: 'Voiceover', description: 'Warm, engaging voice for tutorials.' },
    { id: 3, name: 'Upbeat Corporate', type: 'Background', description: 'Energetic track for marketing.' },
    { id: 4, name: 'Lo-fi Chill', type: 'Background', description: 'Relaxing music for creative content.' },
    { id: 5, name: 'Energetic Youth', type: 'Voiceover', description: 'Dynamic and fast-paced.' },
    { id: 6, name: 'Calm Narrator', type: 'Voiceover', description: 'Soothing voice for storytelling.' },
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
    { id: '120', name: '120 Seconds', desc: 'Extended coverage' },
];

const CreateVideo = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTheme, setSelectedTheme] = useState<number | null>(null);
    const [selectedVideoLength, setSelectedVideoLength] = useState<string>('30');
    const [mode, setMode] = useState("image");

    // Chat Input State
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [chatText, setChatText] = useState('');

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ speakers: Speaker[], messages: Message[] } | null>(null);
    const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
    const [isVideoLengthOpen, setIsVideoLengthOpen] = useState(false);

    // Search State
    const [avatarSearch, setAvatarSearch] = useState('');
    const [voiceSearch, setVoiceSearch] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

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
        setHasChanges(true);
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
        <div className="flex h-full  w-full bg-white dark:bg-[#0B0F19] overflow-hidden">
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
                                            ? "bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        Image
                                    </button>
                                    <button
                                        onClick={() => { setMode("text"); setAnalysisResult(null); }}
                                        className={`px-5 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === "text"
                                            ? "bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600 text-gray-900 dark:text-white"
                                            : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                            }`}
                                    >
                                        Text
                                    </button>
                                </div>


                                <div className='flex gap-4'>
                                    <div className="relative w-48">
                                        <button
                                            onClick={() => setIsVideoLengthOpen(!isVideoLengthOpen)}
                                            className={`w-full flex items-center justify-between bg-white dark:bg-gray-900 border text-left rounded-md px-3 py-1.5 transition-all shadow-sm ${isVideoLengthOpen
                                                ? 'border-gray-300 dark:border-gray-600 ring-2 ring-gray-100 dark:ring-gray-800'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${isVideoLengthOpen ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                                    }`}>
                                                    <Clock size={14} />
                                                </div>
                                                <span className="block text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {videoLengths.find(l => l.id === selectedVideoLength)?.name}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${isVideoLengthOpen ? 'rotate-180' : ''}`}
                                                size={16}
                                            />
                                        </button>

                                        <AnimatePresence>
                                            {isVideoLengthOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg overflow-hidden p-1"
                                                >
                                                    {videoLengths.map((length) => (
                                                        <button
                                                            key={length.id}
                                                            onClick={() => {
                                                                setSelectedVideoLength(length.id);
                                                                setIsVideoLengthOpen(false);
                                                            }}
                                                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all mb-0.5 last:mb-0 ${selectedVideoLength === length.id
                                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-medium'
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm">{length.name}</span>
                                                            </div>
                                                            {selectedVideoLength === length.id && (
                                                                <CheckCircle2 size={14} className="text-gray-900 dark:text-white" />
                                                            )}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <button
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing || (mode === 'image' ? !screenshot : !chatText.trim())}
                                        className={`px-5 py-2.5 text-sm font-medium rounded-md border shadow-sm transition-all ${isAnalyzing || (mode === 'image' ? !screenshot : !chatText.trim())
                                            ? 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow'
                                            }`}
                                    >
                                        {isAnalyzing ? 'Analyzing...' : 'Continue'}
                                    </button>


                                </div>
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
                                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                                        <Users size={20} />
                                        <h2 className="text-lg font-medium">Review Speakers</h2>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {analysisResult.speakers.map((speaker: Speaker) => (
                                            <div
                                                key={speaker.id}
                                                onClick={() => {
                                                    setEditingSpeakerId(editingSpeakerId === speaker.id ? null : speaker.id);
                                                    setHasChanges(false);
                                                }}
                                                className={`p-4 rounded-md border transition-all cursor-pointer group bg-white dark:bg-gray-900 ${editingSpeakerId === speaker.id
                                                    ? 'border-gray-300 dark:border-gray-600 ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <img
                                                            src={avatars.find(a => a.id === speaker.avatarId)?.url}
                                                            alt={speaker.name}
                                                            className="w-14 h-14 rounded-md object-cover border-2"
                                                            style={{ borderColor: speaker.color }}
                                                        />
                                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 shadow-sm">
                                                            <span className="text-[10px]">{speaker.gender === 'male' ? '♂️' : '♀️'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-lg text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors uppercase tracking-tight truncate">{speaker.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-medium uppercase truncate">{audios.find(a => a.id === speaker.voiceId)?.name}</p>
                                                    </div>
                                                    <Settings className={`text-gray-400 transition-transform duration-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 ${editingSpeakerId === speaker.id ? 'rotate-90 text-gray-900 dark:text-white' : ''}`} size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>
                        )}

                        {/* Theme Selection */}
                        <section className="animate-in slide-in-from-bottom duration-700">
                            <div className="flex items-center gap-2 mb-6 text-gray-900 dark:text-white">
                                <Layout size={20} />
                                <h2 className="text-lg font-medium"> Select Theme</h2>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {themes.map((theme) => (
                                    <div
                                        key={theme.id}
                                        onClick={() => setSelectedTheme(theme.id)}
                                        className={`p-4 rounded-md cursor-pointer border transition-all text-center ${selectedTheme === theme.id
                                            ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm'
                                            : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                            }`}
                                    >
                                        <div className={`w-full aspect-video rounded-sm mb-3 ${theme.color} opacity-80`} />
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{theme.name}</h3>
                                        {selectedTheme === theme.id && (
                                            <div className="mt-2 flex justify-center">
                                                <CheckCircle2 size={16} className="text-gray-900 dark:text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                        {/* Action Section */}
                        {/* Action Section */}
                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <button
                                onClick={handleGenerate}
                                disabled={!analysisResult}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-md border shadow-sm transition-all text-sm font-medium ${analysisResult
                                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Wand2 size={16} />
                                Generate Video
                            </button>
                        </div>
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
                        className="h-full bg-gray-50/50 dark:bg-white/[0.02] border-l border-gray-100 dark:border-gray-800 flex flex-col overflow-hidden"
                    >
                        <div className="w-80 flex flex-col h-full">
                            {editingSpeakerId ? (
                                <>
                                    {/* Sidebar Header for Profile Editor */}
                                    <div className="p-4  dark:border-gray-800 flex items-center justify-between">
                                        <div className='bg-black rounded-md py-1 text-white flex items-center justify-center w-full '>
                                            <div className="flex items-center gap-1">
                                                <div className="p-2 bg-orange-500/10 rounded-xl text-white">
                                                    <Users size={18} />
                                                </div>
                                                <h3 className="text-md  text-medium">Edit Performer</h3>
                                            </div>
                                            {/* <button
                                            onClick={() => setEditingSpeakerId(null)}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                        >
                                            <X size={20} />
                                        </button> */}
                                        </div>
                                    </div>

                                    {/* Sidebar Content: Profile Editor */}
                                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                                        {(() => {
                                            const speaker = analysisResult.speakers.find(s => s.id === editingSpeakerId);
                                            if (!speaker) return null;

                                            return (
                                                <>
                                                    {/* Preview Card */}
                                                    <div className=" flex items-end gap-7">
                                                        <div className="relative">
                                                            <img
                                                                src={avatars.find(a => a.id === speaker.avatarId)?.url}
                                                                alt={speaker.name}
                                                                className="w-24 h-24 rounded-sm object-cover border shadow-lg"

                                                            />
                                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center border-2 border-gray-100 dark:border-gray-800 shadow-xl">
                                                                <span>{speaker.gender === 'male' ? '♂️' : '♀️'}</span>
                                                            </div>
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <h4 className="text-lg font-medium ">{speaker.name}</h4>
                                                            <p className="text-sm text-gray-400 ">{audios.find(a => a.id === speaker.voiceId)?.name}</p>
                                                        </div>
                                                    </div>

                                                    {/* Name Input */}
                                                    <div className="space-y-3">
                                                        <label className="text-sm   text-gray-400 flex items-center gap-2">
                                                            <User size={12} />
                                                            Stage Name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={speaker.name}
                                                            onChange={e => updateSpeaker(speaker.id, { name: e.target.value })}
                                                            className="w-full bg-white dark:bg-white/[0.02] border border-gray-300 dark:border-white/5 rounded-sm p-2 text-sm outline-none focus:ring-1 focus:ring-black transition-all font-bold"
                                                        />
                                                    </div>


                                                    {/* 3D Avatars */}
                                                    {/* 3D Avatars */}
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                                3D Persona
                                                            </label>
                                                        </div>

                                                        {/* Avatar Search */}
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                            <input
                                                                type="text"
                                                                placeholder="Search avatars..."
                                                                value={avatarSearch}
                                                                onChange={(e) => setAvatarSearch(e.target.value)}
                                                                className="w-full bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-md py-2 pl-9 pr-3 text-xs outline-none focus:border-gray-400 transition-all placeholder:text-gray-500"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                                                            {avatars
                                                                .filter(avatar => avatar.name.toLowerCase().includes(avatarSearch.toLowerCase()))
                                                                .map(avatar => (
                                                                    <button
                                                                        key={avatar.id}
                                                                        onClick={() => updateSpeaker(speaker.id, { avatarId: avatar.id })}
                                                                        className={`aspect-square rounded-sm overflow-hidden border-2 transition-all group/avatar ${speaker.avatarId === avatar.id ? ' scale-105 shadow-sm' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                                                        title={avatar.name}
                                                                    >
                                                                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110" />
                                                                    </button>
                                                                ))}
                                                        </div>
                                                    </div>

                                                    {/* Voice Selection */}
                                                    <div className="space-y-3 pb-8">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                                                <Music size={12} />
                                                                Voice Synthesis
                                                            </label>
                                                        </div>

                                                        {/* Voice Search */}
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                                            <input
                                                                type="text"
                                                                placeholder="Search voices..."
                                                                value={voiceSearch}
                                                                onChange={(e) => setVoiceSearch(e.target.value)}
                                                                className="w-full bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-md py-2 pl-9 pr-3 text-xs outline-none focus:border-gray-400 transition-all placeholder:text-gray-500"
                                                            />
                                                        </div>

                                                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                                            {audios
                                                                .filter(a => a.type === 'Voiceover')
                                                                .filter(a => a.name.toLowerCase().includes(voiceSearch.toLowerCase()) || a.description.toLowerCase().includes(voiceSearch.toLowerCase()))
                                                                .map(audio => (
                                                                    <button
                                                                        key={audio.id}
                                                                        onClick={() => updateSpeaker(speaker.id, { voiceId: audio.id })}
                                                                        className={`flex items-center justify-between p-3 rounded-sm border-1 text-left transition-all ${speaker.voiceId === audio.id ? 'border-gray-300 bg-indigo-500/5 ring-1 ring-indigo-500/10' : 'border-gray-50 dark:border-white/5 bg-white/50 dark:bg-black/20 hover:border-indigo-200'}`}
                                                                    >
                                                                        <div className="flex-1 overflow-hidden">
                                                                            <p className="text-[11px] font-black uppercase tracking-tight truncate">{audio.name}</p>
                                                                            <p className="text-[9px] text-gray-400 mt-0.5 truncate">{audio.description}</p>
                                                                        </div>
                                                                        {speaker.voiceId === audio.id && (
                                                                            <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-300 flex-shrink-0">
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

                                    <div className="p-4 border-gray-100 dark:border-gray-800  dark:bg-gray-900/50">
                                        <button
                                            onClick={() => {
                                                if (hasChanges) {
                                                    setHasChanges(false);
                                                } else {
                                                    setEditingSpeakerId(null);
                                                }
                                            }}
                                            className={`w-full py-3 rounded-md font-medium text-sm shadow-sm hover:shadow transition-all ${hasChanges
                                                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                                                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                                                }`}
                                        >
                                            {hasChanges ? 'Save Performer' : 'View Conversation'}
                                        </button>
                                    </div>



                                </>
                            ) : (
                                <>
                                    {/* Sidebar Header for Script Review */}
                                    <div className="p-3   dark:border-gray-800 flex items-center justify-between">
                                        <div className='bg-black w-full py-0.5 rounded-sm flex items-center justify-center'>
                                            <div className="flex items-center gap-1">
                                                <div className="p-2  dark:bg-gray-800 rounded-md text-white dark:text-white">
                                                    <MessageSquare size={20} />
                                                </div>
                                                <h3 className="text-md text-white font-medium uppercase tracking-tight">Conversation</h3>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Content: Conversation Flow */}
                                    <div className="flex-1 overflow-y-auto p-4 mt-2 space-y-1 custom-scrollbar bg-gray-50/30 dark:bg-black/10">
                                        {analysisResult.messages.map((msg: Message, idx: number) => {
                                            const speaker = analysisResult.speakers.find((s: Speaker) => s.id === msg.speakerId);
                                            return (
                                                <div key={idx} className={`flex flex-col gap-2 ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{speaker?.name || 'Unknown'}</span>
                                                    </div>
                                                    <div className={`py-1 px-3 rounded-md max-w-[70%] text-sm  border   ${idx % 2 === 0
                                                        ? 'bg-white dark:bg-gray-900 rounded-sm border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                                                        : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-sm border-gray-800 dark:border-gray-200'
                                                        }`}>
                                                        {msg.text}
                                                    </div>
                                                </div>
                                            );
                                        })}
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


