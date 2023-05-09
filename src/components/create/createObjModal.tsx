import styled from 'styled-components'
import SVG_pencil from "../../svg/pencil.svg"
import { useState, useEffect, ChangeEvent, Dispatch, SetStateAction } from 'react'
import { cropImage } from '../../lib/image'
import { getCompUID } from '../../lib/randomString'
import NextImage from 'next/image'

interface IPostData {
  id: string,
  title: string,
  makerId: string,
  objects: { id: string, name: string, img: string | { id: string, url: string } }[],
  imageFile: FormData[],
  start: string[],
  combine: string[],
  combinate: string[][],
  background: string,
  sound: string
}


export default function CreateObjModal({ datas, setDatas, modalType, setModal }: { datas: IPostData, setDatas: Dispatch<SetStateAction<IPostData>>, modalType: "start" | "combine" | undefined, setModal: Dispatch<SetStateAction<"start" | "combine" | undefined>> }) {
  const defaultImg = "/defaultObj.png"
  const [newObjImgUrl, setNewObjImgUrl] = useState(defaultImg)
  const [newObjImg, setNewObjImg] = useState<FormData | string>(defaultImg)
  const [urlInputTxt, setUrlInputTxt] = useState("")
  const [newObjName, setNewObjName] = useState("")
  const [imgType, setImgType] = useState<"file" | "url">("file")

  const handleFileChange = async (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const files = input.files;
    if (!files) return;
    const croppedImg = await cropImage(files[0], 360)
    const url = URL.createObjectURL(croppedImg)
    setNewObjImgUrl(url)
    const newFormData = new FormData();
    newFormData.append('file', croppedImg);
    setNewObjImg(newFormData)
    setUrlInputTxt(url)
  }
  const handleCreateObject = () => {
    if (!newObjImg) return;
    const newData = { ...datas }
    const id = getCompUID(8, document)
    const name = newObjName ? newObjName : "오브젝트"
    let img: string | { id: string, url: string } | null = typeof newObjImg === "string" ? newObjImg : null
    if (typeof newObjImg !== "string") {
      const file = newObjImg.get('file') as File | null
      if (file) {
        const url = URL.createObjectURL(file)
        img = {
          id: String(newData.imageFile.length),
          url
        }
        newData.imageFile.push(newObjImg)
      }
    }

    if (modalType === "combine") newData.combine.push(id)
    else newData.start.push(id)
    if (img) newData.objects.push({ id, name, img })
    setDatas(newData)

    setModal(undefined)
    setNewObjImgUrl(defaultImg)
    setNewObjImg(defaultImg)
  }
  function checkImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
    });
  }
  const handleChangeUrl = async (url: string) => {
    const result = await checkImageUrl(url)
    if (result) {
      setNewObjImgUrl(url);
      setNewObjImg(url);
    } else {
      setUrlInputTxt("");
      setNewObjImgUrl(defaultImg);
      setNewObjImg(defaultImg);
    };
  };

  return (
    <NewObjModalBg>
      <NewObjModalWrap>
        <NewObjModalHeader>
          <h1>새 오브젝트</h1>
        </NewObjModalHeader>
        <NewObjContents>
          <NewObjImg htmlFor="modalInput">
            <NextImage src={newObjImgUrl} alt="object" width={170} height={170} />
            <div>
              <SVG_pencil width="60" height="60" />
            </div>
          </NewObjImg>
          <NewObjListInp>
            <NewObjInput>
              <h2>이름</h2>
              <input
                placeholder='오브젝트'
                type="text"
                value={newObjName}
                onChange={(e) => { setNewObjName(e.target.value) }}
              />
            </NewObjInput>
            <NewObjInput>
              <div>
                <h2>이미지</h2>
                <NewImgOption>
                  <label htmlFor="optionFile">FILE</label>
                  <input checked={imgType === "file"} onChange={() => setImgType("file")} id={"optionFile"} type="radio" />
                  <label htmlFor="optionURL">URL</label>
                  <input checked={imgType === "url"} onChange={() => setImgType("url")} id={"optionURL"} type="radio" />
                </NewImgOption>
              </div>
              {
                imgType === "file" ?
                  <NewObjInputLabel htmlFor="modalInput">
                    <h2>{newObjImgUrl}</h2>
                  </NewObjInputLabel>
                  : <input
                    type="text"
                    value={urlInputTxt}
                    onChange={(e) => setUrlInputTxt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? handleChangeUrl((e.target as HTMLInputElement).value) : null}
                    onBlur={(e) => { handleChangeUrl(e.target.value) }}
                  />
              }
            </NewObjInput>
            <input
              type="file"
              id="modalInput"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <NewObjBtnWrap>
              <button style={{ backgroundColor: "#6084E0" }} onClick={handleCreateObject}>생성</button>
              <button style={{ backgroundColor: "#E04F4F" }} onClick={() => { setModal(undefined) }}>취소</button>
            </NewObjBtnWrap>
          </NewObjListInp>
        </NewObjContents>
      </NewObjModalWrap>
    </NewObjModalBg>
  )
}

