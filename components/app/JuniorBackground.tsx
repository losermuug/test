import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function JuniorBackground() {
  const floatAnim = useSharedValue(0);

  React.useEffect(() => {
    floatAnim.value = withRepeat(
      withSequence(
        withTiming(15, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const floatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatAnim.value }],
  }));

  const reverseFloatingStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -floatAnim.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      
      {/* Sun */}
      <Animated.View style={[styles.sun, reverseFloatingStyle]}>
        <View style={styles.sunInner} />
      </Animated.View>

      {/* Moon - True crescent via SVG */}
      <Animated.View style={[styles.moonContainer, floatingStyle]}>
        <Svg width="80" height="80" viewBox="0 0 100 100">
          <Path
            d="M 50 10 A 40 40 0 1 0 90 50 A 30 30 0 0 1 50 10 Z"
            fill="#C084FC"
            opacity="0.3"
          />
        </Svg>
      </Animated.View>

      {/* Clouds */}
      <Animated.View style={[styles.cloud, floatingStyle, { top: height * 0.18, left: width * 0.4 }]} />
      <Animated.View style={[styles.cloud, reverseFloatingStyle, { top: height * 0.3, right: width * 0.6, transform: [{ scale: 0.6 }] }]} />

      {/* Rainbow - Concentric circles */}
      <View style={styles.rainbowContainer}>
        <View style={[styles.rainbowBand, { borderColor: 'rgba(255, 154, 158, 0.25)', width: width * 1.5, height: width * 1.5, borderRadius: width * 0.75 }]}>
          <View style={[styles.rainbowBand, { borderColor: 'rgba(254, 207, 239, 0.4)', width: width * 1.5 - 60, height: width * 1.5 - 60, borderRadius: (width * 1.5 - 60) / 2 }]}>
            <View style={[styles.rainbowBand, { borderColor: 'rgba(253, 241, 203, 0.4)', width: width * 1.5 - 120, height: width * 1.5 - 120, borderRadius: (width * 1.5 - 120) / 2 }]}>
               <View style={[styles.rainbowBand, { borderColor: 'rgba(194, 229, 211, 0.4)', width: width * 1.5 - 180, height: width * 1.5 - 180, borderRadius: (width * 1.5 - 180) / 2 }]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sun: {
    position: 'absolute',
    top: height * 0.05,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 230, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 217, 61, 0.4)',
  },
  moonContainer: {
    position: 'absolute',
    top: height * 0.12,
    right: 10,
  },
  cloud: {
    position: 'absolute',
    width: 140,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  rainbowContainer: {
    position: 'absolute',
    bottom: -width * 0.5,
    right: -width * 0.2,
  },
  rainbowBand: {
    borderWidth: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
