import axios from "axios";

const searchPhoto = async (term) => {
  try {
    let config = {
      method: "get",
      url: `https://api.unsplash.com/search/photos?query=${term}&client_id=G94SH8IVg963GALThXG6moNqwXegICkGk8SkWVicRyM`,
    };
    const res = await axios(config);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

export { searchPhoto };
