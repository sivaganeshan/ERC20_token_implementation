const Inrs = artifacts.require("inrs");

module.exports = function (deployer) {
  deployer.deploy(Inrs,1000000);
};