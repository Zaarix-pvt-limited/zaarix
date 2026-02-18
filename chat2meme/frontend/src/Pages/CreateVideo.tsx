import { useState, useRef } from 'react';
import {
    ChevronLeft, User, Music, Layout, Wand2, CheckCircle2,
    MessageSquare, X, Users, Settings, Clock, ChevronDown, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from "@remotion/player";
import { MyComposition } from '../Components/MyComposition';



// Avatars will be fetched from MongoDB
interface Avatar {
    id: string;       // MongoDB _id
    name: string;
    url: string;      // previewUrl — shown in selection UI
    gender?: 'male' | 'female';
}

const audios = [
    { id: 1, name: 'Professional Male', type: 'Voiceover', description: 'Deep, authoritative voice for corporate videos.' },
    { id: 2, name: 'Friendly Female', type: 'Voiceover', description: 'Warm, engaging voice for tutorials.' },
    { id: 3, name: 'Upbeat Corporate', type: 'Background', description: 'Energetic track for marketing.' },
    { id: 4, name: 'Lo-fi Chill', type: 'Background', description: 'Relaxing music for creative content.' },
    { id: 5, name: 'Energetic Youth', type: 'Voiceover', description: 'Dynamic and fast-paced.' },
    { id: 6, name: 'Calm Narrator', type: 'Voiceover', description: 'Soothing voice for storytelling.' },
];



interface Speaker {
    id: string;
    name: string;
    color: string;
    avatarId?: string; // Changed to string
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

interface BackgroundImage {
    id: string;
    url: string;
    name: string;
}

const CreateVideo = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
    const [backgrounds, setBackgrounds] = useState<BackgroundImage[]>([]);
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [isLoadingBackgrounds, setIsLoadingBackgrounds] = useState(true);
    const [isLoadingAvatars, setIsLoadingAvatars] = useState(true);
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

    // Fetch backgrounds and avatars on mount
    useState(() => {
        const fetchBackgrounds = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/video/backgrounds');
                const result = await response.json();
                if (result.success) {
                    setBackgrounds(result.data);
                }
            } catch (error) {
                console.error("Failed to fetch backgrounds:", error);
            } finally {
                setIsLoadingBackgrounds(false);
            }
        };

        const fetchAvatars = async () => {
            try {
                // Fetch avatars from MongoDB (previewUrl shown in selection UI)
                const response = await fetch('http://localhost:3000/api/avatar/all');
                const result = await response.json();
                if (result.success) {
                    const fetchedAvatars = result.data.map((avatar: any) => ({
                        id: avatar._id,
                        name: avatar.name,
                        url: avatar.previewUrl, // previewUrl for display
                        gender: 'male'
                    }));
                    setAvatars(fetchedAvatars);
                }
            } catch (error) {
                console.error("Failed to fetch avatars:", error);
            } finally {
                setIsLoadingAvatars(false);
            }
        };

        fetchBackgrounds();
        fetchAvatars();
    });

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
                    avatarId: s.avatarId ? String(s.avatarId) : (avatars.length > 0 ? avatars[0].id : '1'),
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

    const [isGenerating, setIsGenerating] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);

    const handleGenerate = async () => {
        if (!analysisResult) {
            alert('Please analyze your chat content first.');
            return;
        }
        if (!selectedTheme) {
            alert('Please select a theme before generating.');
            return;
        }

        setIsGenerating(true);
        console.log('Generating video...');

        try {
            const chatData = analysisResult.messages.map(msg => {
                const speakerIndex = analysisResult.speakers.findIndex(s => s.id === msg.speakerId);
                const speakerLabel = speakerIndex === 0 ? 'A' : 'B';
                return {
                    speaker: speakerLabel,
                    text: msg.text,
                    voiceId: analysisResult.speakers.find(s => s.id === msg.speakerId)?.voiceId
                };
            });

            const payload = {
                email: "test@example.com",
                chatData: chatData,
                theme: selectedTheme, // This is now the image URL
                backgroundImage: selectedTheme
            };

            const response = await fetch('http://localhost:3000/api/video/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                console.log("✅ Video Generation Successful!", result.data);
                setGeneratedData(result.data.chatData);
                setShowVideo(true);
            } else {
                alert(`Generation failed: ${result.message}`);
            }

        } catch (error) {
            console.error("Generation Error:", error);
            alert("Failed to connect to generation service.");
        } finally {
            setIsGenerating(false);
        }
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

                            {isLoadingBackgrounds ? (
                                <div className="flex justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                    {backgrounds.map((bg) => (
                                        <div
                                            key={bg.id}
                                            onClick={() => setSelectedTheme(bg.url)}
                                            className={`relative p-2 rounded-md cursor-pointer border transition-all text-center group ${selectedTheme === bg.url
                                                ? 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 ring-2 ring-gray-100 dark:ring-gray-800 shadow-sm'
                                                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="w-full aspect-video rounded-sm mb-2 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                                <img
                                                    src={bg.url}
                                                    alt={bg.name}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                            </div>
                                            <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate px-1">{bg.name}</h3>
                                            {selectedTheme === bg.url && (
                                                <div className="absolute top-3 right-3 bg-white dark:bg-gray-900 rounded-full p-0.5 shadow-sm">
                                                    <CheckCircle2 size={16} className="text-green-500" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                        {/* Action Section */}
                        {/* Action Section */}
                        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                            <button
                                onClick={handleGenerate}
                                disabled={!analysisResult || isGenerating}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-md border shadow-sm transition-all text-sm font-medium ${analysisResult && !isGenerating
                                    ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:shadow'
                                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <Wand2 size={16} />
                                {isGenerating ? 'Generating...' : 'Generate Video'}
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
                                                            {isLoadingAvatars ? (
                                                                <div className="col-span-4 flex justify-center py-4">
                                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"></div>
                                                                </div>
                                                            ) : avatars
                                                                .filter(avatar => avatar.name.toLowerCase().includes(avatarSearch.toLowerCase()))
                                                                .map(avatar => (
                                                                    <button
                                                                        key={avatar.id}
                                                                        onClick={() => updateSpeaker(speaker.id, { avatarId: avatar.id })}
                                                                        className={`aspect-square rounded-sm overflow-hidden border-2 transition-all group/avatar ${speaker.avatarId === avatar.id ? ' scale-105 shadow-sm border-indigo-500' : 'border-transparent opacity-70 hover:opacity-100'}`}
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
            {/* Video Player Overlay */}
            <AnimatePresence>
                {showVideo && generatedData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-white dark:bg-gray-900 p-4 rounded-xl shadow-2xl max-w-sm w-full flex flex-col gap-3"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                    Video Generated! 🎉
                                </h2>
                                <button
                                    onClick={() => setShowVideo(false)}
                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="rounded-xl overflow-hidden aspect-[9/16] bg-black">
                                <Player
                                    component={MyComposition}
                                    durationInFrames={Math.max(120, generatedData.length * 120)}
                                    compositionWidth={540}
                                    compositionHeight={960}
                                    fps={30}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    controls
                                    inputProps={{
                                        conversation: generatedData,
                                        avatar1: analysisResult?.speakers[0]?.avatarId ? avatars.find(a => a.id === analysisResult.speakers[0].avatarId)?.url || "" : "",
                                        avatar2: analysisResult?.speakers[1]?.avatarId ? avatars.find(a => a.id === analysisResult.speakers[1].avatarId)?.url || "" : "",
                                        backgroundImage: selectedTheme || ""
                                    }}
                                />
                            </div>

                            <div className="mt-4 flex justify-between items-center text-gray-400 text-sm">
                                <span>Preview Mode</span>
                                <button
                                    onClick={() => alert("Download feature coming soon!")}
                                    className="text-indigo-500 hover:text-indigo-400 font-medium"
                                >
                                    Download
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default CreateVideo;


