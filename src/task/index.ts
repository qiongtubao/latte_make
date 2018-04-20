export  interface Method {
    method: string;
    params: Array<any>;
    id?: number;
};
export interface Result {
    error: any;
    result: any;
    id: number;
};

