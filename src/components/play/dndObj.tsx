import styled from "styled-components"
import { useDndObj } from "../../lib/dnd";
import { TDnds } from "../../types/dnd";

interface IDndObjProps {
  dnds: TDnds,
  objSize: number
}
export default function DndObj({ dnds, objSize }: IDndObjProps) {
  const { handleDndObj } = useDndObj()

  return (
    <>
      {
        dnds.map(({ id, className, x, y, img }, key) => (
          <DndObject
            style={{
              backgroundImage: `url("${img}")`,
              left: x - objSize / 2,
              top: y - objSize / 2,
              width: objSize,
              height: objSize,
            }}
            key={key}
            id={id}
            className={className}
            {...handleDndObj()}
          />
        ))
      }
    </>
  )
}

const DndObject = styled.div`
  cursor:grabbing;
  position: absolute;
  z-index: 1;
  border-radius: 100px;
  background-color: #F1F6F9;
  background-position: center center;
  background-repeat: repeat-x;
  background-size: cover;
`