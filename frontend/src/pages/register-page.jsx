import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const INTEREST_OPTIONS = ["테크", "패션", "리빙", "뷰티", "푸드", "여행"];
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export default function RegisterPage() {
  const navigate = useNavigate();
  const redirectTimeoutRef = useRef(null);
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting) return;

    const normalisedEmail = email.trim().toLowerCase();
    if (!normalisedEmail) {
      setError("이메일을 입력해주세요.");
      setSuccess(null);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalisedEmail)) {
      setError("올바른 이메일 형식을 확인해주세요.");
      setSuccess(null);
      return;
    }
    if (!password || password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setSuccess(null);
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 서로 일치하지 않습니다.");
      setSuccess(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalisedEmail,
          password,
          full_name: fullName.trim() || null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(
          payload.detail || "회원가입 처리 중 오류가 발생했습니다.",
        );
      }

      const data = await response.json();
      setSuccess("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.");
      redirectTimeoutRef.current = setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { email: data.email, justRegistered: true },
        });
      }, 1200);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-4xl font-black tracking-[0.1em] text-emerald-500">
            SwiftCart
          </p>
          <p className="mt-3 text-sm text-neutral-500">
            단 한 번의 가입으로 모든 SwiftCart 서비스를 이용해보세요.
          </p>
        </div>

        <div className="grid w-full max-w-4xl gap-8 rounded-[40px] bg-white p-10 shadow-2xl shadow-emerald-100/60 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-semibold text-neutral-600">
                이메일
              </label>
              <div className="mt-2 flex h-12 items-center rounded-3xl border border-emerald-300 px-4 shadow-inner shadow-emerald-50 focus-within:border-emerald-500 focus-within:ring focus-within:ring-emerald-200/60">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError(null);
                    setSuccess(null);
                  }}
                  placeholder="name@example.com"
                  className="h-full w-full border-0 bg-transparent text-sm text-neutral-800 outline-none"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-600">
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                placeholder="영문, 숫자, 특수문자 조합 6자 이상"
                className="mt-2 h-12 w-full rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-neutral-600">
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                placeholder="비밀번호를 다시 입력하세요"
                className="mt-2 h-12 w-full rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                autoComplete="new-password"
                required
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-neutral-600">
                  이름
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="이름 (선택 사항)"
                  className="mt-2 h-12 w-full rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-600">
                  생년월일
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                  className="mt-2 h-12 w-full rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                />
              </div>
            </div>

            {/* <div>
              <label className="text-sm font-semibold text-neutral-600">
                휴대전화
              </label>
              <div className="mt-2 flex flex-col gap-3">
                <select className="h-12 rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60">
                  <option>대한민국 +82</option>
                  <option>일본 +81</option>
                  <option>미국 +1</option>
                  <option>중국 +86</option>
                </select>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="전화번호"
                    className="h-12 flex-1 rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                  />
                  <button
                    type="button"
                    className="h-12 rounded-3xl bg-emerald-500 px-5 text-sm font-semibold text-white transition hover:bg-emerald-600">
                    인증번호 받기
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="인증번호 입력"
                  className="h-12 rounded-3xl border border-emerald-200 px-4 text-sm text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
                />
              </div>
            </div> */}

            {error ? (
              <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-600">
                {success}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className={`mt-2 h-12 rounded-3xl text-sm font-semibold text-white transition ${
                submitting
                  ? "bg-emerald-300"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}>
              {submitting ? "가입 처리 중..." : "가입 완료"}
            </button>
          </form>

          <aside className="flex flex-col gap-6 rounded-3xl bg-emerald-50/60 p-8 text-sm text-neutral-600">
            <div>
              <h2 className="text-lg font-semibold text-emerald-600">
                취향을 더 정확하게
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                관심 있는 카테고리를 선택하면 맞춤형 추천과 쇼핑 혜택을 빠르게
                받아볼 수 있어요.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const selected = selectedInterests.has(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      selected
                        ? "bg-emerald-500 text-white shadow"
                        : "bg-white text-emerald-500 shadow-sm hover:bg-emerald-100"
                    }`}>
                    #{interest}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-xs leading-relaxed text-neutral-500">
              <p className="font-semibold text-neutral-600">필수 약관 안내</p>
              <p className="mt-1">
                네이버 서비스 이용약관과 개인정보 수집 및 이용에 관한 안내를
                확인했으며, 모두 동의합니다.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAgreeMarketing((prev) => !prev)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold transition ${
                agreeMarketing
                  ? "border-emerald-400 bg-emerald-100 text-emerald-600"
                  : "border-emerald-100 bg-white text-neutral-500 hover:border-emerald-300 hover:text-emerald-500"
              }`}>
              <span
                className={`grid size-5 place-items-center rounded-full text-[11px] font-bold ${
                  agreeMarketing
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}>
                ✓
              </span>
              이벤트 · 혜택 알림 수신에 동의합니다.
            </button>

            <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4 text-xs text-neutral-500">
              <p>
                가입을 완료하면 네이버 쇼핑, 페이, 멤버십 등 모든 서비스를
                하나의 계정으로 이용할 수 있습니다.
              </p>
            </div>

            <Link
              to="/login"
              className="text-center text-xs font-semibold text-emerald-600 transition hover:text-emerald-500">
              이미 계정이 있으신가요? 로그인하기
            </Link>
          </aside>
        </div>

        <Link
          to="/"
          className="mt-8 text-xs font-medium text-emerald-500 transition hover:text-emerald-600">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
