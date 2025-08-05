import { useLogin, usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const SignIn = () => {
  const { login } = useLogin();
  const { ready, authenticated, user } = usePrivy();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 viral-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold glow-text mb-2">Welcome to Viral!</h1>
          <p className="text-xl text-viral-purple font-semibold">
            You're one step closer to growing your future! Sign up today!
          </p>
        </div>

        {/* Sign In Card */}
        <Card className="glass-card border-border/20">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Sign in with Privy to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!authenticated ? (
              <Button
                variant="viral"
                size="lg"
                onClick={login}
                disabled={!ready}
                className="w-full"
              >
                Sign in with Privy
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-sm">✅ Signed in as: {user?.email?.address || "No email"}</p>
                <p className="text-sm">Privy ID: {user?.id}</p>
              </div>
            )}

            <Separator />

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-viral-purple hover:text-viral-pink transition-colors">
                  Sign up here
                </Link>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
