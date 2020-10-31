import React from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {Button} from 'react-native-elements';
import {connect} from 'react-redux';

import {
  addImages,
  removeAllImages,
  movePicDown,
  movePicUp,
  deleteImage,
  addImagesAbove,
  addImagesBelow,
} from '../Redux/actions';

import ImageComponent from './ImageComponent';
import DialogComponent from './Dialog';
import Buttons from './Buttons';
import {openGalleryApi, openCameraApi} from './api';

class Main extends React.Component {
  state = {
    showDialog: false,
  };

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <Button
          title="Clear"
          buttonStyle={styles.headerSaveButton}
          type="clear"
          onPress={this.handleClearImages}
        />
      ),
    });
  }

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

  toggleShowDialog = (bool) => {
    this.setState({showDialog: bool});
  };

  handleClearImages = () => {
    if (this.props.imagePaths.length > 0) {
      this.props.removeAllImages();
    }
  };

  renderItem = ({item}) => (
    <ImageComponent
      imageObj={item}
      movePicUp={this.props.movePicUp}
      movePicDown={this.props.movePicDown}
      deleteImage={this.props.deleteImage}
      resizeMode={this.props.resizeMode}
      addImagesAbove={this.props.addImagesAbove}
      addImagesBelow={this.props.addImagesBelow}
      imageSize={this.props.imageSize}
    />
  );

  render() {
    return (
      <View style={styles.container}>
        <MenuProvider>
          <FlatList
            data={this.props.imagePaths}
            renderItem={this.renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </MenuProvider>
        {this.state.showDialog && (
          <DialogComponent
            closeDialog={this.toggleShowDialog} // Prop to close Pop Up dialog
            imagesPath={this.props.imagePaths}
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
  imagePaths: state.imagesPath,
  resizeMode: state.settings.resizeMode,
  imageSize: state.settings.imageSize,
});

const mapDispatchToProps = {
  addImages,
  removeAllImages,
  movePicUp,
  movePicDown,
  deleteImage,
  addImagesAbove,
  addImagesBelow,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSaveButton: {
    marginLeft: 10,
  },
});
