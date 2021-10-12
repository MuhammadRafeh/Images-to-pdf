import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import propTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons';

const Buttons = (props) => {
  const {openGallery, openCamera, handleMakePDFButton, navigateToPDF} = props;
  return (
    <View style={styles.container}>
      <View style={styles.openButtons}>
        <TouchableOpacity style={styles.openGallery} onPress={openGallery}>
          <Icon name='ios-images' size={35} color='blue'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.openCamera} onPress={openCamera}>
          <Icon name='md-camera-sharp' size={35} color='blue'/>
        </TouchableOpacity>
        <View style={styles.openPDF}>
          <TouchableOpacity
            title="Created PDF"
            type="outline"
            onPress={() => {
              navigateToPDF.navigate('Documents');
            }}
          >
            <Icon name='documents' size={35} color='blue'/>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.makePDF} onPress={handleMakePDFButton}>
        <Text style={{color: 'white'}}>Make PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

Buttons.propTypes = {
  openGallery: propTypes.func,
  openCamera: propTypes.func,
  handleMakePDFButton: propTypes.func,
  navigateToPDF: propTypes.object,
};

export default Buttons;

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
    backgroundColor: 'black',
    padding: 8,
    borderRadius: 8
  },
  openGallery: {
    paddingRight: 25,
  },
  openCamera: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  openPDF: {
    paddingLeft: 25,
  },
});
