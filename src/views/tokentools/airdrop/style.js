import styled from "styled-components";

export const MainWrapper = styled.div`
  display:flex ;
  justify-content: center;
  .cl-form-item {
     margin: 20px 0px ;
  }
  .w-input {
    width: 100%
  }
  .stepbox {
    display: none ;
    &.box-active {
       display: block ;
    }
    .cl-center{
      display:flex ;
      justify-content:center ;
    }
  }
  .cl-alert { 
    margin: 10px 0 ;
  }
  textarea {
    background: url(http://i.imgur.com/2cOaJ.png);
    background-attachment: local;
    background-repeat: no-repeat;
    padding-left: 35px;
    padding-top: 10px;
    border-color: #ccc;
    font-size: 13px;
    line-height: 16px;
}

.textarea-wrapper {
    display: inline-block;
    background-image: linear-gradient(#F1F1F1 50%, #F9F9F9 50%);
    background-size: 100% 32px;
    background-position: left 10px;
}
.cl-info {
   margin-bottom: 20px;
   h1 {
    line-height:20px; ;
   }
}
`
