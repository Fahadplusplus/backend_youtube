class apiError extends Error{
  constructor(
    statuscode,
    messege= "Something went wrong",
    errors = [],
    stack = ""

  ){
    super(messege)
    this.statuscode = statuscode
    this.data= null
    this.message= messege
    this.success= false;
    this.errors= errors

    if (stack){
        this.stack= stack
    } else{
        Error.captureStackTrace(this,this.constructor)
    }
  }

}

export {apiError}