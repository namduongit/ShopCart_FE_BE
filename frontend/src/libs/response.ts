type Response<T> = {
    status: number;
    message: string;
    errors: ErrorType;
    data: T;
}

type ErrorType = string | string[] | Record<string, any>;

export type { Response };