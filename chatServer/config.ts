export const port: any = process.env.PORT || 3001;
export const database: string = process.env.DATABASE || 'mongodb://root:root_password@localhost:27017/';
export const secret = process.env.SECRET || 'default-secret-key';
export const cookieMaxAge = 1000 * 60 * 60 * 24; // 24 hours
