import { combineReducers } from 'redux'

import {
  UPDATE_PDF_QUALITY,
  ADD_IMAGES,
  MOVE_PIC_UP,
  MOVE_PIC_DOWN,
  UPDATE_IMAGE_SIZE,
  UPDATE_RESIZE_MODE,
  ADD_IMAGES_ABOVE,
  ADD_IMAGES_BELOW,
  REMOVE_IMAGES,
  UPDATE_ALL_SETTINGS
} from './actions'

// Reducers for handling New Contacts & Users

movePicToUp = (imagePaths, id) => {
  const target = imagePaths.findIndex((obj) => obj.id === id)

  if (target === 0 || target === -1) return imagePaths // If Image is on Top just simply return

  const before = target - 1 // Getting the index of previous image

  const listOfUri = [...imagePaths] // Copying the image's URI

  const beforeUriObj = listOfUri[before] // Getting the URI and saving it for swap in next steps below

  listOfUri.splice(before, 1, listOfUri[target])// 1 means that delete value on index before

  listOfUri.splice(target, 1, beforeUriObj)

  return listOfUri
}

movePicToDown = (imagePaths, id) => {
  const target = imagePaths.findIndex((obj) => obj.id === id)

  if (!imagePaths[target + 1] || target === -1) return imagePaths // If Image is in bottom just simply return

  const after = target + 1 // Getting the index of next image

  const listOfUri = [...imagePaths] // Copying the image's URI

  const afterUriObj = listOfUri[after] // Getting the URI and saving it for swap in next steps below

  listOfUri.splice(after, 1, listOfUri[target])// 1 means that delete value on index after

  listOfUri.splice(target, 1, afterUriObj)

  return listOfUri
}

addImagesAbove = (state, uriObj) => { // obj have id and listOfUri = [{},{}...]
  const target = state.findIndex((obj) => obj.id === uriObj.id)

  let listOfUri = state.slice(0, target) // Getting the array before the target's index

  listOfUri = listOfUri.concat(uriObj.listOfUri) // Merging the parameters array

  listOfUri = listOfUri.concat(state.slice(target)) // Concatinating the left array from target's index

  return listOfUri
}

addImagesBelow = (state, uriObj) => { // obj have id and listOfUri = [{},{}...]
  const target = state.findIndex((obj) => obj.id === uriObj.id)

  console.log(target)

  let listOfUri = state.slice(0, target + 1)

  listOfUri = listOfUri.concat(uriObj.listOfUri) // Merging the parameters array

  listOfUri = listOfUri.concat(state.slice(target + 1)) // Concatinating the left array from target's index

  return listOfUri
}

const mergeForAddImage = (state, payload) => {
  if (payload instanceof Array) return [...state, ...payload]
  if (payload instanceof Object) return [...state, payload]
  return state
}

handleRemoveImages = (state, payload) => {
  if (payload.length === state.length || payload===true) return [] //it's mean user has selected all the images
  return state.filter(obj => !payload.includes(obj.id))
}

const imageReducer = (state = [], action) => { //[{}, {}, {}, ........]
  switch (action.type) {
    case ADD_IMAGES:
      return mergeForAddImage(state, action.payload)
    case MOVE_PIC_UP:
      return movePicToUp(state, action.payload)
    case MOVE_PIC_DOWN:
      return movePicToDown(state, action.payload)
    case REMOVE_IMAGES:
      return handleRemoveImages(state, action.payload)
    case ADD_IMAGES_ABOVE:
      return addImagesAbove(state, action.payload)
    case ADD_IMAGES_BELOW:
      return addImagesBelow(state, action.payload)
    default:
      return state
  }
}

const settingReducer = (state = { quality: 0.7, imageSize: 40, resizeMode: 'contain' }, action) => {
  switch (action.type) {
    case UPDATE_ALL_SETTINGS:
      return action.payload;
    case UPDATE_PDF_QUALITY:
      return { ...state, quality: action.payload }
    case UPDATE_IMAGE_SIZE:
      return { ...state, imageSize: action.payload }
    case UPDATE_RESIZE_MODE:
      return { ...state, resizeMode: action.payload }
    default:
      return state
  }
}

const reducer = combineReducers({ // when this get state it pass full state to every Reducer
  imagesPath: imageReducer, // [] array of objects
  settings: settingReducer // {}
})
// settings: {quality,}
export default reducer
