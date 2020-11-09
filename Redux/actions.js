export const UPDATE_PDF_QUALITY = 'UPDATE_PDF_QUALITY'
export const ADD_IMAGES = 'ADD_IMAGES'
export const MOVE_PIC_UP = 'MOVE_PIC_UP'
export const MOVE_PIC_DOWN = 'MOVE_PIC_DOWN'
export const UPDATE_IMAGE_SIZE = 'UPDATE_IMAGE_SIZE'
export const UPDATE_RESIZE_MODE = 'UPDATE_RESIZE_MODE'
export const ADD_IMAGES_BELOW = 'ADD_IMAGES_BELOW'
export const ADD_IMAGES_ABOVE = 'ADD_IMAGES_ABOVE'
export const REMOVE_IMAGES = 'REMOVE_IMAGES'

// Action Creators
export const updateQuality = (update) => ({ // update must be a float point between 0.1 to 0.9
  type: UPDATE_PDF_QUALITY,
  payload: update
})

export const addImages = (update) => ({ // update can object or maybe list
  type: ADD_IMAGES,
  payload: update
})

export const movePicUp = (update) => ({ // Update will id
  type: MOVE_PIC_UP,
  payload: update
})

export const movePicDown = (update) => ({ // Update will id
  type: MOVE_PIC_DOWN,
  payload: update
})

export const removeImages = (update) => ({ // update will be list of id's and true in case of delete all
  type: REMOVE_IMAGES,
  payload: update
})

export const updateImageSize = (update) => ({ // update must be an integer
  type: UPDATE_IMAGE_SIZE,
  payload: update
})

export const updateResizeMode = (update) => ({ // update should be an string 'cover'/'contain'
  type: UPDATE_RESIZE_MODE,
  payload: update
})

export const addImagesAbove = (update) => ({ // Update must be an object {id: '', listofUri: [{}...]}
  type: ADD_IMAGES_ABOVE,
  payload: update
})

export const addImagesBelow = (update) => ({ // Update must be an object {id: '', listOfUri: [{}..]}
  type: ADD_IMAGES_BELOW,
  payload: update
})
