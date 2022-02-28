const axios = require("axios");

async function sendPresentation(url, pres_ex_id, body = {}) {
  let data;
  await axios
    .post(`${url}present-proof/records/${pres_ex_id}/send-presentation`, body)
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
  sendPresentation,
};
