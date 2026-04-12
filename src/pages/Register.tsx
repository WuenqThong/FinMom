import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, TrendingUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const passwordStrengthLabel = (password: string) => {
  if (!password) return null;
  if (password.length < 6) return { label: "Yếu", color: "text-red-400", bars: 1 };
  if (password.length < 10 || !/[A-Z]/.test(password)) return { label: "Trung bình", color: "text-yellow-400", bars: 2 };
  return { label: "Mạnh", color: "text-primary", bars: 3 };
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email không hợp lệ";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) errs.password = "Mật khẩu phải ít nhất 6 ký tự";
    if (!form.confirm) errs.confirm = "Vui lòng xác nhận mật khẩu";
    else if (form.confirm !== form.password) errs.confirm = "Mật khẩu không khớp";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setIsLoading(true);
    // Simulate registration
    await new Promise((r) => setTimeout(r, 1400));
    setIsLoading(false);
    toast({
      title: "Đăng ký thành công! 🎉",
      description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
    });
    navigate("/login");
  };

  const strength = passwordStrengthLabel(form.password);

  return (
    <div className="auth-page-bg min-h-screen flex items-center justify-center px-4 py-12">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-panel auth-card">
          <CardContent className="p-8">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold tracking-tight">Tạo tài khoản</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Họ và tên</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Nguyễn Văn A"
                  value={form.name}
                  onChange={handleChange}
                  className={`auth-input ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={`auth-input ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Ít nhất 6 ký tự"
                    value={form.password}
                    onChange={handleChange}
                    className={`auth-input pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
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
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
                {/* Password strength bars */}
                {strength && (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((bar) => (
                        <div
                          key={bar}
                          className={`h-1 w-8 rounded-full transition-all duration-300 ${bar <= strength.bars
                            ? strength.bars === 1
                              ? "bg-red-400"
                              : strength.bars === 2
                                ? "bg-yellow-400"
                                : "bg-primary"
                            : "bg-border"
                            }`}
                        />
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${strength.color}`}>{strength.label}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirm}
                    onChange={handleChange}
                    className={`auth-input pr-10 ${errors.confirm ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  {form.confirm && form.confirm === form.password && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                  )}
                </div>
                {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
              </div>

              <Button
                id="register-submit-btn"
                type="submit"
                className="auth-btn w-full rounded-full gap-2 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="auth-spinner" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                id="go-to-login-link"
                className="font-medium text-primary hover:underline transition-colors"
              >
                Đăng nhập
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
