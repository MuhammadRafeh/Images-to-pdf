import RNImageToPdf from 'react-native-image-to-pdf';
import { PermissionsAndroid } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

import { addImages } from '../Redux/actions';
import store from '../Redux/store';

let id = 1;

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
//PERMISSIONS

const cameraPer = async () => {
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
    return true;
  } else {
    return false;

  }
}


const mediaPer = async () => {
  const granteds = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Images To PDF',
      message:
        'App requires to write external storage ' +
        'so you can make awesome documents.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  if (granteds === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  } else {
    return false;
  }
}

// = ==================================================================================

export const openGalleryApi = async () => {
  // function return false/[{uri, id}...]
  const bool = await mediaPer();
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
      listOfUri.push({ uri: obj.fileCopyUri, id: id++ });
    });
    return listOfUri;
  } catch (e) {
    // error
  }
};

// = ===============================================================================

export const openCameraApi = async (getPicData = false) => {
  const bool = await cameraPer();
  if (!bool) {
    return false;
  }

  const list = await new Promise((resolve, reject) => {
    ImagePicker.launchCamera({}, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        console.log(response)
        const source = { uri: response.uri };
        if (getPicData) {
          resolve([{ uri: source.uri, id: id++ }])
          return;
        }
        const result = { uri: source.uri, id: id++ };
        store.dispatch(addImages(result));
        resolve([])
      }
    });
  })

  return list;
};

// = ===============================================================================

export default myAsyncPDFFunction;
