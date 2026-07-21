export type Error = {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
};
