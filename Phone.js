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
  const size = this.device.substring(this.phone.length + 1, this.device.length - this.carrier.length - 1);
  if (parseInt(size) > 0) return parseInte(size);
  let i = 0;
  let val = parseInt(size.substr(i));
  while (isNaN(val) && i < size.length) {
    i++;
    val = parseInt(size.substr(i));
  }
  return val;
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