import styled from 'styled-components'

export default function Create() {
  return (
    <Container>
      <Header></Header>
      <Main>
        <Contents></Contents>
        <Combine></Combine>
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
  width:50%;
`
const Combine = styled.div`
  flex:1;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`