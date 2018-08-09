export interface IResult{
    topTimeWorked: number;
    topEmployees: string[];
  };
  
export function isIResult(obj: any): obj is IResult {
    return (<IResult>obj).topTimeWorked !== undefined &&
     (<IResult>obj).topEmployees !== undefined;
}