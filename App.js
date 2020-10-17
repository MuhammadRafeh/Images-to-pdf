import React from 'react';
import { Button, TouchableOpacity, StyleSheet, Text } from 'react-native'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './Main' //1st Screen 
import Settings from './Settings' //2nd Screen

const Stack = createStackNavigator()

const SettingButton = props => (
  <TouchableOpacity
    style={styles.settings}
    onPress={() => {props.navigate("Settings")}}
  >
    <Text style={styles.text}>Settings</Text>
  </TouchableOpacity>
)

function MyStackNavigator() {
  return(
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen name="Main" component={Main} options={({ navigation }) => ({
          title: 'Images To PDF', 
          headerTitleAlign: 'center',
          headerTitleAllowFontScaling: true,
          headerRight: props => (<SettingButton navigate={navigation.navigate} />)
        })}
      />
      <Stack.Screen name="Settings" component={Settings} />
    </Stack.Navigator>
  )
}

function App() {
  return (
    <NavigationContainer>
      <MyStackNavigator />
    </NavigationContainer>
  );
}

export default App

const styles = StyleSheet.create({
  settings: {
    backgroundColor: "#DDDDDD",
    padding: 8,
    marginRight: 15
  },
  text: {
    fontWeight: 'bold'
  }
});
