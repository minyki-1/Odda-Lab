import styled from 'styled-components'
import SVG_search from "../svg/search.svg"

export default function Home() {
  return (
    <Container>
      <Header></Header>
      <SortWrapper>
        <SortList>
          <h1>Popular</h1>
          <h1>Newest</h1>
          <h1>Workspace</h1>
        </SortList>
        <Search>
          <input type="text" />
          <SVG_search fill="#F1F6F9" width={24} height={24} />
        </Search>
      </SortWrapper>
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
`
const SortList = styled.div`
  display:flex;
  h1{
    font-size: 20px;
    padding: 2px;
    margin-right:18px;
    cursor: pointer;
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