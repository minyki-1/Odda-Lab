import styled from 'styled-components'
import { useState } from 'react'
import { resizeImage } from '../../lib/image'
import SVG_Home from "../../svg/home.svg"
import Link from "next/link"
import Combine from '../../components/create/combine'
import { useStore } from '../../zustand/store'
import ObjectList from '../../components/create/objectList'
import { IImgData } from '../../types/data'
import OptionalInput from '../../components/create/optionalInput'

export default function Create() {
  const { selectObj, setSelectObj, contentData, setContentData } = useStore()

  const defaultImg = "/defaultBg.jpg"
  const [bgImgData, setBgImgData] = useState<IImgData>({ url: defaultImg })

  return (
    <Container onClick={(e: MouseEvent) => {
      const { id } = (e.target as HTMLElement);
      if (selectObj && !id) setSelectObj(undefined);
    }}>
      <Header>
        <Link href="/"><SVG_Home /></Link>
        <h1>새 실험실 생성</h1>
      </Header>
      <Main>
        <Contents>
          <Title>화면</Title>
          <Preview img={bgImgData.url} />
          <MainInputWrap>
            <MainInput>
              <h2>제목</h2>
              <input type="text" value={contentData.title} onChange={(e) => {
                setContentData({ ...contentData, title: e.target.value })
              }} />
            </MainInput>
            <MainInput>
              <OptionalInput
                title={"배경 이미지"}
                defaultImg={defaultImg}
                getImage={(file: File) => resizeImage(file, 2400, 1500)}
                setData={setBgImgData}
                styles={{ backgroundColor: "#545c6b", marginTop: "10px", padding: "14px 16px" }}
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

export async function getServerSideProps() {
  const data = 'Hello, World!';

  return {
    props: {
      data,
    },
  };
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
    margin-left: 28px;
    margin-right: 8px;
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
  color:#F1F6F9;
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
const MainInput = styled.div`
  display:flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 16px;
  flex:1;
  overflow: hidden;
  div{
    display:flex;
    justify-content: space-between;
  }
  h2{
    color:#F1F6F9;
    font-size: 15px;
    margin-right: 8px;
  }
  input{
    color:#F1F6F9;
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
const MainInputWrap = styled.div`
  display:flex;
  justify-content: space-between;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
`