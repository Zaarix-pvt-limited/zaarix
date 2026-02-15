import { useState } from 'react';
import { ChevronLeft, User, Music, Layout, Wand2, CheckCircle2 } from 'lucide-react';
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

const CreateVideo = () => {
    const navigate = useNavigate();
    const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
    const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<number | null>(null);

    const handleGenerate = () => {
        if (!selectedAvatar || !selectedAudio || !selectedTheme) {
            alert('Please select all options before generating.');
            return;
        }
        console.log('Generating video with:', { selectedAvatar, selectedAudio, selectedTheme });
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
                {/* Avatar Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-6 text-indigo-500">
                        <User size={20} />
                        <h2 className="text-xl font-bold">1. Select Avatar</h2>
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
                        <h2 className="text-xl font-bold">2. Select Audio</h2>
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
                        <h2 className="text-xl font-bold">3. Select Theme</h2>
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
