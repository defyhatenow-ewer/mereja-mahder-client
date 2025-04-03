const shortenString = (str: string, length = 10): string =>
  str.length > length ? `${str.substring(0, length)} ...` : str;

export default shortenString;
