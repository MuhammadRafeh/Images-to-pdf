import React from 'react';
import {View, FlatList, StyleSheet, Text, TouchableOpacity, Animated, BackHandler} from 'react-native';
import * as RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import FileViewer from 'react-native-file-viewer';
import Share from 'react-native-share';

class PdfList extends React.Component {
  state = {
    pdfInfo: [],
    selectedIds: [],
  };

  componentDidMount() {
    this.value = new Animated.Value(0);
    this.id = 0;
    this.fetchDataFromDirectory();
    this.isNavigationChanged = false;
    Animated.timing(this.value, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true
    }).start()

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidUpdate() {
    this.updateHeader();
  }

  handleBackButtonClick = () => {
    if (this.state.selectedIds.length===0) {
      return false //Going back
    } else {
      this.setState({selectedIds: []})
      return true //  Preventing hardware back button to go back
    }
  }

  formatBytes = (a, b = 2) => {
    if (a === 0) {
      return '0 Bytes';
    }
    const c = b < 0 ? 0 : b;
    const d = Math.floor(Math.log(a) / Math.log(1024));
    return `${parseFloat((a / Math.pow(1024, d)).toFixed(c))} ${
      ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][d]
    }`;
  };

  fetchDataFromDirectory = async () => {
    try {
      const data = await RNFS.readDir(
        '/storage/emulated/0/Android/data/com.ImagesToPDF/files/',
      );
      const pdfInfo = [];

      data.forEach((obj) => {
        if (obj.isFile()) {
          pdfInfo.push({
            name: obj.name,
            path: obj.path,
            size: this.formatBytes(obj.size),
            time: obj.mtime,
            id: this.id++,
          });
        }
      });

      const latest = pdfInfo.sort((a, b) => {
        const date1 = new Date(a.time);
        const date2 = new Date(b.time);

        return date2 - date1;
      });

      this.setState({pdfInfo: [...latest]});
    } catch (err) {
      // console.log(err.message, err.code);
    }
  };

