import React from 'react'
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native'

const Buttons = props => (
	<View style={styles.container}>
		  <View style={styles.openButtons}>
      			<View style={styles.openGallery}>
      				 <Button title="Open Gallery" onPress={props.openGallery}/>
      	    </View>
      	    <View style={styles.openCamera}>
      	       <Button title="Open Camera" onPress={props.openCamera}/>
      	    </View>
	    </View>
	    <TouchableOpacity
	      style={styles.makePDF}
	      onPress={props.handleMakePDFButton}
	    >
	      	<Text>Make PDF</Text>
	    </TouchableOpacity>
	</View>
)

export default Buttons

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  openButtons: {
    flexDirection: 'row',
    margin: 10,
  },
  makePDF: {
    marginBottom: 8,
    backgroundColor: "#DDDDDD",
    padding: 8
  },
  openGallery: {
    paddingRight: 5
  },
  openCamera: {
    paddingLeft: 5
  }
});