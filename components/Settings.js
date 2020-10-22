import React from 'react'
import { View, StyleSheet } from 'react-native'

import { Divider, Slider, Text, Button } from 'react-native-elements';

import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';

import propTypes from 'prop-types'

import { connect } from 'react-redux'
import { updateQuality, updateResizeMode } from '../Redux/actions'

class Settings extends React.PureComponent {
	static propTypes = {
		updateQuality: propTypes.func,
		quality: propTypes.any,
		updateResizeMode: propTypes.func,
		resizeMode: propTypes.string
	}

	state = {
		pdfQuality: this.props.quality, //default
		imageSize: 2,
		resizeMode: this.props.resizeMode, //string
	}

	handleHeaderButtonPressed = () => {
		if (this.state.pdfQuality!==this.props.quality){
			this.props.updateQuality(this.state.pdfQuality)
		}

		if (this.state.resizeMode!==this.props.resizeMode){
			this.props.updateResizeMode(this.state.resizeMode)
		}
	}

	componentDidMount() {
		this.props.navigation.setOptions({
    		headerRight: () => (
        		<Button type='clear' onPress={this.handleHeaderButtonPressed} title="Save" />)
    	})
	}

	handleOnPDFQualityChange = value => {
		if (value.toString().length===3) {
			this.setState({ pdfQuality: value })			
		} else {
			this.setState({ pdfQuality: parseFloat(value.toString().slice(0, 3)) })
		}
	}

	handleImageSizeChange = value => {
		this.setState({imageSize: value})
	}

	handleRadioButtonPress = val => {
		this.setState({resizeMode: val})
	}

	render() {
		const radio_props = [
		  {label: 'Full               ', value: 'contain' },
		  {label: 'Short', value: 'cover' }
		];
		let initial = 0
		if (this.state.resizeMode==='cover'){
			initial = 1
		}
		return(
			<View style={styles.container}>
				<Text h4>PDF Quality</Text>
				<Text style={{textAlign: 'right'}}>{this.state.pdfQuality * 100}%</Text>
				<Slider
		          value={this.state.pdfQuality}
		          onValueChange={this.handleOnPDFQualityChange}
		          maximumValue={0.9}
		          minimumValue={0.1}
		          step={.1}
		          thumbTintColor={'#C0C0C0'}
		          style={{marginHorizontal: 3}}
        		/>
        		<Divider style={{ backgroundColor: 'black', marginVertical: 10 }} />
        		<Text h4>Images Size</Text>
				<Text style={{textAlign: 'right'}}>{this.state.imageSize * 10}%</Text>
        		<Slider
		          value={this.state.imageSize}
		          onValueChange={this.handleImageSizeChange}
		          maximumValue={10}
		          minimumValue={1}
		          step={1}
		          thumbTintColor={'#C0C0C0'}
		          style={{marginHorizontal: 3}}
        		/>
        		<Divider style={{ backgroundColor: 'black', marginVertical: 10 }} />
        		<Text h4>Image Display</Text>
        		<View style={{ alignItems: 'center', marginTop: 8 }}>
        		<RadioForm
				  radio_props={radio_props}
				  initial={initial}
				  formHorizontal={true}
				  onPress={this.handleRadioButtonPress}
				/>
        		</View>
        		<Divider style={{ backgroundColor: 'black', marginVertical: 10 }} />
			</View>
		)
	}
}

const mapStateToProps = state => ({
	quality: state.settings.quality,
	resizeMode: state.settings.resizeMode
})

const mapDispatchToProps = {
	updateQuality: updateQuality,
	updateResizeMode: updateResizeMode
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch', 
    justifyContent: 'center',
    marginHorizontal: 10
  }
});
