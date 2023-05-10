import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_arrow_right from "../../svg/arrow-right.svg"
import { ChangeEvent, useState } from 'react'
import NextImage from 'next/image'
import CreateObjModal from "../../components/create/createObjModal"
import { cropImage, resizeImage } from '../../lib/image'
import { IPostData } from '../../types/data'

const temp: IPostData = {
  id: "0",
  title: "이상한 실험실",
  makerId: "0",
  objects: [
    {
      id: "a0",
      name: "물",
      img: "https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Ft1.daumcdn.net%2Fcfile%2Ftistory%2F244B0939537624F506"
    },
    {
      id: "a1",
      name: "불",
      img: "https://media.istockphoto.com/id/1323529010/ko/%EB%B2%A1%ED%84%B0/%EC%A0%88%EC%97%B0%EB%90%9C-%ED%99%94%EC%9E%AC-%EB%B2%A1%ED%84%B0.jpg?s=612x612&w=0&k=20&c=W5Vw8QImatJTlzwtBYj48aglJrOZuv0YP-tZ6TStqnc="
    },
    {
      id: "a2",
      name: "수증기",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    },
    {
      id: "a3",
      name: "숨겨진 요소",
      img: "https://previews.123rf.com/images/rigamondis/rigamondis1111/rigamondis111100015/11317989-%EC%95%84%EC%9D%B4%EC%8A%AC%EB%9E%80%EB%93%9C%EC%9D%98-%ED%95%98%EB%8A%98%EB%A1%9C-%EC%8A%A4%ED%8C%80%EA%B3%BC-%EC%88%98%EC%A6%9D%EA%B8%B0%EA%B0%80%EC%9E%88%EB%8A%94-%ED%81%B0-%EC%86%94%ED%8C%8C-%ED%83%80%EB%9D%BC.jpg"
    }
  ],
  imageFile: [],
  start: ["a0", "a1"],
  combine: ["a2", "a3"],
  combinate: [
    ["a0", "a1", "a2"]
  ],
  endObj: ["a3"],
  background: "/image.jpg",
  sound: "url"
}

export default function Create() {
  const [datas, setDatas] = useState(temp);
  const [selectObj, setSelectObj] = useState<string>()
  const [newObjModal, setNewObjModal] = useState<"start" | "combine" | undefined>()

  const defaultImg = "/defaultBg.jpg"
  const [bgImgURL, setBgImgURL] = useState(defaultImg)
  const [bgImgData, setBgImgData] = useState<FormData | string>(defaultImg)
  const [bgURLInput, setBgURLInput] = useState("")
  const [bgImgType, setBgImgType] = useState<"file" | "url">("file")

  const objImgProps = (data: string) => ({
    id: data,
    onClick: handleOnClick,
    size: selectObj === data ? "65" : "55",
    border: selectObj === data ? "2px solid white" : "",
    img: findObjValueById(data, "img") ?? "",
  })

  const handleOnClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.id !== selectObj) {
      setSelectObj(target.id);
      return;
    }

  }

  const findObjValueById = (id: string | undefined, value: "img" | "id" | "name"): string | undefined => {
    const data = datas.objects.find(value => id === value.id)
    if (!data) return { id: undefined, name: "?", img: undefined }[value]
    const dataInVal = data[value]
    if (typeof dataInVal === "string") return dataInVal
    return dataInVal.url
  }

  const handleCombine = (key: number, kind: 0 | 1 | 2) => {
    if (!selectObj) return;
    const newData: IPostData = JSON.parse(JSON.stringify(datas))
    const combinate = newData.combinate[key]
    let isSame = false
    newData.combinate[key][kind] = selectObj
    if ((combinate[0] === combinate[2] || combinate[1] === combinate[2]) && (combinate[2] !== "")) {
      return alert("재료 오브젝트를 결과 오브젝트로 설정 할 수 없습니다.");
    }
    newData.combinate.forEach((combine, combKey) => {
      if (key === combKey) return;
      const same1 = combine[0] === combinate[0] && combine[1] === combinate[1]
      const same2 = combine[0] === combinate[1] && combine[1] === combinate[0]
      const same3 = combine[1] === combinate[0] && combine[0] === combinate[1]
      if (same1 || same2 || same3) isSame = true;
    })
    if (isSame) return alert("다른 조합과 식이 동일거나 위치만 다릅니다.");
    setDatas(newData)
    setSelectObj(undefined)
  }
  function checkImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        resolve(true);
      };
      img.onerror = () => {
        resolve(false);
      };
    });
  }
  const handleChangeUrl = async (url: string) => {
    const result = await checkImageUrl(url)
    if (result) {
      setBgImgURL(url);
      setBgImgData(url);
    } else {
      setBgURLInput("");
      setBgImgURL(defaultImg);
      setBgImgData(defaultImg);
    };
  };
  const handleFileChange = async (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement
    const files = input.files;
    if (!files) return;
    const resizedImg = await resizeImage(files[0], 2400, 1500)
    const url = URL.createObjectURL(resizedImg)
    setBgImgURL(url)
    const newFormData = new FormData();
    newFormData.append('file', resizedImg);
    setBgImgData(newFormData)
    setBgURLInput(url);
  }

  return (
    <Container onClick={(e: MouseEvent) => {
      const { id } = (e.target as HTMLElement);
      if (selectObj && !id) setSelectObj(undefined);
    }}>
      {
        newObjModal ?
          <CreateObjModal
            datas={datas}
            setDatas={setDatas}
            modalType={newObjModal}
            setModal={setNewObjModal}
          />
          : null
      }
      <Header>
      </Header>
      <Main>
        <Contents>
          <Title>화면</Title>
          <Preview img={bgImgURL} />
          <MainInputWrap>
            <MainInput>
              <h2>제목</h2>
              <input type="text" value={datas.title} onChange={(e) => {
                setDatas({ ...datas, title: e.target.value })
              }} />
            </MainInput>
            <MainInput>
              <div>
                <h2>배경 이미지</h2>
                <NewImgOption>
                  <label htmlFor="optionFile">FILE</label>
                  <input checked={bgImgType === "file"} onChange={() => setBgImgType("file")} id={"optionFile"} type="radio" />
                  <label htmlFor="optionURL">URL</label>
                  <input checked={bgImgType === "url"} onChange={() => setBgImgType("url")} id={"optionURL"} type="radio" />
                </NewImgOption>
              </div>
              {
                bgImgType === "file" ?
                  <MainInputLabel htmlFor="modalInput">
                    <h1>{bgImgURL}</h1>
                  </MainInputLabel>
                  : <input
                    type="text"
                    value={bgURLInput}
                    onChange={(e) => setBgURLInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? handleChangeUrl((e.target as HTMLInputElement).value) : null}
                    onBlur={(e) => { handleChangeUrl(e.target.value) }}
                  />
              }
              <input
                type="file"
                id="modalInput"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </MainInput>
          </MainInputWrap>
        </Contents>
        <ObjectContent>
          <TitleWrap>
            <h1>시작 오브젝트</h1>
            <button onClick={() => setNewObjModal("start")}>
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
            </button>
          </TitleWrap>
          <ObjectList>
            {
              datas.start.map((data, key) => (
                <Object key={key}>
                  <ObjectImg {...objImgProps(data)} />
                  {/* <textarea value={"가나다라마바사"} /> */}
                  <h1 contentEditable={"true"} suppressContentEditableWarning={true} onChange={() => { console.log("s") }}>{findObjValueById(data, "name")}</h1>
                </Object>
              ))
            }
          </ObjectList>
          <TitleWrap>
            <h1>조합 오브젝트</h1>
            <button onClick={() => setNewObjModal("combine")}>
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
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
              <SVG_plus width="24" height="24" fill="#F1F6F9" />
            </button>
          </TitleWrap>
          {
            datas.combinate.map((data, key) => (
              <CombineObj key={key}>
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 0) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[0], "img")})` }}
                  />
                  <h1>{findObjValueById(data[0], "name")}</h1>
                </Object>
                <SVG_plus width="32" height="32" />
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 1) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[1], "img")})` }}
                  />
                  <h1>{findObjValueById(data[1], "name")}</h1>
                </Object>
                <SVG_arrow_right width="32" height="32" />
                <Object>
                  <ObjectImg
                    onClick={() => { handleCombine(key, 2) }}
                    size="60"
                    style={{ backgroundImage: `url(${findObjValueById(data[2], "img")})` }}
                  />
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
  h1,h2,h3,h4,h5,h6,input{
    color:#F1F6F9;
  }
  svg{
    fill:#F1F6F9;
  }
