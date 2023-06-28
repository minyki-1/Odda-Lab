import styled from 'styled-components'
import SVG_search from "../svg/search.svg"
import Link from "next/link"
import SVG_heart_fill from "../svg/heart-fill.svg"
import NextImage from 'next/image'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    console.log(labList)
  }, [labList])

  return (
    <Container>
      <Header></Header>
      <SortWrapper>
        <div>
          <SortTitle select={"true"}>Popular</SortTitle>
          <SortTitle >Newest</SortTitle>
          <SortTitle >Workspace</SortTitle>
        </div>
        <Search>
          <input type="text" />
          <SVG_search fill="#F1F6F9" width={24} height={24} />
        </Search>
      </SortWrapper>
      <LabList>
        {
          labList.map((data, key) => (
            <Lab href={`/play/${data.id}`} key={key}>
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
  padding: 24px 40px;
  div{
    display: flex;
  }
`
const SortTitle = styled.h1<{ select: string }>`
  font-size: 20px;
  padding: 2px;
  margin-right:18px;
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
    width:360px;
    font-size: 16.5px;
    padding:12px 16px;
  }
  svg{
    padding:12px 16px;
    cursor: pointer;
  }
`
const LabList = styled.div`
  display:flex;
  flex-wrap: wrap;
  flex: 1;
`
const Lab = styled(Link)`
  display:flex;
  justify-content: space-between;
  flex-direction: column;
  margin-left: 30px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #252B30;
  width:calc(50% - 45px);
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0px 0px 12px 6px rgba(0,0,0,0.2);
  position: relative;
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
  position: relative;
  @media screen and (max-width: 800px) {
    width:50px;
    height:50px;
  }
  img{
    object-fit: cover;
  }
`
const LabInfo = styled.div`
  padding: 22px;
  display:flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1;
  div{
    display:flex;
    align-items: center;
  }
  h1{
    font-size: 18px;
    margin-right: 20px;
  }
  h2{
    font-size: 16px;
    margin-left: 8px;
    margin-right: 18px;
  }
  img{
    margin-left: 6px;
    border-radius: 100px;
  }
`