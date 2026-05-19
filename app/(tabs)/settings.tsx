import React from "react";
import { Pressable, Text } from "react-native";
import { useAuth } from "@clerk/expo";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const settings = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
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

export default settings;
