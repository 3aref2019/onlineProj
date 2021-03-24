//generate id 
export const makeid = (length: number): string => {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const createErrorObject = (errorArrayFromTypeormValidator: any): any => {
  let errorObject: any = {};
  errorArrayFromTypeormValidator.forEach((e: any) => {
    const key = e.property;
    const value = Object.entries(e.constraints)[0][1];
    errorObject[key] = value;
  });
  return errorObject;
}; 