import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_down from "../../svg/down.svg"
import { useState, useEffect } from 'react'
import { getCompUID } from '../../lib/randomString'

type TDndEvent = PointerEvent | TouchEvent

const temp = {
  id: "0",
  title: "이상한 실험실",
  makerId: "0",
  objects: [
    {
      id: "0",
      name: "물",
      img: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
    },
    {
      id: "1",
      name: "불",
      img: "https://media.istockphoto.com/id/1323529010/ko/%EB%B2%A1%ED%84%B0/%EC%A0%88%EC%97%B0%EB%90%9C-%ED%99%94%EC%9E%AC-%EB%B2%A1%ED%84%B0.jpg?s=612x612&w=0&k=20&c=W5Vw8QImatJTlzwtBYj48aglJrOZuv0YP-tZ6TStqnc="
    },
    {
      id: "2",
      name: "수증기",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    },
    {
      id: "3",
      name: "숨겨진 요소",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    }
  ],
  found: ["0", "1"],
  combinate: [
    ["0", "1", "2"]
  ],
  backgroundImg: "url",
  sound: "url"
}

export default function Play() {
  const [leftObj, setLeftObj] = useState<string>()
  const [rightObj, setRightObj] = useState<string>()
  const [selectObj, setSelectObj] = useState<HTMLElement>()
  const data = temp;

  const makeHandleDnd = (place: 'left' | 'right' | 'start') => {
    return (e: TDndEvent) => {
      let obj = (e.target as HTMLElement | null)?.id
      if (place === "left") {
        obj = leftObj;
        setLeftObj(undefined)
      } else if (place === "right") {
        obj = rightObj;
        setRightObj(undefined)
      }
      const moveEventName = "clientX" in e ? "pointermove" : "touchmove"
      const startEventName = "clientX" in e ? "pointerdown" : "touchstart"
      const endEventName = "clientX" in e ? "pointerup" : "touchend"
      const { x, y } = getLocate(e)
      const newObj = document.createElement("div")
      const uid = getCompUID(16, document)
      newObj.id = uid
      newObj.className = obj + " " + "object"
      newObj.style.left = x - 65 / 2 + "px"
      newObj.style.top = y - 65 / 2 + "px"
      newObj.style.backgroundImage = `url(${data.objects.find(value => value.id === obj)?.img})`
      document.body.appendChild(newObj)
      setSelectObj(newObj)
      const handleMove = (e: TDndEvent) => {
        const { x, y } = getLocate(e)
        newObj.style.left = x - 65 / 2 + "px"
        newObj.style.top = y - 65 / 2 + "px"
      }
      const handleEnd = (e: TDndEvent) => {
        setSelectObj(undefined)
        const target = e.target as HTMLElement
        const { x, y } = getLocate(e)
        const leftCombine = document.getElementById("leftCombine")
        const rightCombine = document.getElementById("rightCombine")
        const objectList = document.getElementById("objectList")
        if (!leftCombine || !rightCombine || !objectList) return
        const checkObjIn = (elem: HTMLElement) => {
          const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = elem
          const checkLeft = offsetLeft < x && offsetLeft + offsetWidth > x
          const checkTop = offsetTop < y && offsetTop + offsetHeight > y
          return checkLeft && checkTop
        }
        if (checkObjIn(leftCombine)) {
          setLeftObj(target.classList[0]);
          target.remove()
        } else if (checkObjIn(rightCombine)) {
          setRightObj(target.classList[0]);
          target.remove()
        } else if (checkObjIn(objectList)) {
          target.remove()
        }
        newObj.style.cursor = "grab"
        target.removeEventListener(moveEventName, handleMove);
      }
      newObj.addEventListener(startEventName, (e) => {
        newObj.style.cursor = "grabbing"
        const { x, y } = getLocate(e)
        newObj.style.left = x - 65 / 2 + "px"
        newObj.style.top = y - 65 / 2 + "px"
        setSelectObj(newObj)
        newObj.addEventListener(moveEventName, handleMove)
      })
      newObj.addEventListener(endEventName, handleEnd)
      newObj.addEventListener(moveEventName, handleMove)
    }
  }

  const getLocate = (e: TDndEvent) => {
    if ("clientX" in e) return { x: e.clientX, y: e.clientY }
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    setSelectObj(undefined)
    const target = selectObj;
    if (!target) return;
    const handleTouchMove = (e: TouchEvent) => {
      target.style.left = e.changedTouches[0].clientX - 65 / 2 + "px"
      target.style.top = e.changedTouches[0].clientY - 65 / 2 + "px"
    }
    const x = e.changedTouches[0].clientX
    const y = e.changedTouches[0].clientY
    const leftCombine = document.getElementById("leftCombine")
    const rightCombine = document.getElementById("rightCombine")
    const objectList = document.getElementById("objectList")
    if (!leftCombine || !rightCombine || !objectList) return
    if (leftCombine.offsetLeft < x && leftCombine.offsetLeft + rightCombine.offsetWidth > x && leftCombine.offsetTop < y && leftCombine.offsetTop + leftCombine.offsetHeight > y) {
      setLeftObj(target.classList[0]);
      target.remove()
    } else if (rightCombine.offsetLeft < x && rightCombine.offsetLeft + rightCombine.offsetWidth > x && rightCombine.offsetTop < y && rightCombine.offsetTop + rightCombine.offsetHeight > y) {
      setRightObj(target.classList[0]);
      target.remove()
    } else if (objectList.offsetLeft < x && objectList.offsetLeft + objectList.offsetWidth > x && objectList.offsetTop < y && objectList.offsetTop + objectList.offsetHeight > y) {
      target.remove()
    }
    target.removeEventListener("touchmove", handleTouchMove);
  }

  const handleObj = () => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return {
      onTouchStart: makeHandleDnd("start"),
      onTouchEnd: handleTouchEnd
    }
    return { onPointerDown: makeHandleDnd("start") }
  }

  const handleCombine = (place: "left" | "right") => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return { onTouchStart: makeHandleDnd(place) }
    else if (!isMobile) return { onPointerDown: makeHandleDnd(place) }
  }

  const handleMove = (e: TDndEvent) => {
    if (typeof navigator !== "object" || !selectObj) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const { x, y } = getLocate(e)
    const checkMobileEvent = isMobile && "changedTouches" in e
    const checkPCEvent = !isMobile && "clientX" in e
    if (!checkMobileEvent && !checkPCEvent) return;
    selectObj.style.left = x - 65 / 2 + "px"
    selectObj.style.top = y - 65 / 2 + "px"
  }

  return (
    <Container
      id="playCont"
      onTouchMove={handleMove}
      onPointerMove={handleMove}
    >
      <Header></Header>
      <Main>
        <Contents>
          <ObjectBackground id="objectList">
            <ObjectHeader>
              <h1>오브젝트</h1>
              <DownBtn />
            </ObjectHeader>
            <ObjectList>
              {
                data.objects.filter(value => data.found.includes(value.id))
                  .map((value, key) => (
                    <Object key={key}>
                      <ObjectImg
                        id={value.id}
                        style={{ backgroundImage: `url("${value.img}")` }}
                        {...handleObj()}
                      />
                      <h1>{value.name}</h1>
                    </Object>
                  ))
              }
            </ObjectList>
          </ObjectBackground>
          <MainContent>
            <Title>
              <h1>{data.title}</h1>
            </Title>
            <CombineWrap>
              <Combine
                id="leftCombine"
                style={{ backgroundImage: `url(${data.objects.find(value => value.id === leftObj)?.img})` }}
                {...handleCombine("left")}
              />
              <Plus />
              <Combine
                id="rightCombine"
                style={{ backgroundImage: `url(${data.objects.find(value => value.id === rightObj)?.img})` }}
                {...handleCombine("right")}
              />
            </CombineWrap>
            <div style={{ height: "15%" }}></div>
          </MainContent>
        </Contents>
        <Ads>Ad</Ads>
      </Main>
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  display:flex;
  flex-direction: column;
  overflow: none;
`
const Header = styled.header`
  width:100vw;
  height:48px;
  background-color: beige;
`
const Main = styled.div`
  flex:1;
  display:flex;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`
const Contents = styled.main`
  flex:1;
  background: linear-gradient(180deg, rgba(65, 65, 65, 0.75) 0%, rgba(65, 65, 65, 0) 37.62%), url(/image.jpg);
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  display:flex;
  @media screen and (max-width: 800px) {
    flex-direction: column-reverse;
  }
`
const MainContent = styled.main`
  flex:1;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
`
const Title = styled.div`
  width:100%;
  display:flex;
  justify-content: center;
  align-items: center;
  h1{
    font-size: 40px;
    font-weight: bold;
    color:white;
    @media screen and (max-width: 800px) {
      font-size: 32px;
    }
  }
`
const CombineWrap = styled.div`
  width:100%;
  display:flex;
  align-items: center;
  justify-content: center;
`
const Combine = styled.div`
  cursor: grab;
  width:120px;
  height:120px;
  margin: 0px 24px;
  border-radius: 1000px;
  background: rgba(255, 255, 255, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(3px);
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
  @media screen and (max-width: 800px) {
    width:90px;
    height:90px;
    border: 2px solid rgba(255, 255, 255, 0.6);
    margin: 0px 12px;
  }
`
const ObjectBackground = styled.div`
  width:320px;
  display:flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  border-right: 2px solid rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3.5px);
  padding-bottom: 24px;
  @media screen and (max-width: 800px) {
    width:100%;
    padding-bottom: 12px;
    border-top: 2px solid rgba(255, 255, 255, 0.2);
    border-right: none;
  }
`
const Plus = styled(SVG_plus)`
  width:65px;
  height:65px; 
  fill:white;
  @media screen and (max-width: 800px) {
    width:45px;
    height:45px; 
  }
`
const Ads = styled.div`
  width:150px;
  background-color: #d6d6d6;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    height:100px;
    width:100vw;
  }
`
const ObjectHeader = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding:24px;
  padding-top: 18px;
  * {
    color:white;
  }
  @media screen and (max-width: 800px) {
    padding: 16px;
    padding-top: 12px;
    h1{
      font-size: 15px;
    }
  }
`
const ObjectList = styled.div`
  display:flex;
  flex-wrap: wrap;
  padding: 0px 12px;
  @media screen and (max-width: 800px) {
    padding: 0px 6px;
  }
`
const Object = styled.div`
  width:33%;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  h1{
    margin-top: 12px;
    font-size: 16px;
    color:white;
  }
  @media screen and (max-width: 800px) {
    width:25%;
    h1{
      margin-top: 8px;
      font-size: 14px;
      color:white;
    }
    margin-bottom: 16px;
  }
`
const ObjectImg = styled.div`
  width:65px;
  height:65px;
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
const DownBtn = styled(SVG_down)`
  width:28px;
  height:28px; 
  fill:white;
  @media screen and (max-width: 800px) {
    width:20px;
    height:20px; 
  }
`