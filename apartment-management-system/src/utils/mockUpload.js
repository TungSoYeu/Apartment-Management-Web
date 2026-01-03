exports.mockUploadFile = (filename) => {
  return `/uploads/mock-${Date.now()}-${filename}`;
};
