import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

class Settings extends React.Component {
	state = {
		asd: null
	}
	render() {
		return(
			<View style={styles.container}>
				<Text>Settings will come soon.</Text>
			</View>
		)
	}
}

export default Settings

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
