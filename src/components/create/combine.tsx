import styled from 'styled-components'
import SVG_plus from "../../svg/plus.svg"
import SVG_arrow_right from "../../svg/arrow-right.svg"
import { useStore } from '../../zustand/store'
import { IPostData } from '../../types/data'
import { useFindDataById } from '../../lib/dnd'

export default function Combine() {
  const { selectObj, setSelectObj, contentData, setContentData } = useStore()
  const findData = useFindDataById()

  const handleCombine = (key: number, kind: 0 | 1 | 2) => {
    if (!selectObj) return;
    const newData: IPostData = JSON.parse(JSON.stringify(contentData))
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
    setContentData(newData)
    setSelectObj(undefined)
  }
  return (
    <>
      <TitleWrap>
        <h1>조합</h1>
        <button onClick={() => {
          if (!contentData) return;
          const newData = { ...contentData }
          newData.combinate.unshift(["", "", ""])
          setContentData(newData)
        }}>
          <SVG_plus width="24" height="24" fill="#F1F6F9" />
        </button>
      </TitleWrap>
      {
        contentData.combinate.map((data, key) => (
          <CombineObj key={key}>
            <Object>
              <ObjectImg
                onClick={() => { handleCombine(key, 0) }}
                size="60"
                style={{ backgroundImage: `url(${findData(data[0], "img")})` }}
              />
              <h1>{findData(data[0], "name")}</h1>
            </Object>
            <SVG_plus width="32" height="32" fill="#F1F6F9" />
            <Object>
              <ObjectImg
                onClick={() => { handleCombine(key, 1) }}
                size="60"
                style={{ backgroundImage: `url(${findData(data[1], "img")})` }}
              />
              <h1>{findData(data[1], "name")}</h1>
            </Object>
            <SVG_arrow_right width="32" height="32" fill="#F1F6F9" />
            <Object>
              <ObjectImg
                onClick={() => { handleCombine(key, 2) }}
                size="60"
                style={{ backgroundImage: `url(${findData(data[2], "img")})` }}
              />
              <h1>{findData(data[2], "name")}</h1>
            </Object>
          </CombineObj>
        ))
      }
    </>
  )
}

const TitleWrap = styled.div`
  display:flex;
  align-items: center;
  margin-top: 36px;
  margin-bottom: 8px;
  h1{
    color:#F1F6F9;
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
const CombineObj = styled.div`
  display:flex;
  align-items: center;
  justify-content: space-between;
  background-color: #4b4e56;
  padding: 16px 48px;
  margin: 20px -24px;
  margin-bottom: -12px;
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
    color:#F1F6F9;
    text-align: center;
    width:50px;
    height:39px;
    margin-top: 12px;
    font-size: 15px;
    margin-bottom: -18px;
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