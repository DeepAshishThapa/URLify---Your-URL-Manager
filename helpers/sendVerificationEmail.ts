import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
){
    try{
        await resend.emails.send({
            from:'dev@hiteshchoudhary.com',
             to: email,
            subject: 'Mystery Message Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        })
        return {success:true, message:'Verification email '}
    }
    catch(emailError){
        console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
    }
}