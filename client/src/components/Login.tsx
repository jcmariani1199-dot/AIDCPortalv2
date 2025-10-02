import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import nokiaLogo from "@assets/NOK_logo_1759328245623.png";
import { apiRequest } from "@/lib/queryClient";

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/login", {
        username,
        password,
      });
      
      const data = await res.json();

      if (data.success) {
        onLoginSuccess();
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 flex flex-col items-center">
          <img 
            src={nokiaLogo} 
            alt="Nokia Logo" 
            className="h-8"
            data-testid="img-login-nokia-logo"
          />
          <div className="space-y-2 text-center">
            <CardTitle className="text-2xl">AI DC & Cloud Network Portal</CardTitle>
            <CardDescription>Sign in to access the portal</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                data-testid="input-username"
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                data-testid="input-password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="text-sm text-destructive" data-testid="text-error">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-login"
            >
              <Lock className="h-4 w-4" />
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
