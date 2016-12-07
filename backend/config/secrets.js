function response() {
  this.message = "";
  this.data = new Array();
}

module.exports = {
    token : "secret-vintage",
    mongo_connection : "mongodb://vintage:vintage@ds159747.mlab.com:59747/cs498rk_final",
    template: response
};
