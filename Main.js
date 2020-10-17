import React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TouchableOpacity, PermissionsAndroid } from 'react-native';

import ImageComponent from './ImageComponent';
import { MenuProvider } from 'react-native-popup-menu';
import DialogComponent from './Dialog';
import Buttons from './Buttons'

import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";

class Main extends React.Component {
  state = {
    imagePaths: [],
    showDialog: false
  }

  componentDidMount() {
    this.id = 0
  }

  openGallery = async () => {
    const bool = await this.gettingPermission()
    if (!bool) return

    try {
      const res = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      // await FileViewer.open(res.uri);
      console.log(res)
      const listOfUri = []
      res.forEach(obj => {
        listOfUri.push({uri: obj.fileCopyUri, id: this.id++})
      })
      this.setState(prevState => ({
        imagePaths: [...prevState.imagePaths, ...listOfUri]
      }))
    }
    catch(e) {
      // error
    }
  }

  gettingPermission = async () => {
    let cam = false, write = false
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        cam = true
      } else {
        console.log("Camera permission denied");
      }
      // WRITE_EXTERNAL_STORAGE
      const granteds = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool Photo App Camera Permission",
          message:
            "Cool Photo App needs access to your camera " +
            "so you can take awesome pictures.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granteds === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the camera");
        write = true
      } else {
        console.log("Camera permission denied");
      }
      if (cam && write) return true
      return false
    } catch (err) {
      console.warn(err);
      return false
    }
  }

  openCamera = async () => {
    const bool = await this.gettingPermission()
    if (!bool) return //If bool is false it mean's that permission denied just return from function.

    const options = {
      title: 'Select Avatar',
      customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response) => {

      if (response.didCancel) {
          console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
  
        this.setState(prevState => ({
          imagePaths: [...prevState.imagePaths, {uri: source.uri, id: this.id++}]
        }))
      }

    });
  }

  handleMakePDFButton = () => {
    this.toggleShowDialog(true)
  }

  toggleShowDialog = bool => {
    this.setState({showDialog: bool})
  }

  removeImage = removeId => {
    this.setState(prevState => ({
      imagePaths: prevState.imagePaths.filter(imagepath => imagepath.id !== removeId)
    }))
  }

  movePicToUp = id => {
    const listOfId = []

    this.state.imagePaths.forEach(obj => {
      listOfId.push(obj.id)
    })

    const target = listOfId.indexOf(id) //Getting the index of target image
    if (target === 0 || target === -1) return  //If Image is on Top just simply return

    const before = target - 1 //Getting the index of previous image

    const listOfUri = [...this.state.imagePaths] //Copying the image's URI

    const beforeUriObj = listOfUri[before] //Getting the URI and saving it for swap in next steps below

    listOfUri.splice(before, 1, listOfUri[target]);// 1 means that delete value on index before

    listOfUri.splice(target, 1, beforeUriObj)

    this.setState({imagePaths: listOfUri})
  }

  movePicToDown = id => {
    const listOfId = []

    this.state.imagePaths.forEach(obj => {
      listOfId.push(obj.id)
    })

    const target = listOfId.indexOf(id) //Getting the index of target image
      if (!this.state.imagePaths[target + 1] || target === -1) return  //If Image is in bottom just simply return

    const after = target + 1 //Getting the index of next image

    const listOfUri = [...this.state.imagePaths] //Copying the image's URI

    const afterUriObj = listOfUri[after] //Getting the URI and saving it for swap in next steps below

    listOfUri.splice(after, 1, listOfUri[target]);// 1 means that delete value on index after

    listOfUri.splice(target, 1, afterUriObj)

    this.setState({imagePaths: listOfUri})
  }

  handleClearImages = () => {
    if (this.state.imagePaths.length>0){
      this.setState({imagePaths: []})
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.clearButton}>
          <Button title="Clear" onPress={this.handleClearImages}/>
        </View>
        <MenuProvider>
          <ScrollView>
            {this.state.imagePaths.map(uri => 
              <ImageComponent 
                imageObj={uri} 
                key={uri.id}
                removeImage={this.removeImage}
                movePicToUp={this.movePicToUp}
                movePicToDown={this.movePicToDown}
              />)
            }
          </ScrollView>
        </MenuProvider>
        {this.state.showDialog && 
          <DialogComponent 
            closeDialog={this.toggleShowDialog} //Prop to close Pop Up dialog
            imagesPath={this.state.imagePaths}
        />}
        <Buttons 
          handleMakePDFButton={this.handleMakePDFButton}
          openCamera={this.openCamera}
          openGallery={this.openGallery}
        />
      </View>
    )
  } 
}
        // <Text>{JSON.stringify(this.state.imagePaths)}</Text>

export default Main

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    paddingBottom:4
  }
});
