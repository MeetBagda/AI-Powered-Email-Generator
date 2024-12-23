import { SignIn } from '@clerk/clerk-react';

function SignInPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  );
}

export default SignInPage;
