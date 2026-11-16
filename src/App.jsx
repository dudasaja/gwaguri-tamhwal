import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * 사용자의 현재 시스템 로컬 날짜를 'YYYY-MM-DD' 형식으로 반환합니다.
 * UTC 변환 시차로 날짜가 밀리는 문제를 방지하기 위해 로컬 연·월·일을 직접 조합합니다.
 */
function getLocalTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 'YYYY-MM-DD' 문자열에 일수(deltaDays)를 더하거나 뺀 날짜 문자열을 반환합니다.
 */
function shiftDateStr(dateStr, deltaDays) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d + deltaDays);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 'YYYY-MM-DD' 문자열을 'M월 D일 (요일)' 한국어 표기로 변환합니다.
 */
function formatKoreanDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${weekdays[dt.getDay()]})`;
}

/**
 * 전남과학고등학교 3개 건물(성실관·창의관·성취관) 및 층별 2단 블록 그리드 구조
 * - 상단 구역(topRooms) · 중앙 복도 바 · 하단 구역(bottomRooms)의 3~4열 그리드로 구성하여
 *   모든 실 이름과 부제가 세로 줄바꿈이나 겹침 없이 선명하게 표시됩니다.
 */
const BUILDINGS = {
  seongsil: {
    id: 'seongsil',
    name: '성실관',
    fullName: '성실관 (본관)',
    mapLabel: '성실관 (본관 · 1~4F)',
    floors: {
      '1F': {
        label: '1F',
        corridor: '◀ 서측 계단 | 1층 복도 | 동측 계단 (면학실 방면) ▶',
        topRooms: [
          { id: 'seongsil_1f_admin', name: '행정실', sub: '시설·준비구역' },
          { id: 'seongsil_1f_principal', name: '교장실', sub: '시설·준비구역' },
          { id: 'seongsil_1f_council', name: '교직원협의실', sub: '시설·준비구역' },
          { id: 'seongsil_1f_health', name: '보건실', sub: '시설·준비구역' },
        ],
        bottomRooms: [
          { id: 'seongsil_1f_lobby', name: '중앙현관', sub: '시설·준비구역' },
          { id: 'seongsil_1f_ai', name: 'AI실', sub: '연구·정보구역' },
          { id: 'seongsil_1f_coding', name: '코딩실', sub: '구 멀티실' },
          { id: 'seongsil_1f_info', name: '정보실', sub: '정보·전산구역' },
          { id: 'seongsil_1f_cafeteria', name: '급식실', sub: '시설·준비구역' },
        ],
      },
      '2F': {
        label: '2F',
        corridor: '◀ 서측 계단 | 2층 복도 | 창의관 2층 연결통로 ▶',
        topRooms: [
          { id: 'seongsil_2f_1_1', name: '1-1 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_2', name: '1-2 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_3', name: '1-3 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_4', name: '1-4 교실', sub: '1학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_2f_grade1', name: '1학년부 교무실', sub: '교무·행정구역' },
          { id: 'seongsil_2f_career', name: '진로진학상담실', sub: '상담·진로구역' },
          { id: 'seongsil_2f_wee', name: '위클래스(Wee)', sub: '상담·지원구역' },
        ],
      },
      '3F': {
        label: '3F',
        corridor: '◀ 서측 계단 | 3층 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'seongsil_3f_2_1', name: '2-1 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_2', name: '2-2 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_3', name: '2-3 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_4', name: '2-4 교실', sub: '2학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_3f_grade2', name: '2학년부 교무실', sub: '교무·행정구역' },
          { id: 'seongsil_3f_main_office', name: '본교무실', sub: '교무·행정구역' },
          { id: 'seongsil_3f_jbs', name: '방송실(JBS)', sub: '방송·미디어구역' },
        ],
      },
      '4F': {
        label: '4F',
        corridor: '◀ 서측 계단 | 4층 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'seongsil_4f_3_1', name: '3-1 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_2', name: '3-2 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_3', name: '3-3 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_4', name: '3-4 교실', sub: '3학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_4f_math1', name: '수학1실', sub: '수학 교과전용실' },
          { id: 'seongsil_4f_math2', name: '수학2실', sub: '수학 교과전용실' },
          { id: 'seongsil_4f_english', name: '영어전용실', sub: '어학 교과전용실' },
          { id: 'seongsil_4f_library', name: '도서관(글마루)', sub: '열람·자료구역' },
        ],
      },
    },
  },
  changui: {
    id: 'changui',
    name: '창의관',
    fullName: '창의관 (실험동)',
    mapLabel: '창의관 (실험동 · 1~4F+옥상)',
    floors: {
      '1F': {
        label: '1F',
        corridor: '◀ 반원형 중앙 계단 | 1층 지구과학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_1f_earth_lab', name: '지구과학 실험실', sub: '지구과학 탐구구역' },
          { id: 'chang_1f_earth_prep', name: '지구과학 준비실', sub: '실험·기자재 준비' },
        ],
        bottomRooms: [
          { id: 'chang_1f_earth_re', name: '지구과학 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_1f_seminar', name: '세미나실', sub: '발표·토론구역' },
        ],
      },
      '2F': {
        label: '2F',
        corridor: '◀ 성실관 2층 연결통로 | 2층 물리·수학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_2f_phys_lab', name: '물리 실험실', sub: '물리 탐구·실험구역' },
          { id: 'chang_2f_phys_prep', name: '물리 준비실', sub: '실험·기자재 준비' },
        ],
        bottomRooms: [
          { id: 'chang_2f_phys_re', name: '물리 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_2f_math_lab', name: '수학 탐구실', sub: '수리·모델링 연구' },
        ],
      },
      '3F': {
        label: '3F',
        corridor: '◀ 반원형 중앙 계단 | 3층 생물 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_3f_bio_lab', name: '생명과학 실험실', sub: '생명과학 탐구구역' },
          { id: 'chang_3f_bio_prep', name: '생물 준비실', sub: '실험·기자재 준비' },
        ],
        bottomRooms: [
          { id: 'chang_3f_bio_re', name: '생명과학 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_3f_equip', name: '첨단기기실', sub: '정밀 분석장비구역' },
        ],
      },
      '4F': {
        label: '4F',
        corridor: '◀ 반원형 중앙 계단 | 4층 화학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_4f_chem_lab', name: '화학 실험실', sub: '화학 탐구·실험구역' },
          { id: 'chang_4f_chem_prep', name: '화학 준비실', sub: '실험·기자재 준비' },
        ],
        bottomRooms: [
          { id: 'chang_4f_chem_re', name: '화학 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_4f_reagent', name: '약품보관실', sub: '시약·안전관리구역' },
        ],
      },
      옥상: {
        label: '옥상',
        corridor: '▲ 옥상 천체관측 데크 · 반원형 타워 상부 돔',
        topRooms: [
          { id: 'chang_rf_observatory', name: '옥상 천문대', sub: '주관측실 · 보조관측실' },
        ],
        bottomRooms: [],
      },
    },
  },
  seongchui: {
    id: 'seongchui',
    name: '성취관',
    fullName: '성취관 (강당)',
    mapLabel: '성취관 (강당 · 1~2F)',
    floors: {
      '1F': {
        label: '1F',
        corridor: '◀ 서측 출입구 | 1층 예체능 복도 | 동측 출입구 ▶',
        topRooms: [
          { id: 'seongchui_1f_music', name: '음악실', sub: '음악·합주구역' },
          { id: 'seongchui_1f_piano', name: '피아노·기악실', sub: '개인·소그룹 연습' },
        ],
        bottomRooms: [
          { id: 'seongchui_1f_art', name: '미술실', sub: '조형·디자인구역' },
          { id: 'seongchui_1f_pingpong', name: '탁구장', sub: '실내 체육구역' },
        ],
      },
      '2F': {
        label: '2F',
        corridor: '▲ 성취관 2층 대강당 진입 홀',
        topRooms: [
          { id: 'seongchui_2f_gym', name: '체육관 (강당)', sub: '다목적 실내 코트' },
        ],
        bottomRooms: [],
      },
    },
  },
};

/**
 * 전체 실 ID -> 건물/층/실 메타데이터 빠른 조회 사전
 */
const ROOM_META_MAP = (() => {
  const map = {
    external: {
      id: 'external',
      buildingId: 'external',
      buildingName: '교외 활동',
      floor: '교외',
      name: '교외 지정 장소',
      sub: '대학·연구소 위탁 및 교외 탐구',
    },
  };
  Object.values(BUILDINGS).forEach((b) => {
    Object.entries(b.floors).forEach(([floorKey, floorObj]) => {
      [...floorObj.topRooms, ...floorObj.bottomRooms].forEach((room) => {
        map[room.id] = {
          ...room,
          buildingId: b.id,
          buildingName: b.name,
          floor: floorKey,
        };
      });
    });
  });
  return map;
})();

/**
 * 과구리 탐활서의 비정형 장소 표기를 표준 roomId로 매핑하는 별칭 사전
 */
const LOCATION_ALIAS_ENTRIES = [
  ['물리r&e', 'chang_2f_phys_re'],
  ['물리실험실', 'chang_2f_phys_lab'],
  ['물리탐구실험', 'chang_2f_phys_lab'],
  ['물리준비실', 'chang_2f_phys_prep'],
  ['수학탐구실', 'chang_2f_math_lab'],
  ['생명과학실험실', 'chang_3f_bio_lab'],
  ['생명과학실', 'chang_3f_bio_lab'],
  ['생명과학r&e', 'chang_3f_bio_re'],
  ['생물준비실', 'chang_3f_bio_prep'],
  ['첨단기기실', 'chang_3f_equip'],
  ['화학실험실', 'chang_4f_chem_lab'],
  ['화학r&e', 'chang_4f_chem_re'],
  ['화학준비실', 'chang_4f_chem_prep'],
  ['약품보관실', 'chang_4f_reagent'],
  ['지구과학실험실', 'chang_1f_earth_lab'],
  ['지구과학r&e', 'chang_1f_earth_re'],
  ['지구과학준비실', 'chang_1f_earth_prep'],
  ['세미나실', 'chang_1f_seminar'],
  ['천문대', 'chang_rf_observatory'],
  ['주관측실', 'chang_rf_observatory'],
  ['코딩실', 'seongsil_1f_coding'],
  ['멀티실', 'seongsil_1f_coding'],
  ['ai실', 'seongsil_1f_ai'],
  ['정보실', 'seongsil_1f_info'],
  ['행정실', 'seongsil_1f_admin'],
  ['교장실', 'seongsil_1f_principal'],
  ['교직원협의실', 'seongsil_1f_council'],
  ['보건실', 'seongsil_1f_health'],
  ['중앙현관', 'seongsil_1f_lobby'],
  ['급식실', 'seongsil_1f_cafeteria'],
  ['1-1', 'seongsil_2f_1_1'],
  ['1-2', 'seongsil_2f_1_2'],
  ['1-3', 'seongsil_2f_1_3'],
  ['1-4', 'seongsil_2f_1_4'],
  ['1학년부', 'seongsil_2f_grade1'],
  ['진로진학', 'seongsil_2f_career'],
  ['위클래스', 'seongsil_2f_wee'],
  ['2-1', 'seongsil_3f_2_1'],
  ['2-2', 'seongsil_3f_2_2'],
  ['2-3', 'seongsil_3f_2_3'],
  ['2-4', 'seongsil_3f_2_4'],
  ['2학년부', 'seongsil_3f_grade2'],
  ['본교무실', 'seongsil_3f_main_office'],
  ['방송실', 'seongsil_3f_jbs'],
  ['3-1', 'seongsil_4f_3_1'],
  ['3-2', 'seongsil_4f_3_2'],
  ['3-3', 'seongsil_4f_3_3'],
  ['3-4', 'seongsil_4f_3_4'],
  ['수학1실', 'seongsil_4f_math1'],
  ['수학2실', 'seongsil_4f_math2'],
  ['영어전용실', 'seongsil_4f_english'],
  ['도서관', 'seongsil_4f_library'],
  ['글마루', 'seongsil_4f_library'],
  ['음악실', 'seongchui_1f_music'],
  ['피아노', 'seongchui_1f_piano'],
  ['기악실', 'seongchui_1f_piano'],
  ['미술실', 'seongchui_1f_art'],
  ['탁구장', 'seongchui_1f_pingpong'],
  ['체육관', 'seongchui_2f_gym'],
  ['강당', 'seongchui_2f_gym'],
];

function normalizeLocationToRoomId(rawLocation) {
  if (!rawLocation) return 'external';
  const cleaned = rawLocation.replace(/\s+/g, '').toLowerCase();
  if (
    cleaned.includes('교외') ||
    cleaned.includes('전남대') ||
    cleaned.includes('지스트') ||
    cleaned.includes('gist')
  ) {
    return 'external';
  }
  for (const [alias, roomId] of LOCATION_ALIAS_ENTRIES) {
    if (cleaned.includes(alias)) return roomId;
  }
  return 'external';
}

/**
 * 실제 과구리(jshsus.kr) 탐활서 데이터 27건 (2026-11-16 ~ 2026-11-23)
 */
const DEFAULT_RECORDS = [
  // 2026-11-16 (13건)
  {
    id: 'gw-01',
    date: '2026-11-16',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-02',
    date: '2026-11-16',
    submittedAt: '11월 10일 21시 27분 59초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'R&E 보고서 작성 및 회의',
    leader: '1306김혜안',
    members: '1305김재훈, 1306김혜안, 1316장승범, 1402국선우',
    teacher: '김희웅',
  },
  {
    id: 'gw-03',
    date: '2026-11-16',
    submittedAt: '11월 13일 16시 06분 38초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리R&E',
    roomId: 'chang_2f_phys_re',
    topic: '시사 역사 골든벨 준비',
    leader: '2107박세인',
    members: '2107박세인,3108신서빈,1105김장현,1305김재훈,1205남도형',
    teacher: '김민기',
  },
  {
    id: 'gw-04',
    date: '2026-11-16',
    submittedAt: '11월 16일 13시 34분 30초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 탐구실험',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 실험실',
    leader: '2205 김주호',
    members: '2205 김주호',
    teacher: '양용해',
  },
  {
    id: 'gw-05',
    date: '2026-11-16',
    submittedAt: '11월 16일 13시 34분 54초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2406 박희재',
    members: '2406 박희재, 2410 심재원',
    teacher: '양용해',
  },
  {
    id: 'gw-06',
    date: '2026-11-16',
    submittedAt: '11월 16일 14시 25분 32초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '수학1실',
    roomId: 'seongsil_4f_math1',
    topic: '스터디',
    leader: '2119 최율희',
    members: '2102 김정원, 2103 김주하, 2119 최율희, 2405 박상언, 2420 한재은',
    teacher: '박형도',
  },
  {
    id: 'gw-07',
    date: '2026-11-16',
    submittedAt: '11월 16일 16시 02분 12초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '소프트웨어 경시대회 준비',
    leader: '1117 조영우',
    members: '1117 조영우, 1114 이예지, 1310 서준혁',
    teacher: '진정숙',
  },
  {
    id: 'gw-08',
    date: '2026-11-16',
    submittedAt: '11월 16일 16시 21분 01초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '2-4반 교실',
    roomId: 'seongsil_3f_2_4',
    topic: '스터디',
    leader: '2409 신현승',
    members: '2409 신현승, 2416 정민준',
    teacher: '문종한',
  },
  {
    id: 'gw-09',
    date: '2026-11-16',
    submittedAt: '11월 16일 16시 21분 07초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2101 김서율',
    members: '2101김서율, 2116 정수현, 2115정도연, 2302강다희',
    teacher: '양용해',
  },
  {
    id: 'gw-10',
    date: '2026-11-16',
    submittedAt: '11월 16일 17시 02분 35초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리학 실험',
    leader: '1203김웅',
    members: '1203김웅, 1208박제경, 1213이시후, 1219황연준',
    teacher: '강대혁',
  },
  {
    id: 'gw-11',
    date: '2026-11-16',
    submittedAt: '11월 16일 17시 21분 34초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '생명과학실',
    roomId: 'chang_3f_bio_lab',
    topic: '생명탐구',
    leader: '1201김슬우',
    members: '1315이서진',
    teacher: '김창진',
  },
  {
    id: 'gw-12',
    date: '2026-11-16',
    submittedAt: '11월 16일 18시 03분 02초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '소프트웨어경시대회준비',
    leader: '1111 이미엘',
    members: '1111 이미엘, 1409 신승민, 1319 현명원',
    teacher: '진정숙',
  },
  {
    id: 'gw-13',
    date: '2026-11-16',
    submittedAt: '11월 16일 18시 12분 25초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2111이승찬',
    members: '2111 이승찬, 2108 방시우, 2307 김현우',
    teacher: '양용해',
  },

  // 2026-11-17 (4건)
  {
    id: 'gw-14',
    date: '2026-11-17',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-15',
    date: '2026-11-17',
    submittedAt: '11월 16일 13시 15분 10초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '전남대학교 사범대',
    roomId: 'external',
    topic: '알앤이활동',
    leader: '1117조영우',
    members: '1119황호준, 1302김동욱, 1418편성인',
    teacher: '유지원',
  },
  {
    id: 'gw-16',
    date: '2026-11-17',
    submittedAt: '11월 16일 13시 34분 54초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2406 박희재',
    members: '2406 박희재, 2410 심재원',
    teacher: '양용해',
  },
  {
    id: 'gw-17',
    date: '2026-11-17',
    submittedAt: '11월 16일 17시 25분 11초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '생명과학실',
    roomId: 'chang_3f_bio_lab',
    topic: '생명탐구',
    leader: '1315이서진',
    members: '1102구현준',
    teacher: '김창진',
  },

  // 2026-11-18 (4건)
  {
    id: 'gw-18',
    date: '2026-11-18',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-19',
    date: '2026-11-18',
    submittedAt: '11월 16일 15시 10분 42초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '1-4 교실',
    roomId: 'seongsil_2f_1_4',
    topic: '영어 빌드업반',
    leader: '1411이도윤',
    members:
      '1102구현준,1109손제연,1205남도형,1215장준우,1302김동욱,1304김승유,1306김혜안,1313윤태린,1317정의찬,1405김유민,1411이도윤',
    teacher: '조솔희',
  },
  {
    id: 'gw-20',
    date: '2026-11-18',
    submittedAt: '11월 16일 13시 34분 54초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2406 박희재',
    members: '2406 박희재, 2410 심재원',
    teacher: '양용해',
  },
  {
    id: 'gw-21',
    date: '2026-11-18',
    submittedAt: '11월 16일 17시 28분 05초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '생명과학실',
    roomId: 'chang_3f_bio_lab',
    topic: '생명탐구',
    leader: '1102구현준',
    members: '1102구현준',
    teacher: '김창진',
  },

  // 2026-11-19 (2건)
  {
    id: 'gw-22',
    date: '2026-11-19',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-23',
    date: '2026-11-19',
    submittedAt: '11월 16일 13시 34분 54초',
    periods: ['1면학', '2면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리 실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '물리 탐구활동',
    leader: '2406 박희재',
    members: '2406 박희재, 2410 심재원',
    teacher: '양용해',
  },

  // 2026-11-20 ~ 2026-11-23 (각 1건)
  {
    id: 'gw-24',
    date: '2026-11-20',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-25',
    date: '2026-11-21',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-26',
    date: '2026-11-22',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
  {
    id: 'gw-27',
    date: '2026-11-23',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
];

const STORAGE_KEY = 'gwaguri_tamhwal_records_v3';

/**
 * 과구리 '탐활서 확인' 페이지에서 복사한 텍스트(탭 구분형/줄바꿈형 모두 지원)를
 * 구조화된 레코드 배열로 변환하는 파싱 함수
 */
function parseGwaguriClipboardText(rawText, fallbackDate) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const fieldKeys = ['활동날짜', '활동시간', '활동장소', '활동내용', '대표학생', '참가학생', '지도교사'];
  const parsed = [];
  let current = null;
  let pendingKey = null;

  const commitRecord = () => {
    if (!current) return;
    if (current.rawLocation || current.leader || current.topic || current.timeText) {
      const dateSource = `${current.dateText || ''} ${current.timeText || ''}`;
      const fullDateMatch = dateSource.match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
      const shortDateMatch = dateSource.match(/(\d{1,2})\s*월\s*(\d{1,2})\s*일/);
      const fallbackYear = fallbackDate.split('-')[0];

      let resolvedDate = fallbackDate;
      if (fullDateMatch) {
        resolvedDate = `${fullDateMatch[1]}-${String(fullDateMatch[2]).padStart(2, '0')}-${String(
          fullDateMatch[3]
        ).padStart(2, '0')}`;
      } else if (shortDateMatch) {
        resolvedDate = `${fallbackYear}-${String(shortDateMatch[1]).padStart(2, '0')}-${String(
          shortDateMatch[2]
        ).padStart(2, '0')}`;
      }

      const timeStr = current.timeText || '19:10 ~ 20:20, 20:30 ~ 21:30';
      const combinedHint = `${timeStr} ${current.topic || ''}`;
      const periods = [];
      if (/19:10|1\s*면학/.test(combinedHint)) periods.push('1면학');
      if (/20:30|2\s*면학/.test(combinedHint)) periods.push('2면학');
      if (/21:40|3\s*면학/.test(combinedHint)) periods.push('3면학');
      if (periods.length === 0) periods.push('1면학', '2면학');

      const rawLoc = current.rawLocation || '장소 미지정';
      parsed.push({
        id: `paste-${Date.now()}-${parsed.length}`,
        date: resolvedDate,
        submittedAt: current.submittedAt || '방금 붙여넣기 반영됨',
        periods,
        timeText: timeStr,
        rawLocation: rawLoc,
        roomId: normalizeLocationToRoomId(rawLoc),
        topic: current.topic || '탐구활동',
        leader: current.leader || '미상',
        members: current.members || current.leader || '없음',
        teacher: current.teacher || '미지정',
      });
    }
    current = null;
    pendingKey = null;
  };

  for (const line of lines) {
    // 제출 시각 줄 감지 (예: "11월 16일 16시 02분 12초")
    if (/^\d{1,2}월\s*\d{1,2}일\s*\d{1,2}시/.test(line)) {
      if (current && (current.rawLocation || current.leader)) {
        commitRecord();
      }
      if (!current) current = {};
      current.submittedAt = line;
      pendingKey = null;
      continue;
    }

    // "필드명\t값" 또는 "필드명 : 값" 한 줄 형식
    let matchedSingleLine = false;
    for (const key of fieldKeys) {
      const m = line.match(new RegExp(`^${key}\\s*[:\\t]\\s*(.+)$`));
      if (m) {
        if ((key === '활동날짜' || key === '활동시간') && current && (current.rawLocation || current.leader)) {
          commitRecord();
        }
        if (!current) current = {};
        const val = m[1].trim();
        if (key === '활동날짜') current.dateText = val;
        if (key === '활동시간') current.timeText = val;
        if (key === '활동장소') current.rawLocation = val;
        if (key === '활동내용') current.topic = val;
        if (key === '대표학생') current.leader = val;
        if (key === '참가학생') current.members = val;
        if (key === '지도교사') current.teacher = val;
        pendingKey = null;
        matchedSingleLine = true;
        break;
      }
    }
    if (matchedSingleLine) continue;

    // 단독 라벨 줄 ("활동장소" 다음 줄에 값이 오는 경우)
    if (fieldKeys.includes(line)) {
      if ((line === '활동날짜' || line === '활동시간') && current && (current.rawLocation || current.leader)) {
        commitRecord();
      }
      if (!current) current = {};
      pendingKey = line;
      continue;
    }

    // 직전 단독 라벨에 대응하는 값 줄
    if (pendingKey && current) {
      if (pendingKey === '활동날짜') current.dateText = line;
      if (pendingKey === '활동시간') current.timeText = line;
      if (pendingKey === '활동장소') current.rawLocation = line;
      if (pendingKey === '활동내용') current.topic = line;
      if (pendingKey === '대표학생') current.leader = line;
      if (pendingKey === '참가학생') current.members = line;
      if (pendingKey === '지도교사') current.teacher = line;
      pendingKey = null;
    }
  }

  commitRecord();
  return parsed;
}

/**
 * 참가학생 문자열에서 고유 학생 인원 수를 계산합니다.
 */
function countUniqueStudents(rec) {
  const raw = `${rec.leader || ''}, ${rec.members || ''}`;
  const tokens = raw
    .split(/[,/]+/)
    .map((s) => s.replace(/\s+/g, ''))
    .filter((s) => s && s !== '없음' && s !== '미상');
  return new Set(tokens).size || 1;
}

export default function App() {
  // 1. 접속 시 오늘 날짜 자동 설정 및 밤 12시(00:00) 자동 다음 날 전환 상태
  const [todayStr, setTodayStr] = useState(() => getLocalTodayStr());
  const [selectedDate, setSelectedDate] = useState(() => getLocalTodayStr());
  const [midnightBanner, setMidnightBanner] = useState('');

  const todayStrRef = useRef(todayStr);
  const selectedDateRef = useRef(selectedDate);
  useEffect(() => {
    todayStrRef.current = todayStr;
  }, [todayStr]);
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  useEffect(() => {
    let midnightTimerId = null;

    const checkDayRollover = () => {
      const currentLocalToday = getLocalTodayStr();
      const prevToday = todayStrRef.current;
      if (currentLocalToday !== prevToday) {
        setTodayStr(currentLocalToday);
        // 기존 '오늘' 날짜를 보고 있었다면 자정(00:00) 경과 시 자동으로 다음 날(새 오늘)로 전환
        if (selectedDateRef.current === prevToday) {
          setSelectedDate(currentLocalToday);
        }
        setMidnightBanner(
          `자정(00:00)이 지나 날짜가 ${formatKoreanDate(currentLocalToday)}로 자동 전환되었습니다.`
        );
      }
    };

    const scheduleNextMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        100
      );
      const delayMs = Math.max(1000, nextMidnight.getTime() - now.getTime());

      midnightTimerId = window.setTimeout(() => {
        checkDayRollover();
        scheduleNextMidnight();
      }, delayMs);
    };

    scheduleNextMidnight();
    const intervalId = window.setInterval(checkDayRollover, 15000);
    const onVisibilityChange = () => {
      if (!document.hidden) checkDayRollover();
    };
    window.addEventListener('focus', checkDayRollover);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      if (midnightTimerId) window.clearTimeout(midnightTimerId);
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkDayRollover);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!midnightBanner) return;
    const t = window.setTimeout(() => setMidnightBanner(''), 6000);
    return () => window.clearTimeout(t);
  }, [midnightBanner]);

  // 2. 탐활 데이터 상태 (localStorage 영속화)
  const [records, setRecords] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // 스토리지 접근 불가 시 기본 27건 사용
    }
    return DEFAULT_RECORDS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // 용량 초과 등 예외 무시
    }
  }, [records]);

  // 3. 화면 모드('campus' 전체 학교 지도 | 'building' 건물 내부 평면도) 및 선택 상태
  const [viewMode, setViewMode] = useState('campus');
  const [selectedBuildingId, setSelectedBuildingId] = useState('seongsil');
  const [selectedFloor, setSelectedFloor] = useState('1F');
  const [selectedRoomId, setSelectedRoomId] = useState('seongsil_1f_coding');
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExternalModal, setShowExternalModal] = useState(false);

  // 달력 팝오버 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const [y, m] = getLocalTodayStr().split('-').map(Number);
    return { year: y, month: m };
  });

  // 클립보드 붙여넣기 모달 상태
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [pasteStatus, setPasteStatus] = useState(null);

  useEffect(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    setCalendarMonth({ year: y, month: m });
  }, [selectedDate]);

  // 건물 진입 핸들러
  const openBuildingView = (bId, preferredFloor = null, preferredRoomId = null) => {
    setSelectedBuildingId(bId);
    const floorKeys = Object.keys(BUILDINGS[bId].floors);
    const targetFloor =
      preferredFloor && floorKeys.includes(preferredFloor) ? preferredFloor : floorKeys[0];
    setSelectedFloor(targetFloor);

    if (preferredRoomId) {
      setSelectedRoomId(preferredRoomId);
    } else {
      const floorObj = BUILDINGS[bId].floors[targetFloor];
      const defaultRoom = floorObj.bottomRooms[0] || floorObj.topRooms[0];
      if (defaultRoom) setSelectedRoomId(defaultRoom.id);
    }
    setViewMode('building');
  };

  // 층 변경 핸들러
  const handleSelectFloor = (floorKey) => {
    setSelectedFloor(floorKey);
    const floorObj = BUILDINGS[selectedBuildingId].floors[floorKey];
    if (floorObj) {
      const firstRoom = floorObj.topRooms[0] || floorObj.bottomRooms[0];
      if (firstRoom) setSelectedRoomId(firstRoom.id);
    }
  };

  // 현재 날짜 + 시간대 필터링된 탐활 목록
  const activeRecords = useMemo(() => {
    return records.filter((rec) => {
      if (rec.date !== selectedDate) return false;
      if (periodFilter !== 'ALL' && !rec.periods.includes(periodFilter)) return false;
      return true;
    });
  }, [records, selectedDate, periodFilter]);

  // 실별 배정 레코드 그룹화
  const recordsByRoom = useMemo(() => {
    const map = {};
    activeRecords.forEach((rec) => {
      if (!map[rec.roomId]) map[rec.roomId] = [];
      map[rec.roomId].push(rec);
    });
    return map;
  }, [activeRecords]);

  // 상단 요약 통계 (전체 탐활 건수, 사용 중인 실 수, 중복 사용실 수)
  const summaryStats = useMemo(() => {
    const entries = Object.entries(recordsByRoom);
    return {
      totalCount: activeRecords.length,
      usedRooms: entries.length,
      conflictRooms: entries.filter(([, list]) => list.length >= 2).length,
    };
  }, [activeRecords, recordsByRoom]);

  // 건물별 요약 통계 (캠퍼스 지도 배지용)
  const buildingSummaries = useMemo(() => {
    const stats = {};
    Object.keys(BUILDINGS).forEach((bId) => {
      let teams = 0;
      let conflictRooms = 0;
      Object.entries(recordsByRoom).forEach(([rId, list]) => {
        const meta = ROOM_META_MAP[rId];
        if (meta && meta.buildingId === bId) {
          teams += list.length;
          if (list.length >= 2) conflictRooms += 1;
        }
      });
      stats[bId] = { teams, conflictRooms };
    });
    return stats;
  }, [recordsByRoom]);

  // 통합 검색 결과
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return activeRecords.filter((rec) => {
      const meta = ROOM_META_MAP[rec.roomId];
      const target = [
        rec.leader,
        rec.members,
        rec.topic,
        rec.teacher,
        rec.rawLocation,
        meta?.name || '',
        meta?.buildingName || '',
      ]
        .join(' ')
        .toLowerCase();
      return target.includes(q);
    });
  }, [activeRecords, searchQuery]);

  // 달력 날짜별 등록 건수
  const countByDate = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.date] = (map[r.date] || 0) + 1;
    });
    return map;
  }, [records]);

  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      cells.push({
        day: d,
        dateStr: `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
      });
    }
    return cells;
  }, [calendarMonth]);

  // 붙여넣기 실시간 미리보기 파싱 결과
  const liveParsedPreview = useMemo(() => {
    return parseGwaguriClipboardText(pasteInput, selectedDate);
  }, [pasteInput, selectedDate]);

  const handleConfirmPaste = () => {
    if (liveParsedPreview.length === 0) {
      setPasteStatus({
        type: 'error',
        message: '인식된 탐활 내역이 없습니다. 과구리 [탐활서 확인] 표 전체를 복사해 붙여넣어 주세요.',
      });
      return;
    }

    setRecords((prev) => [...liveParsedPreview, ...prev]);
    const first = liveParsedPreview[0];
    setSelectedDate(first.date);
    const meta = ROOM_META_MAP[first.roomId];
    if (meta && meta.buildingId !== 'external') {
      openBuildingView(meta.buildingId, meta.floor, meta.id);
    } else {
      setShowExternalModal(true);
    }

    setPasteStatus({
      type: 'success',
      message: `${liveParsedPreview.length}건의 탐활 내역을 평면도에 반영했습니다.`,
    });
    setPasteInput('');
    setIsPasteModalOpen(false);
  };

  const handleRestoreDefaults = () => {
    setRecords(DEFAULT_RECORDS);
    setPasteStatus({
      type: 'success',
      message: '기본 과구리 실데이터(27건)가 복원되었습니다.',
    });
  };

  const externalRecords = recordsByRoom.external || [];
  const currentBuilding = BUILDINGS[selectedBuildingId];
  const currentFloorObj = currentBuilding.floors[selectedFloor];
  const selectedRoomMeta = ROOM_META_MAP[selectedRoomId] || {
    id: selectedRoomId,
    buildingName: '성실관',
    floor: '1F',
    name: '코딩실',
    sub: '구 멀티실',
  };
  const selectedRoomRecords = recordsByRoom[selectedRoomId] || [];

  // 층별 평면도 내 개별 실 카드 렌더링
  const renderRoomCard = (room) => {
    const list = recordsByRoom[room.id] || [];
    const teamCount = list.length;
    const isSelected = selectedRoomId === room.id;

    let cardColorClass =
      'bg-white border-[#d1d5db] text-[#111827] hover:border-[#7ea69b]';
    let statusBadge = (
      <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-[3px] bg-[#f3f4f6] text-[#6b7280]">
        비어 있음
      </span>
    );

    if (teamCount === 1) {
      cardColorClass =
        'bg-[#eef5f3] border-[#7ea69b] text-[#13382e] hover:bg-[#e3efec]';
      statusBadge = (
        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-[#7ea69b] text-white">
          1팀
        </span>
      );
    } else if (teamCount >= 2) {
      cardColorClass =
        'bg-[#fff5ed] border-[#d97736] text-[#7c2d12] hover:bg-[#ffeadb]';
      statusBadge = (
        <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-[3px] bg-[#d97736] text-white">
          {teamCount}팀 중복
        </span>
      );
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => setSelectedRoomId(room.id)}
        className={`w-full text-left min-h-[115px] p-3.5 rounded-[4px] border transition-all flex flex-col justify-between ${cardColorClass} ${
          isSelected ? 'ring-2 ring-[#111827] shadow-sm' : ''
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[15px] font-bold leading-snug tracking-tight break-keep">
              {room.name}
            </span>
            <span className="shrink-0">{statusBadge}</span>
          </div>
          {room.sub && (
            <div className="text-[12px] text-[#6b7280] mt-0.5 leading-tight">
              {room.sub}
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-black/5 text-[12px]">
          {teamCount === 0 ? (
            <span className="text-[#9ca3af]">신청 내역 없음</span>
          ) : (
            <div className="truncate font-medium text-[#374151]">
              {list[0].leader}
              {teamCount > 1
                ? ` 외 ${teamCount - 1}팀`
                : ` (${countUniqueStudents(list[0])}명)`}
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#f3f4f6] text-[#222222]"
      style={{
        fontFamily:
          "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif",
      }}
    >
      {/* 1. 공식 과구리 상단 민트 헤더 (64px) */}
      <header className="bg-[#7ea69b] text-white h-[64px] border-b border-[#6d9489]">
        <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            {/* 2x2 흰색/반투명 그리드 로고 아이콘 */}
            <button
              type="button"
              onClick={() => setViewMode('campus')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <span className="grid grid-cols-2 gap-1 w-6 h-6 p-0.5 shrink-0">
                <span className="bg-white rounded-[1px]" />
                <span className="bg-white/65 rounded-[1px]" />
                <span className="bg-white/65 rounded-[1px]" />
                <span className="bg-white rounded-[1px]" />
              </span>
              <span className="text-[26px] font-bold tracking-tight leading-none text-white">
                과구리
              </span>
            </button>
            <span className="text-white/50 text-lg hidden sm:inline">|</span>
            <span className="text-white/95 text-[14px] truncate hidden sm:inline">
              소개 | 학생부 전산시스템 · 공용 탐활 공간 현황
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasteStatus(null);
              setIsPasteModalOpen(true);
            }}
            className="border border-white/80 text-white px-4 py-2 rounded-[4px] text-[14px] font-medium hover:bg-white/10 transition-colors whitespace-nowrap shrink-0"
          >
            탐활서 데이터 붙여넣기
          </button>
        </div>
      </header>

      {/* 2. 공식 과구리 2줄 글로벌 내비게이션 바 */}
      <nav className="bg-white border-b border-[#e2e8f0] text-[15px] font-medium text-[#222222]">
        <div className="max-w-[1280px] mx-auto px-4">
          {/* 1행 */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-1 pt-2.5 pb-1.5">
            {[
              '공지사항',
              '탐활서',
              '자유게시판',
              '청원·제안',
              '상벌점/휴대폰',
              'JBS',
              '분실물',
              '대포',
            ].map((item) => (
              <span
                key={item}
                className="cursor-pointer hover:text-[#5f8d80] transition-colors whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
          {/* 2행 */}
          <div className="flex flex-wrap items-center gap-x-7 gap-y-1 pt-1 pb-2.5 border-t border-[#f1f5f9]">
            {[
              { label: '기상곡 신청', active: false },
              { label: '세특 바이트 계산기', active: false },
              { label: '감사챌린지', active: false },
              { label: '잔반제로', active: false },
              { label: '탐활 현황 맵', active: true },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => item.active && setViewMode('campus')}
                className={`pb-0.5 whitespace-nowrap transition-colors ${
                  item.active
                    ? 'text-[#5f8d80] font-bold border-b-2 border-[#7ea69b]'
                    : 'text-[#222222] hover:text-[#5f8d80]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 3. 메인 화이트 카드 컨테이너 */}
      <main className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="bg-white border border-[#d1d5db] rounded-[4px] p-6">
          {/* 자정(00:00) 자동 날짜 전환 안내 (자정 경과 시에만 일시 표시) */}
          {midnightBanner && (
            <div className="mb-4 px-3.5 py-2 bg-[#eef5f3] border border-[#7ea69b] text-[#284b42] text-[13px] rounded-[4px] flex items-center justify-between">
              <span>{midnightBanner}</span>
              <button
                type="button"
                onClick={() => setMidnightBanner('')}
                className="font-bold ml-3 hover:underline"
              >
                닫기
              </button>
            </div>
          )}

          {/* 섹션 제목 (과구리 탐활서 확인 표준 굵은 하단 선) */}
          <div className="border-b-2 border-[#222222] pb-3 mb-5 flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
              탐활 현황 맵
            </h1>
            <div className="flex items-center gap-4 text-[13px] text-[#4b5563]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-white border border-[#d1d5db] inline-block" />
                비어 있음
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-[#eef5f3] border border-[#7ea69b] inline-block" />
                1팀 사용 중
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-[2px] bg-[#fff5ed] border border-[#d97736] inline-block" />
                2팀 이상 중복
              </span>
            </div>
          </div>

          {/* 4. 날짜 내비게이션 줄 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative flex items-center gap-3">
              <button
                type="button"
                aria-label="이전 날짜"
                onClick={() => setSelectedDate((d) => shiftDateStr(d, -1))}
                className="w-8 h-8 rounded-[4px] border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6] font-bold flex items-center justify-center"
              >
                &lt;
              </button>

              <span className="text-[26px] font-bold text-[#111827] tracking-tight">
                {formatKoreanDate(selectedDate)}
              </span>

              <button
                type="button"
                onClick={() => {
                  const latest = getLocalTodayStr();
                  setTodayStr(latest);
                  setSelectedDate(latest);
                  setIsCalendarOpen(false);
                }}
                className="bg-[#eef5f3] text-[#4d7c6f] border border-[#7ea69b] px-2.5 py-1 rounded-[4px] text-[13px] font-bold hover:bg-[#e1efeb] transition-colors"
              >
                오늘
              </button>

              <button
                type="button"
                aria-label="다음 날짜"
                onClick={() => setSelectedDate((d) => shiftDateStr(d, 1))}
                className="bg-[#d97736] text-white w-8 h-8 rounded-full font-bold hover:bg-[#c56729] transition-colors flex items-center justify-center shadow-xs"
              >
                &gt;
              </button>

              <button
                type="button"
                onClick={() => setIsCalendarOpen((o) => !o)}
                className="border border-[#d1d5db] px-3 py-1.5 rounded-[4px] text-[14px] text-[#374151] hover:bg-[#f9fafb] font-medium"
              >
                달력
              </button>

              {/* 월간 달력 팝오버 */}
              {isCalendarOpen && (
                <div className="absolute left-0 top-full mt-2 z-30 w-[280px] bg-white border border-[#9ca3af] rounded-[4px] shadow-lg p-3.5">
                  <div className="flex items-center justify-between mb-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth((prev) =>
                          prev.month === 1
                            ? { year: prev.year - 1, month: 12 }
                            : { year: prev.year, month: prev.month - 1 }
                        )
                      }
                      className="px-2 py-0.5 text-xs border border-[#d1d5db] rounded-[3px] hover:bg-[#f3f4f6]"
                    >
                      이전
                    </button>
                    <span className="text-[14px] font-bold text-[#111827]">
                      {calendarMonth.year}년 {calendarMonth.month}월
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCalendarMonth((prev) =>
                          prev.month === 12
                            ? { year: prev.year + 1, month: 1 }
                            : { year: prev.year, month: prev.month + 1 }
                        )
                      }
                      className="px-2 py-0.5 text-xs border border-[#d1d5db] rounded-[3px] hover:bg-[#f3f4f6]"
                    >
                      다음
                    </button>
                  </div>
                  <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-[#6b7280] mb-1">
                    <span>일</span>
                    <span>월</span>
                    <span>화</span>
                    <span>수</span>
                    <span>목</span>
                    <span>금</span>
                    <span>토</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-[12px]">
                    {calendarDays.map((cell, idx) => {
                      if (!cell) return <div key={`blank-${idx}`} />;
                      const isSel = cell.dateStr === selectedDate;
                      const isTod = cell.dateStr === todayStr;
                      const hasData = (countByDate[cell.dateStr] || 0) > 0;
                      return (
                        <button
                          key={cell.dateStr}
                          type="button"
                          onClick={() => {
                            setSelectedDate(cell.dateStr);
                            setIsCalendarOpen(false);
                          }}
                          className={`py-1 rounded-[3px] flex flex-col items-center ${
                            isSel
                              ? 'bg-[#7ea69b] text-white font-bold'
                              : isTod
                              ? 'border border-[#7ea69b] text-[#4d7c6f] font-bold'
                              : 'hover:bg-[#f3f4f6] text-[#374151]'
                          }`}
                        >
                          <span>{cell.day}</span>
                          <span
                            className={`w-1 h-1 rounded-full mt-0.5 ${
                              hasData
                                ? isSel
                                  ? 'bg-white'
                                  : 'bg-[#d97736]'
                                : 'bg-transparent'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 우측: 요약 통계 + 면학 시간 필터 탭 */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-[15px] text-[#374151]">
                전체 탐활 <strong className="text-[#111827]">{summaryStats.totalCount}건</strong>
                <span className="mx-2 text-[#d1d5db]">|</span>
                사용 중인 실{' '}
                <strong className="text-[#4d7c6f]">{summaryStats.usedRooms}곳</strong>
                <span className="mx-2 text-[#d1d5db]">|</span>
                중복 사용실{' '}
                <strong
                  className={
                    summaryStats.conflictRooms > 0 ? 'text-[#d97736]' : 'text-[#111827]'
                  }
                >
                  {summaryStats.conflictRooms}곳
                </strong>
              </div>

              <div className="inline-flex border border-[#d1d5db] rounded-[4px] overflow-hidden">
                {[
                  { key: 'ALL', label: '전체 시간' },
                  { key: '1면학', label: '1면학' },
                  { key: '2면학', label: '2면학' },
                  { key: '3면학', label: '3면학' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setPeriodFilter(tab.key)}
                    className={`px-3 py-1.5 text-[13px] transition-colors ${
                      periodFilter === tab.key
                        ? 'bg-[#7ea69b] text-white font-bold'
                        : 'bg-white text-[#374151] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 5. 안내 문구 + 통합 검색 바 줄 (노란색 배너 없이 깔끔하게 유지) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#e5e7eb]">
            <p className="text-[14px] text-[#4b5563]">
              건물을 클릭하면 층별 평면도와 사용 중인 팀 현황을 확인할 수 있습니다.
            </p>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="학생 이름, 학번, 실 이름 검색..."
                className="w-72 border border-[#d1d5db] rounded-[4px] px-3 py-1.5 text-[14px] focus:outline-none focus:border-[#7ea69b]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827] text-sm"
                >
                  ×
                </button>
              )}

              {/* 검색어 입력 시 즉시 이동 결과 드롭다운 */}
              {searchQuery.trim() !== '' && (
                <div className="absolute right-0 top-full mt-1.5 z-30 w-80 sm:w-96 bg-white border border-[#9ca3af] rounded-[4px] shadow-lg max-h-72 overflow-y-auto">
                  <div className="px-3 py-2 bg-[#f8f9fa] border-b border-[#e5e7eb] text-[12px] font-bold text-[#374151]">
                    검색 결과 ({searchResults.length}건)
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-[13px] text-[#6b7280]">
                      선택된 날짜에 일치하는 내역이 없습니다.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#f1f5f9]">
                      {searchResults.map((rec) => {
                        const meta = ROOM_META_MAP[rec.roomId];
                        return (
                          <button
                            key={rec.id}
                            type="button"
                            onClick={() => {
                              if (meta && meta.buildingId !== 'external') {
                                openBuildingView(meta.buildingId, meta.floor, meta.id);
                              } else {
                                setShowExternalModal(true);
                              }
                              setSearchQuery('');
                            }}
                            className="w-full text-left px-3 py-2.5 hover:bg-[#eef5f3] transition-colors"
                          >
                            <div className="flex items-center justify-between text-[13px] font-bold text-[#111827]">
                              <span>
                                {meta
                                  ? `${meta.buildingName} ${meta.floor} · ${meta.name}`
                                  : rec.rawLocation}
                              </span>
                              <span className="text-[12px] text-[#4d7c6f]">{rec.leader}</span>
                            </div>
                            <div className="text-[12px] text-[#4b5563] truncate mt-0.5">
                              {rec.topic}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 6. 화면 모드 A: 전남과학고등학교 실제 사진 기반 캠퍼스 SVG 지도 */}
          {viewMode === 'campus' ? (
            <div className="relative w-full overflow-hidden rounded-[4px] border border-[#cbd5e1] bg-[#eef6f4]">
              <svg
                viewBox="0 0 1120 420"
                className="w-full h-auto block select-none"
                role="img"
                aria-label="전남과학고등학교 성실관, 창의관, 성취관 및 잔디 운동장 전경 지도"
              >
                <defs>
                  <linearGradient id="jshsSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5f1ee" />
                    <stop offset="100%" stopColor="#f4f9f7" />
                  </linearGradient>
                </defs>

                {/* 배경 하늘 및 부드러운 구름 */}
                <rect x="0" y="0" width="1120" height="275" fill="url(#jshsSky)" />
                <g fill="#ffffff" opacity="0.72">
                  <ellipse cx="170" cy="48" rx="48" ry="14" />
                  <ellipse cx="205" cy="44" rx="34" ry="12" />
                  <ellipse cx="760" cy="42" rx="54" ry="15" />
                  <ellipse cx="805" cy="46" rx="36" ry="11" />
                </g>

                {/* 원경 녹지 */}
                <path
                  d="M0,248 Q260,218 540,238 T1120,230 L1120,275 L0,275 Z"
                  fill="#cde2d1"
                />

                {/* 건물 앞 붉은 벽돌 계단식 화단/단차 & 조경수 */}
                <rect x="0" y="264" width="1120" height="14" fill="#a85548" />
                <rect x="0" y="278" width="1120" height="12" fill="#d6d3d1" />
                {[42, 472, 838, 1082].map((tx, i) => (
                  <g key={`tree-${i}`}>
                    <circle cx={tx} cy="254" r="18" fill="#4f9446" />
                    <circle cx={tx + 14} cy="258" r="14" fill="#63a858" />
                  </g>
                ))}

                {/* 전경 푸른 잔디 운동장 (교차 줄무늬 + 트랙 라인 + 양측 하얀 골대) */}
                <rect x="0" y="290" width="1120" height="130" fill="#5ba83a" />
                {[0, 160, 320, 480, 640, 800, 960].map((gx, idx) => (
                  <rect
                    key={`stripe-${idx}`}
                    x={gx}
                    y="290"
                    width="80"
                    height="130"
                    fill="#4c962e"
                    opacity="0.55"
                  />
                ))}
                {/* 운동장 외곽 라인 및 하프라인 */}
                <polygon
                  points="85,305 1035,305 1085,405 35,405"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
                <line
                  x1="560"
                  y1="305"
                  x2="560"
                  y2="405"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
                <ellipse
                  cx="560"
                  cy="355"
                  rx="42"
                  ry="20"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  opacity="0.9"
                />
                {/* 좌측 전경 하얀 축구 골대 */}
                <g stroke="#ffffff" strokeWidth="3" fill="none">
                  <polygon points="75,332 96,332 96,374 75,374" />
                  <polyline points="75,332 58,340 58,380 75,374" />
                </g>
                {/* 우측 원경 하얀 축구 골대 */}
                <g stroke="#ffffff" strokeWidth="3" fill="none">
                  <polygon points="1024,332 1045,332 1045,374 1024,374" />
                  <polyline points="1045,332 1062,340 1062,380 1045,374" />
                </g>

                {/* ================= 1. 성실관 (본관 · 1~4F) ================= */}
                <g
                  onClick={() => openBuildingView('seongsil')}
                  className="cursor-pointer group"
                >
                  {/* 본관 붉은 벽돌 파사드 */}
                  <rect
                    x="84"
                    y="92"
                    width="374"
                    height="172"
                    fill="#9c3d32"
                    stroke="#6e261e"
                    strokeWidth="1.5"
                  />
                  {/* 좌측 끝 둥근 붉은 벽돌 계단탑 & 세로 아치형 창 */}
                  <rect
                    x="56"
                    y="88"
                    width="38"
                    height="176"
                    rx="17"
                    fill="#8b3228"
                    stroke="#6e261e"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="67"
                    y="102"
                    width="16"
                    height="146"
                    rx="8"
                    fill="#334155"
                    stroke="#e8e2d5"
                    strokeWidth="2"
                  />

                  {/* 4개 층 수평 아이보리 콘크리트 띠 */}
                  <rect x="84" y="88" width="374" height="8" fill="#e8e2d5" />
                  <rect x="84" y="130" width="374" height="7" fill="#e8e2d5" />
                  <rect x="84" y="172" width="374" height="7" fill="#e8e2d5" />
                  <rect x="84" y="214" width="374" height="7" fill="#e8e2d5" />

                  {/* 창문 베이 */}
                  {[101, 143, 185].map((wy, rIdx) =>
                    [106, 144, 182, 220, 310, 348, 386, 424].map((wx, cIdx) => (
                      <rect
                        key={`ss-win-${rIdx}-${cIdx}`}
                        x={wx}
                        y={wy}
                        width="26"
                        height="22"
                        rx="1.5"
                        fill="#2d3b45"
                        stroke="#e8e2d5"
                        strokeWidth="1.2"
                      />
                    ))
                  )}

                  {/* 중앙현관 돌출 포치 & 하얀 수직 열주 기둥 */}
                  <rect
                    x="252"
                    y="175"
                    width="52"
                    height="89"
                    fill="#e8e2d5"
                    stroke="#b8b0a2"
                    strokeWidth="1.2"
                  />
                  {[258, 270, 282, 294].map((px) => (
                    <rect
                      key={`pillar-${px}`}
                      x={px}
                      y="183"
                      width="5"
                      height="81"
                      fill="#ffffff"
                    />
                  ))}
                  <rect x="265" y="226" width="26" height="38" fill="#1e293b" />

                  {/* 성실관 상단 상태 배지 & 하단 이름 라벨 */}
                  {(() => {
                    const st = buildingSummaries.seongsil;
                    const isConflict = st.conflictRooms > 0;
                    const isUsed = st.teams > 0;
                    const pillColor = isConflict
                      ? '#c87a28'
                      : isUsed
                      ? '#6b968a'
                      : '#6b7280';
                    const statusText = isConflict
                      ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teams}팀`
                      : isUsed
                      ? `${st.teams}팀 사용 중`
                      : '현재 비어 있음';
                    return (
                      <g>
                        <rect
                          x="178"
                          y="46"
                          width="176"
                          height="28"
                          rx="14"
                          fill={pillColor}
                        />
                        <text
                          x="266"
                          y="64"
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {statusText}
                        </text>

                        <rect
                          x="184"
                          y="246"
                          width="164"
                          height="26"
                          rx="13"
                          fill="#1f2937"
                        />
                        <text
                          x="266"
                          y="263"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {BUILDINGS.seongsil.mapLabel}
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* ================= 2층 연결통로 ================= */}
                <g>
                  <rect
                    x="458"
                    y="174"
                    width="44"
                    height="32"
                    fill="#9c3d32"
                    stroke="#6e261e"
                    strokeWidth="1.2"
                  />
                  <rect
                    x="462"
                    y="180"
                    width="36"
                    height="18"
                    fill="#bae6fd"
                    stroke="#e8e2d5"
                    strokeWidth="1.5"
                  />
                  <text
                    x="480"
                    y="167"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#374151"
                  >
                    2층 연결통로
                  </text>
                </g>

                {/* ================= 2. 창의관 (실험동 · 1~4F+옥상) ================= */}
                <g
                  onClick={() => openBuildingView('changui')}
                  className="cursor-pointer group"
                >
                  {/* 옥상 천문대 돔 (반원형 중앙 타워 상부) */}
                  <path
                    d="M645,92 A28,26 0 0,1 701,92 Z"
                    fill="#f8fafc"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="673"
                    y1="66"
                    x2="673"
                    y2="92"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <text
                    x="673"
                    y="58"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#334155"
                  >
                    옥상 천문대
                  </text>

                  {/* 창의관 붉은 벽돌 파사드 */}
                  <rect
                    x="502"
                    y="92"
                    width="342"
                    height="172"
                    fill="#9c3d32"
                    stroke="#6e261e"
                    strokeWidth="1.5"
                  />
                  {/* 수평 아이보리 콘크리트 띠 */}
                  <rect x="502" y="88" width="342" height="8" fill="#e8e2d5" />
                  <rect x="502" y="130" width="342" height="7" fill="#e8e2d5" />
                  <rect x="502" y="172" width="342" height="7" fill="#e8e2d5" />
                  <rect x="502" y="214" width="342" height="7" fill="#e8e2d5" />

                  {/* 좌·우 실험실 창문 베이 */}
                  {[101, 143, 185, 227].map((wy, rIdx) =>
                    [518, 558, 598, 722, 762, 802].map((wx, cIdx) => (
                      <rect
                        key={`cg-win-${rIdx}-${cIdx}`}
                        x={wx}
                        y={wy}
                        width="28"
                        height="22"
                        rx="1.5"
                        fill="#2d3b45"
                        stroke="#e8e2d5"
                        strokeWidth="1.2"
                      />
                    ))
                  )}

                  {/* 중앙 반원형 통유리 커튼월 타워 */}
                  <rect
                    x="638"
                    y="92"
                    width="70"
                    height="172"
                    rx="6"
                    fill="#7dd3fc"
                    fillOpacity="0.78"
                    stroke="#e8e2d5"
                    strokeWidth="2"
                  />
                  {[130, 172, 214].map((ly) => (
                    <line
                      key={`curtain-h-${ly}`}
                      x1="638"
                      y1={ly}
                      x2="708"
                      y2={ly}
                      stroke="#e8e2d5"
                      strokeWidth="2"
                    />
                  ))}
                  <line
                    x1="661"
                    y1="92"
                    x2="661"
                    y2="264"
                    stroke="#e8e2d5"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="685"
                    y1="92"
                    x2="685"
                    y2="264"
                    stroke="#e8e2d5"
                    strokeWidth="1.5"
                  />

                  {/* 창의관 상단 상태 배지 & 하단 이름 라벨 */}
                  {(() => {
                    const st = buildingSummaries.changui;
                    const isConflict = st.conflictRooms > 0;
                    const isUsed = st.teams > 0;
                    const pillColor = isConflict
                      ? '#c87a28'
                      : isUsed
                      ? '#6b968a'
                      : '#6b7280';
                    const statusText = isConflict
                      ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teams}팀`
                      : isUsed
                      ? `${st.teams}팀 사용 중`
                      : '현재 비어 있음';
                    return (
                      <g>
                        <rect
                          x="581"
                          y="18"
                          width="184"
                          height="28"
                          rx="14"
                          fill={pillColor}
                        />
                        <text
                          x="673"
                          y="36"
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {statusText}
                        </text>

                        <rect
                          x="578"
                          y="246"
                          width="190"
                          height="26"
                          rx="13"
                          fill="#1f2937"
                        />
                        <text
                          x="673"
                          y="263"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {BUILDINGS.changui.mapLabel}
                        </text>
                      </g>
                    );
                  })()}
                </g>

                {/* ================= 3. 성취관 (강당 · 1~2F) ================= */}
                <g
                  onClick={() => openBuildingView('seongchui')}
                  className="cursor-pointer group"
                >
                  {/* 성취관 붉은 벽돌 & 아이보리 수평띠 */}
                  <rect
                    x="868"
                    y="138"
                    width="196"
                    height="126"
                    fill="#9c3d32"
                    stroke="#6e261e"
                    strokeWidth="1.5"
                  />
                  <rect x="864" y="132" width="204" height="8" fill="#e8e2d5" />
                  <rect x="868" y="198" width="196" height="7" fill="#e8e2d5" />

                  {/* 강당 대형 창문 베이 */}
                  {[888, 924, 960, 996, 1032].map((wx, idx) => (
                    <g key={`sc-win-${idx}`}>
                      <rect
                        x={wx}
                        y="150"
                        width="20"
                        height="36"
                        rx="1.5"
                        fill="#2d3b45"
                        stroke="#e8e2d5"
                        strokeWidth="1.2"
                      />
                      <rect
                        x={wx}
                        y="214"
                        width="20"
                        height="34"
                        rx="1.5"
                        fill="#2d3b45"
                        stroke="#e8e2d5"
                        strokeWidth="1.2"
                      />
                    </g>
                  ))}

                  {/* 성취관 상단 상태 배지 & 하단 이름 라벨 */}
                  {(() => {
                    const st = buildingSummaries.seongchui;
                    const isConflict = st.conflictRooms > 0;
                    const isUsed = st.teams > 0;
                    const pillColor = isConflict
                      ? '#c87a28'
                      : isUsed
                      ? '#6b968a'
                      : '#6b7280';
                    const statusText = isConflict
                      ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teams}팀`
                      : isUsed
                      ? `${st.teams}팀 사용 중`
                      : '현재 비어 있음';
                    return (
                      <g>
                        <rect
                          x="886"
                          y="92"
                          width="160"
                          height="28"
                          rx="14"
                          fill={pillColor}
                        />
                        <text
                          x="966"
                          y="110"
                          textAnchor="middle"
                          fontSize="12.5"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {statusText}
                        </text>

                        <rect
                          x="888"
                          y="246"
                          width="156"
                          height="26"
                          rx="13"
                          fill="#1f2937"
                        />
                        <text
                          x="966"
                          y="263"
                          textAnchor="middle"
                          fontSize="12"
                          fontWeight="700"
                          fill="#ffffff"
                        >
                          {BUILDINGS.seongchui.mapLabel}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              </svg>

              {/* 교외 활동 배정 팀이 있는 경우 지도 우측 하단 작은 배지 표시 */}
              {externalRecords.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowExternalModal(true)}
                  className="absolute right-4 bottom-4 bg-[#1f2937]/90 hover:bg-[#111827] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#7ea69b]" />
                  <span>교외 활동 {externalRecords.length}건</span>
                </button>
              )}
            </div>
          ) : (
            /* 7. 화면 모드 B: 건물 내부 층별 2단 블록 그리드 평면도 + 우측 과구리 2열 표 상세 패널 */
            <div>
              {/* 상단 내비게이션: 전체 학교 지도로 돌아가기 + 건물 탭 + 층 탭 */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[#e5e7eb]">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('campus')}
                    className="px-3.5 py-1.5 rounded-[4px] border border-[#d1d5db] bg-[#f9fafb] hover:bg-[#f3f4f6] text-[14px] font-bold text-[#111827] transition-colors"
                  >
                    ← 전체 학교 지도로 돌아가기
                  </button>

                  <div className="h-5 w-[1px] bg-[#d1d5db] mx-1 hidden sm:block" />

                  {Object.values(BUILDINGS).map((b) => {
                    const st = buildingSummaries[b.id];
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => openBuildingView(b.id)}
                        className={`px-3.5 py-1.5 rounded-[4px] text-[14px] font-bold transition-colors flex items-center gap-1.5 ${
                          selectedBuildingId === b.id
                            ? 'bg-[#7ea69b] text-white'
                            : 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb]'
                        }`}
                      >
                        <span>{b.fullName}</span>
                        {st.teams > 0 && (
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                              selectedBuildingId === b.id
                                ? 'bg-white text-[#2f5e51]'
                                : st.conflictRooms > 0
                                ? 'bg-[#d97736] text-white'
                                : 'bg-[#7ea69b] text-white'
                            }`}
                          >
                            {st.teams}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 층 선택 탭 */}
                <div className="flex items-center gap-1.5">
                  {Object.keys(currentBuilding.floors).map((floorKey) => {
                    const floorObj = currentBuilding.floors[floorKey];
                    const floorRooms = [...floorObj.topRooms, ...floorObj.bottomRooms];
                    const hasTeams = floorRooms.some(
                      (r) => (recordsByRoom[r.id]?.length || 0) > 0
                    );
                    const hasConflict = floorRooms.some(
                      (r) => (recordsByRoom[r.id]?.length || 0) >= 2
                    );

                    return (
                      <button
                        key={floorKey}
                        type="button"
                        onClick={() => handleSelectFloor(floorKey)}
                        className={`px-3 py-1.5 rounded-[4px] text-[13px] font-bold border transition-colors flex items-center gap-1.5 ${
                          selectedFloor === floorKey
                            ? 'bg-[#111827] text-white border-[#111827]'
                            : 'bg-white text-[#374151] border-[#d1d5db] hover:bg-[#f3f4f6]'
                        }`}
                      >
                        <span>{floorKey}</span>
                        {hasTeams && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              hasConflict ? 'bg-[#d97736]' : 'bg-[#7ea69b]'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 좌측 8컬럼(2단 블록 평면도) + 우측 4컬럼(과구리 2열 표 상세 패널) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* 좌측: 2단 블록 그리드 평면도 */}
                <div className="lg:col-span-8 bg-[#f9fafb] border border-[#d1d5db] rounded-[4px] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[17px] font-bold text-[#111827]">
                      {currentBuilding.fullName} · {selectedFloor} 평면도
                    </h2>
                    <span className="text-[12px] text-[#6b7280]">
                      실 카드를 클릭하면 우측에서 신청 상세 표를 볼 수 있습니다.
                    </span>
                  </div>

                  {/* 상단 구역 */}
                  <div
                    className={`grid gap-3 ${
                      currentFloorObj.topRooms.length === 1
                        ? 'grid-cols-1'
                        : currentFloorObj.topRooms.length === 2
                        ? 'grid-cols-1 sm:grid-cols-2'
                        : 'grid-cols-2 sm:grid-cols-4'
                    }`}
                  >
                    {currentFloorObj.topRooms.map(renderRoomCard)}
                  </div>

                  {/* 중앙 복도 바 */}
                  <div className="my-3.5 py-2 px-3 rounded-[4px] bg-[#e5e7eb] border border-[#cbd5e1] text-center text-[12px] font-bold text-[#475569]">
                    {currentFloorObj.corridor}
                  </div>

                  {/* 하단 구역 */}
                  {currentFloorObj.bottomRooms.length > 0 && (
                    <div
                      className={`grid gap-3 ${
                        currentFloorObj.bottomRooms.length === 2
                          ? 'grid-cols-1 sm:grid-cols-2'
                          : currentFloorObj.bottomRooms.length === 3
                          ? 'grid-cols-1 sm:grid-cols-3'
                          : currentFloorObj.bottomRooms.length === 5
                          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
                          : 'grid-cols-2 sm:grid-cols-4'
                      }`}
                    >
                      {currentFloorObj.bottomRooms.map(renderRoomCard)}
                    </div>
                  )}
                </div>

                {/* 우측: 과구리 표준 2열 표 상세 패널 */}
                <div className="lg:col-span-4 bg-white border border-[#d1d5db] rounded-[4px] p-4">
                  <div className="pb-3 mb-3 border-b border-[#e5e7eb] flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[12px] text-[#6b7280]">
                        {selectedRoomMeta.buildingName} · {selectedRoomMeta.floor}
                      </div>
                      <h3 className="text-[18px] font-bold text-[#111827] mt-0.5">
                        {selectedRoomMeta.name}
                        {selectedRoomMeta.sub && (
                          <span className="ml-1.5 text-[13px] font-normal text-[#6b7280]">
                            ({selectedRoomMeta.sub})
                          </span>
                        )}
                      </h3>
                    </div>

                    {selectedRoomRecords.length === 0 ? (
                      <span className="text-[12px] font-semibold px-2.5 py-1 rounded-[3px] bg-[#f3f4f6] text-[#6b7280]">
                        비어 있음
                      </span>
                    ) : selectedRoomRecords.length === 1 ? (
                      <span className="text-[12px] font-bold px-2.5 py-1 rounded-[3px] bg-[#7ea69b] text-white">
                        1팀 사용 중
                      </span>
                    ) : (
                      <span className="text-[12px] font-bold px-2.5 py-1 rounded-[3px] bg-[#d97736] text-white">
                        {selectedRoomRecords.length}팀 중복
                      </span>
                    )}
                  </div>

                  {selectedRoomRecords.length === 0 ? (
                    <div className="py-12 px-4 text-center border border-dashed border-[#d1d5db] rounded-[4px] bg-[#f9fafb]">
                      <p className="text-[14px] font-bold text-[#374151]">
                        신청된 탐활 내역이 없습니다.
                      </p>
                      <p className="text-[12px] text-[#6b7280] mt-1">
                        {formatKoreanDate(selectedDate)} ({periodFilter === 'ALL' ? '전체 시간' : periodFilter}) 기준 비어 있는 실입니다.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[580px] overflow-y-auto pr-0.5">
                      {selectedRoomRecords.map((rec) => (
                        <div
                          key={rec.id}
                          className="border border-[#cccccc] rounded-[2px] overflow-hidden"
                        >
                          <div className="bg-[#f8f9fa] px-3 py-1.5 text-[12px] text-[#666666] border-b border-[#cccccc] flex items-center justify-between">
                            <span>{rec.submittedAt}</span>
                            <span className="font-semibold text-[#374151]">
                              총 {countUniqueStudents(rec)}명
                            </span>
                          </div>
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  활동날짜
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                                  {formatKoreanDate(rec.date)}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  활동시간
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                                  {rec.timeText}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  활동장소
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                                  {rec.rawLocation}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  활동내용
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd] leading-relaxed">
                                  {rec.topic}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  대표학생
                                </th>
                                <td className="bg-white text-[#111827] font-bold text-[13px] px-3 py-2 border-b border-[#dddddd]">
                                  {rec.leader}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                                  참가학생
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd] leading-relaxed">
                                  {rec.members}
                                </td>
                              </tr>
                              <tr>
                                <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-[#dddddd] text-center">
                                  지도교사
                                </th>
                                <td className="bg-white text-[#111827] text-[13px] px-3 py-2">
                                  {rec.teacher}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 8. 교외 활동 상세 조회 모달 */}
      {showExternalModal && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d1d5db] rounded-[4px] shadow-xl max-w-[540px] w-full overflow-hidden">
            <div className="bg-[#7ea69b] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold">
                교외 활동 내역 ({formatKoreanDate(selectedDate)})
              </h3>
              <button
                type="button"
                onClick={() => setShowExternalModal(false)}
                className="text-white/90 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
              {externalRecords.length === 0 ? (
                <p className="text-[14px] text-[#6b7280] py-6 text-center">
                  선택된 날짜에 등록된 교외 활동이 없습니다.
                </p>
              ) : (
                externalRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-[#cccccc] rounded-[2px] overflow-hidden"
                  >
                    <div className="bg-[#f8f9fa] px-3 py-1.5 text-[12px] text-[#666666] border-b border-[#cccccc]">
                      {rec.submittedAt}
                    </div>
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                            활동시간
                          </th>
                          <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                            {rec.timeText}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                            활동장소
                          </th>
                          <td className="bg-white text-[#111827] font-bold text-[13px] px-3 py-2 border-b border-[#dddddd]">
                            {rec.rawLocation}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                            활동내용
                          </th>
                          <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                            {rec.topic}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                            대표학생
                          </th>
                          <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                            {rec.leader}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-b border-[#dddddd] text-center">
                            참가학생
                          </th>
                          <td className="bg-white text-[#111827] text-[13px] px-3 py-2 border-b border-[#dddddd]">
                            {rec.members}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[88px] bg-[#f2f2f2] font-bold text-[#222222] text-[13px] px-2.5 py-2 border-r border-[#dddddd] text-center">
                            지도교사
                          </th>
                          <td className="bg-white text-[#111827] text-[13px] px-3 py-2">
                            {rec.teacher}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 9. 과구리 탐활서 데이터 붙여넣기 모달 (실시간 파싱 미리보기 포함) */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white border border-[#d1d5db] rounded-[4px] shadow-xl max-w-[680px] w-full overflow-hidden">
            <div className="bg-[#7ea69b] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold">탐활서 데이터 붙여넣기</h3>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="text-white/90 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-3 text-[13px]">
              <p className="text-[#374151] leading-relaxed">
                과구리(<strong>jshsus.kr</strong>)의 <strong>[탐활서 확인]</strong> 화면을 드래그해 복사(<code>Ctrl+C</code>)한 뒤 붙여넣으면 자동으로 날짜·장소·학생을 분석해 평면도에 반영합니다.
              </p>

              <textarea
                rows={7}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder={`예시:\n활동날짜\t11월 16일\n활동시간\t19:10 ~ 20:20, 20:30 ~ 21:30\n활동장소\t코딩실\n활동내용\t소프트웨어 경시대회 준비\n대표학생\t1117 조영우\n참가학생\t1114 이예지, 1310 서준혁\n지도교사\t진정숙`}
                className="w-full border border-[#d1d5db] rounded-[4px] p-2.5 text-[13px] font-mono focus:outline-none focus:border-[#7ea69b]"
              />

              {/* 실시간 파싱 미리보기 표 */}
              {liveParsedPreview.length > 0 && (
                <div className="border border-[#d1d5db] rounded-[4px] overflow-hidden">
                  <div className="bg-[#eef5f3] px-3 py-1.5 text-[12px] font-bold text-[#2f5e51] border-b border-[#d1d5db]">
                    자동 인식 미리보기 ({liveParsedPreview.length}건)
                  </div>
                  <div className="max-h-36 overflow-y-auto">
                    <table className="w-full text-[12px] border-collapse">
                      <thead>
                        <tr className="bg-[#f8f9fa] border-b border-[#e5e7eb] text-[#374151]">
                          <th className="px-2.5 py-1.5 text-left">날짜</th>
                          <th className="px-2.5 py-1.5 text-left">매핑된 실</th>
                          <th className="px-2.5 py-1.5 text-left">대표학생</th>
                          <th className="px-2.5 py-1.5 text-left">활동내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {liveParsedPreview.map((item) => {
                          const meta = ROOM_META_MAP[item.roomId];
                          return (
                            <tr key={item.id}>
                              <td className="px-2.5 py-1.5 whitespace-nowrap">{item.date}</td>
                              <td className="px-2.5 py-1.5 whitespace-nowrap font-semibold text-[#4d7c6f]">
                                {meta ? `${meta.buildingName} ${meta.name}` : item.rawLocation}
                              </td>
                              <td className="px-2.5 py-1.5 whitespace-nowrap">{item.leader}</td>
                              <td className="px-2.5 py-1.5 truncate max-w-[200px]">{item.topic}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {pasteStatus && (
                <div
                  className={`px-3 py-2 rounded-[4px] border text-[13px] ${
                    pasteStatus.type === 'error'
                      ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                      : 'bg-[#eef5f3] border-[#b7d4cc] text-[#264b41]'
                  }`}
                >
                  {pasteStatus.message}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e5e7eb]">
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="px-3 py-1.5 rounded-[4px] border border-[#d1d5db] text-[#4b5563] hover:bg-[#f3f4f6]"
                >
                  기본 실데이터 27건 복원
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasteModalOpen(false)}
                    className="px-3.5 py-1.5 rounded-[4px] border border-[#d1d5db] text-[#374151] hover:bg-[#f3f4f6]"
                  >
                    닫기
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPaste}
                    className="px-4 py-1.5 rounded-[4px] bg-[#7ea69b] hover:bg-[#6d9489] text-white font-bold"
                  >
                    지도에 반영하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
