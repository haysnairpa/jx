import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export function TabBarIcon({ style, ...rest }) {
  return <FontAwesome6 size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}