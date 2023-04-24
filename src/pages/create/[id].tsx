import styled from 'styled-components'
import SvgHeart from '../svg/heart.svg';

const temp = {
  id: "0",
  name: "test1",
  makerId: "0",
  objects: [
    {
      id: "0",
      name: "물",
      img: "url"
    },
    {
      id: "1",
      name: "불",
      img: "url"
    },
    {
      id: "2",
      name: "수증기",
      img: "url"
    }
  ],
  combinate: [
    [0, 1, 2]
  ],
  backgroundImg: "url",
  // sound:""
}

export default function Create() {
  return (
    <Container>
      <input type='file' />
      <h1>My Next WebApp</h1>
      <SvgHeart width="24" height="24" fill="white" />
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`
