
export interface SysGestures{
  id: number,
  name: string,
  description: string,
  fontAwesomeIcon: string, // FontAwesome icon name
  enabled: boolean,
}

/**
 * @description System actions 1 call, 2 sms, 3 flashlight, 4 record
 */
export interface SysAction{
  type: number,
  name: string,
  fontawesomeIcon?: string,
  description?: string,
  enabled?: boolean
}

export interface CustomAction{
  id: number, // gesture id
  name: string, // action label
  type: number, // type of action (1 for call, 2 for open app, 3 for etc)
  cbArgs: any[],
  enabled: boolean,
  [index: string]: any
}

export interface CallInput {
  name: string,
  type: 1,
  cbArgs: string[]
}

export interface MessageInput {
  name: string,
  type: 2,
  text: string[]
}

export interface ButtonGesture{
  id: number,
  gType: 2, // Volume Button gesture type
  name: string, // Name of the gesture
  recordTrials: Array<ButtonRecord[]>,
}

export interface TouchGesture{
  id: number,
  gType: 3, // Touch gesture type
  name: string, // Name of the gesture
  recordTrials: Array<TouchRecord[]>
}

export interface SpeechGesture{
  id: number,
  gType: 4, // Speech gesture type
  name: string, // Name of the gesture
  recordTrials: SpeechRecord,
}

export interface ShakePhonesGesture{
  id: number,
  gType: 1, // Shake gesture type
  name: string, // Name of the gesture
  recordTrials: Array<ShakePhoneRecord[]>
}


export interface ButtonRecord{
  button: 'up' | 'down',
  duration: number, // Duration in milliseconds
  timeDiff: number, // Time difference from the last recorded action
}

export interface SpeechRecord {
  text: string, // Text representing the speech gesture
  lang: string, // Language of the speech gesture
}

export interface TouchRecord {
  x: number, // X coordinate of the touch
  y: number, // Y coordinate of the touch
  duration: number, // Duration in milliseconds
  timeDiff: number, // Time difference from the last recorded action
}

export interface ShakePhoneRecord {
  duration: number, // Duration in milliseconds
  timeDiff: number, // Time difference from the last recorded action
  direction: 'left' | 'right' | 'up' | 'down', // Direction of the shake
  intensity: number, // Intensity of the shake
  additional?: {[index: string]: any} // Additional properties
}



export interface DefaultInput {
  name: string,
  value: string | boolean | null | undefined,
  id: string,
  parentClass?: string,
  placeholder?: string,
  label?: string,
  type: 'default'|'textarea'|'datetime'|'date'|'time'|'number'|'email'|'password'|'datetime-local'| 'toggle' |'tel'|'file'|'hidden',
  class?: string
}


export interface OptionalInput {
  name: string,
  value: string,
  class?: string,
  placeholder?: string,
  parentClass?: string,
  options: {text:string, value: any}[],
  label?: string,
  id: string,
  type: 'checklist'|'radio'|'select'|'selectM'
}
