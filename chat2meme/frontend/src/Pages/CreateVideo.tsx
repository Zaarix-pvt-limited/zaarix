import { useState, useRef } from 'react';
import {
    ChevronLeft, User, Music, Layout, Wand2, CheckCircle2,
    MessageSquare, Upload, Type, X, Loader2, Sparkles, Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
}

interface Message {
    speakerId: string;
    text: string;
}

const CreateVideo = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<number | null>(null);

    // Chat Input State
    const [inputMode, setInputMode] = useState<'screenshot' | 'text'>('screenshot');
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
    const [chatText, setChatText] = useState('');

    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ speakers: Speaker[], messages: Message[] } | null>(null);

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
        if (inputMode === 'screenshot' && !screenshot) return alert('Upload a screenshot first');
        if (inputMode === 'text' && !chatText.trim()) return alert('Enter chat text first');

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            if (inputMode === 'screenshot' && screenshot) {
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
                setAnalysisResult(result.data);
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

    const handleGenerate = () => {
        if (!analysisResult) {
            alert('Please analyze your chat content first.');
            return;
        }
        if (!selectedAvatar || !selectedAudio || !selectedTheme) {
            alert('Please select all options before generating.');
            return;
        }
        console.log('Generating video with:', {
            analysisResult,
            selectedAvatar,
            selectedAudio,
            selectedTheme
        });
        alert('Video generation started!');
    };

    return (
        <div className="p-6 h-full overflow-y-auto w-full bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white pb-20">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
                <button
                    onClick={() => navigate('/service/video')}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Create New Video</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Configure your AI video settings.</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-12">
                {/* 1. Chat Content Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-emerald-500">
                        <MessageSquare size={20} />
                        <h2 className="text-xl font-bold">1. Chat Content</h2>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        <div className="flex gap-4 mb-6">
                            <button
                                onClick={() => { setInputMode('screenshot'); setAnalysisResult(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${inputMode === 'screenshot'
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <Upload size={18} />
                                Screenshot
                            </button>
                            <button
                                onClick={() => { setInputMode('text'); setAnalysisResult(null); }}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${inputMode === 'text'
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <Type size={18} />
                                Text Content
                            </button>
                        </div>

                        {inputMode === 'screenshot' ? (
                            <div className="space-y-4">
                                {!screenshotPreview ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors cursor-pointer group"
                                    >
                                        <div className="bg-emerald-50 dark:bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Upload className="text-emerald-500" size={32} />
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Click to upload screenshot</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">PNG, JPG or WebP up to 10MB</p>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </div>
                                ) : (
                                    <div className="relative rounded-xl overflow-hidden aspect-video bg-black flex items-center justify-center group">
                                        <img src={screenshotPreview} alt="Preview" className="max-h-full object-contain" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={clearScreenshot}
                                                className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    value={chatText}
                                    onChange={(e) => { setChatText(e.target.value); setAnalysisResult(null); }}
                                    placeholder="Paste your chat history here..."
                                    className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none dark:text-white"
                                />
                                <div className="flex justify-end">
                                    <p className="text-xs text-gray-500">{chatText.length} characters</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || (!screenshot && !chatText.trim())}
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                {isAnalyzing ? 'Analyzing Chat...' : 'Analyze Chat to Detect Speakers'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* Analysis Results (New Section) */}
                {analysisResult && (
                    <section className="animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center gap-2 mb-6 text-orange-500">
                            <Users size={20} />
                            <h2 className="text-xl font-bold">2. Review Speakers & Script</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Speakers List */}
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Detected Speakers</h3>
                                {analysisResult.speakers.map((speaker, idx) => (
                                    <div key={speaker.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/40 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: speaker.color || '#6366f1' }}>
                                            {speaker.name.charAt(0)}
                                        </div>
                                        <span className="font-semibold">{speaker.name}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Conversation Script */}
                            <div className="md:col-span-2 space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">Conversation Flow</h3>
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/50 max-h-80 overflow-y-auto space-y-3 shadow-inner">
                                    {analysisResult.messages.map((msg, idx) => {
                                        const speaker = analysisResult.speakers.find(s => s.id === msg.speakerId);
                                        return (
                                            <div key={idx} className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase" style={{ color: speaker?.color || '#6366f1' }}>{speaker?.name || 'Unknown'}</span>
                                                <p className="bg-white dark:bg-gray-900 p-3 rounded-xl rounded-tl-none border border-gray-100 dark:border-gray-800 text-sm">{msg.text}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Avatar Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-indigo-500">
                        <User size={20} />
                        <h2 className="text-xl font-bold">{analysisResult ? '3' : '2'}. Select Avatar</h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar.id)}
                                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${selectedAvatar === avatar.id ? 'border-indigo-500 scale-95 shadow-lg' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                    }`}
                            >
                                <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 backdrop-blur-sm p-2 text-center">
                                    <p className="text-white text-xs font-medium">{avatar.name}</p>
                                </div>
                                {selectedAvatar === avatar.id && (
                                    <div className="absolute top-2 right-2 text-indigo-500 bg-white rounded-full">
                                        <CheckCircle2 size={24} fill="currentColor" className="text-white fill-indigo-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Audio Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-purple-500">
                        <Music size={20} />
                        <h2 className="text-xl font-bold">{analysisResult ? '4' : '3'}. Select Audio</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {audios.map((audio) => (
                            <div
                                key={audio.id}
                                onClick={() => setSelectedAudio(audio.id)}
                                className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between ${selectedAudio === audio.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'
                                    }`}
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{audio.name}</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{audio.description}</p>
                                    <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                                        {audio.type}
                                    </span>
                                </div>
                                {selectedAudio === audio.id && (
                                    <CheckCircle2 size={20} className="text-purple-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Theme Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-blue-500">
                        <Layout size={20} />
                        <h2 className="text-xl font-bold">{analysisResult ? '5' : '4'}. Select Theme</h2>
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

                {/* Action Section */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                    <button
                        onClick={handleGenerate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-indigo-500/20"
                    >
                        <Wand2 size={20} />
                        Generate Video
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateVideo;

