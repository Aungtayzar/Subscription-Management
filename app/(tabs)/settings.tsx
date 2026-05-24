import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const Settings = () => {
  const { signOut } = useAuth();
  const posthog = usePostHog();

  const handleLogout = async () => {
    try {
      posthog.capture("user_signed_out");
      posthog.reset();
      await signOut();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text>settings</Text>
      <Pressable
        className="mt-6 items-center rounded-xl bg-primary px-4 py-3"
        onPress={handleLogout}
      >
        <Text className="text-base font-semibold text-white">Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
