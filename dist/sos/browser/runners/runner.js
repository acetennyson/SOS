import { VolumeButtonsWeb } from "../chunk-WHSLFWNE.js";

const runtime = {
  running: false
};
function buttonRecordRecognition(buttonGestures, record) {
  if(!record || !Array.isArray(record) || !record.length) return null;
  // the first gesture recordtrial is enough to give, no need comparing with all 3 trials
  const getMatchingLength = buttonGestures.filter(bgs => (bgs.recordTrials.length && bgs.recordTrials[0].length==record.length) );
  if(!getMatchingLength) return null;

  for (let i = 0; i < getMatchingLength.length; i++) {
    const gesture = getMatchingLength[i];
    const firstRecord = gesture.recordTrials[0];

    // better than the previous one, right????
    let falseMatch = record.find((data, index)=>{
      return firstRecord[index].button!==data.button || Math.floor(firstRecord[index].timeDiff/1000) !== Math.floor(data.timeDiff/1000)
    })

    if(!falseMatch) {
      return gesture;
    }

  }

  return null;
}

function callPhone(number) {

}

function openApp(scheme) {

}

function sendSms(number, message) {

}


function performAction(gestureId, actions = []){
  if(gestureId) return;
  let action =  actions.find(act=>act.id==gestureId);
  // if(action) return this.eventbus.dispatch(action.cb, ...action.cbArgs)
  if (action) {
    let cb = ()=>{};
    switch (action.type) {
      case 1:
        cb = callPhone
      break;

      case 2:
        cb = openApp
      break;

      case 3:
        cb = sendSms
      break;

      default:
      break;
    }

    cb(...action.cbArgs)
  }
}

addEventListener('listenForGestures', async (resolve, reject, args) => {
  // if(temp.running) return;
  console.log('listenForGestures has been triggered')
  try {
    // CapacitorKV.set('bgGestures', args);
    let recordedData = {
      button: []
    };
    let lastInputTime = {
      button: 0
    };
    let timeOutVar = {
      button: null
    }


    function UpdateTimeOut(params, recognise) {
      lastInputTime[params.name] = Date.now()
      if(timeOutVar[params.name]) {
        clearTimeout(timeOutVar[params.name]);
        timeOutVar[params.name] = null;
        delete timeOutVar[params.name]
      }

      timeOutVar[params.name] = setTimeout(() => {
        lastInputTime[params.name] = 0;
        recordedData[params.name] = [];
        let gest = recognise(params.gestures, recordedData[params.name]);
        performAction(gest.id, params.actions);
      }, params.timeout);
    }

    if(Object.values(args).length) {
      let {gestures, actions, timeout} = args
      let VB = args.volume || VolumeButtonsWeb;
      VB.watchVolume(
        {
          suppressVolumeIndicator: true,
          disableSystemVolumeHandler: true
        }, (res, err)=>{
          if(err){
            console.error('Bgerror', err);
            return;
          }
          let timeDFF = 0;
          if(lastInputTime.button==0){
            // start new record
            recordedData.button = [];
          }else{
            timeDFF = Date.now() - lastInputTime.button;
            // add to recorded data and update lastInputTime and timeOut
          }
          recordedData.button.push({
            button: res.direction,
            duration: 0,
            timeDiff: timeDFF
          });

          UpdateTimeOut({name: 'button', timeout: timeout, recordedData: recordedData, gestures: gestures.filter(g=>g.gType==2), actions: actions}, buttonRecordRecognition);
        }
      )

    }else

    {
    let pf = await CapacitorKV.get({ key: 'gestures' })
    let timeoutSt = await CapacitorKV.get({ key: 'timeout' })
    // let {gestures, actions, timeout} = JSON.parse(pf.value || '{gestures: [], actions: [], timeout: 5000}'); // gestures and actions
    let [{gestures, actions}, timeout] = [JSON.parse(pf.value||'{gestures: [], actions: []}'), Number(timeoutSt.value||5000)]


    VolumeButtonsWeb.watchVolume(
      {
      suppressVolumeIndicator: true
      }, (res, err)=>{
        if(err){
          console.error('Bgerror', err);
          return;
        }
        let timeDFF = 0;
        if(lastInputTime.button==0){

          // get important data needed for detection
          CapacitorKV.get({ key: 'gestures' })
          .then((pf2)=>{
            if(pf2.value){
              let data = JSON.parse(pf2.value);
              gestures = data.gestures;
              actions = data.actions
            }
          })

          // start new record
          recordedData.button = [];
        }else{
          timeDFF = Date.now() - lastInputTime.button;
          // add to recorded data and update lastInputTime and timeOut
        }
        recordedData.button.push({
          button: res.direction,
          duration: 0,
          timeDiff: timeDFF
        });

        UpdateTimeOut({name: 'button', timeout: timeout, recordedData: recordedData, gestures: gestures.filter(g=>g.gType==2), actions: actions}, buttonRecordRecognition);
      }
    )
    }
    temp.running = true;

    resolve();
  } catch (error) {
    // unable to read saved data
    console.error('Error in listenForGestures:', error);
    reject(error)
  }
})

addEventListener('changedata', async (resolve, reject, args) => {
  console.log('changedata triggered')
  try {
    runtime.running = true
    resolve(runtime);
  } catch (error) {
    reject(error)
  }
});
