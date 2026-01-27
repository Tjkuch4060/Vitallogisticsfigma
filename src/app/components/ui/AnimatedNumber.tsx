import { useSpring, animated } from '@react-spring/web';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delay?: number;
}

export function AnimatedNumber({ 
  value, 
  prefix = '', 
  suffix = '', 
  decimals = 2,
  delay = 200 
}: AnimatedNumberProps) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    delay,
    config: { mass: 1, tension: 20, friction: 10 }
  });

  return (
    <animated.span>
      {number.to(n => {
        const formatted = n.toFixed(decimals);
        return `${prefix}${formatted}${suffix}`;
      })}
    </animated.span>
  );
}
