import React from 'react';
import {View} from 'react-native';
import Dialog from 'react-native-dialog';
import FileViewer from 'react-native-file-viewer';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import myAsyncPDFFunction from './api';

class DialogComponent extends React.Component {
  static propTypes = {
    imagesPath: propTypes.array,
    closeDialog: propTypes.func,
    pdfQuality: propTypes.any,
  };

  state = {
    pdfName: '',
  };

  handlePDFNameInput = (pdfName) => {
    this.setState({pdfName});
  };

  handleCancel = () => {
    this.props.closeDialog(false);
  };

  handleDone = async () => {
    this.props.closeDialog(false);
    const list = [];
    this.props.imagesPath.forEach((obj) => {
      list.push(obj.uri);
    });
    try {
      const filePath = await myAsyncPDFFunction(
        list,
        this.state.pdfName,
        this.props.pdfQuality,
      );
      await FileViewer.open(filePath);
    } catch (e) {
      // error
    }
  };

  render() {
    if (this.props.imagesPath.length > 0) {
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

const mapStateToProps = (state) => ({
  pdfQuality: state.settings.quality,
});

export default connect(mapStateToProps)(DialogComponent);
