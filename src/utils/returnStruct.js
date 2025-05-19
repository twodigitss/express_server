const json_struct = (
  {success=true, status=200, message=null, data=null, errors={}}) => { 

  if (status != 200) success = false
  return {
    success, status, message, data, 
    errors: errors || {
      code: 200,
      details: null
    }
  }
}

export default json_struct;
