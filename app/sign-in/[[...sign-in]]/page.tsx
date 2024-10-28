import { SignIn } from '@clerk/nextjs'

const SignInPage = () => {
    return <SignIn signUpForceRedirectUrl="/new-user" signUpFallbackRedirectUrl="/new-user" />
}

export default SignInPage