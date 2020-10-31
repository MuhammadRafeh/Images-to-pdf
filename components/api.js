// import { Dimensions } from 'react-native';
import RNImageToPdf from 'react-native-image-to-pdf';
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import {addImages} from '../Redux/actions';
import store from '../Redux/store';

let id = 0;

const myAsyncPDFFunction = async (list, pdfName, pdfQuality) => {
  const namePDF = `${pdfName}.pdf`;

  try {
    const options = {
      imagePaths: list, // Demand List of URI's
      name: namePDF, // Demand Name of pdf
      maxSize: {
        width: 595,
        height: 842,
      },
      quality: pdfQuality, // optional compression paramter
    };
    const pdf = await RNImageToPdf.createPDFbyImages(options);

    return pdf.filePath;
  } catch (err) {
    // console.log(err);
  }
};

// = ==================================================================================

const gettingPermission = async () => {
  let cam = false;
  let write = false;
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Images To PDF',
        message:
          'App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log("You can use the camera");
      cam = true;
    } else {
      // console.log("Camera permission denied");
    }
    // WRITE_EXTERNAL_STORAGE
    const granteds = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Images To PDF',
        message:
          'App requires to access your internal your photos ' +
          'so you can make awesome documents.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granteds === PermissionsAndroid.RESULTS.GRANTED) {
      // console.log("You can use the camera");
      write = true;
    } else {
      // console.log("Camera permission denied");
    }
    if (cam && write) {
      return true;
    }
    return false;
  } catch (err) {
    // console.warn(err);
    return false;
  }
};

// = ==================================================================================

export const openGalleryApi = async () => {
  // function return false/[{uri, id}...]
  const bool = await gettingPermission();
  if (!bool) {
    return false;
  }

  try {
    const res = await DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.images],
    });

    // console.log(res) // It will always be list
    const listOfUri = [];
    res.forEach((obj) => {
      listOfUri.push({uri: obj.fileCopyUri, id: id++});
    });
    return listOfUri;
  } catch (e) {
    // error
  }
};

// = ===============================================================================

export const openCameraApi = async () => {
  // Function return object {id, uri}
  const bool = await gettingPermission();
  if (!bool) {
    return false;
  } // If bool is false it mean's that permission denied just return from function.

  await ImagePicker.launchCamera({}, (response) => {
    if (response.didCancel) {
      // console.log('User cancelled image picker');
    } else if (response.error) {
      // console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      // console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = {uri: response.uri};

      const result = {uri: source.uri, id: id++};
      store.dispatch(addImages(result));
    }
  });
};

// = ===============================================================================

export default myAsyncPDFFunction;
