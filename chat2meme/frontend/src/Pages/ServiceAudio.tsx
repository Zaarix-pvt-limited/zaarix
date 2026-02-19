import React from 'react';
import { Search, Filter, Play, Pause, Plus, ChevronRight, Globe, Mic, BookOpen, Users, GraduationCap, Megaphone, Monitor, MoreHorizontal } from 'lucide-react';

const categories = [
    { icon: Globe, label: 'Language' },
    { icon: Mic, label: 'Accent' },
    { icon: Users, label: 'Conversational' },
    { icon: BookOpen, label: 'Narration' },
    { icon: Users, label: 'Characters' },
    { icon: Monitor, label: 'Social Media' },
    { icon: GraduationCap, label: 'Educational' },
    { icon: Megaphone, label: 'Advertisement' },
];

const handpicked = [
    { title: 'Best voices for Eleven v3', id: 'v3', bg: 'bg-gradient-to-br from-purple-900 to-slate-900' },
    { title: 'Popular Tiktok voices', id: 'tiktok', bg: 'bg-gradient-to-br from-orange-100 to-orange-200' },
    { title: 'Studio-Quality Conversational Voices', id: 'studio', bg: 'bg-zinc-900' },
];

const ServiceAudio = () => {
    const [voices, setVoices] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [playingVoiceId, setPlayingVoiceId] = React.useState<string | null>(null);
    const [currentAudio, setCurrentAudio] = React.useState<HTMLAudioElement | null>(null);

    React.useEffect(() => {
        return () => {
            // Cleanup audio on unmount
            if (currentAudio) {
                currentAudio.pause();
            }
        }
    }, [currentAudio]);

    React.useEffect(() => {
        const fetchVoices = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/video/voices');
                const result = await response.json();
                if (result.success) {
                    console.log("Fetched voices:", result.data);
                    setVoices(result.data);
                } else {
                    setError("Failed to load voices");
                }
            } catch (err) {
                console.error("Error loading voices:", err);
                setError("Error loading voices");
            } finally {
                setLoading(false);
            }
        };

        fetchVoices();
    }, []);

    const handlePlay = (voiceId: string, previewUrl: string) => {
        console.log("Attempting to play:", voiceId, previewUrl);
        // If clicking the same voice that is playing, pause it
        if (playingVoiceId === voiceId) {
            if (currentAudio) {
                currentAudio.pause();
                setPlayingVoiceId(null);
            }
            return;
        }

        // Stop currently playing audio if any
        if (currentAudio) {
            currentAudio.pause();
        }

        if (!previewUrl) {
            console.error("No preview URL for voice:", voiceId);
            return;
        }

        const audio = new Audio(previewUrl);
        audio.onended = () => {
            setPlayingVoiceId(null);
        };

        audio.play()
            .then(() => console.log("Audio started playing"))
            .catch(e => console.error("Playback failed:", e));
        setCurrentAudio(audio);
        setPlayingVoiceId(voiceId);
    };

    return (
        <div className="p-6 h-full overflow-y-auto w-full bg-white dark:bg-[#171e2e] text-gray-900 dark:text-white">
            {/* Header / Search */}
            <div className="mb-8 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold hidden md:block">Voice Library</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>0 / 3 slots used</span>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-sm font-medium flex items-center gap-2 transition-colors">
                            <Plus size={16} />
                            Create a Voice
                        </button>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search library voices..."
                            className="w-full bg-gray-100 dark:bg-[#303c56] border border-gray-200 dark:border-gray-800 rounded-sm pl-10 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#303c56] border border-gray-200 dark:border-gray-800 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map((cat, idx) => (
                        <button
                            key={idx}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 transition-colors"
                        >
                            <cat.icon size={14} />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Trending Voices */}
            <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Trending voices</h2>
                    <ChevronRight size={18} className="text-gray-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading && <p className="text-gray-500">Loading voices...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && voices.map((voice, idx) => {
                        // Random gradient for visual consistency
                        const gradients = [
                            'from-yellow-400 to-orange-500',
                            'from-green-400 to-emerald-600',
                            'from-pink-500 to-rose-500',
                            'from-teal-400 to-cyan-500',
                            'from-red-400 to-red-600',
                            'from-lime-400 to-green-500',
                            'from-blue-400 to-indigo-600',
                            'from-purple-400 to-violet-600'
                        ];
                        const gradient = gradients[idx % gradients.length];

                        return (
                            <div key={voice.voiceId || idx} className="bg-gray-50 dark:bg-[#303c56] p-4 rounded-md border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group h-full flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                        {voice.name[0]}
                                        {/* ElevenLabs doesn't send verification status easily, assume true for high quality voices */}
                                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2 border-[#303c56]">
                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                // Log the voice object to confirm properties
                                                console.log("Play clicked for:", voice);
                                                handlePlay(voice.voiceId, voice.previewUrl);
                                            }}
                                        >
                                            {playingVoiceId === voice.voiceId ? (
                                                <Pause size={20} fill="currentColor" />
                                            ) : (
                                                <Play size={20} fill="currentColor" />
                                            )}
                                        </button>
                                        <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5 rounded-sm text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-sm">
                                            Add
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-base mb-0.5">{voice.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{voice.category || 'Generated'}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-3 line-clamp-1">{voice.labels?.description || voice.description || 'No description available'}</p>

                                    <div className="flex gap-2 flex-wrap">
                                        {voice.labels && Object.entries(voice.labels).slice(0, 3).map(([key, value], i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700">
                                                {String(value)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Handpicked */}
            <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Handpicked for your use case</h2>
                    <div className="flex gap-2">
                        <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"><ChevronRight className="rotate-180" size={18} /></button>
                        <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-800"><ChevronRight size={18} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {handpicked.map((item, idx) => (
                        <div key={idx} className={`relative h-40 rounded-md overflow-hidden p-5 flex flex-col justify-between group cursor-pointer ${item.bg}`}>
                            {/* Overlay for darker backgrounds */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                            <h3 className={`relative z-10 text-xl font-bold ${item.id === 'tiktok' ? 'text-gray-900' : 'text-white'} max-w-[80%]`}>
                                {item.title}
                            </h3>

                            <div className="relative z-10 self-end">
                                <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                                    <ChevronRight className={item.id === 'tiktok' ? 'text-gray-900' : 'text-white'} size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Spotlight */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold">Weekly spotlight - Character Voices</h2>
                    <ChevronRight size={18} className="text-gray-500" />
                </div>

                <div className="space-y-2">
                    {[1, 2].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#303c56] transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-sm">Toby - Little Mythical Monster</h4>
                                    <p className="text-xs text-gray-500">Creature - Goblin Mythical Monster - A goblin...</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Globe size={12} />
                                    <span>English +5</span>
                                </div>
                                <div className="text-xs text-gray-500">2y</div>
                                <div className="text-xs text-gray-500">8.3K</div>
                                <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <Play size={14} fill="currentColor" />
                                </button>
                                <button className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <MoreHorizontal size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceAudio;
