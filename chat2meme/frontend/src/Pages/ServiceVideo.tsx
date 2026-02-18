import { Play, Plus, MoreHorizontal, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const featuredVideos = [
    {
        id: 1,
        title: 'The Future of AI',
        creator: 'TechDaily',
        views: '1.2M',
        duration: '10:23',
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 2,
        title: 'Cinematic Travel Vlog',
        creator: 'Wanderlust',
        views: '856K',
        duration: '05:45',
        thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 3,
        title: 'Product Showcase 2024',
        creator: 'DesignHub',
        views: '2.1M',
        duration: '02:30',
        thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 4,
        title: 'Abstract Art Process',
        creator: 'CreativeMind',
        views: '430K',
        duration: '08:15',
        thumbnail: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 5,
        title: 'Coding Tutorial: React',
        creator: 'CodeMaster',
        views: '1.5M',
        duration: '15:00',
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 6,
        title: 'Nature Documentary',
        creator: 'WildEarth',
        views: '3.2M',
        duration: '45:20',
        thumbnail: 'https://images.unsplash.com/photo-1501854140884-074cf2b2c3af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
];

const ServiceVideo = () => {
    return (
        <div className="p-6 h-full overflow-y-auto w-full bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-white">
            {/* Creation Section */}
            <div className="mb-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-4">Start Creating Your Masterpiece</h1>
                    <p className="text-indigo-100 mb-8 text-lg">Turn your ideas into stunning videos with AI. Choose from thousands of templates or start from scratch.</p>
                    <Link to="/service/video/create" className="bg-white text-indigo-600 px-6 py-3 rounded-sm font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-sm w-fit">
                        <Plus size={20} />
                        Create New Video
                    </Link>
                </div>
                {/* Decorative Pattern */}
                <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                    <Video size={400} />
                </div>
            </div>

            {/* Gallery Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Made by the Community</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Explore what others are building with our tools.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 dark:bg-[#151B2B] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                            Trending
                        </button>
                        <button className="px-4 py-2 text-sm font-medium rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            Latest
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredVideos.map((video) => (
                        <div key={video.id} className="group bg-white dark:bg-[#151B2B] border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                            {/* Thumbnail */}
                            <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                        <Play fill="currentColor" size={20} />
                                    </button>
                                </div>
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-white text-xs font-medium">
                                    {video.duration}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <div className="flex gap-3">
                                    <img
                                        src={video.avatar}
                                        alt={video.creator}
                                        className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-500 transition-colors">{video.title}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            <span>{video.creator}</span>
                                            <span>•</span>
                                            <span>{video.views} views</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceVideo;
