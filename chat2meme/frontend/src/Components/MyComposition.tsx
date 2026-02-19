import { AbsoluteFill, useCurrentFrame, Img } from 'remotion';
import React from 'react';
import bgImage from '../assets/image.png';

interface Message {
    speaker: 'A' | 'B';
    text: string;
    audioUrl?: string;
    emotion?: string;   // emotion label from AI (e.g. 'happy', 'sad')
    avatarUrl?: string; // resolved from backend: avatar image for this emotion
}

interface RemotionVideoProps {
    conversation: Message[];
    avatar1: string; // fallback URL for speaker A
    avatar2: string; // fallback URL for speaker B
    backgroundImage?: string;
}

export const MyComposition: React.FC<RemotionVideoProps> = ({ conversation = [], avatar1, avatar2, backgroundImage }) => {

    const frame = useCurrentFrame();

    const framesPerMessage = 120; // 4 seconds per message
    const index = Math.floor(frame / framesPerMessage);
    const currentMessage = conversation[index] || conversation[conversation.length - 1] || { speaker: 'A', text: '...' };

    return (
        <AbsoluteFill
            style={{
                backgroundColor: '#f0f0f0',
                fontFamily: 'sans-serif',
                overflow: 'hidden'
            }}
        >
            {/* Background Image */}
            <AbsoluteFill style={{ zIndex: 0 }}>
                <Img src={backgroundImage || bgImage} style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }} />
            </AbsoluteFill>

            {/* Speech Bubbles Area */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none' // Allow clicking through if needed
            }}>
                {/* Bubble for Speaker A */}
                {currentMessage.speaker === 'A' && (
                    <div style={{
                        position: 'absolute',
                        top: '19%',
                        left: '10%',
                        background: 'white',
                        border: '4px solid black',
                        borderRadius: '20px',
                        padding: '20px',
                        maxWidth: '350px',
                        boxShadow: '10px 10px 0px rgba(0,0,0,0.2)',
                        transform: 'rotate(-2deg)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'black',
                            lineHeight: '1.3',
                            fontFamily: 'Comic Sans MS, cursive, sans-serif'
                        }}>
                            {currentMessage.text}
                        </div>
                        {/* Tail for A */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '40px',
                            width: '0',
                            height: '0',
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: '25px solid black',
                            transform: 'skewX(-20deg)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-14px',
                            left: '42px',
                            width: '0',
                            height: '0',
                            borderLeft: '16px solid transparent',
                            borderRight: '16px solid transparent',
                            borderTop: '22px solid white',
                            transform: 'skewX(-20deg)'
                        }} />
                    </div>
                )}

                {/* Bubble for Speaker B */}
                {currentMessage.speaker === 'B' && (
                    <div style={{
                        position: 'absolute',
                        top: '19%',
                        right: '10%', // Positioned on right
                        background: 'white',
                        border: '4px solid black',
                        borderRadius: '20px',
                        padding: '20px',
                        maxWidth: '350px',
                        boxShadow: '-10px 10px 0px rgba(0,0,0,0.2)', // Shadow to other side
                        transform: 'rotate(2deg)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: 'black',
                            lineHeight: '1.3',
                            fontFamily: 'Comic Sans MS, cursive, sans-serif'
                        }}>
                            {currentMessage.text}
                        </div>
                        {/* Tail for B */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            right: '40px', // Tail on right
                            width: '0',
                            height: '0',
                            borderLeft: '20px solid transparent',
                            borderRight: '20px solid transparent',
                            borderTop: '25px solid black',
                            transform: 'skewX(20deg)'
                        }} />
                        <div style={{
                            position: 'absolute',
                            bottom: '-14px',
                            right: '42px',
                            width: '0',
                            height: '0',
                            borderLeft: '16px solid transparent',
                            borderRight: '16px solid transparent',
                            borderTop: '22px solid white',
                            transform: 'skewX(20deg)'
                        }} />
                    </div>
                )}
            </div>

            {/* Characters Container */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                height: '60%',
                zIndex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                padding: '0'
            }}>
                {/* Speaker A — Left, always at fixed position */}
                <div style={{
                    position: 'relative',
                    left: '-40px',
                    bottom: '-20px',
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    transform: currentMessage.speaker === 'A' ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0)',
                    opacity: currentMessage.speaker === 'A' ? 1 : 0.9,
                    zIndex: currentMessage.speaker === 'A' ? 2 : 1,
                }}>
                    <div style={{ width: '380px', height: '780px', overflow: 'hidden' }}>
                        <Img
                            src={
                                currentMessage.speaker === 'A'
                                    ? (currentMessage.avatarUrl || avatar1 || bgImage)  // active: use emotion URL
                                    : (avatar1 || bgImage)                               // inactive: always static preview
                            }
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            alt="Speaker A"
                        />
                    </div>
                </div>

                {/* Speaker B — Right, always at fixed position */}
                <div style={{
                    position: 'relative',
                    right: '160px',
                    bottom: '-30px',
                    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
                    transform: currentMessage.speaker === 'B' ? 'scale(1.05) translateY(-10px)' : 'scale(1) translateY(0)',
                    opacity: currentMessage.speaker === 'B' ? 1 : 0.9,
                    zIndex: currentMessage.speaker === 'B' ? 2 : 1,
                }}>
                    <div style={{ width: '390px', height: '820px', overflow: 'hidden' }}>
                        <Img
                            src={
                                currentMessage.speaker === 'B'
                                    ? (currentMessage.avatarUrl || avatar2 || bgImage)  // active: use emotion URL
                                    : (avatar2 || bgImage)                               // inactive: always static preview
                            }
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            alt="Speaker B"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: 0,
                width: '100%',
                textAlign: 'center',
                zIndex: 3,
                textShadow: '2px 2px 0 #000',
                color: 'white'
            }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Allowed by</div>
                <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'serif', marginTop: '-5px' }}>Zaarix AI</div>
            </div>
        </AbsoluteFill>
    );
};
