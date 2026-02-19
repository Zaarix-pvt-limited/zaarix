import React from 'react';
import { AbsoluteFill, useCurrentFrame, Img, Audio, Sequence } from 'remotion';

const fallbackAvatar =
  'https://res.cloudinary.com/duo62w4uq/image/upload/v1771399186/image-removebg-preview_11_ge9pbv.png';

const framesPerMessage = 120;

export const Chat2MemeComposition = ({
  conversation = [],
  avatar1 = '',
  avatar2 = '',
  backgroundImage = '',
}) => {
  const frame = useCurrentFrame();

  const safeConversation =
    Array.isArray(conversation) && conversation.length > 0
      ? conversation
      : [{ speaker: 'A', text: 'No conversation provided.' }];

  const index = Math.floor(frame / framesPerMessage);
  const currentMessage = safeConversation[index] || safeConversation[safeConversation.length - 1];

  // ─── Emotion-aware avatar resolution ───────────────────────────────────────
  // For each speaker, find the MOST RECENT avatarUrl up to the current frame.
  // This means each avatar shows the emotion from its last spoken message,
  // rather than reverting to the static preview URL between turns.

  let resolvedAvatarA = avatar1 || fallbackAvatar;
  let resolvedAvatarB = avatar2 || fallbackAvatar;

  // Walk through messages up to and including the current one
  for (let i = 0; i <= Math.min(index, safeConversation.length - 1); i++) {
    const msg = safeConversation[i];
    if (!msg) continue;
    if (msg.speaker === 'A' && msg.avatarUrl) resolvedAvatarA = msg.avatarUrl;
    if (msg.speaker === 'B' && msg.avatarUrl) resolvedAvatarB = msg.avatarUrl;
  }

  // When a speaker is ACTIVE, always use their current message's avatarUrl if available
  const avatarUrlA =
    currentMessage.speaker === 'A' && currentMessage.avatarUrl
      ? currentMessage.avatarUrl
      : resolvedAvatarA;

  const avatarUrlB =
    currentMessage.speaker === 'B' && currentMessage.avatarUrl
      ? currentMessage.avatarUrl
      : resolvedAvatarB;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f0f0f0',
        fontFamily: 'sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background */}
      {backgroundImage ? (
        <AbsoluteFill style={{ zIndex: 0 }}>
          <Img
            src={backgroundImage}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Audio per message */}
      {safeConversation.map((msg, i) => (
        <Sequence key={`${i}-${msg.text || ''}`} from={i * framesPerMessage} durationInFrames={framesPerMessage}>
          {msg.audioUrl ? <Audio src={msg.audioUrl} /> : null}
        </Sequence>
      ))}

      {/* Chat bubbles */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 2,
        }}
      >
        {currentMessage.speaker === 'A' ? (
          <div
            style={{
              position: 'absolute',
              top: '19%', left: '10%',
              background: 'white',
              border: '4px solid black',
              borderRadius: '20px',
              padding: '20px',
              maxWidth: '350px',
              boxShadow: '10px 10px 0px rgba(0,0,0,0.2)',
              transform: 'rotate(-2deg)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '24px', fontWeight: 'bold',
                color: 'black', lineHeight: '1.3',
                fontFamily: 'Comic Sans MS, cursive, sans-serif',
              }}
            >
              {currentMessage.text}
            </div>
          </div>
        ) : null}

        {currentMessage.speaker === 'B' ? (
          <div
            style={{
              position: 'absolute',
              top: '19%', right: '10%',
              background: 'white',
              border: '4px solid black',
              borderRadius: '20px',
              padding: '20px',
              maxWidth: '350px',
              boxShadow: '-10px 10px 0px rgba(0,0,0,0.2)',
              transform: 'rotate(2deg)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '24px', fontWeight: 'bold',
                color: 'black', lineHeight: '1.3',
                fontFamily: 'Comic Sans MS, cursive, sans-serif',
              }}
            >
              {currentMessage.text}
            </div>
          </div>
        ) : null}
      </div>

      {/* Avatars — always show the emotion-resolved URL */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, width: '100%', height: '60%',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          padding: 0,
        }}
      >
        {/* Speaker A — left */}
        <div
          style={{
            position: 'relative',
            left: '-40px',
            bottom: '-20px',
            transform: currentMessage.speaker === 'A'
              ? 'scale(1.05) translateY(-10px)'
              : 'scale(1)',
            opacity: currentMessage.speaker === 'A' ? 1 : 0.9,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <div style={{ width: '380px', height: '780px', overflow: 'hidden' }}>
            <Img
              src={avatarUrlA}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Speaker B — right */}
        <div
          style={{
            position: 'relative',
            right: '160px',
            bottom: '-30px',
            transform: currentMessage.speaker === 'B'
              ? 'scale(1.05) translateY(-10px)'
              : 'scale(1)',
            opacity: currentMessage.speaker === 'B' ? 1 : 0.9,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        >
          <div style={{ width: '390px', height: '820px', overflow: 'hidden' }}>
            <Img
              src={avatarUrlB}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px', left: 0,
          width: '100%',
          textAlign: 'center',
          zIndex: 3,
          textShadow: '2px 2px 0 #000',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>Allowed by</div>
        <div style={{ fontSize: '24px', fontWeight: '900', fontFamily: 'serif', marginTop: '-5px' }}>
          Zaarix AI
        </div>
      </div>
    </AbsoluteFill>
  );
};
