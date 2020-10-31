import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Divider, Slider, Text, Button} from 'react-native-elements';
import RadioForm from 'react-native-simple-radio-button';
import propTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  updateQuality,
  updateResizeMode,
  updateImageSize,
} from '../Redux/actions';

class Settings extends React.PureComponent {
  static propTypes = {
    updateQuality: propTypes.func,
    quality: propTypes.any,
    updateResizeMode: propTypes.func,
    resizeMode: propTypes.string,
  };

  state = {
    pdfQuality: this.props.quality, // default
    imageSize: this.props.imageSize,
    resizeMode: this.props.resizeMode, // string
  };

  componentDidMount() {
    this.headerRightButton();
  }

  handleHeaderButtonPressed = () => {
    if (this.state.pdfQuality !== this.props.quality) {
      this.props.updateQuality(this.state.pdfQuality);
    }

    if (this.state.resizeMode !== this.props.resizeMode) {
      this.props.updateResizeMode(this.state.resizeMode);
    }

    if (this.state.imageSize !== this.props.imageSize) {
      this.props.updateImageSize(this.state.imageSize);
    }
  };

  headerRightButton = () => {
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          type="clear"
          onPress={this.handleHeaderButtonPressed}
          title="Save"
        />
      ),
    });
  };

  handleOnPDFQualityChange = (value) => {
    if (value.toString().length === 3) {
      this.setState({pdfQuality: value});
    } else {
      this.setState({pdfQuality: parseFloat(value.toString().slice(0, 3))});
    }
  };

  handleImageSizeChange = (value) => {
    this.setState({imageSize: value});
  };

  handleRadioButtonPress = (val) => {
    this.setState({resizeMode: val});
  };

  render() {
    const radio_props = [
      {label: 'Full (Slow)              ', value: 'contain'},
      {label: 'Short (Fast)', value: 'cover'},
    ];
    let initial = 0;
    if (this.state.resizeMode === 'cover') {
      initial = 1;
    }
    return (
      <View style={styles.container}>
        <Text h4>PDF Quality</Text>
        <Text style={styles.pdfQuality}>{this.state.pdfQuality * 100} %</Text>
        <Slider
          value={this.state.pdfQuality}
          onValueChange={this.handleOnPDFQualityChange}
          maximumValue={0.9}
          minimumValue={0.1}
          step={0.1}
          thumbTintColor="#C0C0C0"
          style={styles.pdfQualitySlider}
        />
        <Divider style={styles.divider} />
        <Text h4>Images Size</Text>
        <Text style={styles.imageSize}>{this.state.imageSize} %</Text>
        <Slider
          value={this.state.imageSize}
          onValueChange={this.handleImageSizeChange}
          maximumValue={100}
          minimumValue={10}
          step={10}
          thumbTintColor="#C0C0C0"
          style={styles.imageSizeSlider}
        />
        <Divider style={styles.divider} />
        <Text h4>Image Display</Text>
        <View style={styles.radioFormView}>
          <RadioForm
            radio_props={radio_props}
            initial={initial}
            formHorizontal
            onPress={this.handleRadioButtonPress}
          />
        </View>
        <Divider style={styles.divider} />
        <Text h4>PDF Storage Location</Text>
        <Text style={styles.pdfStorageText}>
          Interal Storage: Android/data/com.ImagesToPDF/files/
        </Text>
        <Divider style={styles.divider} />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  quality: state.settings.quality,
  resizeMode: state.settings.resizeMode,
  imageSize: state.settings.imageSize,
});

const mapDispatchToProps = {
  updateQuality,
  updateResizeMode,
  updateImageSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginHorizontal: 10,
    paddingTop: 5,
  },
  pdfQuality: {
    textAlign: 'right',
  },
  pdfQualitySlider: {
    marginHorizontal: 3,
  },
  divider: {
    backgroundColor: 'black',
    marginVertical: 10,
  },
  imageSize: {
    textAlign: 'right',
  },
  imageSizeSlider: {
    marginHorizontal: 3,
  },
  radioFormView: {
    alignItems: 'center',
    marginTop: 8,
  },
  pdfStorageText: {
    paddingTop: 8,
  },
});
