import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
    return <SignUp forceRedirectUrl="/new-user" fallbackRedirectUrl="/new-user" />
}

export default SignUpPage