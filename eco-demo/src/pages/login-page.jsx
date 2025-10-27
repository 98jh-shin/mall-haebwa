import { useState } from "react";
import { Link } from "react-router-dom";

const TAB_OPTIONS = [
  { key: "id", label: "ID/비밀번호" },
  { key: "temp", label: "미정" },
  { key: "qr", label: "미정" },
];

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("id");
  const [remember, setRemember] = useState(true);
  const [ipSecurity, setIpSecurity] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-8 text-center">
          <p className="text-4xl font-black tracking-[0.1em] text-emerald-500">
            SwiftCart
          </p>
        </div>

        <div className="w-full max-w-xl rounded-[36px] bg-white p-10 shadow-2xl shadow-emerald-100/60">
          <div className="flex items-center gap-2 rounded-2xl bg-neutral-50 p-1 text-sm font-semibold text-neutral-500">
            {TAB_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex-1 rounded-2xl px-4 py-3 transition ${
                  activeTab === key
                    ? "bg-white text-emerald-600 shadow"
                    : "hover:text-emerald-500"
                }`}>
                {label}
              </button>
            ))}
          </div>

          <form
            className="mt-8 flex flex-col gap-5"
            onSubmit={(event) => event.preventDefault()}>
            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
              아이디
              <input
                type="text"
                placeholder="아이디"
                className="h-12 rounded-2xl border border-emerald-400/70 px-4 text-neutral-800 shadow-inner shadow-emerald-100 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-neutral-600">
              비밀번호
              <input
                type="password"
                placeholder="비밀번호"
                className="h-12 rounded-2xl border border-emerald-300 px-4 text-neutral-800 shadow-inner shadow-emerald-50 outline-none transition focus:border-emerald-500 focus:ring focus:ring-emerald-200/60"
              />
            </label>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
              <button
                type="button"
                onClick={() => setRemember((prev) => !prev)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                  remember
                    ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                    : "border-neutral-200 hover:border-emerald-300 hover:text-emerald-500"
                }`}>
                <span
                  className={`grid size-4 place-items-center rounded-full text-[10px] font-semibold ${
                    remember
                      ? "bg-emerald-500 text-white"
                      : "bg-neutral-100 text-neutral-400"
                  }`}>
                  ✓
                </span>
                로그인 상태 유지
              </button>

              <button
                type="button"
                onClick={() => setIpSecurity((prev) => !prev)}
                className={`flex items-center gap-3 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  ipSecurity
                    ? "bg-emerald-500 text-white"
                    : "bg-neutral-100 text-neutral-500 hover:text-emerald-500"
                }`}>
                IP보안
                <span
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    ipSecurity ? "bg-emerald-300" : "bg-neutral-300"
                  }`}>
                  <span
                    className={`absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-transform ${
                      ipSecurity ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>
            </div>

            <button
              type="submit"
              className="mt-2 h-12 rounded-2xl bg-emerald-500 text-sm font-semibold text-white transition hover:bg-emerald-600">
              로그인
            </button>

            <button
              type="button"
              className="h-12 rounded-2xl border border-emerald-300 text-sm font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50">
              패스키 로그인
            </button>
          </form>
        </div>

        <div className="mt-6 flex w-full max-w-xl flex-col items-center gap-3 text-xs text-neutral-500">
          <div className="flex gap-3">
            <button type="button" className="transition hover:text-emerald-500">
              비밀번호 찾기
            </button>
            <span>·</span>
            <button type="button" className="transition hover:text-emerald-500">
              아이디 찾기
            </button>
            <span>·</span>
            <Link
              to="/register"
              className="font-semibold text-emerald-600 transition hover:text-emerald-500">
              회원가입
            </Link>
          </div>

          <p className="text-center text-[11px] leading-relaxed text-neutral-400">
            지문 · 얼굴 인증을 설정했다면 간편하게 로그인 해보세요.
          </p>
          <Link
            to="/"
            className="text-[11px] font-medium text-emerald-500 transition hover:text-emerald-600">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
