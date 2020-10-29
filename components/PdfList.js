import React from 'react'
import { View, FlatList, StyleSheet, Text, TouchableOpacity, TouchableHighlight } from 'react-native'
import * as RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons'

import { Button, Divider } from 'react-native-elements';
import FileViewer from "react-native-file-viewer";

class PdfList extends React.Component {

	state = {
		pdfInfo: [],
		selectedIds: [],
		isNavigationChanged: false
	}

	formatBytes = (a,b=2) => {
		if(0===a) return "0 Bytes"
		const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024))
		return parseFloat((a/Math.pow(1024,d)).toFixed(c))+" "+["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"][d]
	}

	fetchDataFromDirectory = async () => {
		try{
			const data = await RNFS.readDir("/storage/emulated/0/Android/data/com.ImagesToPDF/files/")
			const pdfInfo = []

			data.forEach(obj => {
				if (obj.isFile()) {
					pdfInfo.push({name: obj.name, path: obj.path, size: this.formatBytes(obj.size), time: obj.mtime, id: this.id++})
				}
			})

			const latest = pdfInfo.sort((a, b) => {
				const date1 = new Date(a.time)
				const date2 = new Date(b.time)

				return date2 - date1
			})

			this.setState({pdfInfo: [...latest]})

		} catch(err) {
			console.log(err.message, err.code);
		}
	}

	onPressDoc = async (uri, id) => {

		if (this.state.selectedIds.length === 0){
	    	 try{
	      		await FileViewer.open(uri);
	    	} catch(e) {
	     	 // Error
	    	}
	    	return
	    }
		
	    if (!this.state.selectedIds.includes(id)){ //if id not exist in list
	    	this.setState(prevState => ({
				selectedIds: [...prevState.selectedIds, id]
			}))
	    } else {
	    	const list = [...this.state.selectedIds]
	    	list.splice(this.state.selectedIds.indexOf(id), 1);
	    	this.setState({selectedIds: list})
	    }

	}

	onLongPressDoc = id => {
		if (this.state.selectedIds.length === 0) {
			this.setState(prevState => ({
				selectedIds: [...prevState.selectedIds, id]
			}))
		}
	}

	componentDidUpdate(){
		if (this.state.selectedIds.length > 0 && !this.state.isNavigationChanged){
			//Code to set Header when something is selected

			this.props.navigation.setOptions({
	    		headerRight: () => (
	    			<View style={{flexDirection: 'row', alignItems: 'center'}}> 
	    				<TouchableOpacity
		        			onPress={() => {
		        				const list = this.state.pdfInfo.map(obj => obj.id)
		        				this.setState({selectedIds: list})
		        			}}
		        			style={{marginRight:18}}
						>
		        			<Icon name="md-checkmark-done-sharp" size={25} color="black"/>
		        		</TouchableOpacity>
		        		<TouchableOpacity
		        			onPress={() => console.log(1)}
		        			style={{marginRight:20}}
						>
		        			<Icon name="md-share-social" size={25} color="black"/>
		        		</TouchableOpacity>
		        		<TouchableOpacity 
		        			onPress={() => console.log(1)}
		        			style={{marginRight:15}}
						>
		        			<Icon name="md-trash-bin" size={25} color="black"/>
		        		</TouchableOpacity>
	    			</View>
	    		),
	    		headerLeft: () => (
	    			<TouchableOpacity onPress={() => {this.setState({selectedIds: []})}}>
	    				<Icon name="md-close" size={25} style={{marginLeft: 12, color: 'black'}}/>
	    			</TouchableOpacity>
	    		),
	    		headerStyle: {
		            backgroundColor: '#C0C0C0',
		        },
		        headerTintColor: 'black',
		        headerTitle: 'Actions'
    		})
    		this.setState({isNavigationChanged: true})
    		return
		}
		if (this.state.selectedIds.length === 0 && this.state.isNavigationChanged === true) {
			//Code to set navigation when nothing is selected

			this.props.navigation.setOptions({
	    		headerRight: () => (<View />),
	    		headerStyle: {
		            backgroundColor: 'white',
		        },
		        headerLeft: (props) => (
		        	<TouchableOpacity {...props}>
		        		<Icon name='md-arrow-back' size={25} style={{marginLeft: 14}} color={'black'}/>
		        	</TouchableOpacity>
		        ),
		        headerTitle: "Created PDF's",
		        headerTintColor: 'black'
    		})
    		this.setState({isNavigationChanged: false})
		}

	}

	renderItem = ({ item }) => { //item will be a object
		let show = '' // min: hours: date: just now: yesterday
		const curTime = new Date()
		const difTime = new Date(curTime - item.time)
		const minutes = difTime.getUTCMinutes()
		const hours = difTime.getUTCHours()

		show = curTime.getDate() === item.time.getDate() ? 'hoursORmin' : 'date'

		const curYear = curTime.getUTCFullYear()
		const docYear = item.time.getUTCFullYear()

		const curMonth = curTime.getUTCMonth()
		const docMonth = item.time.getUTCMonth()

		if (show === 'hoursORmin') {
			if (curYear=== docYear && curMonth === docMonth){
				//Here now we have to decide what to show, hours/min
				if (hours === 0){
					show = minutes === 0 ? 'just now' : 'min'
				} else {
					show = 'hours'
				}
			} else {
				show = 'date'
			}
		} else {
			// show = 'date'
			show = (curYear === docYear && curMonth === docMonth && difTime.getUTCDate() === 1) && 'yesterday'
		}


		const defineStyle = this.state.selectedIds.includes(item.id) ? {flexDirection: 'row', paddingBottom: 8, paddingTop: 8, backgroundColor: '#C0C0C0', paddingLeft: 15} : {flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 15}

		return ( 
			<TouchableOpacity
				style={defineStyle}
				onPress={() => this.onPressDoc(item.path, item.id)}
				onLongPress={() => {this.onLongPressDoc(item.id)}}
			>
				<Icon name="document" size={40} color="blue" />
				<View style={{flexDirection: 'column'}}>
					<Text style={styles.pdfName}>{item.name}</Text>
					{show === 'min' && <Text style={styles.belowNameRow}>{minutes} minutes ago - {item.size}</Text>}
					{show === 'just now' && <Text style={styles.belowNameRow}>Just now - {item.size}</Text>}
					{show === 'hours' && <Text style={styles.belowNameRow}>{hours} hours ago - {item.size}</Text>}
					{show === 'yesterday' && <Text style={styles.belowNameRow}>Yesterday - {item.size}</Text>}
					{show === 'date' && <Text style={styles.belowNameRow}>{item.time.getUTCDate()}/{docMonth+1}/{docYear} - {item.size}</Text>}
				</View>
			</TouchableOpacity>
		)
	}

	componentDidMount() {
		this.id = 0
		this.fetchDataFromDirectory()
	}

	render() {
		return(
			<View style={styles.container}>
				<FlatList
					data={this.state.pdfInfo}
					renderItem={this.renderItem}
					keyExtractor={item => item.id.toString()}
					extraData={this.state.selectedIds}
				/>
			</View>
		)
	}
}
//   /storage/emulated/0/Android/data/com.practiceProject/files/
export default PdfList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  pdfName: {
  	marginLeft: 10,
  	fontWeight: 'bold',
  	paddingTop: 2,
  	fontSize: 15
  },
  belowNameRow: {
  	marginLeft: 10,
  	paddingTop: 2
  }
});
