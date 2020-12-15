import React from 'react';
import {Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  BackHandler,
  Alert } from 'react-native';
import propTypes from 'prop-types';
import FileViewer from 'react-native-file-viewer';
import {connect} from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';

import {Button} from 'react-native-elements';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  addImages,
  movePicDown,
  movePicUp,
  addImagesAbove,
  addImagesBelow,
  removeImages
} from '../Redux/actions';

import {openGalleryApi} from './api';

class RenderImages extends React.Component {
  static propTypes = {
    movePicUp: propTypes.func,
    movePicDown: propTypes.func,
    addImagesAbove: propTypes.func,
    addImagesBelow: propTypes.func,
    imageSize: propTypes.number,
    resizeMode: propTypes.string,
    toggleButtonVisible: propTypes.func,
    isButtonVisible: propTypes.bool,
    navigation: propTypes.any
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.imagePaths !== this.props.imagePaths ||
      nextState.selectedIds !== this.state.selectedIds ||
      nextProps.resizeMode !== this.props.resizeMode ||
      nextProps.imageSize !== this.props.imageSize
    );
  }

  state = {
    selectedIds: []
  }

  componentDidMount() {
    this.isNavigationChanged = false;
    // BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.focusListener = this.props.navigation.addListener('focus', () => {
      console.log('focus')
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    });

    this.blurListener = this.props.navigation.addListener('blur', () => {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
      console.log('Blur')
    });
  }

  componentDidUpdate() {
    this.updateHeader();
    if (this.state.selectedIds.length === 0 && !this.props.isButtonVisible) { //Here we are mounting the button
      this.props.toggleButtonVisible(true);
      console.log('visible')
    }
    else if (this.state.selectedIds.length != 0 && this.props.isButtonVisible) { //here we are hiding button
      this.props.toggleButtonVisible(false);
      console.log('hide')
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.focusListener();
    this.blurListener();
  }

  handleBackButtonClick = () => {
    if (this.state.selectedIds.length===0) {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel"
      },
      { text: "YES", onPress: () => {
        this.props.removeImages(true);
        BackHandler.exitApp()} }
    ]);
    return true;
      // return false //Going back
    } else {
      this.setState({selectedIds: []})
      return true //  Preventing hardware back button to go back
    }
  }

  updateHeader = () => {
    if (this.state.selectedIds.length > 0 && !this.isNavigationChanged) {
      // Code to set Header when something is selected --------------------------------------------

      this.props.navigation.setOptions({

        headerRight: () => (
          <View style={styles.headerContainerOnSelect}>

            <TouchableOpacity //up arrow key --------------------------------------------------------
              onPress={this.handleMoveUp}
              style={styles.headerUpKey}>
              <Icon name="md-arrow-up" size={25} color="black" />
            </TouchableOpacity>

            <TouchableOpacity //down arrow key ------------------------------------------------------
              onPress={() => {

              }}
              style={styles.headerDownKey}>
              <Icon name="md-arrow-down" size={25} color="black" />
            </TouchableOpacity>

            <TouchableOpacity //Delete dustbin ---------------------------------------------------------
              onPress={() => {
                  this.props.removeImages(this.state.selectedIds);
                  this.setState({selectedIds: []})
              }}
              style={styles.headerTrashIcon}>
              <Icon name="md-trash-bin" size={25} color="black" />
            </TouchableOpacity>

          </View>
        ),
        headerLeft: () => (
          <View style={styles.headerContainerOnSelect}>

            <TouchableOpacity //Cross ------------------------------------------------------------
              onPress={() => {
                this.setState({selectedIds: []});
              }}>
              <Icon name="md-close" size={25} style={styles.headerCloseIcon} />
            </TouchableOpacity>

            <TouchableOpacity //Select All ---------------------------------------------------------
              onPress={() => {
                const list = this.props.imagePaths.map(obj => obj.id);
                this.setState({selectedIds: list});
              }}>
              <Icon name="md-checkmark-done-sharp" size={25} style={styles.headerSelectAll} />
            </TouchableOpacity>

          </View>
        ),
        headerStyle: {
          backgroundColor: '#C0C0C0',
        },
        headerTitle: '',
      });
      this.isNavigationChanged = true;
      return;
    }

    if (
      this.state.selectedIds.length === 0 &&
      this.isNavigationChanged === true
    ) {
      // Code to set navigation when nothing is selected ----------------------------------------------

      this.props.navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity // Setting ----------------------------------------------------------------
            style={styles.settings}
            onPress={() => {
              this.props.navigation.navigate('Settings');
            }}>
            <Icon name='md-settings' size={25} color='blue'/>
          </TouchableOpacity>),
        headerStyle: undefined,
        headerLeft: undefined,
        headerTitle: undefined,
      });
      this.isNavigationChanged = false;
    }
  }

  handleMoveUp = id => {
    this.props.movePicUp(id);
  };

  handleMoveDown = id => {
    this.props.movePicDown(id);
  };

  handleViewImage = async (uri) => {
    try {
      await FileViewer.open(uri);
    } catch (e) {
      // Error
    }
  };

  handleAddImageAbove = async (id) => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesAbove({id, listOfUri});
  };

  handleAddImageBelow = async (id) => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesBelow({id, listOfUri});
  };

  handleOnImagePress = async (id, uri) => {
    if (this.state.selectedIds.length === 0) {
      await this.handleViewImage(uri);
      return
    }

    if (!this.state.selectedIds.includes(id)) {
      // if id not exist in list
      this.setState((prevState) => ({
        selectedIds: [...prevState.selectedIds, id],
      }));
    } else {
      // In this section below we want to unselect this id
      const list = [...this.state.selectedIds];
      list.splice(this.state.selectedIds.indexOf(id), 1);
      this.setState({selectedIds: list});
    }
  }

  handleOnImageLongPress = id => {
    if (this.state.selectedIds.length === 0) {
      this.setState((prevState) => ({
        selectedIds: [...prevState.selectedIds, id]
      }));
    }
  }

  renderItem = ({item}) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight =
      (Dimensions.get('window').height * this.props.imageSize) / 100;

    const imageStyle = this.state.selectedIds.includes(item.id) ?
      {
        width: windowWidth,
        height: windowHeight,
        marginBottom: 13,
        borderRadius: windowWidth/2,
        overlayColor: 'grey',
        backgroundColor: 'grey'
      } : {
        width: windowWidth,
        height: windowHeight,
        marginBottom: 13,
      } ;
      console.log(item.uri)

    return(
      <TouchableOpacity
        onPress={() => {this.handleOnImagePress(item.id, item.uri)}}
        onLongPress={() => {this.handleOnImageLongPress(item.id)}}
      >
        <Image
          style={imageStyle}
          resizeMode={this.props.resizeMode}
          source={{
            uri: item.uri
          }}
        />
      </TouchableOpacity>
    )
  };

  render() {

    return (
      <FlatList
        data={this.props.imagePaths}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={this.state.selectedIds}
      />
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
  removeImages,
  movePicUp,
  movePicDown,
  addImagesAbove,
  addImagesBelow,
};

export default connect(mapStateToProps, mapDispatchToProps)(RenderImages);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdfName: {
    marginLeft: 10,
    fontWeight: 'bold',
    paddingTop: 2,
    fontSize: 15,
  },
  belowNameRow: {
    marginLeft: 10,
    paddingTop: 2,
  },
  headerContainerOnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSelectAll: {
    marginLeft: 18,
  },
  headerSocialIcon: {
    marginRight: 20,
  },
  headerTrashIcon: {
    marginRight: 15,
  },
  headerCloseIcon: {
    marginLeft: 12,
    color: 'black',
  },
  documentView: {
    flexDirection: 'column',
  },
  noDataView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settings: {
    padding: 8,
    marginRight: 15
  },
  headerDownKey: {
    marginRight: 15,
  },
  headerUpKey: {
    marginRight: 15,
  }
});
