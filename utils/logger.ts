const info = (...params: string[]) => {
  console.log(params);
};

const error = (...params: string[]) => {
  console.log(params);
};

module.exports = {
  info,
  error,
};
