import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Vui lòng điền đầy đủ thông tin", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    // Simulate login
    await new Promise((r) => setTimeout(r, 1200));
    setIsLoading(false);
    toast({ title: "Đăng nhập thành công!", description: "Chào mừng bạn trở lại FinWise." });
    navigate("/");
  };

  return (
    <div className="auth-page-bg min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background decorations */}
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-panel auth-card">
          <CardContent className="p-8">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Đăng nhập</h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Nhập thông tin tài khoản của bạn để tiếp tục
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-input"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:underline"
                    tabIndex={-1}
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="auth-input pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                id="login-submit-btn"
                type="submit"
                className="auth-btn w-full rounded-full gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-spinner" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                id="go-to-register-link"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 FinWise
        </p>
      </div>
    </div>
  );
}
