"use client"; // 입력을 받고 보내기 결과를 보여 줘야 해서 브라우저에서 실행됩니다.

import { useState, type FormEvent } from "react";
import { consult } from "@/data/consult";
import { services, site } from "@/data/site";

type Status = "idle" | "sending" | "done" | "error";

// 온라인 상담 신청서. 보내면 Web3Forms를 거쳐 법인 메일로 도착합니다.
export default function ConsultForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return; // 사람 눈에 안 보이는 칸이 채워져 있으면 스팸 로봇이므로 무시

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: consult.accessKey,
          subject: `${consult.subject} - ${name}`,
          from_name: consult.fromName,
          replyto: email, // 받은 메일에서 '답장'을 누르면 신청자에게 바로 답장됩니다.
          // 아래 이름들이 받는 메일에 항목 이름으로 그대로 나옵니다.
          "회사명·이름": name,
          연락처: String(data.get("phone") ?? "").trim(),
          이메일: email,
          "상담 분야": String(data.get("field") ?? "") || "선택 안 함",
          "상담 내용": String(data.get("content") ?? "").trim() || "(내용 없음)",
          "개인정보 수집·이용 동의": "동의함",
        }),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) throw new Error(result?.message || `HTTP ${response.status}`);
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setMessage(`보내지 못했습니다. 잠시 뒤 다시 시도하시거나 ${site.phone}로 전화해 주세요.`);
    }
  }

  // 아직 Access Key를 넣지 않았으면 신청서 대신 안내를 보여 줍니다.
  if (!consult.accessKey) {
    return (
      <div className="consult-off">
        <p>온라인 상담 신청서를 준비하고 있습니다.</p>
        <p>
          상담은 <a href={`tel:${site.phone}`}>{site.phone}</a>
          {site.kakao && (
            <>
              {" "}
              또는{" "}
              <a href={site.kakao} target="_blank" rel="noopener noreferrer">
                카카오톡
              </a>
            </>
          )}
          으로 문의해 주세요.
        </p>
      </div>
    );
  }

  if (status === "done") {
    return (
      <div className="consult-done" role="status">
        <strong>상담 신청이 접수되었습니다.</strong>
        <p>내용을 확인한 뒤 남겨 주신 연락처로 연락드리겠습니다.</p>
        <button type="button" className="consult-again" onClick={() => setStatus("idle")}>
          새 신청서 쓰기
        </button>
      </div>
    );
  }

  return (
    <form className="consult-form" onSubmit={handleSubmit}>
      <label className="consult-field">
        <span>
          회사명·이름 <em aria-hidden="true">*</em>
        </span>
        <input name="name" required maxLength={80} autoComplete="organization" placeholder="예: 현명상사 홍길동" />
      </label>
      <div className="consult-row">
        <label className="consult-field">
          <span>
            연락처 <em aria-hidden="true">*</em>
          </span>
          <input
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[0-9\-\s]{9,15}"
            title="숫자와 - 로 9~15자리 입력해 주세요"
            placeholder="010-0000-0000"
          />
        </label>
        <label className="consult-field">
          <span>
            이메일 <em aria-hidden="true">*</em>
          </span>
          <input name="email" type="email" required autoComplete="email" placeholder="name@company.com" />
        </label>
      </div>
      <label className="consult-field">
        <span>상담 분야</span>
        <select name="field" defaultValue="">
          <option value="">선택해 주세요 (선택 사항)</option>
          {services.map((service) => (
            <option key={service.slug} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="기타">기타</option>
        </select>
      </label>
      <label className="consult-field">
        <span>상담 원하시는 내용</span>
        <textarea name="content" rows={5} maxLength={3000} placeholder="상황을 간단히 적어 주세요." />
      </label>

      {/* 스팸 로봇 걸러내기용 칸 (사람에게는 보이지 않음) */}
      <input type="checkbox" name="botcheck" className="consult-bot" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="consult-privacy">
        <label className="consult-agree">
          <input type="checkbox" name="agree" required />
          <span>
            개인정보 수집·이용에 동의합니다. <em aria-hidden="true">*</em>
          </span>
        </label>
        <details>
          <summary>자세히 보기</summary>
          <ul>
            {consult.privacy.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </details>
      </div>

      {status === "error" && (
        <p className="consult-error" role="alert">
          {message}
        </p>
      )}
      <button type="submit" className="consult-submit" disabled={status === "sending"}>
        {status === "sending" ? "보내는 중…" : "상담 신청하기"}
      </button>
    </form>
  );
}