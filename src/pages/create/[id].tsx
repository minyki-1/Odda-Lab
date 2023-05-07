import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_arrow_right from "../../svg/arrow-right.svg"
import SVG_cross from "../../svg/cross.svg"
import SVG_pencil from "../../svg/pencil.svg"
import { useState, useEffect } from 'react'
import { cropImage } from '../../lib/image'
import Image from 'next/image'

interface IPostData {
  id: string,
  title: string,
  makerId: string,
  objects: { id: string, name: string, img: string | FormData }[],
  start: string[],
  combine: string[],
  combinate: string[][],
  background: string,
  sound: string
}

const temp: IPostData = {
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
  start: ["0", "1"],
  combine: ["2", "3"],
  combinate: [
    ["0", "1", "2"]
  ],
  background: "/image.jpg",
  sound: "url"
}

export default function Create() {
  const defaultImg = "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
  const [datas, setDatas] = useState(temp);
  const [selectObj, setSelectObj] = useState<string>()
  const [newObjModal, setNewObjModal] = useState<"start" | "combine">()
  const [newObjImgUrl, setNewObjImgUrl] = useState(defaultImg)
  const [newObjImg, setNewObjImg] = useState<FormData | string>()
  const [newObjName, setNewObjName] = useState("")
  const [displayImg, setDisplayImg] = useState<string>()

  const objImgProps = (data: string) => ({
    id: data,
    onClick: handleOnClick,
    size: selectObj === data ? "60" : "50",
    img: findObjValueById(data, "img") ?? "",
    className: "obj",
    border: selectObj === data ? "3px solid rgb(75, 124, 222)" : "",
  })

  const handleOnClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    setSelectObj(target.id)
  }

  const findObjValueById = (id: string | undefined, value: "img" | "id" | "name"): string | undefined => {
    const data = datas.objects.find(value => id === value.id)
    if (!data) return { id: undefined, name: "?", img: undefined }[value]
    const dataInVal = data[value]
    if (typeof dataInVal === "string") return dataInVal
    const file = dataInVal.get("file") as File | null
    if (file) return URL.createObjectURL(file)
  }

  const handleCombine = (data: string[], key: number, kind: number, selectObj: string | undefined) => {
    const onClick = () => {
      if (!selectObj) return;
      const newData: IPostData = JSON.parse(JSON.stringify(datas))
      newData.combinate[key][kind] = selectObj
      const combinate = newData.combinate[key]
      let isSame = false
      if (combinate[0] === "" || combinate[1] === "" || combinate[2] === "") {
        setSelectObj(undefined)
        setDatas(newData)
        return;
      }
      if (combinate[0] === combinate[2] || combinate[1] === combinate[2]) {
        isSame = true;
        alert("재료가 결과가 될 수 없습니다.");
      }
      newData.combinate.forEach((combine, combKey) => {
        if (key === combKey) return;
        const same1 = combine[0] === combinate[0] && combine[1] === combinate[1]
        const same2 = combine[0] === combinate[1] && combine[1] === combinate[0]
        const same3 = combine[1] === combinate[0] && combine[0] === combinate[1]
        if (same1 || same2 || same3) {
          isSame = true;
          return alert("위치만 다른 동일한 재료를 설정할 수 없습니다.");
        }
      })
      if (isSame) return;
      setDatas(newData)
      setSelectObj(undefined)
    }
    return {
      onClick,
      size: "65",
      className: "obj",
      style: { backgroundImage: `url(${findObjValueById(data[kind], "img")})` }
    }
  }

  return (
    <Container onClick={(e: MouseEvent) => {
      const { className } = (e.target as HTMLElement);
      if (selectObj && !className && className.indexOf('obj') === -1) setSelectObj(undefined);
    }}>
      {
        newObjModal ?
          <NewObjModalBg>
            <NewObjModal>
              <NewObjModalHeader>
                <h1>새 오브젝트</h1>
                <SVG_cross onClick={() => { setNewObjModal(undefined) }} width={36} height={36} />
              </NewObjModalHeader>
              <NewObjModalLab htmlFor="modalInput" img={newObjImgUrl}>
                <Image src={newObjImgUrl} alt="object" width={170} height={170} />
                <div>
                  <SVG_pencil fill="white" width="60" height="60" />
                </div>
              </NewObjModalLab>
              <input
                type="file"
                id="modalInput"
                accept="image/*"
                onChange={async (e) => {
                  const input = e.target as HTMLInputElement
                  const files = input.files;
                  if (!files) return;
                  const croppedImg = await cropImage(files[0], 360)
                  setNewObjImgUrl(URL.createObjectURL(croppedImg))
                  const newFormData = new FormData();
                  newFormData.append('file', croppedImg);
                  setNewObjImg(newFormData)
                }}
                style={{ display: "none" }}
              />
              <input value={newObjName} onChange={(e) => { setNewObjName(e.target.value) }} type="text" />
              <button onClick={() => {
                if (!newObjImg) return;
                const copyData = { ...datas }
                const newObject = {
                  id: String(copyData.objects.length),
                  name: newObjName,
                  img: newObjImg
                }
                if (newObjModal === "combine") copyData.combine.push(String(copyData.objects.length))
                else copyData.start.push(String(copyData.objects.length))
                copyData.objects.push(newObject)
                setDatas(copyData)

                setNewObjModal(undefined)
                setNewObjImgUrl(defaultImg)
                setNewObjImg(undefined)
              }}>생성</button>
            </NewObjModal>
          </NewObjModalBg>
          : null
      }
      <Header>
        {/* <button onClick={async () => {
          await fetch('http://localhost:3000/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: formData,
          });
        }}>전달</button>
        <button onClick={async () => {
          const response = await fetch('http://localhost:3000/images/0');
          const data = await response.json()
          const blob = new Blob([Buffer.from(data[0].file.buffer)]);
          setDisplayImg(URL.createObjectURL(blob))
        }}>받기</button> */}
      </Header>
      <Main>
        <Contents>
          <Title>화면</Title>
          {displayImg && <Image src={displayImg} alt='display image' width={200} height={200} />}
          <Preview></Preview>
        </Contents>
        <ObjectContent>
          <TitleWrap>
            <h1>시작 오브젝트</h1>
            <button onClick={() => setNewObjModal("start")}>
              <SVG_plus width="22" height="22" />
            </button>
          </TitleWrap>
          <ObjectList>
            {
              datas.start.map((data, key) => (
                <Object key={key}>
                  <ObjectImg {...objImgProps(data)} />
                  <h1>{findObjValueById(data, "name")}</h1>
                </Object>
              ))
            }
          </ObjectList>
          <TitleWrap>
            <h1>조합 오브젝트</h1>
            <button onClick={() => setNewObjModal("start")}>
              <SVG_plus width="22" height="22" />
            </button>
          </TitleWrap>
          <ObjectList>
            {
              datas.combine.map((data, key) => (
                <Object key={key}>
                  <ObjectImg {...objImgProps(data)} />
                  <h1>{findObjValueById(data, "name")}</h1>
                </Object>
              ))
            }
          </ObjectList>
          <TitleWrap>
            <h1>조합</h1>
            <button onClick={() => {
              const newData = { ...datas }
              newData.combinate.unshift(["", "", ""])
              setDatas(newData)
            }}>
              <SVG_plus width="22" height="22" />
            </button>
          </TitleWrap>
          {
            datas.combinate.map((data, key) => (
              <CombineObj key={key}>
                <Object>
                  <ObjectImg {...handleCombine(data, key, 0, selectObj)} />
                  <h1>{findObjValueById(data[0], "name")}</h1>
                </Object>
                <SVG_plus width="36" height="36" />
                <Object>
                  <ObjectImg {...handleCombine(data, key, 1, selectObj)} />
                  <h1>{findObjValueById(data[1], "name")}</h1>
                </Object>
                <SVG_arrow_right width="36" height="36" />
                <Object>
                  <ObjectImg {...handleCombine(data, key, 2, selectObj)} />
                  <h1>{findObjValueById(data[2], "name")}</h1>
                </Object>
              </CombineObj>
            ))
          }
        </ObjectContent>
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
  flex:1;
  display:flex;
  flex-direction: column;
  padding: 24px;
  padding-top:0px;
  height:calc(100vh - 48px - 24px);
  overflow-y: scroll;
`
const ObjectContent = styled.div`
  width:460px;
  height:calc(100vh - 48px - 24px);
  background-color: rgb(240, 240, 245);
  overflow-y: scroll;
  padding: 24px;
  padding-top:0px;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`
const Title = styled.div`
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 24px;
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
    font-size: 14px;
    color:black;
  }
  @media screen and (max-width: 800px) {
    h1{
      margin-top: 8px;
      font-size: 12px;
    }
    margin-bottom: 16px;
  }
