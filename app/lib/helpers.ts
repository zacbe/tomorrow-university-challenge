import { ObjectId } from 'mongodb';

export function on(promise: any) {
  return promise
    .then((data:any) => {
      return [null, data];
    })
    .catch((err:any) => [err]);
}

export function stringId(id: any): string {
  return id.toString();
}

export function nativeId(str: string): ObjectId {
  return new ObjectId(str);
}