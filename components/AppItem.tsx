import { colors } from "@/constants/colors";
import { fonts } from "@/constants/fonts";
import { spacing } from "@/constants/spacing";
import { typography } from "@/constants/typography";
import { App } from "@/types/App";
import React from "react";
import { Image, StyleSheet, Switch, Text, View } from "react-native";
interface Props {
  item: App;
  onSelected: (app: App) => void;
  appSelected?: boolean;
}

const AppItem = ({ item, onSelected, appSelected = false }: Props) => {
  const toggleSwitch = () => {
    onSelected(item);
  };

  return (
    <View style={styles.listItem}>
      <View style={styles.appData}>
        <View style={styles.appIconWrapper}>
          <Image
            source={{ uri: item.icon }}
            style={styles.appIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.appName}>{item.name}</Text>
      </View>
      <Switch
        trackColor={{ false: colors.surfaceMuted, true: colors.primary }}
        thumbColor={appSelected ? colors.primaryMuted : colors.darkMuted}
        onValueChange={toggleSwitch}
        value={appSelected}
      />
    </View>
  );
};

export default AppItem;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },

  appData: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },

  appIconWrapper: {
    width: 40,
    height: 40,
    backgroundColor: colors.surfaceLight,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  appIcon: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
  },

  appName: {
    fontFamily: fonts.medium,
    fontSize: typography.body,
    color: colors.dark,
    width: 180,
  },
});
