import styled from 'styled-components'

export default function Create() {
  return (
    <Container>
      <input type='file' />
      <h1>My Next WebApp</h1>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`
