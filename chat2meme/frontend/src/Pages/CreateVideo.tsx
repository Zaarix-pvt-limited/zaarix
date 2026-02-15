import { useState, useRef } from 'react';
import {
    ChevronLeft, User, Music, Layout, Wand2, CheckCircle2,
    MessageSquare, Upload, Type, X, Loader2, Sparkles, Users, Settings, Clock
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

    // Chat Input State
    const [inputMode, setInputMode] = useState<'screenshot' | 'text'>('screenshot');
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
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center border-2 border-gray-100">
                                                    <span className="text-[10px]">{speaker.gender === 'male' ? '♂️' : '♀️'}</span>
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-lg group-hover:text-orange-500 transition-colors uppercase tracking-tight">{speaker.name}</p>
                                                <p className="text-[10px] text-gray-400 font-medium uppercase">{audios.find(a => a.id === speaker.voiceId)?.name}</p>
                                            </div>
                                            <Settings className={`text-gray-300 transition-transform duration-500 ${editingSpeakerId === speaker.id ? 'rotate-90 text-orange-500' : ''}`} size={18} />
                                        </div>

                                        {/* Speaker Editor Dropdown */}
                                        {editingSpeakerId === speaker.id && (
                                            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 space-y-5 animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Name</label>
                                                    <input
                                                        type="text"
                                                        value={speaker.name}
                                                        onChange={e => updateSpeaker(speaker.id, { name: e.target.value })}
                                                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none font-bold"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Gender</label>
                                                        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                                                            <button
                                                                onClick={() => updateSpeaker(speaker.id, { gender: 'male' })}
                                                                className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${speaker.gender === 'male' ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm' : 'text-gray-400'}`}
                                                            >
                                                                Male
                                                            </button>
                                                            <button
                                                                onClick={() => updateSpeaker(speaker.id, { gender: 'female' })}
                                                                className={`flex-1 py-1 rounded-md text-[10px] font-bold transition-all ${speaker.gender === 'female' ? 'bg-white dark:bg-gray-800 text-pink-500 shadow-sm' : 'text-gray-400'}`}
                                                            >
                                                                Female
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Avatar</label>
                                                        <div className="flex gap-1">
                                                            {avatars.map(avatar => (
                                                                <button
                                                                    key={avatar.id}
                                                                    onClick={() => updateSpeaker(speaker.id, { avatarId: avatar.id })}
                                                                    className={`w-6 h-6 rounded-md overflow-hidden border-2 transition-all ${speaker.avatarId === avatar.id ? 'border-orange-500 scale-110' : 'border-transparent opacity-50'}`}
                                                                >
                                                                    <img src={avatar.url} className="w-full h-full object-cover" />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Select voice</label>
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {audios.filter(a => a.type === 'Voiceover').map(audio => (
                                                            <button
                                                                key={audio.id}
                                                                onClick={() => updateSpeaker(speaker.id, { voiceId: audio.id })}
                                                                className={`flex items-center justify-between p-2 rounded-lg border-2 text-left transition-all ${speaker.voiceId === audio.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-100 dark:border-gray-800'}`}
                                                            >
                                                                <div>
                                                                    <p className="text-[10px] font-bold">{audio.name}</p>
                                                                    <p className="text-[8px] text-gray-400">{audio.description}</p>
                                                                </div>
                                                                {speaker.voiceId === audio.id && <CheckCircle2 size={12} className="text-blue-500" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="animate-in slide-in-from-bottom duration-700">
                            <div className="flex items-center gap-2 mb-6 text-gray-400">
                                <MessageSquare size={18} />
                                <h2 className="text-xl font-bold">3. Conversation Flow</h2>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-3xl border border-gray-100 dark:border-gray-700/50 max-h-96 overflow-y-auto space-y-4 shadow-inner">
                                {analysisResult.messages.map((msg: Message, idx: number) => {
                                    const speaker = analysisResult.speakers.find((s: Speaker) => s.id === msg.speakerId);
                                    return (
                                        <div key={idx} className={`flex flex-col gap-2 ${idx % 2 === 0 ? 'items-start' : 'items-end'}`}>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: speaker?.color || '#6366f1' }}>{speaker?.name || 'Unknown'}</span>
                                            </div>
                                            <div className={`p-4 rounded-2xl max-w-[80%] text-sm shadow-sm border ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900 rounded-tl-none border-gray-100 dark:border-gray-800' : 'bg-indigo-500 text-white rounded-tr-none border-indigo-400'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}





                {/* Theme Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-blue-500">
                        <Layout size={20} />
                        <h2 className="text-xl font-bold">{analysisResult ? '4' : '2'}. Select Theme</h2>
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

                {/* 5. Select Video Length */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-rose-500">
                        <Clock size={20} />
                        <h2 className="text-xl font-bold">{analysisResult ? '5' : '3'}. Select Video Length</h2>
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

