import React from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';

import { Dimensions } from 'react-native';

import propTypes from 'prop-types'

import FileViewer from "react-native-file-viewer";

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

  }

  state = {
    isMenuVisible: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.imageObj.uri !== this.props.imageObj.uri || nextProps.resizeMode !== this.props.resizeMode
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

  handleAddImageAbove = () => {
    this.props.addImagesAbove()
  }

  handleAddImageBelow = () => {
    this.props.addImagesBelow()
  }


  render() {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    return(
        <Menu>
          <MenuTrigger>
              <Image
                style={{
                  width: windowWidth,
                  height: 200,
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
