
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

