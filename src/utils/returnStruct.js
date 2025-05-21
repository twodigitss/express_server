/**
 * @param {boolean} success
 * @param {number} status
 * @param {string|null} message
 * @param {any} data
 * @param {{ code: number, details: any }=} errors
 */

const payload = ({success=true, status=200, message=null, data=null, errors={}}) => { 
  if (status != 200) success = false

  return {
    success, status, message, data, 
    errors: errors || {
      code: 200,
      details: null
    }
  }
}

export default payload;
