import styled from "styled-components"
import SVG_plus from "../../svg/plus.svg"
import { useStore } from "../../zustand/store"
import CreateObjModal from "./createObjModal";
import { useState } from "react";
import { useFindDataById } from "../../lib/dnd";

export default function ObjectList({ title, modalType }: { title: string, modalType: "start" | "combine" }) {
  const { selectObj, setSelectObj, contentData } = useStore();
  const [newObjModal, setNewObjModal] = useState<"start" | "combine" | undefined>(undefined)
  const findData = useFindDataById()

  const objImgProps = (data: string) => ({
    id: data,
    onClick: handleOnClick,
    size: selectObj === data ? "65" : "55",
    border: selectObj === data ? "2px solid white" : "",
    img: findData(data, "img") ?? "",
  })

  const handleOnClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.id !== selectObj) {
      setSelectObj(target.id);
      return;
    }
  }
  return (
    <>
      {
        newObjModal ?
          <CreateObjModal
            modalType={newObjModal}
            setModal={setNewObjModal}
          />
          : null
      }
      <TitleWrap>
        <h1>{title}</h1>
        <button onClick={() => setNewObjModal(modalType)}>
          <SVG_plus width="24" height="24" fill="#F1F6F9" />
        </button>
      </TitleWrap>
      <ObjList>
        {
          contentData[modalType].map((data, key) => (
            <Object key={key}>
              <ObjectImg {...objImgProps(data)} />
              <h1>{findData(data, "name")}</h1>
            </Object>
          ))
        }
      </ObjList>
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
const ObjList = styled.div`
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