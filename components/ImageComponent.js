import React from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';

import { Dimensions } from 'react-native';

import propTypes from 'prop-types'

import FileViewer from "react-native-file-viewer";

import { openGalleryApi } from './api'

// import  {open}

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

//Return React Native's Image Component
class ImageComponent extends React.Component {
  static propTypes = {
    deleteImage: propTypes.func,
    movePicUp: propTypes.func,
    movePicDown: propTypes.func,
    imageObj: propTypes.object,
    addImagesAbove: propTypes.func,
    addImagesBelow: propTypes.func,
    imageSize: propTypes.number
  }

  state = {
    isMenuVisible: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.imageObj.id !== this.props.imageObj.id || nextProps.imageSize !== this.props.imageSize || this.props.resizeMode || nextProps.resizeMode
  }

  toggleMenuVisible = () => {
    this.setState({isMenuVisible: true})
  }

  handleDelete = () => {
    this.props.deleteImage(this.props.imageObj.id)
  }

  handleMoveUp = () => {
    this.props.movePicUp(this.props.imageObj.id)
  }

  handleMoveDown = () => {
    this.props.movePicDown(this.props.imageObj.id)
  }

  handleViewImage = async () => {
    try{
      await FileViewer.open(this.props.imageObj.uri);
    } catch(e) {
      // Error
    }
  }

  handleAddImageAbove = async () => {
    const listOfUri = await openGalleryApi()
    if (!listOfUri) return //if listOfUri is false then return simply
    this.props.addImagesAbove({id: this.props.imageObj.id, listOfUri})
  }

  handleAddImageBelow = async () => {
    const listOfUri = await openGalleryApi()
    if (!listOfUri) return //if listOfUri is false then return simply
    this.props.addImagesBelow({id: this.props.imageObj.id, listOfUri})
  }


  render() {
    let windowWidth = Dimensions.get('window').width;
    let windowHeight = (Dimensions.get('window').height*this.props.imageSize)/100;
    // Image.getSize(this.props.imageObj.uri, (width, height) => {
    //   if (width < windowWidth)
    //     windowWidth = width
    //   if (height < windowHeight)
    //     windowHeight = height
    // });
    return(
        <Menu>
          <MenuTrigger>
              <Image
                style={{
                  width: windowWidth,
                  height: windowHeight,
                  marginBottom: 13
                }}
                resizeMode={this.props.resizeMode}
                source={{
                  uri: this.props.imageObj.uri
              }}/>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption text='View' onSelect={this.handleViewImage}/>
            <MenuOption text='Delete' onSelect={this.handleDelete}/>
            <MenuOption text='Move Up' onSelect={this.handleMoveUp}/>
            <MenuOption text='Move Down' onSelect={this.handleMoveDown}/>
            <MenuOption text='Add Above' onSelect={this.handleAddImageAbove}/>
            <MenuOption text='Add Below' onSelect={this.handleAddImageBelow}/>
          </MenuOptions>
        </Menu>
    )
  }
}

export default ImageComponent

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginBottom: 13
  }
});