`
const Contents = styled.div`
  flex:1;
  display:flex;
  flex-direction: column;
  padding: 24px;
  padding-top:0px;
  height:calc(100vh - 48px - 24px);
  overflow-y: scroll;
  background-color: #343943;
`
const ObjectContent = styled.div`
  width:460px;
  height:calc(100vh - 48px - 24px);
  background-color: #2C2F35;
  overflow-y: scroll;
  padding: 24px;
  padding-top:0px;
`
const Ad = styled.div`
  width:150px;
  background-color: #D9D9D9;
`
const Title = styled.h1`
  font-size: 20px;
  margin-top: 36px;
  margin-bottom: 24px;
`
const Preview = styled.div<{ img: string }>`
  aspect-ratio:16 / 9;
  margin: 4px;
  background-color: #D9D9D9;
  border-radius: 8px;
  background:${({ img }: { img: string }) => `url(${img})`};
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
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
  input,h1{
    text-align: center;
    width:50px;
    height:39px;
    margin-top: 12px;
    font-size: 15px;
    margin-bottom: -18px;
    /* text-overflow: ellipsis; */
    /* overflow: hidden; */
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
  background-color: #4b4e56;
  padding: 16px 48px;
  margin: 20px -24px;
  margin-bottom: -12px;
`
const TitleWrap = styled.div`
  display:flex;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 8px;
  h1{
    font-size: 18px;
    margin-right: 8px;
  }
  button{
    border: none;
    display:flex;
    cursor: pointer;
    border-radius: 24px;
    padding: 4px;
    opacity: 0.8;
    &:hover{
      opacity: 1;
      background-color: #444444;
    }
  }
`
const MainInput = styled.div`
  display:flex;
  flex-direction: column;
  margin-top: 16px;
  padding: 16px;
  flex:1;
  div{
    display:flex;
    justify-content: space-between;
  }
  h2{
    font-size: 15px;
    margin-right: 8px;
  }
  input{
    border:none;
    background-color: #545c6b;
    color:white;
    border-radius: 4px;
    flex:1;
    margin-top: 10px;
    padding: 12px 16px;
    font-size: 18px;
  }
`
const MainInputLabel = styled.label`
  border:none;
  background-color: #545c6b;
  border-radius: 4px;
  flex:1;
  margin-top: 10px;
  padding: 14px 16px;
  &::-webkit-scrollbar {
    display: none;
  }
  h1{
    font-size: 18px;
    height:18px;
    overflow: hidden;
  }
`
const NewImgOption = styled.div`
  display:flex;
  align-items: center;
  input{
    margin:0px;
  }
  label{
    margin-left: 12px;
    padding-right: 2px;
    font-size: 12px;
    color:#F1F6F9;
  }
`
const MainInputWrap = styled.div`
  display:flex;
  justify-content: space-between;
  @media screen and (max-width: 1200px) {
    flex-direction: column;
  }
`