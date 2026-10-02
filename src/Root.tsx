import React from 'react';
import {Composition} from 'remotion';
import {Edit} from './Edit';
import {FPS, TOTAL} from './timeline';

export const RemotionRoot: React.FC = () => (
  <Composition id="InnopolisEdit" component={Edit} durationInFrames={TOTAL} fps={FPS} width={1280} height={720} />
);
