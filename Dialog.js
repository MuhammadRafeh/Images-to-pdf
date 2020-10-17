import React from 'react';
import { View } from 'react-native';
import Dialog from "react-native-dialog";

import myAsyncPDFFunction from './api'
import FileViewer from "react-native-file-viewer";

class DialogComponent extends React.Component {
  state = {
    pdfName: '',
  }

  handlePDFNameInput = pdfName => {
    this.setState({pdfName})
  }

  handleCancel = () => {
    this.props.closeDialog(false)
  }

  handleDone = async () => {
    this.props.closeDialog(false)
    const list = []
    this.props.imagesPath.forEach(obj => {
      list.push(obj.uri)
    })
    try {
      const filePath = await myAsyncPDFFunction(list, this.state.pdfName)
      await FileViewer.open(filePath);
    }
    catch(e) {
      // error
    }
  }

  render() {
    if (this.props.imagesPath.length>0) {
      return (
        <View>
          <Dialog.Container visible={true}>
            <Dialog.Title>Enter PDF Name</Dialog.Title>
            <Dialog.Input value={this.state.pdfName} onChangeText={this.handlePDFNameInput} autoFocus={true}/>
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Done" onPress={this.handleDone}/>
          </Dialog.Container>
        </View>
      )
    } return (
        <View>
          <Dialog.Container visible={true}>
            <Dialog.Title>Pick An Image</Dialog.Title>
            <Dialog.Description>
              Select at least 1 image to continue.
            </Dialog.Description>
            <Dialog.Button label="Ok" onPress={this.handleCancel} />
          </Dialog.Container>
        </View>
    )
  }
}

export default DialogComponent
