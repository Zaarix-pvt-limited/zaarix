import React, { useRef, useEffect } from 'react';
import Message from './Message';

const ConversationList = ({ conversations }) => {
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations]);

    if (!conversations || conversations.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-12 pb-12">
            {conversations.map((conv, convIdx) => (
                <div key={convIdx} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 py-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversation {convIdx + 1}</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    <div className="space-y-2">
                        {conv.map((line, msgIdx) => (
                            <Message
                                key={`${convIdx}-${msgIdx}`}
                                speaker={line.speaker}
                                text={line.text}
                                audioUrl={line.audioUrl}
                                emotion={line.emotion}
                                avatar={line.avatar}
                            />
                        ))}
                    </div>
                </div>
            ))}
            <div ref={endRef} />
        </div>
    );
};

export default ConversationList;
