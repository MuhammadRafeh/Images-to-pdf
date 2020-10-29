import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

import { Button } from 'react-native-elements'

import propTypes from 'prop-types'

const Buttons = props => (
	<View style={styles.container}>
		  <View style={styles.openButtons}>
      			<View style={styles.openGallery}>
      				 <Button title="Open Gallery" type="outline" onPress={props.openGallery}/>
      	    </View>
      	    <View style={styles.openCamera}>
      	       <Button title="Open Camera" type="outline" onPress={props.openCamera}/>
      	    </View>
            <View style={styles.openPDF}>
               <Button title="Created PDF" type="outline" onPress={() => {props.navigateToPDF.navigate("Created PDF's")}}/>
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

Buttons.propTypes = {
  openGallery: propTypes.func,
  openCamera: propTypes.func,
  handleMakePDFButton: propTypes.func
}

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
    paddingLeft: 5,
    paddingRight: 5
  },
  openPDF: {
    paddingLeft: 5
  }
});