const NewObjModalBg = styled.div`
  width:100vw;
  height:100vh;
  z-index: 999;
  background-color: rgba(0,0,0,0.25);
  backdrop-filter: blur(2.5px);
  position: fixed;
  display:flex;
  align-items: center;
  justify-content: center;
`
const NewObjModalWrap = styled.div`
  display:flex;
  flex-direction: column;
  padding: 24px;
  background-color: #F1F6F9;
  width:550px;
  border-radius: 4px;
`
const NewObjModalHeader = styled.div`
  margin-bottom: 32px;
  display:flex;
  width:100%;
  align-items: center;
  justify-content: space-between;
  h1{
    color:#2C2F35;
    width:100%;
    font-size: 22px;
  }
  svg{
    cursor:pointer;
  }
`
const NewObjImg = styled.label`
  cursor: pointer;
  display:flex;
  width:170px;
  height:170px;
  padding:16px;
  margin-right: 32px;
  img{
    width:170px;
    height:170px;
    border-radius: 100px;
    background-color: #dadada;
  }
  div{
    width:170px;
    height:170px;
    border-radius: 200px;
    background-color: rgba(0, 0, 0, 0.25);
    display:none;
    align-items: center;
    justify-content: center;
    position:absolute;
  }
  &:hover{
    div{
      display:flex;
    }
  }
`
const NewObjContents = styled.div`
  display:flex;
  flex:1;
`
const NewObjInput = styled.div`
  display:flex;
  flex-direction: column;
  margin-bottom: 24px;
  flex:1;
  div{
    display:flex;
    justify-content: space-between;
  }
  h2{
    font-size: 12px;
    color:#252B30;
    margin-right: 8px;
  }
  input{
    border:none;
    background-color: #dedede;
    border-radius: 4px;
    flex:1;
    margin-top: 6px;
    padding: 10.25px 16px;
    font-size: 18px;
  }
`
const NewObjInputLabel = styled.label`
  border:none;
  background-color: #dedede;
  border-radius: 4px;
  flex:1;
  margin-top: 6px;
  padding: 12px 16px;
  width:calc(316px - 32px);
  h2{
    white-space: nowrap;
    overflow: hidden;
    font-size: 18px;
    color:#252B30;
  }
`
const NewImgOption = styled.div`
  display:flex;
  align-items: center;
  input{
    margin:0px;
    color:#252B30;
  }
  label{
    margin-left: 12px;
    padding-right: 2px;
    font-size: 12px;
    color:#252B30;
  }
`
const NewObjListInp = styled.div`
  display:flex;
  flex-direction: column;
  flex:1;
`
const NewObjBtnWrap = styled.div`
  display:flex;
  margin-top: 10px;
  margin-bottom: 20px;
  button{
    padding:12px;
    border: none;
    border-radius: 4px;
    margin: 4px;
    flex: 1;
    color:white;
    cursor: pointer;
  }
`