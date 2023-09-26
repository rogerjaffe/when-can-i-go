const utils = {
  breakUpTime: (time) => {
    const hours = time.substring(0,2);
    const minutes = time.substring(3,5);
    const seconds = time.substring(6,8);
    return {hours, minutes, seconds};
  }
}

export default utils;
