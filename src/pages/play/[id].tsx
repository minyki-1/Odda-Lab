import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_down from "../../svg/down.svg"
import { useState, useEffect, useRef } from 'react'
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
  const [selectObj, setSelectObj] = useState<string>()
  const leftCombine = useRef<HTMLElement>(null);
  const rightCombine = useRef<HTMLElement>(null);
  const objectList = useRef<HTMLElement>(null);
  const [dndObjs, setDndObjs] = useState<{ id: string, className: string, x: number, y: number }[]>([])
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
      const id = getCompUID(16, document)
      setSelectObj(id)
      const { x, y } = getLocate(e)
      if (obj) setDndObjs([...dndObjs, { id, className: obj, x, y }])
    }
  }

  const getLocate = (e: TDndEvent) => {
    if ("clientX" in e) return { x: e.clientX, y: e.clientY }
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
  }

  const handleObj = () => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return { onTouchStart: makeHandleDnd("start"), onTouchEnd: handleDndDrop }
    return { onPointerDown: makeHandleDnd("start") }
  }

  const handleCombine = (place: "left" | "right") => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return { onTouchStart: makeHandleDnd(place), onTouchEnd: handleDndDrop }
    else if (!isMobile) return { onPointerDown: makeHandleDnd(place) }
  }

  const handleMove = (e: TDndEvent) => {
    e.preventDefault()
    if (typeof navigator !== "object" || !selectObj) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const { x, y } = getLocate(e)
    const checkMobileEvent = isMobile && "changedTouches" in e
    const checkPCEvent = !isMobile && "clientX" in e
    const obj = document.getElementById(selectObj)
    if ((!checkMobileEvent && !checkPCEvent) || !obj) return;
    obj.style.left = x - 65 / 2 + "px"
    obj.style.top = y - 65 / 2 + "px"
  }

  const findObjValueById = (id: string | undefined, value: "img" | "id" | "name") => {
    const result = data.objects.find(value => id === value.id)
    if (!result) return undefined
    return result[value]
  }

  const handleDndObj = () => {
    if (typeof navigator !== "object") return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return {
      onTouchStart: handleDndGrap,
      onTouchEnd: handleDndDrop,
      onTouchMove: handleMove
    }
    return {
      onPointerDown: handleDndGrap,
      onPointerUp: handleDndDrop,
      onPointerMove: handleMove
    }
  }

  const handleDndGrap = (e: TDndEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    target.style.cursor = "grabbing"
    target.style.zIndex = "100"
    const { x, y } = getLocate(e)
    target.style.left = x - 65 / 2 + "px"
    target.style.top = y - 65 / 2 + "px"
    setSelectObj(target.id)
  }

  const handleDndDrop = (e: TDndEvent) => {
    e.preventDefault()
    const target = selectObj ? document.getElementById(selectObj) : null;
    if (!target) return;
    const { x, y } = getLocate(e)
    const checkObjIn = (elem: HTMLElement | null) => {
      if (!elem) return
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = elem
      const checkLeft = offsetLeft < x && offsetLeft + offsetWidth > x
      const checkTop = offsetTop < y && offsetTop + offsetHeight > y
      return checkLeft && checkTop
    }
    if (checkObjIn(leftCombine.current)) {
      setLeftObj(target.classList[target.classList.length - 1]);
      target.remove()
    } else if (checkObjIn(rightCombine.current)) {
      setRightObj(target.classList[target.classList.length - 1]);
      target.remove()
    } else if (checkObjIn(objectList.current)) {
      target.remove()
    }
    setSelectObj(undefined)
    target.style.cursor = "grab"
    target.style.zIndex = "1"
  }

  const disablePullToRefresh = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const preventPullToRefresh = (event: TouchEvent) => event.preventDefault();
    window.addEventListener("touchmove", preventPullToRefresh, { passive: false });
    return () => {
      window.removeEventListener("touchmove", preventPullToRefresh);
    };
  }

  useEffect(() => {
    return disablePullToRefresh();
  }, []);

  return (
    <Container
      onTouchMove={handleMove}
      onPointerMove={handleMove}
    >
      {
        dndObjs.map(({ id, className, x, y }, key) => (
          <DndObject
            style={{
              backgroundImage: `url("${data.objects.find(value => value.id === className)?.img}")`,
              left: x - 65 / 2,
              top: y - 65 / 2
            }}
            key={key}
            id={id}
            className={className}
            {...handleDndObj()}
          />
        ))
      }
      <Header></Header>
      <Main>
        <Contents>
          <ObjectBackground ref={objectList}>
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
                ref={leftCombine}
                style={{ backgroundImage: `url(${findObjValueById(leftObj, "img")})` }}
                {...handleCombine("left")}
              />
              <Plus />
              <Combine
                ref={rightCombine}
                style={{ backgroundImage: `url(${findObjValueById(rightObj, "img")})` }}
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
const DndObject = styled.div<{ img: string }>`
  width:65px;
  height:65px;
  cursor:grabbing;
  position: absolute;
  z-index: 1;
  border-radius: 100px;
  background-color: white;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
`