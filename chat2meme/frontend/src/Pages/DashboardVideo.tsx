import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Film, Plus, Clock, FileVideo, Download,
    AlertCircle, RefreshCw, Calendar, Play, X
} from 'lucide-react';

interface VideoRecord {
    _id: string;
    title: string;
    fileName: string;
    fileSizeBytes: number;
    messageCount: number;
    backgroundImage: string;
    cloudinaryUrl: string;
    status: 'rendering' | 'completed' | 'failed';
    createdAt: string;
}

const formatFileSize = (bytes: number): string => {
    if (!bytes || bytes === 0) return '—';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
};

const formatDate = (iso: string): string =>
    new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });

const statusConfig = {
    completed: { label: 'Completed', className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' },
    rendering: { label: 'Rendering…', className: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800' },
    failed: { label: 'Failed', className: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800' },
};

// ─── Video Player Modal ───────────────────────────────────────────────────────
const VideoModal = ({ video, onClose }: { video: VideoRecord; onClose: () => void }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
    >
        <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className="relative w-full max-w-lg bg-gray-950 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            {/* Close */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black transition-colors"
            >
                <X size={16} />
            </button>

            {/* Video */}
            <video
                src={video.cloudinaryUrl}
                controls
                autoPlay
                className="w-full aspect-[9/16] bg-black object-contain"
            />

            {/* Footer */}
            <div className="p-4 flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                    <p className="text-white font-medium text-sm truncate">{video.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(video.createdAt)} · {formatFileSize(video.fileSizeBytes)}</p>
                </div>
                <a
                    href={video.cloudinaryUrl}
                    download={video.fileName}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                    <Download size={15} />
                    Download
                </a>
            </div>
        </motion.div>
    </motion.div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const DashboardVideo = () => {
    const navigate = useNavigate();
    const [videos, setVideos] = useState<VideoRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeVideo, setActiveVideo] = useState<VideoRecord | null>(null);

    const fetchVideos = async (silent = false) => {
        if (!silent) setIsLoading(true);
        else setIsRefreshing(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:3000/api/video/list');
            const result = await res.json();
            if (result.success) {
                setVideos(result.data);
            } else {
                setError(result.message || 'Failed to load videos.');
            }
        } catch {
            setError('Could not connect to server. Is the backend running?');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => { fetchVideos(); }, []);

    const totalSize = videos.reduce((acc, v) => acc + (v.fileSizeBytes || 0), 0);
    const withVideo = videos.filter(v => v.cloudinaryUrl).length;

    return (
        <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-white dark:bg-[#171e2e]">

            {/* Video Player Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Film size={24} className="text-gray-700 dark:text-gray-300" />
                        Video Library
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        All your generated Chat2Meme videos
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchVideos(true)}
                        disabled={isRefreshing}
                        className="p-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-gray-500 dark:text-gray-400"
                        title="Refresh"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => navigate('/service/video/create')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        Create New
                    </button>
                </div>
            </div>

            {/* Stats */}
            {!isLoading && !error && videos.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { icon: <Film size={18} />, label: 'Total Videos', value: String(videos.length) },
                        { icon: <FileVideo size={18} />, label: 'Total Size', value: formatFileSize(totalSize) },
                        { icon: <Clock size={18} />, label: 'Stored on Cloud', value: `${withVideo} / ${videos.length}` },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.03]">
                            <div className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 flex-shrink-0">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Loading */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-gray-900 dark:border-t-white animate-spin" />
                    <p className="text-sm text-gray-400">Loading your videos…</p>
                </div>
            )}

            {/* Error */}
            {!isLoading && error && (
                <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 mb-6">
                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-sm">Could not load videos</p>
                        <p className="text-xs mt-0.5 text-red-600 dark:text-red-300">{error}</p>
                        <button onClick={() => fetchVideos()} className="mt-2 text-xs font-medium underline hover:no-underline">
                            Try again
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && videos.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-24 gap-4 text-center"
                >
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Film size={36} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">No videos yet</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                            Create your first Chat2Meme video and it will appear here automatically.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/service/video/create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md text-sm font-medium hover:opacity-90 transition-all shadow-sm"
                    >
                        <Plus size={16} />
                        Create Your First Video
                    </button>
                </motion.div>
            )}

            {/* Video Grid */}
            {!isLoading && !error && videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {videos.map((video, i) => {
                        const cfg = statusConfig[video.status] || statusConfig.completed;
                        const hasVideo = Boolean(video.cloudinaryUrl);

                        return (
                            <motion.div
                                key={video._id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group flex flex-col rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all"
                            >
                                {/* Thumbnail / Preview */}
                                <div
                                    className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer"
                                    onClick={() => hasVideo && setActiveVideo(video)}
                                >
                                    {/* Background thumbnail */}
                                    {video.backgroundImage ? (
                                        <img
                                            src={video.backgroundImage}
                                            alt={video.title}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Film size={32} className="text-gray-300 dark:text-gray-600" />
                                        </div>
                                    )}

                                    {/* Play overlay */}
                                    {hasVideo && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                                                <Play size={20} className="text-gray-900 ml-1" fill="currentColor" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Status badge */}
                                    <span className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.className}`}>
                                        {cfg.label}
                                    </span>

                                    {/* Cloud badge */}
                                    {hasVideo && (
                                        <span className="absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                            ☁ Saved
                                        </span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate" title={video.title}>
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                                        <Calendar size={11} />
                                        <span>{formatDate(video.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        {video.fileSizeBytes > 0 && <span>{formatFileSize(video.fileSizeBytes)}</span>}
                                        {video.messageCount > 0 && <span>{video.messageCount} messages</span>}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="px-4 pb-4 flex gap-2">
                                    {hasVideo ? (
                                        <>
                                            <button
                                                onClick={() => setActiveVideo(video)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-medium hover:opacity-90 transition-all"
                                            >
                                                <Play size={12} fill="currentColor" />
                                                Play
                                            </button>
                                            <a
                                                href={video.cloudinaryUrl}
                                                download={video.fileName}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                                            >
                                                <Download size={12} />
                                                Download
                                            </a>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => navigate('/service/video/create')}
                                            className="w-full flex items-center justify-center gap-2 py-2 rounded-md border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                                        >
                                            <Plus size={12} />
                                            Re-create
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DashboardVideo;
