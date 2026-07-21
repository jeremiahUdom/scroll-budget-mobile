import { useUserPreference } from "@/context/UserPreferenceContext";
import { Redirect } from "expo-router";

const App = () => {
  const { hasOnboarded } = useUserPreference();

  if (hasOnboarded) return <Redirect href={"/(onboarding)/SelectApps"} />;

  return <Redirect href={"/(onboarding)/Onboarding"} />;
};

export default App;
