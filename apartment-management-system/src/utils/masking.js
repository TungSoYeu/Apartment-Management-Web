exports.maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone;
  return phone.substring(0, 3) + "*****" + phone.substring(phone.length - 2);
};
