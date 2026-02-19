import React from 'react';
import { Composition } from 'remotion';
import { Chat2MemeComposition } from './VideoComposition';

const defaultConversation = [{ speaker: 'A', text: 'Your video is being generated...' }];
const framesPerMessage = 120;

export const RemotionRoot = () => {
  return (
    <Composition
      id="Chat2MemeVideo"
      component={Chat2MemeComposition}
      width={540}
      height={960}
      fps={30}
      durationInFrames={Math.max(120, defaultConversation.length * framesPerMessage)}
      defaultProps={{
        conversation: defaultConversation,
        avatar1: '',
        avatar2: '',
        backgroundImage: '',
      }}
      calculateMetadata={({ props }) => {
        const messages = Array.isArray(props?.conversation) ? props.conversation : defaultConversation;
        return {
          durationInFrames: Math.max(120, messages.length * framesPerMessage),
        };
      }}
    />
  );
};
