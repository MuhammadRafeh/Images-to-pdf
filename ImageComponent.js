import React from 'react';
import { Image, StyleSheet, ScrollView } from 'react-native';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

//Return React Native's Image Component
class ImageComponent extends React.Component {
  state = {
    isMenuVisible: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.imageObj.uri !== this.props.imageObj.uri
  }

  toggleMenuVisible = () => {
    this.setState({isMenuVisible: true})
    console.log(23)
  }

  handleDelete = () => {
    this.props.removeImage(this.props.imageObj.id)
  }

  handleMoveUp = () => {
    this.props.movePicToUp(this.props.imageObj.id)
  }

  handleMoveDown = () => {
    this.props.movePicToDown(this.props.imageObj.id)
  }

  render() {
    return(
        <Menu>
          <MenuTrigger>
              <Image 
                style={styles.image} 
                resizeMode={'cover'}
                source={{
                  uri: this.props.imageObj.uri
              }}/>
          </MenuTrigger>
          <MenuOptions>
            <MenuOption text='Delete' onSelect={this.handleDelete}/>
            <MenuOption text='Move Up' onSelect={this.handleMoveUp}/>
            <MenuOption text='Move Down' onSelect={this.handleMoveDown}/>
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
