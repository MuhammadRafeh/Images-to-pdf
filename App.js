import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import propTypes from 'prop-types';

import Main from './components/Main'; // 1st Screen
import Settings from './components/Settings'; // 2nd Screen
import PdfList from './components/PdfList';
import store from './Redux/store';

import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

const SettingButton = (props) => (
  <TouchableOpacity
    style={styles.settings}
    onPress={() => {
      props.navigate('Settings');
    }}>
    <Icon name='md-settings' size={25} color='blue'/>
  </TouchableOpacity>
);

SettingButton.propTypes = {
  navigate: propTypes.func,
};

function MyStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main">
      <Stack.Screen
        name="Main"
        component={Main}
        options={({navigation}) => ({
          title: 'Images To PDF',
          headerTitleAlign: 'center',
          headerTitleAllowFontScaling: true,
          headerRight: () => <SettingButton navigate={navigation.navigate} />,
        })}
      />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Documents" component={PdfList} />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <MyStackNavigator />
      </Provider>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  settings: {
    padding: 8,
    marginRight: 15
  },
  text: {
    fontWeight: 'bold',
  },
});
