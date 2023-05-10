export interface IPostData {
  id: string,
  title: string,
  makerId: string,
  objects: { id: string, name: string, img: string | { id: string, url: string } }[],
  imageFile: FormData[],
  start: string[],
  combine: string[],
  combinate: string[][],
  endObj: string[],
  background: string,
  sound: string
}