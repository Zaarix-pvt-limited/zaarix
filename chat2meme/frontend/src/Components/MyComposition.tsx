import { AbsoluteFill, useVideoConfig, useCurrentFrame, spring, Audio } from 'remotion';
import React from 'react';

interface Message {
    speaker: 'A' | 'B';
    text: string;
    audioUrl?: string;
}

interface RemotionVideoProps {
    conversation: Message[];
    avatar1: string; // URL or base64
    avatar2: string; // URL or base64
}

export const MyComposition: React.FC<RemotionVideoProps> = ({ conversation = [], avatar1, avatar2 }) => {
    const { fps } = useVideoConfig();
    const frame = useCurrentFrame();

    const framesPerMessage = 120; // 4 seconds per message
    const index = Math.floor(frame / framesPerMessage);
    const currentMessage = conversation[index] || conversation[conversation.length - 1] || { speaker: 'A', text: 'Waiting for conversation...' };

    // Calculate current time within the message for animations
    const messageFrame = frame % framesPerMessage;

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#1a1a2e',
                color: 'white',
                fontFamily: 'sans-serif',
                overflow: 'hidden'
            }}
        >
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: -100,
                left: -100,
                width: 400,
                height: 400,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)',
                filter: 'blur(80px)',
                opacity: 0.4
            }} />

            {/* Avatars Container */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                width: '100%',
                height: '60%',
                padding: '0 40px'
            }}>
                {/* Speaker A */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    opacity: currentMessage.speaker === 'A' ? 1 : 0.5,
                    transform: `scale(${currentMessage.speaker === 'A' ? 1.1 : 1})`,
                    transition: 'all 0.3s ease-out'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        border: `4px solid ${currentMessage.speaker === 'A' ? '#6366f1' : '#ccc'}`,
                        overflow: 'hidden',
                        boxShadow: currentMessage.speaker === 'A' ? '0 0 30px rgba(99, 102, 241, 0.4)' : 'none',
                        background: '#333'
                    }}>
                        {avatar1 ? (
                            <img src={avatar1} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Speaker A" />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px' }}>A</div>
                        )}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#6366f1' }}>Speaker A</div>
                </div>

                {/* Speaker B */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    opacity: currentMessage.speaker === 'B' ? 1 : 0.5,
                    transform: `scale(${currentMessage.speaker === 'B' ? 1.1 : 1})`,
                    transition: 'all 0.3s ease-out'
                }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        border: `4px solid ${currentMessage.speaker === 'B' ? '#a855f7' : '#ccc'}`,
                        overflow: 'hidden',
                        boxShadow: currentMessage.speaker === 'B' ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none',
                        background: '#333'
                    }}>
                        {avatar2 ? (
                            <img src={avatar2} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Speaker B" />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '40px' }}>B</div>
                        )}
                    </div>
                    <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#a855f7' }}>Speaker B</div>
                </div>
            </div>

            {/* Text Area */}
            <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '40px',
                right: '40px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                minHeight: '150px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{
                    fontSize: '14px',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '10px',
                    color: currentMessage.speaker === 'A' ? '#818cf8' : '#c084fc',
                    fontWeight: 'bold'
                }}>
                    {currentMessage.speaker === 'A' ? 'Speaker A' : 'Speaker B'}
                </div>
                <div style={{ fontSize: '24px', lineHeight: '1.4', fontWeight: '500' }}>
                    {currentMessage.text}
                </div>
            </div>

            {/* Audio Player (Basic Implementation) */}
            {/* If audioUrl exists, we try to play it. Note: sequencing audio in Remotion requires distinct <Audio> tags with startFrom props.
                For this basic structure, we might skip complex audio syncing or just play the current one if simple. 
                Given the "basic structure" request, let's keep it visual for now to avoid complexity with overlapping audio.
            */}
        </AbsoluteFill>
    );
};
