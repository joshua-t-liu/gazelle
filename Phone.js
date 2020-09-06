const PHONE = 4;
const CARRIER = 5;
const DEVICE = 6;
const ID = 7;

const Phone = function(phone, carrier, device, id) {
  this.phone = phone;
  this.carrier = carrier;
  this.device = device;
  this.id = id;
  this.size = this.getSize();
};

Phone.prototype.getSize = function() {
  return parseInt(this.device.substring(this.phone.length + 1, this.device.length - this.carrier.length - 1));
}

Phone.prototype.stringifyCSV = function() {
  return (
    this.phone + ',' +
    this.carrier + ',' +
    this.device + ',' +
    this.id
  );
}

module.exports = function(link) {
  if (typeof link !== 'string') return null;
  let split = link.split('/');
  if (split.length !== 8) return null;
  return new Phone(split[PHONE], split[CARRIER], split[DEVICE], split[ID]);
};