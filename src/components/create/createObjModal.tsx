import styled from 'styled-components'
import SVG_pencil from "../../svg/pencil.svg"
import { useState, Dispatch, SetStateAction } from 'react'
import { cropImage } from '../../lib/image'
import { getCompUID } from '../../lib/randomString'
import NextImage from 'next/image'
import { useStore } from '../../zustand/store'
import { IImgData } from '../../types/data'
import OptionalInput from './optionalInput'

export default function CreateObjModal({ modalType, setModal }: { modalType: "start" | "combine" | undefined, setModal: Dispatch<SetStateAction<"start" | "combine" | undefined>> }) {
  const defaultImg = "/defaultObj.png"
  const [newObjImg, setNewObjImg] = useState<IImgData>({ url: defaultImg })
  const [newObjName, setNewObjName] = useState("")
  const { contentData, setContentData } = useStore()

  const handleCreateObject = () => {
    if (!newObjImg || !contentData) return;
    const newData = { ...contentData }
    const id = getCompUID(8, document)
    const name = newObjName ? newObjName : "오브젝트"
    let img: string | { id: string, url: string } | null = newObjImg.url
    if (newObjImg.form) {
      const formData = newObjImg.form
      const file = formData?.get('file') as File | null
      if (file && formData) {
        img = { url: newObjImg.url, id: String(newData.imageFile.length) }
        newData.imageFile.push(formData)
      }
    }

    if (modalType === "combine") newData.combine.push(id)
    else newData.start.push(id)
    if (img) newData.objects.push({ id, name, img })
    setContentData(newData)

    setModal(undefined)
    setNewObjImg({ url: defaultImg })
  }

  return (
    <NewObjModalBg>
      <NewObjModalWrap>
        <NewObjModalHeader>
          <h1>새 오브젝트</h1>
        </NewObjModalHeader>
        <NewObjContents>
          <NewObjImg htmlFor="newModalInput">
            <NextImage src={newObjImg.url} alt="object" width={170} height={170} />
            <div>
              <SVG_pencil fill="white" width="60" height="60" />
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
              <OptionalInput
                title={"이미지"}
                defaultImg={defaultImg}
                getImage={(file: File) => cropImage(file, 360)}
                setData={setNewObjImg}
                styles={{ backgroundColor: "#343943", marginTop: "6px", padding: "12px 16px" }}
              />
            </NewObjInput>
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
  top:0px;
  left:0px;
`
const NewObjModalWrap = styled.div`
  display:flex;
  flex-direction: column;
  padding: 24px;
  background-color: #141821;
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
    color:#F1F6F9;
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
    color:#F1F6F9;
    margin-right: 8px;
  }
  input{
    border:none;
    color:#F1F6F9;
    background-color: #343943;
    border-radius: 4px;
    flex:1;
    margin-top: 6px;
    padding: 10.25px 16px;
    font-size: 18px;
  }
`
const NewObjInputLabel = styled.label`
  border:none;
  border-radius: 4px;
  flex:1;
  background-color: #343943;
  margin-top: 6px;
  padding: 12px 16px;
  h2{
    margin: 0px;
    white-space: nowrap;
    overflow: hidden;
    font-size: 18px;
    color:#F1F6F9;
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