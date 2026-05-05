type Response<T> = {
    status: number;
    success: boolean;
    message: string;
    errors: ErrorType;
    data: T;
}

type ErrorType = string | string[] | Record<string, any> | null;

export type { Response };