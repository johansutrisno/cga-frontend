import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" >
            <div className="max-w-md w-full">
                <SignUp forceRedirectUrl="/new-user" fallbackRedirectUrl="/new-user" />
            </div>
        </div >
    )
}

export default SignUpPage