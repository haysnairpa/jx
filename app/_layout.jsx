import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    "Aeonik-Black": require("../assets/fonts/AeonikProTRIAL-Bold.otf"),
    "Aeonik-Bold": require("../assets/fonts/AeonikProTRIAL-Light.otf"),
    "Aeonik-Medium": require("../assets/fonts/AeonikProTRIAL-Regular.otf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // or return a loading indicator
  }
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
