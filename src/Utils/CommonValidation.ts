import { z } from "zod";
const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[^\s]*)?$/;
export const ZOD_WEBSITE = z.string({ required_error: "Website is required" }).regex(urlRegex, { message: 'Invalid URL format' }).nonempty({ message: 'Website URL is required' })
export const ZOD_NAME = z.string({ required_error: "Full name is required" }).min(1, { message: 'Full name is required' }).max(50, { message: 'Full name should be at most 50 characters' });
export const ZOD_EMAIL = z.string({ required_error: "Email/Phone is required" }).trim().email({ message: "Please provide a valid email address or phone number." }).or(z.string().regex(/^\d+$/))
export const ZOD_PHONE = z.string({ required_error: "Phone is required" }).regex(/^\+?[1-9]\d{1,14}$/)
export const ZOD_EMAIL_ONLY = z.string({ required_error: "Email is required" }).trim().email({ message: "Please provide a valid email address." })
export const ZOD_PASSWORD = (name: string) => z.string({ required_error: `${name} is required` }).min(8, { message: `${name ?? "password"} must be at least 8 characters long.` })
    .nonempty({ message: `${name ?? "password"} cannot be empty.` })
    .refine((password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?#@_!()~.-]).{8,}$/.test(password), {
        message: `${name ?? "Password"} must contain a mix of uppercase letters, lowercase letters, numbers, and special characters.`
    });

export const ZOD_SIGN_IN_PASSWORD = z.string({ required_error: "Password is required" }).nonempty({ message: `Password cannot be empty.` }).min(8, { message: `Password must be at least 8 characters long.` })

export const ZOD_OTP = z.string({ required_error: "OTP is required" }).refine((otp) => {
    return String(otp).length === 6
}, "OTP must be exactly 6 digits");

export const ZOD_TITLE = z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(50, { message: `Title must not exceed 50 characters` });

export const ZOD_USERNAME = z.string({ required_error: "Username is required" }).min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9 ]+$/, "Special characters are not allowed");

export const ZOD_BIO = z.string().nullable()
export const ZOD_COUNTRY = z.string({ required_error: "Country is required" })

export const ZOD_DATE = z.string().nullable()
export const ZOD_ADDRESS = z.string().nullable()
export const ZOD_LOCATION = z.string().nullable()
export const ZOD_HOBBY = z.string().nullable()
export const ZOD_SCHOOL = z.string().nullable()
export const ZOD_WEBSITE_OPTIONAL = z.string()
    .nullable()
    .refine((value) => value === null || urlRegex.test(value), { message: 'Invalid URL format' });