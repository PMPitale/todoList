
export function convertToYYYYMMDD(inputDate){
    return  inputDate.getFullYear() + '-' + (inputDate.getMonth() + 1) + '-' + inputDate.getDate();
}