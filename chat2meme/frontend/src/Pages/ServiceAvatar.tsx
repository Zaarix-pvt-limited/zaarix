import React from 'react';
import { Search, Filter, Plus, MoreHorizontal, Download } from 'lucide-react';

const avatars = [
    {
        id: 1,
        name: 'Professional Man',
        category: 'Business',
        url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 2,
        name: 'Creative Woman',
        category: 'Artistic',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 3,
        name: 'Tech Lead',
        category: 'Technology',
        url: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Processing'
    },
    {
        id: 4,
        name: 'Marketing Guru',
        category: 'Marketing',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 5,
        name: 'Sales Rep',
        category: 'Business',
        url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 6,
        name: 'Customer Support',
        category: 'Support',
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 7,
        name: 'Animator',
        category: 'Creative',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    },
    {
        id: 8,
        name: 'Data Scientist',
        category: 'Technology',
        url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        status: 'Active'
    }
];

const ServiceAvatar = () => {
    return (
        <div className="p-6 h-full overflow-y-auto w-full bg-white dark:bg-[#171e2e] text-gray-900 dark:text-white">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Avatar Library</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage and select your AI avatars.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#303c56] border border-gray-200 dark:border-gray-800 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-sm font-medium flex items-center gap-2 transition-colors">
                        <Plus size={18} />
                        Create Avatar
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search avatars..."
                    className="w-full bg-gray-50 dark:bg-[#303c56] border border-gray-200 dark:border-gray-800 rounded-sm pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-500"
                />
            </div>

            {/* Avatar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {avatars.map((avatar) => (
                    <div key={avatar.id} className="group relative bg-white dark:bg-[#303c56] border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300">
                        {/* Image Container */}
                        <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                            <img
                                src={avatar.url}
                                alt={avatar.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                                    <Download size={20} />
                                </button>
                                <button className="p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 transition-colors">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="absolute top-3 right-3">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${avatar.status === 'Active'
                                        ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20'
                                        : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20'
                                    } backdrop-blur-md`}>
                                    {avatar.status}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-1">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{avatar.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{avatar.category}</p>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceAvatar;
