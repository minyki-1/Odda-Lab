import { TDndEvent } from "../types/dnd";
import { useStore } from "../zustand/store";
const objSize = 70

export const getLocate = (e: TDndEvent) => {
  if ("clientX" in e) return { x: e.clientX, y: e.clientY }
  return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY }
}

export const useDndObj = () => {
  const { selectObj, setSelectObj } = useStore()
  const handleDndDrop = (e: TDndEvent) => {
    e.preventDefault()
    const target = selectObj ? document.getElementById(selectObj) : null;
    setSelectObj(undefined)
    if (!target) return;
    target.style.cursor = "grab"
    target.style.zIndex = "1"
  }
  const handleMove = (e: TDndEvent) => {
    e.preventDefault()
    const target = selectObj ? document.getElementById(selectObj) : null;
    if (typeof navigator !== "object" || !target) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const { x, y } = getLocate(e)
    const checkMobileEvent = isMobile && "changedTouches" in e
    const checkPCEvent = !isMobile && "clientX" in e
    if (!checkMobileEvent && !checkPCEvent) return;
    target.style.left = x - objSize / 2 + "px"
    target.style.top = y - objSize / 2 + "px"
  }
  const handleDndGrap = (e: TDndEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    target.style.cursor = "grabbing"
    target.style.zIndex = "100"
    const { x, y } = getLocate(e)
    target.style.left = x - objSize / 2 + "px"
    target.style.top = y - objSize / 2 + "px"
    setSelectObj(target.id)
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
  return { handleDndDrop, handleMove, handleDndGrap, handleDndObj }
}

export const useFindDataById = () => {
  const { contentData } = useStore()
  const get = (id: string | undefined, value: "img" | "id" | "name") => {
    const data = contentData.objects.find(value => id === value.id)
    if (!data) return { id: undefined, name: "?", img: undefined }[value]
    const dataInVal = data[value]
    if (typeof dataInVal === "string") return dataInVal
    return dataInVal.url
  }
  return get
}