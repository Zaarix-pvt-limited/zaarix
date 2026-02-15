import React from 'react';

const Message = ({ speaker, text, audioUrl, emotion, avatar }) => {
    const isSpeakerA = speaker === 'A';

    return (
        <div className={`flex w-full mb-6 ${isSpeakerA ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[90%] md:max-w-[75%] gap-3 ${isSpeakerA ? 'flex-row' : 'flex-row-reverse'}`}>

                {/* Avatar */}
                <div className="flex-shrink-0 mt-auto">
                    {avatar ? (
                        <img src={avatar} alt={`Speaker ${speaker}`} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                    ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm ${isSpeakerA ? 'bg-indigo-400' : 'bg-purple-400'}`}>
                            {speaker}
                        </div>
                    )}
                </div>

                {/* Message Content */}
                <div className={`flex flex-col ${isSpeakerA ? 'items-start' : 'items-end'}`}>
                    <span className="mb-1 ml-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {speaker === 'A' ? 'Speaker A' : 'Speaker B'}
                    </span>

                    <div className={`relative px-5 py-4 shadow-sm ${isSpeakerA
                            ? 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                            : 'bg-indigo-600 text-white rounded-2xl rounded-br-sm'
                        }`}>
                        <p className="text-base leading-relaxed whitespace-pre-wrap">{text}</p>

                        {/* Audio Player */}
                        {audioUrl && (
                            <div className={`mt-3 p-1 rounded-lg ${isSpeakerA ? 'bg-gray-100' : 'bg-indigo-500/50'}`}>
                                <audio
                                    controls
                                    src={`http://localhost:4000${audioUrl}`}
                                    className="w-full h-8"
                                />
                            </div>
                        )}

                        {/* Emotion Badge */}
                        {emotion && (
                            <span className={`absolute -top-2 ${isSpeakerA ? '-right-2' : '-left-2'} text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-sm font-medium transform rotate-3`}>
                                {emotion}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
