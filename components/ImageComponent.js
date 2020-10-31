import React from 'react';
import {Image, Dimensions} from 'react-native';
import propTypes from 'prop-types';
import FileViewer from 'react-native-file-viewer';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import {openGalleryApi} from './api';

class ImageComponent extends React.Component {
  static propTypes = {
    deleteImage: propTypes.func,
    movePicUp: propTypes.func,
    movePicDown: propTypes.func,
    imageObj: propTypes.object,
    addImagesAbove: propTypes.func,
    addImagesBelow: propTypes.func,
    imageSize: propTypes.number,
    resizeMode: propTypes.string,
  };

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.imageObj.id !== this.props.imageObj.id ||
      nextProps.imageSize !== this.props.imageSize ||
      this.props.resizeMode !== nextProps.resizeMode
    );
  }

  handleDelete = () => {
    this.props.deleteImage(this.props.imageObj.id);
  };

  handleMoveUp = () => {
    this.props.movePicUp(this.props.imageObj.id);
  };

  handleMoveDown = () => {
    this.props.movePicDown(this.props.imageObj.id);
  };

  handleViewImage = async () => {
    try {
      await FileViewer.open(this.props.imageObj.uri);
    } catch (e) {
      // Error
    }
  };

  handleAddImageAbove = async () => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesAbove({id: this.props.imageObj.id, listOfUri});
  };

  handleAddImageBelow = async () => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesBelow({id: this.props.imageObj.id, listOfUri});
  };

  render() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight =
      (Dimensions.get('window').height * this.props.imageSize) / 100;

    const imageStyle = {
      width: windowWidth,
      height: windowHeight,
      marginBottom: 13,
    };

    return (
      <Menu>
        <MenuTrigger>
          <Image
            style={imageStyle}
            resizeMode={this.props.resizeMode}
            source={{
              uri: this.props.imageObj.uri,
            }}
          />
        </MenuTrigger>
        <MenuOptions>
          <MenuOption text="View" onSelect={this.handleViewImage} />
          <MenuOption text="Delete" onSelect={this.handleDelete} />
          <MenuOption text="Move Up" onSelect={this.handleMoveUp} />
          <MenuOption text="Move Down" onSelect={this.handleMoveDown} />
          <MenuOption text="Add Above" onSelect={this.handleAddImageAbove} />
          <MenuOption text="Add Below" onSelect={this.handleAddImageBelow} />
        </MenuOptions>
      </Menu>
    );
  }
}

export default ImageComponent;
