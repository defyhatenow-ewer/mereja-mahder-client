const makeDownloadable = (url: string): string =>
  url.replace("/upload", "/upload/fl_attachment");

export default makeDownloadable;
