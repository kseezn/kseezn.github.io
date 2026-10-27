"use client"; // 네이버 지도는 방문자의 브라우저에서 불러와야 해서 브라우저에서 실행됩니다.

import { useEffect, useRef, useState } from "react";
import { naverMapLink, offices, site, type Office } from "@/data/site";

// 네이버 지도 스크립트에서 이 파일이 쓰는 부분만 적어 둔 타입입니다.
type GeocodeResult = { v2: { addresses: { x: string; y: string }[] } };
type NaverMaps = {
  LatLng: new (lat: number, lng: number) => unknown;
  Map: new (element: HTMLElement, options: object) => unknown;
  Marker: new (options: object) => unknown;
  ZoomControlStyle: { SMALL: unknown };
  Position: { TOP_LEFT: unknown };
  Service?: {
    Status: { OK: unknown };
    geocode: (options: { query: string }, callback: (status: unknown, response: GeocodeResult) => void) => void;
  };
};
declare global {
  interface Window {
    naver?: { maps: NaverMaps };
    navermap_authFailure?: () => void;
  }
}

// 지도 스크립트는 페이지에서 한 번만 불러오고, 지도 여러 개가 함께 씁니다.
let loader: Promise<NaverMaps> | null = null;
const authFailureListeners = new Set<() => void>();

function loadNaverMaps(keyId: string) {
  if (!loader) {
    loader = new Promise((resolve, reject) => {
      // Client ID 인증에 실패하면 네이버가 이 함수를 불러 줍니다.
      window.navermap_authFailure = () => authFailureListeners.forEach((listener) => listener());
      const script = document.createElement("script");
      // 위도·경도가 없는 사무실이 있을 때만 주소 검색 기능(geocoder)을 함께 불러옵니다.
      const needsGeocoder = offices.some((office) => !office.lat || !office.lng);
      script.src =
        `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(keyId)}` +
        (needsGeocoder ? "&submodules=geocoder" : "");
      script.async = true;
      script.onload = () => (window.naver?.maps ? resolve(window.naver.maps) : reject(new Error("지도 로드 실패")));
      script.onerror = () => reject(new Error("지도 스크립트를 불러오지 못했습니다."));
      document.head.appendChild(script);
    });
  }
  return loader;
}

// 주소를 위도·경도로 바꿉니다. (사무실 정보에 lat, lng가 있으면 그 값을 씁니다)
function findPosition(maps: NaverMaps, office: Office): Promise<{ lat: number; lng: number }> {
  if (office.lat && office.lng) return Promise.resolve({ lat: office.lat, lng: office.lng });
  return new Promise((resolve, reject) => {
    if (!maps.Service) return reject(new Error("주소 검색 기능이 없습니다."));
    maps.Service.geocode({ query: office.address }, (status, response) => {
      const first = response?.v2?.addresses?.[0];
      if (status !== maps.Service?.Status.OK || !first) return reject(new Error("주소를 찾지 못했습니다."));
      resolve({ lat: Number(first.y), lng: Number(first.x) });
    });
  });
}

export default function NaverMap({ office }: { office: Office }) {
  const mapRef = useRef<HTMLDivElement>(null);
  // off: Client ID 없음 / loading: 불러오는 중 / ready: 지도 표시 / failed: 실패
  const [status, setStatus] = useState<"off" | "loading" | "ready" | "failed">(
    site.naverMapKeyId ? "loading" : "off",
  );

  useEffect(() => {
    if (!site.naverMapKeyId) return;
    let cancelled = false;
    const onAuthFailure = () => setStatus("failed");
    authFailureListeners.add(onAuthFailure);

    loadNaverMaps(site.naverMapKeyId)
      .then(async (maps) => {
        const { lat, lng } = await findPosition(maps, office);
        if (cancelled || !mapRef.current) return;
        const position = new maps.LatLng(lat, lng);
        // 예전 홈페이지와 같은 설정: 확대 18, 왼쪽 위 작은 확대·축소 버튼
        const map = new maps.Map(mapRef.current, {
          center: position,
          zoom: 18,
          minZoom: 6,
          zoomControl: true,
          zoomControlOptions: { style: maps.ZoomControlStyle.SMALL, position: maps.Position.TOP_LEFT },
          scaleControl: false,
        });
        new maps.Marker({ position, map, title: office.name });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    return () => {
      cancelled = true;
      authFailureListeners.delete(onAuthFailure);
    };
  }, [office]);

  const link = naverMapLink(office);

  return (
    <div className="map-box">
      {status !== "off" && status !== "failed" && (
        <div className="map-canvas" ref={mapRef} aria-label={`${office.name} 위치 지도`} role="img">
          {status === "loading" && <span className="map-loading">지도를 불러오는 중…</span>}
        </div>
      )}
      {(status === "off" || status === "failed") && (
        <a className="map-placeholder" href={link} target="_blank" rel="noopener noreferrer">
          <span className="map-pin" aria-hidden="true" />
          <span>네이버 지도에서 위치 보기 ↗</span>
        </a>
      )}
      <a className="map-route" href={link} target="_blank" rel="noopener noreferrer">
        길찾기 ↗
      </a>
    </div>
  );
}