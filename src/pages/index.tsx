import styled from 'styled-components'
import SvgHeart from '../svg/heart.svg';

const temp = {
  id: "0",
  name: "test1",
  makerId: "0",
  objects: [
    {
      name: "물",
      // img
    }
  ]
}

export default function Home() {
  function typedArrayToURL(typedArray: any, mimeType: any) {
    return URL.createObjectURL(new Blob([typedArray.buffer], { type: mimeType }))
  }
  const handleClickBtn = () => {

    return new Promise(function (resolve, reject) {
      try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "~~~~~");
        xhr.responseType = "blob";
        xhr.onerror = function () { reject("Network error.") };
        xhr.onload = function () {
          if (xhr.status === 200) { resolve(xhr.response) }
          else { reject("Loading error:" + xhr.statusText) }
        };
        xhr.send();
      }
      catch (err) { reject(err) }
    });
  }
  function previewImage(event: any) {
    const file = event.target.files[0];

    if (!file.type.match("image.*")) {
      alert("이미지 파일만 선택해주세요.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (function (theFile) {
      return function (e) {
        const url: any = e.target?.result;
        return new Promise(function (resolve, reject) {
          try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function () { reject("Network error.") };
            xhr.onload = function () {
              if (xhr.status === 200) {
                resolve(xhr.response);
                const url = window.URL.createObjectURL(xhr.response);
                console.log(url)
              }
              else { reject("Loading error:" + xhr.statusText) }
            };
            xhr.send();
          }
          catch (err) { reject(err) }
        });
      };
    })(file);

    reader.readAsDataURL(file);
  }
  return (
    <Container>
      <input type='file' onChange={previewImage} />
      <h1>My Next WebApp</h1>
      <SvgHeart width="24" height="24" fill="white" />
    </Container>
  )
}

const Container = styled.div`
  width:100vw;
  min-height:100vh;
`
