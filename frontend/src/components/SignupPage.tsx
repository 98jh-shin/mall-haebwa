import { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { toast } from 'sonner@2.0.3';
import type { Page } from '../App';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    address: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name || !formData.phone) {
      toast.error('필수 정보를 모두 입력해주세요');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다');
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      toast.error('필수 약관에 동의해주세요');
      return;
    }

    if (!emailVerified) {
      toast.error('이메일 인증을 완료해주세요');
      return;
    }

    toast.success('회원가입이 완료되었습니다!');
    onNavigate('login');
  };

  const handleVerifyEmail = () => {
    if (!formData.email) {
      toast.error('이메일을 입력해주세요');
      return;
    }
    toast.success('인증 이메일이 발송되었습니다');
    // Mock verification
    setTimeout(() => {
      setEmailVerified(true);
      toast.success('이메일 인증이 완료되었습니다');
    }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-2xl p-8 mx-6 md:mx-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">회원가입</h1>
          <p className="text-gray-600">AI Shop과 함께 스마트한 쇼핑을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm mb-2">
              이메일 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-10"
                  disabled={emailVerified}
                />
                {emailVerified && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              <Button
                onClick={handleVerifyEmail}
                disabled={emailVerified}
                className="bg-gray-900 hover:bg-black text-white shrink-0"
              >
                {emailVerified ? '인증완료' : '인증하기'}
              </Button>
            </div>
          </div>

          {/* Password */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8자 이상 입력"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="비밀번호 재입력"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">
                휴대폰 번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="tel"
                  placeholder="010-1234-5678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm mb-2">배송지 주소 (선택)</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="서울시 강남구 테헤란로 123"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <Separator />

          {/* Terms */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                <span className="text-red-500">*</span> 이용약관에 동의합니다
              </label>
              <Button variant="link" className="text-sm p-0 h-auto ml-auto">
                보기
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="privacy"
                checked={agreedToPrivacy}
                onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
              />
              <label htmlFor="privacy" className="text-sm cursor-pointer">
                <span className="text-red-500">*</span> 개인정보 처리방침에 동의합니다
              </label>
              <Button variant="link" className="text-sm p-0 h-auto ml-auto">
                보기
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="marketing"
                checked={agreedToMarketing}
                onCheckedChange={(checked) => setAgreedToMarketing(checked as boolean)}
              />
              <label htmlFor="marketing" className="text-sm cursor-pointer">
                마케팅 정보 수신에 동의합니다 (선택)
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white"
          >
            회원가입
          </Button>
        </form>

        <Separator className="my-6" />

        <div className="text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Button
            variant="link"
            className="p-0 h-auto text-gray-900"
            onClick={() => onNavigate('login')}
          >
            로그인
          </Button>
        </div>
      </Card>
    </div>
  );
}