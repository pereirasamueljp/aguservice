export function getParams<T>(params: string){
    if(!params) return null
    let object: T;
    try{
        object = JSON.parse(params)
    } catch(error){
        return null
    }
    return object 
}