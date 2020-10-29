import React from 'react'
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'
import * as RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons'

import FileViewer from "react-native-file-viewer";

class PdfList extends React.Component {

	state = {
		pdfInfo: [],
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

	onPressDoc = async (uri) => {
		try{
	      await FileViewer.open(uri);
	    } catch(e) {
	      // Error
	    }
	}

	renderItem = ({ item }) => { //item will be a object
		let show = '' // min: hours: date: just now
		const curTime = new Date()
		const difTime = new Date(curTime - item.time)
		const minutes = difTime.getUTCMinutes()
		const hours = difTime.getUTCHours()

		show = curTime.getDate() === item.time.getDate() ? 'hoursORmin' : 'date'

		if (show === 'hoursORmin') {
			if (curTime.getUTCFullYear() === item.time.getUTCFullYear() && curTime.getUTCMonth() === item.time.getUTCMonth()){
				//Here now we have to decide what to show, hours/min
				if (hours === 0){
					show = minutes === 0 ? 'just now' : 'min'
				} else {
					show = 'hours'
				}
			} else {
				show = 'date'
			}
		} 

		return ( 
			<TouchableOpacity
				style={{flexDirection: 'row', paddingBottom: 18}}
				onPress={() => this.onPressDoc(item.path)}
			>
				<Icon name="document" size={35} color="blue" />
				<View style={{flexDirection: 'column'}}>
					<Text style={styles.pdfName}>{item.name}</Text>
					{show === 'min' && <Text style={styles.belowName}>{minutes} minutes ago - {item.size}</Text>}
					{show === 'just now' && <Text style={styles.belowName}>Just now - {item.size}</Text>}
					{show === 'hours' && <Text style={styles.belowName}>{hours} hours ago - {item.size}</Text>}
					{show === 'date' && <Text style={styles.belowName}>{item.time.getUTCDate()}/{item.time.getUTCMonth()+1}/{item.time.getUTCFullYear()} - {item.size}</Text>}
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
    backgroundColor: '#fff',
    padding: 25
  },
  pdfName: {
  	marginLeft: 10,
  	fontWeight: 'bold',
  	paddingTop: 1
  },
  belowName: {
  	marginLeft: 10,
  }
});
