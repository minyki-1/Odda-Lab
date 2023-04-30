import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_arrow_right from "../../svg/arrow-right.svg"

export default function Create() {
  return (
    <Container>
      <Header></Header>
      <Main>
        <Contents>
          <Title>시작 오브젝트</Title>
          <ObjectList>
            <Object>
              <ObjectImg
              />
              <h1>물</h1>
            </Object>
          </ObjectList>
          <Title>조합 오브젝트</Title>
          <ObjectList>
            <Object>
              <ObjectImg
              />
              <h1>물</h1>
            </Object>
          </ObjectList>
          <Title>화면</Title>
          <Preview></Preview>
        </Contents>
        <Combine>
          <CombineTitle>조합</CombineTitle>
          <CombineObj>
            <Object>
              <ObjectImg
              />
              <h1>물</h1>
            </Object>
            <SVG_plus width="48" height="48" />
            <Object>
              <ObjectImg
              />
              <h1>물</h1>
            </Object>
            <SVG_arrow_right width="48" height="48" />
            <Object>
              <ObjectImg
              />
              <h1>물</h1>
            </Object>
          </CombineObj>
        </Combine>
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
  background-color: #D9D9D9;
`
const Main = styled.div`
  display:flex;
  width:100%;
  flex:1;
`
const Contents = styled.div`
  width:45%;
  display:flex;
  flex-direction: column;
  padding: 24px;
  padding-top:0px;
  height:calc(100vh - 48px - 24px);
  overflow-y: scroll;
`
const Combine = styled.div`
  flex:1;
  background-color: rgba(219, 219, 219, 0.2);
  height:calc(100vh - 48px);
  overflow-y: scroll;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`
const Title = styled.div`
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 28px;
`
const Preview = styled.div`
  width:100%;
  aspect-ratio:16 / 9;
  margin: 4px;
  background-color: #D9D9D9;
`
const ObjectList = styled.div`
  display:flex;
  flex-wrap: wrap;
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
  h1{
    margin-top: 12px;
    font-size: 16px;
    color:black;
  }
  @media screen and (max-width: 800px) {
    h1{
      margin-top: 8px;
      font-size: 14px;
    }
    margin-bottom: 16px;
  }
`
const ObjectImg = styled.div`
  width:60px;
  height:60px;
  cursor: grab;
  border-radius: 100px;
  background-color: #000000;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  @media screen and (max-width: 800px) {
    width:50px;
    height:50px;
  }
`
const CombineTitle = styled.div`
  font-size: 20px;
  margin: 24px;
  margin-top: 36px;
  margin-bottom: 28px;
`
const CombineObj = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  background-color: white;
  padding: 20px 40px;
  margin: 20px 0px;
`