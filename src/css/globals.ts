import { createGlobalStyle } from 'styled-components';
import { normalize } from './normalize';
import { reset } from './reset';

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  ${reset}
  *::-webkit-scrollbar{
    width:7px;
    height:0px;
  }
  *::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.25);
  }
  *::-webkit-scrollbar-track {
    background-color: initial;
  }
  a {
    text-decoration: none;
    cursor: pointer;
  }
  *{
    user-select: none;
    /* pointer-events: none; */
  }
  h1,h2,h3,h4,h5 { color: #363636; font-weight:normal; }
  h1 { font-size: 19px; }
  h2 { font-size: 16px; }
  h3 { font-size: 14px; }
  h4 { font-size: 12px; }
  h5 { font-size: 11px; }
  input {
    color: #363636;
    border: none;
    font-size: 14px;
    outline: none;
    background-color: initial;
    min-width: 0px;
    min-height: 0px;
  }
  select {
    color: #363636;
    border: none;
    font-size: 14px;
    outline: none;
    background-color: initial;
  }
  button {
    background-color: initial;
  }
  .object{
    width:65px;
    height:65px;
    cursor:grabbing;
    position: absolute;
    z-index: 100;
    border-radius: 100px;
    background-color: white;
    background-position: center center;
    background-repeat: repeat-x;
    background-size: cover;
  }
`;