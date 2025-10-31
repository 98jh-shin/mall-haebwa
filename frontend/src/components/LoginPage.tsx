import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { toast, Toaster } from "sonner";
import type { Page, User } from "../App";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ 쿠키 포함 (필수!)
        body: JSON.stringify({ email, password, remember: rememberMe }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? "로그인 실패");
      }

      const user = await res.json();

      // 백엔드가 _id로 보낼 수도 있으므로 안전하게 처리
      onLogin({
        id: user.id ?? user._id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        role: user.role ?? "user",
      });

      toast.success("로그인 성공!");
    } catch (err: any) {
      toast.error(err.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    const mockUser: User = {
      id: "1",
      email: `user@${provider}.com`,
      name: "홍길동",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
    };

    onLogin(mockUser);
    toast.success(`${provider} 로그인 성공!`);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md p-8 mx-6 md:mx-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">로그인</h1>
          <p className="text-gray-600">AI Shop에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm mb-2">이메일</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">비밀번호</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked: boolean) =>
                  setRememberMe(checked as boolean)
                }
              />
              <label htmlFor="remember" className="text-sm cursor-pointer">
                로그인 상태 유지
              </label>
            </div>
            <Button variant="link" className="text-sm p-0 h-auto">
              비밀번호 찾기
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white">
            로그인
          </Button>
        </form>

        <div className="relative mb-6">
          <Separator />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-gray-600">
            또는
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin("Google")}>
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin("Kakao")}>
            <div className="w-5 h-5 bg-yellow-400 rounded mr-2 flex items-center justify-center">
              <span className="text-xs">K</span>
            </div>
            Kakao로 계속하기
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSocialLogin("Naver")}>
            <div className="w-5 h-5 bg-green-600 rounded mr-2 flex items-center justify-center">
              <span className="text-xs text-white">N</span>
            </div>
            Naver로 계속하기
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          계정이 없으신가요?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-gray-900"
            onClick={() => onNavigate("signup")}>
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}
