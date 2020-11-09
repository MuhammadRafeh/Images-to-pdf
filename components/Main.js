import React from 'react';
import {StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist'
import FileViewer from 'react-native-file-viewer';

import myAsyncPDFFunction from './api';

import {
  addImages,
  removeAllImages
} from '../Redux/actions';

import RenderImages from './ImageComponent';
import DialogComponent from './Dialog';
import Buttons from './Buttons';
import {openGalleryApi, openCameraApi} from './api';

class Main extends React.Component {
  state = {
    showDialog: false,
  };

  openGallery = async () => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImages(listOfUri);
  };

  openCamera = async () => {
    await openCameraApi();
  };

  handleMakePDFButton = () => {
    this.toggleShowDialog(true);
  };

  toggleShowDialog = async (bool, makePdf = false, pdfName) => {
    this.setState({showDialog: bool});
    if(makePdf === true) {
          const list = this.props.imagesPath.map(obj => obj.uri)
        try {
          const filePath = await myAsyncPDFFunction(
            list,
            pdfName,
            this.props.pdfQuality,
          );
          await FileViewer.open(filePath);
        } catch (e) {
          // error
        }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <RenderImages navigation={this.props.navigation}/>
        {this.state.showDialog && (
          <DialogComponent
            closeDialog={this.toggleShowDialog} // Prop to close Pop Up dialog
            length={this.props.imagesPath.length}
          />
        )}
        <Buttons
          handleMakePDFButton={this.handleMakePDFButton}
          openCamera={this.openCamera}
          openGallery={this.openGallery}
          navigateToPDF={this.props.navigation}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  imagesPath: state.imagesPath,
  pdfQuality: state.settings.quality
});

const mapDispatchToProps = {
  addImages
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
