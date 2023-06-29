import styled from 'styled-components'
import SVG_search from "../svg/search.svg"
import Link from "next/link"
import SVG_heart_fill from "../svg/heart-fill.svg"
import NextImage from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface IObj {
  id: string,
  img: string,
  name: string
}

interface ILabList {
  id: string,
  title: string,
  background_img: string,
  start_obj: IObj[],
  created_at: string,
  like_count: number,
  maker_name: string,
  maker_img: string
}

export default function Home({ data }: { data: ILabList[] }) {
  const [labList, setLabList] = useState(data)
  const labListRef = useRef(null);

  const styling = (comp: HTMLElement, style: Object) => {
    for (const [key, value] of Object.entries(style)) comp.style[key as any] = value;
  }

  const handleScroll = () => {
    const labListComp = labListRef.current as HTMLElement | null;
    labListComp?.childNodes.forEach((node, key) => {
      const comp = node as HTMLElement
      const playButton = comp.getElementsByClassName(comp.id + "playBtn")[0] as HTMLElement
      const rect = (comp as HTMLElement).getBoundingClientRect();
      const onStyle = { width: "70px", height: "35px", backgroundColor: "rgba(245, 245, 245, 1)", color: "rgba(20,20,20,1)" }
      const offStyle = { width: "20px", height: "20px", backgroundColor: "rgba(245, 245, 245, 0.5)", color: "rgba(20,20,20,0)" }
      if (rect.top > 80 && rect.top < 350) {
        playButton.innerText = "Play";
        styling(playButton, onStyle)
      } else {
        playButton.innerText = "";
        styling(playButton, offStyle)
      }
    });
  }

  useEffect(() => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      handleScroll()
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [])

  return (
    <Container>
      <Header></Header>
      <SortWrapper>
        <TitleWrap>
          <SortTitle select={"true"}>Popular</SortTitle>
          <SortTitle >Newest</SortTitle>
          <SortTitle >Workspace</SortTitle>
        </TitleWrap>
        <Search>
          <input type="text" />
          <SVG_search fill="#F1F6F9" />
        </Search>
      </SortWrapper>
      <LabList ref={labListRef}>
        {
          labList.map((data, key) => (
            <Lab key={key} id={data.id}>
              <BgGradient />
              <NextImage
                fill={true}
                src={data.background_img}
                alt={'BackgroundImage'}
              />
              <LabInfo>
                <h1>{data.title}</h1>
                <div>
                  <SVG_heart_fill width={20} height={20} />
                  <h2>{data.like_count}</h2>
                  <NextImage width={24} height={24} src={data.maker_img} alt={data.maker_name} />
                  <h2>{data.maker_name}</h2>
                </div>
              </LabInfo>
              <LabPlayBtn href={`/play/${data.id}`} className={data.id + "playBtn"}>Play</LabPlayBtn>
              <PreviewObjList>
                {
                  data.start_obj.slice(0, 3).map((data, key) => (
                    <PreviewObj key={key}>
                      <NextImage src={data.img} alt={"object"} fill={true} />
                    </PreviewObj>
                  ))
                }
              </PreviewObjList>
            </Lab>
          ))
        }
      </LabList>
    </Container>
  )
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3000/lab/popular/1');
  const data = await response.json();
  return {
    props: {
      data,
    },
  };
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  background-color: #343943;
  h1,input,h2,h3,h4{
    color:#F1F6F9;
  }
  svg{
    fill:#F1F6F9;
  }
`
const Header = styled.div`
  flex:1;
  height:48px;
  background-color: #1D2334;
  display:flex;
  align-items: center;
`
const SortWrapper = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 30px;
  @media screen and (max-width: 800px) {
    justify-content: start;
    align-items: start;
    flex-direction: column;
    padding: 12px 18px;
  }
`
const TitleWrap = styled.div`
  display: flex;
  align-items: center;
  height:45px;
  margin-bottom: 12px;
`
const SortTitle = styled.h1<{ select: string }>`
  font-size: 16px;
  padding: 2px;
  margin-right:16px;
  cursor: pointer;
  opacity: ${({ select }: { select: string }) => select === "true" ? 1 : 0.6};
  &:hover{
    opacity:1;
  }
`
const Search = styled.div`
  background-color: #252B30;
  display:flex;
  align-items: center;
  border-radius: 4px;
  input{
    width:250px;
    font-size: 16px;
    padding:12px 16px;
  }
  svg{
    width:22px;
    height:22px;
    padding:12px 16px;
    cursor: pointer;
  }
  @media screen and (max-width: 800px) {
    width:100%;
    input{
      flex:1;
      font-size: 16px;
      padding:12px 16px;
    }
    svg{
      width:20px;
      height:20px;
      padding:10px 14px;
      cursor: pointer;
    }
  }
`
const LabList = styled.div`
  display:flex;
  flex-wrap: wrap;
  flex: 1;
  padding-bottom: 300px;
`
const Lab = styled.div`
  display:flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  width:calc(100% / 2 - 45px);
  aspect-ratio: 16 / 10;
  background-color: white;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 0px 12px 6px rgba(0,0,0,0.2);
  position: relative;
  img{
    object-fit: cover;
    z-index: 1;
  }
  @media screen and (min-width: 1500px) {
    width:calc(100% / 3 - 40px);
  }
  @media screen and (max-width: 800px) {
    width:calc(100% - 40px);
    margin-left: 20px;
    aspect-ratio: 16 / 10;
  }
`
const LabPlayBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  margin: 24px 28px;
  width:30px;
  height:30px;
  border-radius: 8px;
  border: none;
  background-color: rgba(245, 245, 245, 0.5);
  transition: 0.25s;
  box-shadow: 0px 0px 16px 4px rgba(0,0,0,0.2);
  color:rgba(20,20,20,0);
  cursor: pointer;
  font-size: 18px;
  &:hover{
    width:90px;
    height:45px;
    background-color: rgba(245, 245, 245, 1);
    color:rgba(20,20,20,1);
  }
  @media screen and (max-width: 500px) {
    font-size: 16px;
    margin: 16px 20px;
    width:20px;
    height:20px;
    border-radius: 6px;
    &:hover{
      width:70px;
      height:35px;
    }
  }
`
const PreviewObjList = styled.div`
  display:flex;
  align-items: center;
  justify-content: center;
  width:100%;
  height:100%;
  position: absolute;
`
const PreviewObj = styled.div`
  display:flex;
  align-items: center;  
  justify-content: center;
  width:12%;
  aspect-ratio: 1 / 1;
  border-radius: 100px;
  overflow: hidden;
  margin: 20px;
  z-index: 3;
  position: relative;
  @media screen and (max-width: 800px) {
    width:15%;
    margin: 14px;
  }
`
const LabInfo = styled.div`
  padding: 22px 24px;
  width:calc(100% - 48px);
  display:flex;
  align-items: center;
  justify-content: space-between;
  z-index: 3;
  div{
    display:flex;
    align-items: center;
  }
  h1{
    font-size: 18px;
  }
  h2{
    font-size: 16px;
    margin-left: 8px;
    margin-right: 4px;
  }
  img{
    margin-left: 16px;
    border-radius: 100px;
  }
  @media screen and (max-width: 500px) {
    padding: 16px 20px;
    width:calc(100% - 40px);
    h1{
      font-size: 16px;
    }
    h2{
      font-size: 13px;
      margin-left: 6px;
      margin-right: 2px;
    }
    img{
      width:20px;
      height:20px;
      margin-left: 14px;
      border-radius: 100px;
    }
    svg{
      width:18px;
      height:18px;
    }
  }
`
const BgGradient = styled.div`
  width:100%;
  height:100%;
  position: absolute;
  z-index: 2;
  background: linear-gradient(0deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%); 
`