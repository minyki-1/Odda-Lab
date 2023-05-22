import styled from 'styled-components'
import SVG_search from "../svg/search.svg"
import Link from "next/link"
import SVG_heart_fill from "../svg/heart-fill.svg"
const tempObjURL = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
const tempData = [
  { id: "0", title: "테스트 실험실1", backgroundImage: "/image.jpg", object: [tempObjURL, tempObjURL, tempObjURL] },
  { id: "1", title: "테스트 실험실2", backgroundImage: "/image.jpg", object: [tempObjURL, tempObjURL, tempObjURL] }
]

export default function Home() {
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
      <RabotoryList>
        {
          tempData.map((data, key) => (
            <Rabotory href={`/play/${data.id}`} key={key}>
              <RabImg>
                <div style={{ backgroundImage: `url(${data.object[0]})` }}></div>
                <div style={{ backgroundImage: `url(${data.object[1]})` }}></div>
                <div style={{ backgroundImage: `url(${data.object[2]})` }}></div>
              </RabImg>
              <RabTitle>{data.title}</RabTitle>
              <RabInfo>
                <SVG_heart_fill width={16} height={16} />
                <h2>20</h2>
                <SVG_heart_fill width={16} height={16} />
                <h2>20</h2>
              </RabInfo>
            </Rabotory>
          ))
        }
      </RabotoryList>
    </Container>
  )
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
const RabotoryList = styled.div`
  display:flex;
  flex-wrap: wrap;
  flex: 1;
`
const Rabotory = styled(Link)`
  display:flex;
  flex-direction: column;
  margin-left: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #252B30;
  width:calc(33% - 50px);
  border-radius: 8px;
  box-shadow: 0px 0px 12px 6px rgba(0,0,0,0.2);
`
const RabImg = styled.div`
  width:100%;
  aspect-ratio: 16 / 9;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(/image.jpg);
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  display:flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  div{
    width:70px;
    height:70px;
    border-radius: 100px;
    background-position: center center;
    background-repeat: repeat-x;
    background-size: cover;
    margin: 20px;
    @media screen and (max-width: 800px) {
      width:50px;
      height:50px;
    }
  }
`
const RabTitle = styled.h1`
  padding: 16px;
  font-size: 20px;
`
const RabInfo = styled.div`
  padding: 18px;
  padding-top: 0px;
  display:flex;
  align-items: center;
  h2{
    font-size: 17px;
    margin-left: 4px;
    margin-right: 20px;
  }
  svg{
    padding:4px;
  }
`