  onPressDoc = async (uri, id) => {
    if (this.state.selectedIds.length === 0) {
      try {
        await FileViewer.open(uri);
      } catch (e) {
        // Error
      }
      return;
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
  };

  onLongPressDoc = (id) => {
    if (this.state.selectedIds.length === 0) {
      this.setState((prevState) => ({
        selectedIds: [...prevState.selectedIds, id],
      }));
    }
  };

  fileDeletion = () => {
    const remaining = [];

    const pathList = this.state.pdfInfo.filter((obj) => {
      if (this.state.selectedIds.includes(obj.id)) {
        return true;
      }
      remaining.push(obj);
    });
    pathList.forEach((obj) => {
      RNFS.unlink(obj.path)
        .then((res) => {
          // console.log('FILE DELETED');
        })
        .catch((err) => {
          // console.log(err.message);
        });
    });
    this.setState({selectedIds: [], pdfInfo: remaining});
  };
  updateHeader = () => {
    if (this.state.selectedIds.length > 0 && !this.isNavigationChanged) {
      // Code to set Header when something is selected

      this.props.navigation.setOptions({
        headerRight: () => (
          <View style={styles.headerContainerOnSelect}>
            <TouchableOpacity //Select All
              onPress={() => {
                const list = this.state.pdfInfo.map((obj) => obj.id);
                this.setState({selectedIds: list});
              }}
              style={styles.headerSelectAll}>
              <Icon name="md-checkmark-done-sharp" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let pathList = this.state.pdfInfo.filter((obj) => {
                  if (this.state.selectedIds.includes(obj.id)) {
                    return true;
                  }
                });

                pathList = pathList.map((obj) => `file://${obj.path}`);

                Share.open({
                  urls: pathList,
                })
                  .then((res) => {
                    // console.log(res);
                  })
                  .catch((err) => {
                    // console.log(err);
                  });
              }}
              style={styles.headerSocialIcon}>
              <Icon name="md-share-social" size={25} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.fileDeletion}
              style={styles.headerTrashIcon}>
              <Icon name="md-trash-bin" size={25} color="black" />
            </TouchableOpacity>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => {
              this.setState({selectedIds: []});
            }}>
            <Icon name="md-close" size={25} style={styles.headerCloseIcon} />
          </TouchableOpacity>
        ),
        headerStyle: {
          backgroundColor: '#C0C0C0',
        },
        headerTitle: 'Actions',
      });
      this.isNavigationChanged = true;
      return;
    }
    if (
      this.state.selectedIds.length === 0 &&
      this.isNavigationChanged === true
    ) {
      // Code to set navigation when nothing is selected

      this.props.navigation.setOptions({
        headerRight: undefined,
        headerStyle: undefined,
        headerLeft: undefined,
        headerTitle: undefined,
      });
      this.isNavigationChanged = false;
    }
  };

  renderItem = ({item}) => {
    // item will be a object
    let show = ''; // min: hours: date: just now: yesterday
    const curTime = new Date();
    const difTime = new Date(curTime - item.time);
    const minutes = difTime.getUTCMinutes();
    const hours = difTime.getUTCHours();

    show = curTime.getDate() === item.time.getDate() ? 'hoursORmin' : 'date';

    const curYear = curTime.getUTCFullYear();
    const docYear = item.time.getUTCFullYear();

    const curMonth = curTime.getUTCMonth();
    const docMonth = item.time.getUTCMonth();

    if (show === 'hoursORmin') {
      if (curYear === docYear && curMonth === docMonth) {
        // Here now we have to decide what to show, hours/min
        if (hours === 0) {
          show = minutes === 0 ? 'just now' : 'min';
        } else {
          show = 'hours';
        }
      } else {
        show = 'date';
      }
    } else {
      show =
        curYear === docYear &&
        curMonth === docMonth &&
        curTime.getUTCDate() === item.time.getUTCDate() + 1
          ? 'yesterday'
          : 'date';
    }

    const defineStyle = this.state.selectedIds.includes(item.id)
      ? {
          flexDirection: 'row',
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: '#C0C0C0',
          paddingLeft: 15,
        }
      : {
          flexDirection: 'row',
          paddingBottom: 8,
          paddingTop: 8,
          paddingLeft: 15,
        };

    return (
      <TouchableOpacity
        style={defineStyle}
        onPress={() => this.onPressDoc(item.path, item.id)}
        onLongPress={() => {
          this.onLongPressDoc(item.id);
        }}>
        <Icon name="document" size={40} color="grey" />
        <View style={styles.documentView}>
          <Text style={styles.pdfName}>{item.name}</Text>
          {show === 'min' && (
            <Text style={styles.belowNameRow}>
              {minutes} minutes ago - {item.size}
            </Text>
          )}
          {show === 'just now' && (
            <Text style={styles.belowNameRow}>Just now - {item.size}</Text>
          )}
          {show === 'hours' && (
            <Text style={styles.belowNameRow}>
              {hours} hours ago - {item.size}
            </Text>
          )}
          {show === 'yesterday' && (
            <Text style={styles.belowNameRow}>Yesterday - {item.size}</Text>
          )}
          {show === 'date' && (
            <Text style={styles.belowNameRow}>
              {item.time.getUTCDate()}/{docMonth + 1}/{docYear} - {item.size}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    if (this.state.pdfInfo.length === 0) {
      return (
        <View style={styles.emptyScreenView}>
          <Icon name="document" size={40} color="grey" />
          <Text style={styles.nothingDocsCreatedYet}>Nothing Docs Created Yet.</Text>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.pdfInfo}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.id.toString()}
          extraData={this.state.selectedIds}
          ListEmptyComponent={<Text></Text>}
          ItemSeparatorComponent={() => (
            <Animated.View
              style={{
                height: 2,
                backgroundColor: "#f5f5f5",
                marginLeft: 10,
                marginRight: 10,
                opacity: this.value
              }}
            />
          )}
        />
        {
          this.state.pdfInfo.length <= 3 &&
          <View>
            <Text style={{color: 'black', textAlign: 'center', color: 'grey', marginBottom: 1, fontWeight: 'bold'}}>Press and Hold for more Actions</Text>
            <Text style={{color: 'black', textAlign: 'center', marginBottom: 50, color: 'grey', fontWeight: 'bold'}}>Tap for View</Text>
          </View>
        }
      </View>
    );
  }
}
//   /storage/emulated/0/Android/data/com.practiceProject/files/
export default PdfList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    marginRight: 18,
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
  nothingDocsCreatedYet: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'grey',
    marginTop: 5
  },
  emptyScreenView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    flex: 1
  }
});
