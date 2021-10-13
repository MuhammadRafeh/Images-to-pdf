import React from 'react';
import {
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  BackHandler,
  Alert,
  Text
} from 'react-native';
import propTypes from 'prop-types';
import FileViewer from 'react-native-file-viewer';
import { connect } from 'react-redux';

const AddButtons = React.memo((props) => (
  <TouchableOpacity onPress={props.onPress}>
    <View style={{ width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Icon name={props.iconName} size={35} color='blue' />
      </View>
      <View style={{ position: 'absolute', left: 1, top: 2 }}>
        <Icon name='md-add-circle-sharp' color='black' size={23} />
      </View>
    </View>
  </TouchableOpacity>
))

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

import Icon from 'react-native-vector-icons/Ionicons';

import {
  addImages,
  movePicDown,
  movePicUp,
  addImagesAbove,
  addImagesBelow,
  removeImages
} from '../Redux/actions';

import { openGalleryApi } from './api';

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
    this.focusedIndex = -1;
    this.isNavigationChanged = false;
    this.resetHeader = true;
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
    if (this.state.selectedIds.length === 0) {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        {
          text: "YES", onPress: () => {
            this.props.removeImages(true);
            BackHandler.exitApp()
          }
        }
      ]);
      return true;
      // return false //Going back
    } else {
      this.setState({ selectedIds: [] })
      return true //  Preventing hardware back button to go back
    }
  }

  updateHeader = () => { // ------------------------------------------------------UPDATE HEADER
    if (this.state.selectedIds.length === 1 && !this.isNavigationChanged) {
      // Code to set Header when just 1 item is selected --------------------------------------------

      this.props.navigation.setOptions({

        headerRight: () => (
          <View style={styles.headerContainerOnSelect}>


            <TouchableOpacity //up arrow key --------------------------------------------------------
              onPress={this.handleMoveUp}
              style={styles.headerRightStyle}>
              <Icon name="md-arrow-up" size={25} color="black" />
            </TouchableOpacity>

            <TouchableOpacity //down arrow key ------------------------------------------------------
              onPress={this.handleMoveDown}
              style={styles.headerRightStyle}>
              <Icon name="md-arrow-down" size={25} color="black" />
            </TouchableOpacity>

            <TouchableOpacity //Delete dustbin ---------------------------------------------------------
              onPress={() => {
                this.props.removeImages(this.state.selectedIds);
                this.setState({ selectedIds: [] })
              }}
              style={styles.headerRightStyle}>
              <Icon name="md-trash-bin" size={25} color="black" />
            </TouchableOpacity>

            <View style={styles.headerRightStyle}>
              <Menu>
                <MenuTrigger>
                  <Icon name="ellipsis-vertical" size={25} color="black" />
                </MenuTrigger>
                <MenuOptions>
                  <View style={{ backgroundColor: 'grey', padding: 8 }}>
                    <MenuOption onSelect={this.handleAddImageAbove}>
                      <Text style={{ color: 'white', fontSize: 18 }}>Add Images Above</Text>
                    </MenuOption>
                  </View>
                  <View style={{ height: 1, backgroundColor: 'grey' }} />
                  <View style={{ backgroundColor: 'grey', padding: 8 }}>
                    <MenuOption onSelect={this.handleAddImageBelow}>
                      <Text style={{ color: 'white', fontSize: 18 }}>Add Images Below</Text>
                    </MenuOption>
                  </View>
                </MenuOptions>
              </Menu>
            </View>

          </View>
        ),
        headerLeft: () => (
          <View style={styles.headerContainerOnSelect}>

            <TouchableOpacity //Cross ------------------------------------------------------------
              onPress={() => {
                this.setState({ selectedIds: [] });
              }}>
              <Icon name="md-close" size={25} style={styles.headerCloseIcon} />
            </TouchableOpacity>

            <TouchableOpacity //Select All ---------------------------------------------------------
              onPress={() => {
                const list = this.props.imagePaths.map(obj => obj.id);
                this.setState({ selectedIds: list });
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
      this.resetHeader = false
      console.log('top')
      return;
    }

    if (this.state.selectedIds.length > 1 && this.isNavigationChanged) {
      //Code to set header when more then 1 item is selected -------------------------------------------------------
      this.props.navigation.setOptions({

        headerRight: () => (
          <View style={styles.headerContainerOnSelect}>

            <TouchableOpacity //Delete dustbin ---------------------------------------------------------
              onPress={() => {
                this.props.removeImages(this.state.selectedIds);
                this.setState({ selectedIds: [] })
              }}
              style={styles.headerRightStyle}>
              <Icon name="md-trash-bin" size={25} color="black" />
            </TouchableOpacity>

          </View>
        )
      });
      this.isNavigationChanged = false;
      console.log('medium')
      return;
    }

    if (
      this.state.selectedIds.length === 0 &&
      !this.resetHeader
    ) {
      // Code to set navigation when nothing is selected ----------------------------------------------

      this.props.navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity // Setting ----------------------------------------------------------------
            style={styles.settings}
            onPress={() => {
              this.props.navigation.navigate('Settings');
            }}>
            <Icon name='md-settings' size={25} color='blue' />
          </TouchableOpacity>),
        headerStyle: undefined,
        headerLeft: undefined,
        headerTitle: undefined,
      });
      this.resetHeader = true;
      this.isNavigationChanged = false;
      console.log('last')
    }
  }

  handleMoveUp = () => {
    this.props.movePicUp(this.state.selectedIds[0]);
    const newFocused = this.focusedIndex - 1;
    this.ref.scrollToIndex({animated: true, index: newFocused, viewPosition: 0.5})
    this.focusedIndex = newFocused
  };

  handleMoveDown = () => {
    this.props.movePicDown(this.state.selectedIds[0]);
    const newFocused = this.focusedIndex + 1;
    this.ref.scrollToIndex({animated: true, index: newFocused, viewPosition: 0.5})
    this.focusedIndex = newFocused
  };

  handleViewImage = async (uri) => {
    try {
      await FileViewer.open(uri);
    } catch (e) {
      // Error
    }
  };

  handleAddImageAbove = async (id = false) => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesAbove({ id: id ? id: this.state.selectedIds[0], listOfUri });
  };

  handleAddImageBelow = async (id = false) => {
    const listOfUri = await openGalleryApi();
    if (!listOfUri) {
      return;
    } // if listOfUri is false then return simply
    this.props.addImagesBelow({ id: id ? id : this.state.selectedIds[0], listOfUri });
  };

  handleOnImagePress = async (id, uri, index) => {
    this.focusedIndex = index;
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
      this.setState({ selectedIds: list });
    }
  }

  handleOnImageLongPress = (id, index) => {
    if (this.state.selectedIds.length === 0) {
      this.setState({selectedIds: [id]});
      this.focusedIndex = index;
    }
  }

  renderItem = ({ item, index }) => {
    const windowWidth = Dimensions.get('window').width;
    const windowHeight =
      (Dimensions.get('window').height * this.props.imageSize) / 100;

    const imageStyle = this.state.selectedIds.includes(item.id) ?
      {
        width: windowWidth,
        height: windowHeight,
        marginBottom: 13,
        borderRadius: windowWidth / 2,
        overlayColor: 'grey',
        backgroundColor: 'grey'
      } : {
        width: windowWidth,
        height: windowHeight,
        marginBottom: 13,
      };
    console.log(item.uri)

    return (
      <>
        {/* {
          index == 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 1 }}>
              <AddButtons iconName={'ios-images'} onPress={this.handleAddImageAbove.bind(null, item.id)} />
              <AddButtons iconName={'md-camera-sharp'} />
            </View>
          )
        } */}
        <TouchableOpacity
          onPress={() => { this.handleOnImagePress(item.id, item.uri, index) }}
          onLongPress={() => { this.handleOnImageLongPress(item.id, index) }}
        >
          <Image
            style={imageStyle}
            resizeMode={this.props.resizeMode}
            source={{
              uri: item.uri
            }}
          />
        </TouchableOpacity>
        <View style={{ position: 'absolute', width: 30, height: 30, borderRadius: 30, justifyContent: 'center', alignItems: 'center', top: 4, left: 5, backgroundColor: 'black' }}>
          <Text style={{ color: 'white' }}>{index + 1}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 1 }}>
          <AddButtons iconName={'ios-images'} onPress={this.handleAddImageBelow.bind(null, item.id)} />
          <AddButtons iconName={'md-camera-sharp'} />
        </View>
      </>
    )
  };

  render() {

    return (
      <FlatList
        data={this.props.imagePaths}
        renderItem={this.renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={this.state.selectedIds}
        ref={ref => this.ref = ref}
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
  headerContainerOnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerSelectAll: {
    marginLeft: 18,
  },
  headerRightStyle: {
    marginRight: 15,
  },
  headerCloseIcon: {
    marginLeft: 12,
    color: 'black',
  },
  settings: {
    padding: 8,
    marginRight: 15
  }
});
