import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { MainWrapper } from './style'
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';
import Web3 from "web3/dist/web3.min.js";
// import Web3 from "web3";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { AIRDROPPER_ABI, AIRDROPPER_CONTRACT, ERC20TOKEN_ABI } from "../../../config/settings.js";
import { useSelector} from 'react-redux'

const steps = [ 'Plan/Do','Check','Action',];
const vertical = "top"
const horizontal = "right"

export default function Airdrop(props) {

// redux
  const account = useSelector((state) => {
      return state.getIn(['header', 'account'])
  })

  const walletProvider = useSelector((state) => {
      return state.getIn(['header', 'walletProvider'])
  })

// state
  const [activeStep, setActiveStep] = React.useState(0);
  const [approveAmount, setApproveAmount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [approve, setApprove] = React.useState(false);
  const [isApproveLoading, setIsApproveLoading] = React.useState(false);
  const [isDisabled,  setIsDisabled] = React.useState(1);
  const [skipped, setSkipped] = React.useState(new Set());
  const [checkMsgTip, setCheckMsgTip] = React.useState([]);
  const [sendData, setSendData] = React.useState({
    addressArr: [],
    tokenArr: [],
  })
  const [data, setData] = React.useState({
    tokenAddress: '', 
    toArr: ``
  })
  const [messageData, setMessageData] = React.useState({
    open: false, msgType: "info", message: ""
  })


  const handleCnhange = e => {
    const {value, name} = e.target
    setData(preData => {
      return {
        ...preData,
        [name]: value
      }
    })
  }

  const  sendMessage = (type, nsg) => {
    setSnackbarOpen(true)
    setMessageData({
        msgType: type ? type : "info", 
        message: nsg
    })
  }

  const isStepOptional = (step) => {
    return step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const sendCheckMessage = (type, message) => {
    let tip = {title: type, message: message};
    checkMsgTip.push(tip)
    setCheckMsgTip(checkMsgTip)
  }

 const checkRate = (nubmer) => {
  var re = /^[0-9]+.?[0-9]*/;//
  if (!re.test(nubmer)) {
      return false;
  }
  return true;
}

  const handleNext = async () => {
    setCheckMsgTip([])
    if(account){
      if(data.toArr && data.tokenAddress) {
        if(activeStep === 0){
              setOpen(true)
              if(data.tokenAddress && Web3.utils.isAddress(data.tokenAddress)) {
                sendCheckMessage('success', "Contract Token address verified complete")
              }else{
                setOpen(false)
                setIsDisabled(0)
                sendCheckMessage('error', "Please enter the correct token address")
              }

              var list = data.toArr.split("\n")
              var isTrue = false
              var address = [];
              var token = [];
              var tokensum = 0

              if(list.length > 0) {
                let newSkipped = skipped;
                if (isStepSkipped(activeStep)) {
                  newSkipped = new Set(newSkipped.values());
                  newSkipped.delete(activeStep);
                }
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
                setSkipped(newSkipped);
                for (let a = 0; a <= list.length; a++ ) {
                    if (typeof list[a] === 'string') {
                        var str = list[a].split(",")
                        if(str.length < 2) {
                            console.log('err: 1', 1)
                            isTrue = true
                            break
                        }
          
                        if(str.length > 2) {
                            console.log('err: 2')
                            isTrue = true
                            break
                        }
                        if(!Web3.utils.isAddress(str[0])) {
                            console.log('err: 3')
                            isTrue = true
                            break
                        }
          
                        if (!checkRate(str[1])){
                            console.log('err: 4')
                            isTrue = true
                            break
                        }
                        address.push(str[0])
                        token.push(str[1]) 
                        tokensum  += Number(str[1])
                      }
                  }

                  setSendData({
                    addressArr: address,
                    tokenArr: token,
                  })
            
                  if(isTrue){
                    setIsDisabled(0)
                    sendCheckMessage('error', "Please check whether the address and quantity format of the tokens sent in batches are correct")
                    setOpen(false)
                    return false
                  }else{
                    sendCheckMessage('success', "Tokens and address sent in batches are verified complete")
                    var web3Obj = new Web3(walletProvider)
                    var myContract = new web3Obj.eth.Contract(ERC20TOKEN_ABI, data.tokenAddress) 
                        await myContract.methods.allowance(account, AIRDROPPER_CONTRACT).call({ from: account }).then((allowanceTokenCount)=>{
                          if(allowanceTokenCount >= tokensum) {
                            sendCheckMessage('success', "Check Allowance authorization and quantity verified complete")
                          }else{
                            setApproveAmount(Number(tokensum))
                            sendCheckMessage('error', "Check Allowance authorization and quantity verified fail Please click APPROVE ")
                            setIsDisabled(0)
                            setApprove(true)
                          }
                        }).catch((err)=>{
                          console.log("err", err)
                          sendCheckMessage('error', "Check Allowance authorization and quantity verified fail ")
                          setIsDisabled(0)
                          setApprove(true)
                        })
                        setOpen(false)
                  }
                }
     
        }else{
          let newSkipped = skipped;
          if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
          }
          setActiveStep((prevActiveStep) => prevActiveStep + 1);
          setSkipped(newSkipped);
        }

      }else{
          sendMessage('warning',"Please enter the token address, recipient address and the number of recipient tokens")
      }
  }else{
    sendMessage('warning',"Please click on the wallet in the upper right corner to log in")
  }
  };

  const handleBack = () => {
    setIsDisabled(1)
    setActiveStep((prevActiveStep) => {
      if(prevActiveStep === 2) {
        return  prevActiveStep - 2
      }else{
        return  prevActiveStep - 1
      }
    });
    setCheckMsgTip([])
  };
  
  const handleApprove = async () => {
    setOpen(true)
    var web3Obj = new Web3(walletProvider)
    var myContract = new web3Obj.eth.Contract(ERC20TOKEN_ABI, data.tokenAddress)
    await myContract.methods.balanceOf(account).call({ from: account }).then(async (balanceOf)=>{
      if(approveAmount <= balanceOf){
        var listTip = checkMsgTip
        var resFilter =  listTip.filter((item)=>{
            return  item.title !== "error"
         })
         await  myContract.methods.approve(AIRDROPPER_CONTRACT, approveAmount).send({ from: account}).then(()=>{
           resFilter.push({title: "success", message: "Check Allowance authorization and quantity verified complete" })
           setCheckMsgTip(resFilter)
           setIsDisabled(1)
           setApprove(false)
           setOpen(false)
         }).catch( err=>{
           setOpen(false)
           sendMessage('warning',`code : ${err.code}  message: ${err.message}`)
         })
      }
      console.log("balanceOf", balanceOf)
    }).catch((err)=>{
      setOpen(false)
      sendMessage('warning',`code : ${err.code}  message: ${err.message}`)
    })

  }

const hanndleBatch = async () => {
      setIsApproveLoading(true)
      var web3Obj = new Web3(walletProvider)
      var myContract = new web3Obj.eth.Contract(AIRDROPPER_ABI, AIRDROPPER_CONTRACT)
      await  myContract.methods.batch(data.tokenAddress ,sendData.addressArr, sendData.tokenArr).send({ from: account }).then(()=>{
        setActiveStep(3)
        setIsApproveLoading(false)
      }).catch( err=>{
        setIsApproveLoading(false)
        sendMessage('warning',`code : ${err.code}  message: ${err.message}`)
      })
}
const handleReset = () => {
  setActiveStep(0)
  setCheckMsgTip([])
  setData({
    tokenAddress: '', 
    toArr: ``
  })
  setSendData({
    addressArr: [],
    tokenArr: []
  })

}

const handleClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setSnackbarOpen(false);
};

  return (
    <MainWrapper>
    <Box sx={{ width: '50%' }}>
      <Typography variant="h4" className='cl-form-item' component="div">
         Airdropper
      </Typography>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Parameter</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
          ✅ All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={()=>handleReset()}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <Box className={`stepbox ${activeStep === 0 ? "box-active" : ""}`} sx={{ flexDirection: 'row', pt: 2 }} >
                <div className='cl-form-item'>
                    <Alert severity="info" className='cl-h-line'>
                            <AlertTitle>Please fill in an erc20 token address of rikeby network</AlertTitle>
                    </Alert>
                </div>
                <div className='cl-form-item'>
                    <TextField name="tokenAddress" value={data.tokenAddress} onChange={handleCnhange} className='w-input'  label="token address" variant="outlined"    />
                </div>
                <div className='cl-form-item'>
                    <Alert severity="info" className='cl-h-line'>
                            <AlertTitle>Please fill in the number of addresses and accounts you need to accept, separated by commas, one per line</AlertTitle>
                    </Alert>
                </div>
                <div className='cl-form-item textarea'>
                    <TextField 
                        label="Please fill in the address and number of tokens"
                        multiline
                        name="toArr"
                        rows={10}
                        value={data.toArr}
                        onChange={handleCnhange}
                        className='w-input code'
                    />
                 </div>
          </Box>
          <Box className={`stepbox  ${activeStep === 1 ? "box-active" : ""}`} sx={{ flexDirection: 'row', pt: 2, height: '40vh' }} >
      
           {checkMsgTip.map((item, key) => (
              <Alert severity={item.title} key={key} className="cl-alert">{item.message}</Alert>
           ))}
           <div className='cl-center'>
           {approve ?   <Button variant="contained" disableElevation onClick={()=>{handleApprove()}} > approve  </Button> : ""}
           </div>

          </Box>
          <Box className={`stepbox middle ${activeStep === 2 ? "box-active" : ""}`} sx={{ flexDirection: 'row', pt: 2, height: '40vh' }} >
           <div className='cl-center'>

              <div>
               <div className='cl-info'>
                  <h1>Address total: {sendData.addressArr.length}</h1>
               </div>
              {isApproveLoading ? <CircularProgress color="success" />:   <Button variant="contained" disableElevation onClick={()=>{hanndleBatch()}} > airdrop  </Button>}

              </div>

           </div>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={()=>handleBack()}
              sx={{ mr: 1 }}
            >
              Back 
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? '' :   
            <Button onClick={()=>{handleNext()}}  disabled={isDisabled === 0}>
              {activeStep === steps.length - 1 ? '' : 'Next'}  
            </Button>
            }
          </Box>
        </React.Fragment>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleClose} severity={messageData.msgType} sx={{ width: "100%" }}>
           {messageData.message}
        </Alert>
      </Snackbar>
       <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>

    </MainWrapper>
  );
}
