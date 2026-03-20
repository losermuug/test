import React from 'react';
import Svg, { Circle, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function VisualCoin({ size = 24 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
          <Stop offset="0%" stopColor="#FFF176" />
          <Stop offset="80%" stopColor="#FBC02D" />
          <Stop offset="100%" stopColor="#F57F17" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="45" fill="url(#grad)" stroke="#F57F17" strokeWidth="4" />
      <Circle cx="50" cy="50" r="35" fill="none" stroke="#F9A825" strokeWidth="2" strokeDasharray="6,4" />
      <SvgText x="49" y="66" fontSize="46" fontWeight="900" fill="#F57F17" textAnchor="middle">₮</SvgText>
    </Svg>
  );
}