`
const ObjectImg = styled.div<{ size: string, img: string, shadow: string, border: string }>`
  width:${({ size }: { size: string }) => size + "px"};
  height:${({ size }: { size: string }) => size + "px"};
  background-image: ${({ img }: { img: string }) => `url(${img})`};
  box-shadow:${({ shadow }: { shadow: string }) => shadow};
  border:${({ border }: { border: string }) => border};
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
const CombineObj = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgb(225, 225, 230);
  padding: 16px 30px;
  margin: 20px -24px;
  margin-bottom: -12px;
`
const TitleWrap = styled.div`
  display:flex;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 8px;
  h1{
    font-size: 16px;
    margin-right: 8px;
  }
  button{
    border: none;
    display:flex;
    cursor: pointer;
    border-radius: 24px;
    padding: 4px;
    &:hover{
      background-color: #e0e0e0;
    }
  }
`
const NewObjModalBg = styled.div`
  width:100vw;
  height:100vh;
  z-index: 999;
  background-color: rgba(0,0,0,0.25);
  backdrop-filter: blur(2.5px);
  position: fixed;
  display:flex;
  align-items: center;
  justify-content: center;
`
const NewObjModal = styled.div`
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background-color: white;
  width:310px;
  aspect-ratio:3 / 4;
  input{
    border:none;
    background-color: #e9e9e9;
    width:75%;
    padding:12px 18px;
    text-align: center;
    margin: 30px;
    font-size: 18px;
  }
`
const NewObjModalHeader = styled.div`
  margin-bottom: 16px;
  display:flex;
  width:100%;
  align-items: center;
  justify-content: space-between;
  h1{
    width:100%;
    font-size: 22px;
  }
  svg{
    cursor:pointer;
  }
`
const NewObjModalLab = styled.label<{ img: string }>`
  cursor: pointer;
  display:flex;
  align-items: center;
  justify-content: center;
  img{
    width:170px;
    height:170px;
    border-radius: 100px;
    background-color: #dadada;
    position:absolute;
  }
  div{
    width:170px;
    height:170px;
    border-radius: 200px;
    background-color: rgba(0, 0, 0, 0.25);
    display:none;
    align-items: center;
    justify-content: center;
    position:absolute;
  }
  &:hover{
    div{
      display:flex;
    }
  }
`