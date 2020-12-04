const PHONE = 4;
const CARRIER = 6; //5
const DEVICE = 7; //6
const ID = 8; //7

const Phone = function(phone, carrier, device, id, link) {
  this.phone = phone;
  this.carrier = carrier;
  this.device = device;
  this.id = id;
  this.size = this.getSize();
  this.link = link;
};

Phone.prototype.getSize = function() {
  const size = this.device.substring(this.phone.length + 1, this.device.length - this.carrier.length - 1);
  if (parseInt(size) > 0) return parseInt(size);
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
  if (split.length !== 9) return null; // 8 for iphones 9 for ipads
  return new Phone(split[PHONE], split[CARRIER], split[DEVICE], split[ID], link);
};
