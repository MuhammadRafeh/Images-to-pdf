import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Main from './components/Main'; // 1st Screen
import Settings from './components/Settings'; // 2nd Screen
import PdfList from './components/PdfList';
import store from './Redux/store';

import { MenuProvider } from 'react-native-popup-menu';

import Icon from 'react-native-vector-icons/Ionicons';
import { updateAllSettings } from './Redux/actions';

// import { enableScreens } from 'react-native-screens';

// enableScreens(); //Optimization for navigator below.
const Stack = createStackNavigator();


function MyStackNavigator() {
  const dispatch = useDispatch();

  const getSettings = async () => {
    const [quality, resizeMode, imageSize] = await Promise.all([
      AsyncStorage.getItem('@pdfQuality'),
      AsyncStorage.getItem('@resizeMode'),
      AsyncStorage.getItem('@imageSize')
    ])
    dispatch(updateAllSettings({
      quality: quality ? parseFloat(quality): 0.7,
      resizeMode: resizeMode ? resizeMode: 'contain',
      imageSize: imageSize ? parseInt(imageSize): 40
    }))
  };

  useEffect(() => {
    getSettings();
  }, [])
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={Main}
        options={({ navigation }) => ({
          title: 'Images To PDF',
          headerTitleAlign: 'center',
          headerTitleAllowFontScaling: true,
          headerRight: () => <TouchableOpacity //------------------------------------ Setting Button
            style={styles.settings}
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <Icon name='md-settings' size={25} color='blue' />
          </TouchableOpacity>
        })}
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Documents" component={PdfList} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Provider store={store}>
          <MyStackNavigator />
        </Provider>
      </NavigationContainer>
    </MenuProvider>
  );
}

export default App;

const styles = StyleSheet.create({
  settings: {
    padding: 8,
    marginRight: 15
  }
});
