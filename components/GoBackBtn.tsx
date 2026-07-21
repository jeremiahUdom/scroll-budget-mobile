import { colors } from "@/constants/colors";
import Ionicons from "@react-native-vector-icons/ionicons";
import React from "react";
import { Pressable } from "react-native";

const GoBackBtn = ({ onButtonPressed }: { onButtonPressed: () => void }) => {
  return (
    <Pressable onPress={onButtonPressed}>
      <Ionicons name="chevron-back" size={25} color={colors.icon} />
    </Pressable>
  );
};

export default GoBackBtn;
