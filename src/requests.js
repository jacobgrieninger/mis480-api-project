import axios from 'axios';

const searchPhoto = async (term) => {
  try {
    let config = {
      method: 'get',
      url: `https://api.unsplash.com/search/photos?per_page=30&query=${term}&client_id=G94SH8IVg963GALThXG6moNqwXegICkGk8SkWVicRyM`,
    };
    const res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

const OCR = async (url) => {
  try {
    let encoded = encodeURIComponent(url);
    let config = {
      method: 'get',
      url: `https://api.ocr.space/parse/imageurl?apikey=K84103076788957&url=${encoded}`,
    };
    const res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export { searchPhoto, OCR };
