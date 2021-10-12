import React from 'react';
import { View } from 'react-native';
import Dialog from 'react-native-dialog';
import propTypes from 'prop-types';

class DialogComponent extends React.Component {
  static propTypes = {
    length: propTypes.number,
    closeDialog: propTypes.func,
  };

  state = {
    pdfName: '',
  };

  handlePDFNameInput = (pdfName) => {
    this.setState({ pdfName });
  };

  handleCancel = () => {
    this.props.closeDialog(false);
  };

  handleDone = async () => {
    this.props.closeDialog(false, true, this.state.pdfName);
  };

  render() {
    if (this.props.length > 0) {
      return (
        <View>
          <Dialog.Container visible>
            <Dialog.Title>Enter PDF Name</Dialog.Title>
            <Dialog.Input
              value={this.state.pdfName}
              onChangeText={this.handlePDFNameInput}
              autoFocus
            />
            <Dialog.Button label="Cancel" onPress={this.handleCancel} />
            <Dialog.Button label="Done" onPress={this.handleDone} />
          </Dialog.Container>
        </View>
      );
    }
    return (
      <View>
        <Dialog.Container visible>
          <Dialog.Title>Pick An Image</Dialog.Title>
          <Dialog.Description>
            Select at least 1 image to continue.
          </Dialog.Description>
          <Dialog.Button label="Ok" onPress={this.handleCancel} />
        </Dialog.Container>
      </View>
    );
  }
}

export default DialogComponent
