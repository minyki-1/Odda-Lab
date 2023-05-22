import styled from 'styled-components'
import { ChangeEvent, useState } from 'react'
import { resizeImage, checkImageURL } from '../../lib/image'
import SVG_Home from "../../svg/home.svg"
import Link from "next/link"
import Combine from '../../components/create/combine'
import { useStore } from '../../zustand/store'
import ObjectList from '../../components/create/objectList'

export default function Create() {
  const { selectObj, setSelectObj, contentData, setContentData } = useStore()

  const defaultImg = "/defaultBg.jpg"
  const [bgImgURL, setBgImgURL] = useState(defaultImg)
  const [bgImgData, setBgImgData] = useState<FormData | string>(defaultImg)
  const [bgURLInput, setBgURLInput] = useState("")
  const [bgImgType, setBgImgType] = useState<"file" | "url">("file")

  const handleChangeUrl = async (url: string) => {
    const result = await checkImageURL(url)
    if (result) {
      setBgImgURL(url);
      setBgImgData(url);
    } else {
      setBgURLInput("");
      setBgImgURL(defaultImg);
      setBgImgData(defaultImg);
    };
  };
  const handleFileChange = async (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const files = input.files;
    if (!files) return;
    const resizedImg = await resizeImage(files[0], 2400, 1500)
    const url = URL.createObjectURL(resizedImg)
    setBgImgURL(url)
    const newFormData = new FormData();
    newFormData.append('file', resizedImg);
    setBgImgData(newFormData)
    setBgURLInput(url);
  }

  return (
    <Container onClick={(e: MouseEvent) => {
      const { id } = (e.target as HTMLElement);
      if (selectObj && !id) setSelectObj(undefined);
    }}>
      <Header>
        <Link href="/"><SVG_Home /></Link>
        <h1>새 라보토리 생성</h1>
      </Header>
      <Main>
        <Contents>
          <Title>화면</Title>
          <Preview img={bgImgURL} />
          <MainInputWrap>
            <MainInput>
              <h2>제목</h2>
              <input type="text" value={contentData.title} onChange={(e) => {
                setContentData({ ...contentData, title: e.target.value })
              }} />
            </MainInput>
            <MainInput>
              <div>
                <h2>배경 이미지</h2>
                <NewImgOption>
                  <label htmlFor="optionFile">FILE</label>
                  <input checked={bgImgType === "file"} onChange={() => setBgImgType("file")} id={"optionFile"} type="radio" />
                  <label htmlFor="optionURL">URL</label>
                  <input checked={bgImgType === "url"} onChange={() => setBgImgType("url")} id={"optionURL"} type="radio" />
                </NewImgOption>
              </div>
              {
                bgImgType === "file" ?
                  <MainInputLabel htmlFor="modalInput">
                    <h1>{bgImgURL}</h1>
                  </MainInputLabel>
                  : <input
                    type="text"
                    value={bgURLInput}
                    onChange={(e) => setBgURLInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? handleChangeUrl((e.target as HTMLInputElement).value) : null}
                    onBlur={(e) => { handleChangeUrl(e.target.value) }}
                  />
              }
              <input
                type="file"
                id="modalInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </MainInput>
            {/* TODO: 오디오 파일 받기 */}
          </MainInputWrap>
        </Contents>
        <ObjectContent>
          <ObjectList title="시작 오브젝트" modalType='start' />
          <ObjectList title="조합 오브젝트" modalType='combine' />
          <Combine />
        </ObjectContent>
        <Ad></Ad>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  display:flex;
  flex-direction: column;
`
const Header = styled.div`
  width:100%;
  height:48px;
  background-color: #1D2334;
  display:flex;
  align-items: center;
  svg{
    width:22px;
    height:22px;
    fill:#F1F6F9;
    margin:0px 12px;
    padding: 2px;
    opacity: 0.7;
    cursor: pointer;
    &:hover{
      opacity: 1;
    }
  }
  h1{
    font-size: 18px;
    color:#F1F6F9;
    margin-left: 4px;
    opacity: 0.9;
  }
`
const Main = styled.div`
  display:flex;
  width:100%;
  flex:1;
  h1,h2,h3,h4,h5,h6,input{
    color:#F1F6F9;
  }
  svg{
    fill:#F1F6F9;
  }
`
const Contents = styled.div`
  flex:1;
  display:flex;
  flex-direction: column;
  padding: 24px;
  padding-top:0px;
  height:calc(100vh - 48px - 24px);
  overflow-y: scroll;
  background-color: #343943;
`
const ObjectContent = styled.div`
  width:460px;
  height:calc(100vh - 48px - 24px);
  background-color: #2C2F35;
  overflow-y: scroll;
  padding: 24px;
  padding-top:0px;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`
const Title = styled.h1`
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 24px;
`
const Preview = styled.div<{ img: string }>`
  aspect-ratio:16 / 9;
  margin: 4px;
  background-color: #D9D9D9;
  border-radius: 8px;
  background:${({ img }: { img: string }) => `url(${img})`};
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
`
const Object = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 16px;
  margin-right: 16px;
  input,h1{
    text-align: center;
    width:50px;
    height:39px;
    margin-top: 12px;
    font-size: 15px;
    margin-bottom: -18px;
  }
  @media screen and (max-width: 800px) {
    h1{
      margin-top: 8px;
      font-size: 12px;
    }
    margin-bottom: 16px;
  }
`
const ObjectImg = styled.div<{ size: string, img: string, shadow: string, border: string }>`
  width:${({ size }: { size: string }) => size + "px"};
  height:${({ size }: { size: string }) => size + "px"};
  background-image: ${({ img }: { img: string }) => `url(${img})`};
  box-shadow:${({ shadow }: { shadow: string }) => shadow};
  border:${({ border }: { border: string }) => border};
  cursor: grab;
  border-radius: 100px;
  background-color: white;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  @media screen and (max-width: 800px) {
    width:50px;
    height:50px;
  }
`

const MainInput = styled.div`
  display:flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 16px;
  flex:1;
  div{
    display:flex;
    justify-content: space-between;
  }
  h2{
    font-size: 15px;
    margin-right: 8px;
  }
  input{
    border:none;
    background-color: #545c6b;
    color:white;
    border-radius: 4px;
    flex:1;
    margin-top: 10px;
    padding: 12px 16px;
    font-size: 18px;
  }
`
const MainInputLabel = styled.label`
  border:none;
  background-color: #545c6b;
  border-radius: 4px;
  flex:1;
  margin-top: 10px;
  padding: 14px 16px;
  &::-webkit-scrollbar {
    display: none;
  }
  h1{
    font-size: 18px;
    height:18px;
    overflow: hidden;
  }
`
const NewImgOption = styled.div`
  display:flex;
  align-items: center;
  input{
    margin:0px;
  }
  label{
    margin-left: 12px;
    padding-right: 2px;
    font-size: 12px;
    color:#F1F6F9;
  }
`
const MainInputWrap = styled.div`
  display:flex;
  justify-content: space-between;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
`