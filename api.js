// import { Dimensions } from 'react-native';
import RNImageToPdf from 'react-native-image-to-pdf';

const myAsyncPDFFunction = async (list, pdfName) => {
  // const deviceWidth = Dimensions.get('window').width;
  // const deviceHeight = Dimensions.get('window').height;
  const namePDF = pdfName+'.pdf'
  // console.log(namePDF)
  // console.log(list)
    try {
      console.log(list)
        const options = {
            imagePaths: list, //Demand List of URI's
            name: namePDF, //Demand Name of pdf
            maxSize: { // optional maximum image dimension - larger images will be resized
                width: 595,
                height:  842,
            },
            quality: .7, // optional compression paramter
        };
        const pdf = await RNImageToPdf.createPDFbyImages(options);
        
        console.log(pdf.filePath);
        return pdf.filePath
    } catch(err) {
        console.log(err);
    }
}

export default myAsyncPDFFunction
