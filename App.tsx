import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider, useSelector} from 'react-redux';
import store from './src/redux/store';
import {LogBox, View, useColorScheme as useSystemColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import MainStack from './src/navigation/MainStack';
import { selectTheme } from './src/redux/slices/settingsSlice';

const AppContent = () => {
  const reduxTheme = useSelector(selectTheme);
  const systemScheme = useSystemColorScheme();
  const activeTheme = reduxTheme === 'system' ? (systemScheme || 'light') : reduxTheme;

  return (
    <View className={`flex-1 ${activeTheme}`} style={{ flex: 1 }}>
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  LogBox.ignoreAllLogs();

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
