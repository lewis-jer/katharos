const y = (a) => {
  return (b) => {
    return a % b;
  };
};

const x = y(2)(2);
 console.log(typeof x)