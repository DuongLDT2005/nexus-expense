import React, { useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/slices/authSlice";
import { useNavigation } from "@react-navigation/native";
import { useHomeScreen } from "./useHomeScreen";
import PrimaryView from "../../components/atoms/PrimaryView";
import HeaderContainer from "../../components/molecules/HeaderContainer";

export default function HomeScreen() {
  const { categories, loading, error, refetch } = useHomeScreen();
  const user = useSelector(selectUser);
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (user && !user.currencyId) {
      navigation.navigate("ChooseCurrencyScreen", { isFromSettings: false });
    }
  }, [user, navigation]);

  return (
    <PrimaryView useSidePadding={false} style={{ paddingTop: 0 }}>
      <HeaderContainer headerText="Nexus Test Connection" />

      <View className="flex-1 mt-6 px-6">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          API Connection Test (Expo Go)
        </Text>

        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#22c55e" />
            <Text className="text-gray-500 mt-2">Connecting to server...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center px-4">
            <Text className="text-red-500 font-semibold text-center mb-2">
              Error connecting to JSON Server!
            </Text>
            <Text className="text-gray-500 text-sm text-center mb-4">
              {error}
            </Text>
            <TouchableOpacity
              onPress={refetch}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                className="p-4 mb-3 rounded-xl flex-row items-center justify-between"
                style={{ backgroundColor: item.color || "#e5e7eb" }}
              >
                <Text className="text-white font-bold text-lg">
                  {item.name}
                </Text>
                <Text className="text-white/80 font-mono text-sm">
                  {item.icon}
                </Text>
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-gray-500 text-center mt-8">
                No categories found in database.
              </Text>
            }
          />
        )}
      </View>
    </PrimaryView>
  );
}
