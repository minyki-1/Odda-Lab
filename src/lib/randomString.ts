export const getCompUID = (length: number, doc: Document) => {
  const chars = '_ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  let id = '';
  while (id === '' || doc.getElementsByClassName(id)[0]) {
    for (let i = 0; i < length; i++) {
      const randomNum = Math.floor(Math.random() * chars.length);
      id += chars.substring(randomNum, randomNum + 1);
    }
  }
  return id;
}