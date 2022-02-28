const axios = require("axios");

async function getPresentationExchanges(url) {
  let data;
  await axios
    .get(`${url}present-proof/records`)
    .then((res) => {
      data = res.data.results;
    })
    .catch((err) => {
      console.log(err);
      data = undefined;
    });
  return data;
}

module.exports = {
  getPresentationExchanges,
};
