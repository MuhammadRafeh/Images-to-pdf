import { combineReducers } from 'redux'

import { 
  UPDATE_PDF_QUALITY, 
  ADD_IMAGES, DELETE_IMAGE, 
  MOVE_PIC_UP, 
  MOVE_PIC_DOWN, 
  REMOVE_ALL_IMAGES, 
  UPDATE_IMAGE_SIZE,
  UPDATE_RESIZE_MODE,
  ADD_IMAGES_ABOVE,
  ADD_IMAGES_BELOW } from './actions'

//Reducers for handling New Contacts & Users

 movePicToUp = (imagePaths, id) => {

    const target = imagePaths.map(obj => obj.id).indexOf(id) //Getting the index of target image
 
    if (target === 0 || target === -1) return imagePaths  //If Image is on Top just simply return

    const before = target - 1 //Getting the index of previous image

    const listOfUri = [...imagePaths] //Copying the image's URI

    const beforeUriObj = listOfUri[before] //Getting the URI and saving it for swap in next steps below

    listOfUri.splice(before, 1, listOfUri[target]);// 1 means that delete value on index before

    listOfUri.splice(target, 1, beforeUriObj)

    return listOfUri
  }

  movePicToDown = (imagePaths, id) => {

    const target = imagePaths.map(obj => obj.id).indexOf(id) //Getting the index of target image

    if (!imagePaths[target + 1] || target === -1) return imagePaths  //If Image is in bottom just simply return

    const after = target + 1 //Getting the index of next image

    const listOfUri = [...imagePaths] //Copying the image's URI

    const afterUriObj = listOfUri[after] //Getting the URI and saving it for swap in next steps below

    listOfUri.splice(after, 1, listOfUri[target]);// 1 means that delete value on index after

    listOfUri.splice(target, 1, afterUriObj)

    return listOfUri
  }

  addImagesAbove = (state, obj) => { //obj have id and listOfUri = [{},{}...]

    const target = state.map(obj => obj.id).indexOf(obj.id) //Getting the index of target image

    let listOfUri = state.slice(0, target) //Getting the array before the target's index

    listOfUri = listOfUri.concat(obj.listOfUri) //Merging the parameters array

    listOfUri = listOfUri.concat(state.slice(target)) //Concatinating the left array from target's index

    return listOfUri
  }

  addImagesBelow = (state, obj) => { //obj have id and listOfUri = [{},{}...]

    const target = state.map(obj => obj.id).indexOf(obj.id) //Getting the index of target image

    let listOfUri = state.slice(0, target+1)

    listOfUri = listOfUri.concat(obj.listOfUri) //Merging the parameters array

    listOfUri = listOfUri.concat(state.slice(target+1)) //Concatinating the left array from target's index

    return listOfUri
  }

const mergeForAddImage = (state, payload) => {
	if (payload instanceof Array) return [...state, ...payload]
	if (payload instanceof Object) return [...state, payload]
	return state
}

const imageReducer = (state = [], action) => {
	switch (action.type) {
		case ADD_IMAGES:
			return mergeForAddImage(state, action.payload)
		case DELETE_IMAGE:
			return state.filter(imagepath => imagepath.id !== action.payload) //action.payload is id
		case MOVE_PIC_UP:
			return movePicToUp(state, action.payload)
		case MOVE_PIC_DOWN:
			return movePicToDown(state, action.payload)
		case REMOVE_ALL_IMAGES:
			return []
    case ADD_IMAGES_ABOVE:
      return addImagesAbove(state, action.payload)
    case ADD_IMAGES_BELOW:
      return addImagesBelow(state, action.payload)
		default:
			return state
	}
}

const settingReducer = (state = {quality: 0.7, imageSize: 50, resizeMode: 'cover' }, action) => {
	switch (action.type) {
		case UPDATE_PDF_QUALITY:
			return {...state, quality: action.payload}
    case UPDATE_IMAGE_SIZE:
      return {...state, imageSize: action.payload}
    case UPDATE_RESIZE_MODE:
      return {...state, resizeMode: action.payload}
		default:
			return state
	}
}

const reducer = combineReducers({ //when this get state it pass full state to every Reducer
	imagesPath: imageReducer, //[] array of objects
	settings: settingReducer, //{}
})
//settings: {quality,}
export default reducer
