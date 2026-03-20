import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withDelay } from 'react-native-reanimated';
import VisualCoin from './VisualCoin';

const CoinRenderer = ({ index, size }: { index: number, size: number }) => {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(index * 100, withSpring(0, { damping: 12 }));
    opacity.value = withDelay(index * 100, withSpring(1));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
    marginLeft: index > 0 ? -size * 0.45 : 0,
  }));

  return (
    <Animated.View style={style}>
      <VisualCoin size={size} />
    </Animated.View>
  );
};

export default function MoneyVisualizer({ amount, size = 32, textColor = '#F57F17' }: { amount: number, size?: number, textColor?: string }) {
  const coinsCount = Math.floor(amount / 1000);
  const remainder = amount % 1000;
  
  const displayCoins = Math.min(coinsCount, 6); // Max 6 coins shown overlapping visually

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
      {coinsCount === 0 && remainder > 0 ? (
        <Text style={{ fontSize: size * 0.6, fontWeight: '900', color: textColor }}>{remainder}₮</Text>
      ) : (
        <>
          <View style={{ flexDirection: 'row' }}>
            {Array.from({ length: displayCoins }).map((_, i) => (
              <CoinRenderer key={i} index={i} size={size} />
            ))}
          </View>
          {coinsCount > 6 && (
            <Text style={{ fontSize: size * 0.8, fontWeight: '900', color: textColor, marginLeft: 8 }}>
              x{coinsCount}
            </Text>
          )}
          {remainder > 0 && (
            <Text style={{ fontSize: size * 0.5, fontWeight: '800', color: '#8E8E93', marginLeft: 6 }}>
              + {remainder}₮
            </Text>
          )}
        </>
      )}
      {coinsCount === 0 && remainder === 0 && (
         <Text style={{ fontSize: size * 0.6, fontWeight: '900', color: '#AEAEB2' }}>0</Text>
      )}
    </View>
  );
}
