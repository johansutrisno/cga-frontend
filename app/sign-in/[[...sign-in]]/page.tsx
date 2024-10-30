import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" >
            <div className="max-w-md w-full">
                <SignIn signUpForceRedirectUrl="/new-user" signUpFallbackRedirectUrl="/new-user" />
            </div>
        </div >
    )
}

export default SignInPage