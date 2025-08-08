import React from 'react';
import { ErrorMessage, useField} from 'formik';
import { TextField } from '@mui/material';

const CustomTextField = ({label,className, ...props}) => {
  const [field, meta] = useField(props)
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className={className}>{label ? <label htmlFor={field.name}>{label}</label> : <></>}</div>
      <TextField
        size='small'
        className={`form-control shadow-none ${meta.touched && meta.error && 'is-invalid'}`}
        {...field} {...props}
        autoComplete="off"
      />
      <ErrorMessage component="div" name={field.name} className="text-rose-400 text-sm" />
    </div>
  )
}

export default CustomTextField;