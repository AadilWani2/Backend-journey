import React from 'react'

const FormGroup = ({label,placeholder,value,onChange,type}) => {
  return (
    <div className='input-group'>
        <label htmlFor={label}>{label}</label>
        <input type={type} value={value} onChange={onChange} id={label} name={label} placeholder={placeholder} required />
    </div>
  )
}

export default FormGroup