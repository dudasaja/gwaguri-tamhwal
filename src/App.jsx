import React, { useState, useMemo, useEffect, useRef } from 'react';

/**
 * ============================================================================
 * 1. 날짜 및 자정(00:00) 자동 전환 유틸리티
 * ============================================================================
 */
function getLocalTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(dateStr, delta) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

function formatKoreanDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${weekdays[dt.getDay()]})`;
}

/**
 * ============================================================================
 * 2. 전남과학고등학교 3개 건물(성실관·창의관·성취관) 및 층별 2단 블록 그리드 구조
 *    - 창의관 2층: 물리실험실·물리 R&E실과 함께 수학1실·수학2실 배치
 *    - 성실관 3층: 2학년 교실과 함께 도서관 배치
 *    - 성실관 4층: 3학년 교실과 함께 무한상상실·학생회실 배치
 * ============================================================================
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
        corridor: '◀ 서측 계단 | 1층 복도 | 동측 계단 ▶',
        topRooms: [],
        bottomRooms: [
          { id: 'seongsil_1f_ai', name: 'AI실', sub: '연구·정보구역' },
          { id: 'seongsil_1f_coding', name: '코딩실', sub: '구 멀티실' },
          { id: 'seongsil_1f_info', name: '정보실', sub: '정보·전산구역' },
        ],
      },
      '2F': {
        label: '2F',
        corridor: '◀ 서측 계단 | 2층 복도 | 창의관 2층 연결통로 ▶',
        topRooms: [
          { id: 'seongsil_2f_1_1', name: '1-1반 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_2', name: '1-2반 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_3', name: '1-3반 교실', sub: '1학년 학급교실' },
          { id: 'seongsil_2f_1_4', name: '1-4반 교실', sub: '1학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_2f_wee', name: '위클래스·상담실', sub: '상담·진로지원구역' },
        ],
      },
      '3F': {
        label: '3F',
        corridor: '◀ 서측 계단 | 3층 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'seongsil_3f_2_1', name: '2-1반 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_2', name: '2-2반 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_3', name: '2-3반 교실', sub: '2학년 학급교실' },
          { id: 'seongsil_3f_2_4', name: '2-4반 교실', sub: '2학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_3f_library', name: '도서관', sub: '면학·독서·자료열람실' },
        ],
      },
      '4F': {
        label: '4F',
        corridor: '◀ 서측 계단 | 4층 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'seongsil_4f_3_1', name: '3-1반 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_2', name: '3-2반 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_3', name: '3-3반 교실', sub: '3학년 학급교실' },
          { id: 'seongsil_4f_3_4', name: '3-4반 교실', sub: '3학년 학급교실' },
        ],
        bottomRooms: [
          { id: 'seongsil_4f_maker', name: '무한상상실', sub: '메이커·창작·탐구실' },
          { id: 'seongsil_4f_council', name: '학생회실', sub: '학생자치회실' },
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
          { id: 'chang_1f_earth_re', name: '지구과학 R&E실', sub: '심화 R&E 연구실' },
        ],
        bottomRooms: [
          { id: 'chang_1f_earth_prep', name: '지구과학 준비실', sub: '실험·기자재 준비' },
          { id: 'chang_1f_seminar', name: '지구과학 세미나실', sub: '발표·토론구역' },
        ],
      },
      '2F': {
        label: '2F',
        corridor: '◀ 성실관 2층 연결통로 | 2층 물리·수학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_2f_phys_lab', name: '물리실험실', sub: '물리 탐구·실험구역' },
          { id: 'chang_2f_phys_re', name: '물리 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_2f_math1', name: '수학1실', sub: '수학 교과전용실' },
          { id: 'chang_2f_math2', name: '수학2실', sub: '수학 교과전용실' },
        ],
        bottomRooms: [
          { id: 'chang_2f_phys_prep', name: '물리준비실', sub: '실험·기자재 준비' },
          { id: 'chang_2f_math_lab', name: '수학연구실', sub: '수리·모델링 연구' },
        ],
      },
      '3F': {
        label: '3F',
        corridor: '◀ 반원형 중앙 계단 | 3층 생명과학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_3f_bio_lab', name: '생명과학실험실', sub: '생명과학 탐구구역' },
          { id: 'chang_3f_bio_re', name: '생명과학 R&E실', sub: '심화 R&E 연구실' },
          { id: 'chang_3f_bio_prep', name: '생명과학준비실', sub: '실험·기자재 준비' },
        ],
        bottomRooms: [
          { id: 'chang_3f_equip', name: '현미경·기기실', sub: '정밀 분석장비구역' },
          { id: 'chang_3f_lecture', name: '생명과학 강의실', sub: '교과·세미나구역' },
        ],
      },
      '4F': {
        label: '4F',
        corridor: '◀ 반원형 중앙 계단 | 4층 화학 복도 | 동측 계단 ▶',
        topRooms: [
          { id: 'chang_4f_chem_lab', name: '화학 실험실', sub: '화학 탐구·실험구역' },
          { id: 'chang_4f_chem_re', name: '화학 R&E실', sub: '심화 R&E 연구실' },
        ],
        bottomRooms: [
          { id: 'chang_4f_chem_prep', name: '화학 준비실', sub: '실험·기자재 준비' },
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
 * 전체 실 ID -> 건물/층/실 메타데이터 O(1) 조회 사전
 */
const ROOM_BY_ID = (() => {
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
const RAW_ALIAS_ENTRIES = [
  ['물리r&e', 'chang_2f_phys_re'],
  ['물리실험실', 'chang_2f_phys_lab'],
  ['물리탐구실험', 'chang_2f_phys_lab'],
  ['물리준비실', 'chang_2f_phys_prep'],
  ['수학1실', 'chang_2f_math1'],
  ['수학2실', 'chang_2f_math2'],
  ['수학연구실', 'chang_2f_math_lab'],
  ['수학탐구실', 'chang_2f_math_lab'],
  ['지구과학세미나실', 'chang_1f_seminar'],
  ['지구과학실험실', 'chang_1f_earth_lab'],
  ['지구과학r&e', 'chang_1f_earth_re'],
  ['지구과학준비실', 'chang_1f_earth_prep'],
  ['생명과학실험실', 'chang_3f_bio_lab'],
  ['생명과학실', 'chang_3f_bio_lab'],
  ['생명과학r&e', 'chang_3f_bio_re'],
  ['생명과학준비실', 'chang_3f_bio_prep'],
  ['생물준비실', 'chang_3f_bio_prep'],
  ['생명과학강의실', 'chang_3f_lecture'],
  ['현미경·기기실', 'chang_3f_equip'],
  ['현미경기기실', 'chang_3f_equip'],
  ['첨단기기실', 'chang_3f_equip'],
  ['화학실험실', 'chang_4f_chem_lab'],
  ['화학r&e', 'chang_4f_chem_re'],
  ['화학준비실', 'chang_4f_chem_prep'],
  ['약품보관실', 'chang_4f_reagent'],
  ['천문대', 'chang_rf_observatory'],
  ['주관측실', 'chang_rf_observatory'],
  ['코딩실', 'seongsil_1f_coding'],
  ['멀티실', 'seongsil_1f_coding'],
  ['ai실', 'seongsil_1f_ai'],
  ['정보실', 'seongsil_1f_info'],
  ['1-1', 'seongsil_2f_1_1'],
  ['1-2', 'seongsil_2f_1_2'],
  ['1-3', 'seongsil_2f_1_3'],
  ['1-4', 'seongsil_2f_1_4'],
  ['위클래스', 'seongsil_2f_wee'],
  ['상담실', 'seongsil_2f_wee'],
  ['2-1', 'seongsil_3f_2_1'],
  ['2-2', 'seongsil_3f_2_2'],
  ['2-3', 'seongsil_3f_2_3'],
  ['2-4', 'seongsil_3f_2_4'],
  ['도서관', 'seongsil_3f_library'],
  ['글마루', 'seongsil_3f_library'],
  ['3-1', 'seongsil_4f_3_1'],
  ['3-2', 'seongsil_4f_3_2'],
  ['3-3', 'seongsil_4f_3_3'],
  ['3-4', 'seongsil_4f_3_4'],
  ['무한상상실', 'seongsil_4f_maker'],
  ['메이커', 'seongsil_4f_maker'],
  ['학생회실', 'seongsil_4f_council'],
  ['학생자치', 'seongsil_4f_council'],
  ['음악실', 'seongchui_1f_music'],
  ['피아노', 'seongchui_1f_piano'],
  ['기악실', 'seongchui_1f_piano'],
  ['미술실', 'seongchui_1f_art'],
  ['탁구장', 'seongchui_1f_pingpong'],
  ['체육관', 'seongchui_2f_gym'],
  ['강당', 'seongchui_2f_gym'],
];

const LOCATION_ALIAS_ENTRIES = [...RAW_ALIAS_ENTRIES].sort(
  (a, b) => b[0].length - a[0].length
);

/**
 * 교외·외부 장소 판별 키워드 (대학·연구소·교회·성당·사찰·공공기관·타 지역 등)
 * 교내 실명보다 먼저 검사하여 '전남대 물리실험실', '시립도서관' 등이 교내로 오분류되지 않도록 방지
 */
const OFF_CAMPUS_KEYWORDS = [
  '교외',
  '외부',
  '학교밖',
  '학교외',
  '교회',
  '성당',
  '사찰',
  '기도원',
  '수련원',
  '대학',
  '대학교',
  '전남대',
  '조선대',
  '전북대',
  '과기원',
  'gist',
  '지스트',
  'kaist',
  '카이스트',
  'postech',
  '포항공대',
  '연구소',
  '연구원',
  '연구센터',
  '진흥원',
  '개발원',
  '기술원',
  '실험원',
  '과학관',
  '박물관',
  '미술관',
  '기념관',
  '전시관',
  '시립도서관',
  '국립도서관',
  '도립도서관',
  '공공도서관',
  '시청',
  '도청',
  '군청',
  '구청',
  '주민센터',
  '행정복지센터',
  '복지관',
  '문화센터',
  '청소년수련관',
  '병원',
  '의원',
  '보건소',
  '약국',
  '은행',
  '우체국',
  '경찰서',
  '소방서',
  '출장',
  '견학',
  '답사',
  '현장학습',
  '현장탐방',
  '봉사활동',
  '나주',
  '빛가람',
  '혁신도시',
  '광주',
  '화순',
  '담양',
  '순천',
  '여수',
  '목포',
  '무안',
  '영광',
  '장성',
  '곡성',
  '구례',
  '보성',
  '고흥',
  '장흥',
  '강진',
  '해남',
  '완도',
  '진도',
  '신안',
  '서울',
  '대전',
  '부산',
  '대구',
  '인천',
  '울산',
  '세종',
  '제주',
  '터미널',
  '공항',
  '카페',
  '호수공원',
  '금성산',
  '영산강',
];

function normalizeLocationToRoomId(rawLocation) {
  if (!rawLocation) return 'external';
  const cleaned = rawLocation.replace(/\s+/g, '').toLowerCase();

  // 1. 명백한 교외·외부 시설/기관/지역 키워드가 포함된 경우 무조건 외부로 분류
  if (OFF_CAMPUS_KEYWORDS.some((kw) => cleaned.includes(kw))) {
    return 'external';
  }

  // 2. '1학년 2반' 형태 표기 정규화 후 교내 실 사전 매칭
  const normalizedGradeClass = cleaned.replace(
    /([1-3])학년([1-4])반/g,
    '$1-$2'
  );
  for (const [alias, roomId] of LOCATION_ALIAS_ENTRIES) {
    if (normalizedGradeClass.includes(alias)) return roomId;
  }

  // 3. 교내 건물/교실 목록에 전혀 해당하지 않는 낯선 장소는 모두 외부로 취급
  return 'external';
}

function getExternalPlaceKey(rawLocation) {
  const label = (rawLocation || '').trim() || '교외 지정 장소';
  return `external::${label.replace(/\s+/g, '')}`;
}

function countUniqueStudents(rec) {
  const set = new Set();
  const addToken = (str) => {
    if (!str) return;
    str
      .split(',')
      .map((s) => s.replace(/^[.\s]+|[.\s]+$/g, ''))
      .filter((s) => s && s !== '.')
      .forEach((s) => set.add(s.replace(/\s+/g, '')));
  };
  addToken(rec.leader);
  addToken(rec.members);
  return Math.max(1, set.size);
}

/**
 * ============================================================================
 * 3. 실제 과구리(jshsus.kr) 탐활서 데이터 27건 (2026-11-16 ~ 2026-11-23)
 * ============================================================================
 */
const RAW_DEFAULT_RECORDS = [
  // 2026-11-16 (13건)
  {
    id: 'gw-01',
    date: '2026-11-16',
    submittedAt: '10월 12일 07시 07분 29초',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '19:10 ~ 20:20, 20:30 ~ 21:30',
    rawLocation: '물리실험실',
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
    topic: 'KYPT 준비 및 실험(3면학까지 요청드립니다.)',
    leader: '2304 김민건',
    members:
      '2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민',
    teacher: '김희웅',
  },
];

const DEFAULT_RECORDS = RAW_DEFAULT_RECORDS.map((rec) => ({
  ...rec,
  roomId: normalizeLocationToRoomId(rec.rawLocation),
}));

const STORAGE_KEY = 'gwaguri_tamhwal_records_v4';
const ADMIN_PASSWORD = '12031213';

/**
 * ============================================================================
 * 4. 과구리 탐활서 원문 복사-붙여넣기 파서 (줄바꿈/탭 복사 형식 완벽 지원)
 * ============================================================================
 */
function parseGwaguriText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const normalized = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t+/g, ' ')
    .replace(
      /(활동날짜|활동시간|활동장소|활동내용|대표학생|참가학생|지도교사|지원)\s*\n+\s*/g,
      '$1 '
    );

  const blocks = normalized
    .split(/(?=활동날짜)/g)
    .map((b) => b.trim())
    .filter((b) => b.includes('활동날짜'));

  const parsed = [];

  blocks.forEach((block, idx) => {
    const lines = block
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    let date = '';
    let timeText = '19:10 ~ 20:20, 20:30 ~ 21:30';
    let rawLocation = '';
    let topic = '';
    let leader = '';
    let members = '';
    let teacher = '';

    lines.forEach((line) => {
      if (line.startsWith('활동날짜')) {
        const m = line.replace('활동날짜', '').trim().match(/\d{4}-\d{2}-\d{2}/);
        if (m) date = m[0];
      } else if (line.startsWith('활동시간')) {
        timeText = line.replace('활동시간', '').trim() || timeText;
      } else if (line.startsWith('활동장소')) {
        rawLocation = line.replace('활동장소', '').trim();
      } else if (line.startsWith('활동내용')) {
        topic = line.replace('활동내용', '').trim();
      } else if (line.startsWith('대표학생')) {
        leader = line.replace('대표학생', '').trim();
      } else if (line.startsWith('참가학생')) {
        const val = line.replace('참가학생', '').trim();
        members = val === '.' || val === '' ? leader : val;
      } else if (line.startsWith('지도교사')) {
        teacher = line.replace('지도교사', '').trim();
      }
    });

    if (!date) return;

    const periods = [];
    if (timeText.includes('19:10') || timeText.includes('1면학')) periods.push('1면학');
    if (timeText.includes('20:30') || timeText.includes('2면학')) periods.push('2면학');
    if (
      timeText.includes('21:40') ||
      timeText.includes('3면학') ||
      topic.includes('3면학')
    ) {
      periods.push('3면학');
    }
    if (periods.length === 0) periods.push('1면학', '2면학');

    parsed.push({
      id: `parsed-${Date.now()}-${idx}`,
      date,
      submittedAt: '방금 붙여넣음',
      periods,
      timeText,
      rawLocation: rawLocation || '미지정',
      roomId: normalizeLocationToRoomId(rawLocation),
      topic: topic || '탐구활동',
      leader: leader || '미기재',
      members: members || leader || '미기재',
      teacher: teacher || '미기재',
    });
  });

  return parsed;
}

/**
 * ============================================================================
 * 5. 월간 달력 팝오버 컴포넌트
 * ============================================================================
 */
function MonthCalendarPopover({ selectedDate, todayStr, recordDatesSet, onSelectDate, onClose }) {
  const [viewYear, setViewYear] = useState(() => Number(selectedDate.slice(0, 4)));
  const [viewMonth, setViewMonth] = useState(() => Number(selectedDate.slice(5, 7)) - 1);

  const daysGrid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i += 1) cells.push(null);
    for (let d = 1; d <= lastDate; d += 1) {
      const mStr = String(viewMonth + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      cells.push({ day: d, dateStr: `${viewYear}-${mStr}-${dStr}` });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <div className="absolute left-0 top-full mt-2 z-50 w-[300px] bg-white border border-[#bdbdbd] rounded-[5px] shadow-lg p-3.5 text-[#222222]">
      <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#e5e7eb]">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="px-2 py-1 text-[13px] font-bold text-[#444444] hover:bg-[#f3f4f6] rounded"
        >
          ◀
        </button>
        <span className="text-[15px] font-bold">
          {viewYear}년 {viewMonth + 1}월
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="px-2 py-1 text-[13px] font-bold text-[#444444] hover:bg-[#f3f4f6] rounded"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-[12px] font-bold text-[#6b7280] mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((w, idx) => (
          <div
            key={w}
            className={idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-600' : ''}
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
        {daysGrid.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const isSelected = cell.dateStr === selectedDate;
          const isToday = cell.dateStr === todayStr;
          const hasRecords = recordDatesSet.has(cell.dateStr);
          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => {
                onSelectDate(cell.dateStr);
                onClose();
              }}
              className={`relative py-1.5 rounded-[4px] font-medium transition-colors ${
                isSelected
                  ? 'bg-[#8bc7c0] text-white font-bold'
                  : isToday
                  ? 'bg-[#eef8f7] text-[#2f6861] font-bold border border-[#8bc7c0]'
                  : 'hover:bg-[#f3f4f6] text-[#222222]'
              }`}
            >
              {cell.day}
              {hasRecords && (
                <span
                  className={`block mx-auto mt-0.5 w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-[#d9823b]'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-[12px]">
        <button
          type="button"
          onClick={() => {
            onSelectDate(todayStr);
            onClose();
          }}
          className="px-2.5 py-1 rounded bg-[#eef8f7] text-[#2f6861] font-bold hover:bg-[#dff1ef]"
        >
          오늘로 이동
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-2.5 py-1 rounded bg-[#f3f4f6] text-[#4b5563] hover:bg-[#e5e7eb]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * 6. 메인 애플리케이션 컴포넌트 (공식 과구리 UI + 캠퍼스 전경 + 층별 2단 그리드)
 * ============================================================================
 */
export default function App() {
  // 1. 오늘 날짜 & 자정(00:00) 자동 전환 상태
  const [todayStr, setTodayStr] = useState(() => getLocalTodayStr());
  const [selectedDate, setSelectedDate] = useState(() => getLocalTodayStr());
  const todayRef = useRef(todayStr);
  todayRef.current = todayStr;

  useEffect(() => {
    const syncMidnightDate = () => {
      const latestToday = getLocalTodayStr();
      if (latestToday !== todayRef.current) {
        setTodayStr(latestToday);
        setSelectedDate(latestToday);
      }
    };

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      1
    );
    const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

    const midnightTimer = window.setTimeout(syncMidnightDate, msUntilMidnight);
    const intervalTimer = window.setInterval(syncMidnightDate, 15000);
    window.addEventListener('focus', syncMidnightDate);

    return () => {
      window.clearTimeout(midnightTimer);
      window.clearInterval(intervalTimer);
      window.removeEventListener('focus', syncMidnightDate);
    };
  }, [todayStr]);

  // 2. 탐활 데이터 상태 (localStorage 영속화 및 실 위치 ID 재정규화)
  const [records, setRecords] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((rec) => ({
            ...rec,
            roomId: normalizeLocationToRoomId(rec.rawLocation),
          }));
        }
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
      // 저장 실패 무시
    }
  }, [records]);

  // 3. UI 탐색 및 필터 상태
  const [periodFilter, setPeriodFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // 'overview' (캠퍼스 전경 지도) | 'building' (건물 층별 2단 그리드 평면도)
  const [viewMode, setViewMode] = useState('overview');
  const [selectedBuildingId, setSelectedBuildingId] = useState('seongsil');
  const [selectedFloor, setSelectedFloor] = useState('1F');
  const [selectedRoomId, setSelectedRoomId] = useState('seongsil_1f_coding');

  // 모달 상태
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [pasteStatus, setPasteStatus] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [isExternalModalOpen, setIsExternalModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const openPasteModal = () => {
    setPasteStatus(null);
    setAdminPassword('');
    setAdminPasswordError(false);
    setIsPasteModalOpen(true);
  };

  const closePasteModal = () => {
    setIsPasteModalOpen(false);
    setAdminPassword('');
    setAdminPasswordError(false);
    setPasteStatus(null);
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(''), 2800);
  };

  // 데이터가 존재하는 날짜 집합
  const recordDatesSet = useMemo(() => {
    const s = new Set();
    records.forEach((r) => s.add(r.date));
    return s;
  }, [records]);

  // 선택된 날짜 + 면학 시간대 필터링 결과
  const activeRecords = useMemo(() => {
    return records.filter((rec) => {
      if (rec.date !== selectedDate) return false;
      if (periodFilter !== 'ALL') {
        const hasPeriod =
          Array.isArray(rec.periods) && rec.periods.includes(periodFilter);
        if (!hasPeriod) return false;
      }
      return true;
    });
  }, [records, selectedDate, periodFilter]);

  // 실별 배정 레코드 그룹화 (O(1) 조회용)
  const activitiesByRoom = useMemo(() => {
    const map = {};
    activeRecords.forEach((rec) => {
      if (!map[rec.roomId]) map[rec.roomId] = [];
      map[rec.roomId].push(rec);
    });
    return map;
  }, [activeRecords]);

  // 상단 요약 통계 (전체 탐활 건수, 사용 중인 실 수, 중복 사용실 수)
  const summaryStats = useMemo(() => {
    const entries = Object.entries(activitiesByRoom);
    return {
      totalCount: activeRecords.length,
      usedRooms: entries.length,
      conflictRooms: entries.filter(([, list]) => list.length >= 2).length,
    };
  }, [activeRecords, activitiesByRoom]);

  // 건물별·층별 요약 통계 및 SVG 배지 속성 사전 계산
  const { buildingStats, floorStats, buildingBadges } = useMemo(() => {
    const bStats = {};
    const fStats = {};
    const bBadges = {};

    Object.values(BUILDINGS).forEach((b) => {
      let teams = 0;
      let conflictRooms = 0;
      fStats[b.id] = {};
      Object.entries(b.floors).forEach(([floorKey, floorObj]) => {
        const floorRooms = [...floorObj.topRooms, ...floorObj.bottomRooms];
        let floorTeams = 0;
        let floorConflict = false;
        floorRooms.forEach((r) => {
          const count = activitiesByRoom[r.id]?.length || 0;
          if (count > 0) {
            floorTeams += count;
            teams += count;
          }
          if (count >= 2) {
            floorConflict = true;
            conflictRooms += 1;
          }
        });
        fStats[b.id][floorKey] = {
          hasTeams: floorTeams > 0,
          hasConflict: floorConflict,
          teams: floorTeams,
        };
      });

      bStats[b.id] = { teams, conflictRooms };
      bBadges[b.id] = {
        pillColor:
          conflictRooms > 0 ? '#d9823b' : teams > 0 ? '#5ea69e' : '#6b7280',
        statusText:
          conflictRooms > 0
            ? `중복 사용실 ${conflictRooms}곳 · ${teams}팀`
            : teams > 0
            ? `${teams}팀 사용 중`
            : '현재 비어 있음',
      };
    });

    const extTeams = activitiesByRoom.external?.length || 0;
    bStats.external = { teams: extTeams, conflictRooms: 0 };
    bBadges.external = {
      pillColor: extTeams > 0 ? '#6366f1' : '#6b7280',
      statusText: extTeams > 0 ? `외부 활동 ${extTeams}팀` : '현재 비어 있음',
    };

    return { buildingStats: bStats, floorStats: fStats, buildingBadges: bBadges };
  }, [activitiesByRoom]);

  // 외부(교외·외부 장소) 활동을 실제 작성된 장소명별로 그룹화
  const externalPlaceGroups = useMemo(() => {
    const extList = activitiesByRoom.external || [];
    const groupedMap = new Map();
    extList.forEach((rec) => {
      const displayName = (rec.rawLocation || '').trim() || '교외 지정 장소';
      const key = getExternalPlaceKey(displayName);
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: key,
          name: displayName,
          sub: '교외 · 외부 활동 장소',
          records: [],
        });
      }
      groupedMap.get(key).records.push(rec);
    });
    return Array.from(groupedMap.values());
  }, [activitiesByRoom]);

  // 통합 검색 결과
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results = [];
    activeRecords.forEach((rec) => {
      const meta = ROOM_BY_ID[rec.roomId];
      const roomLabel = meta
        ? `${meta.buildingName} ${meta.floor} ${meta.name}`
        : rec.rawLocation;
      const haystack = `${rec.leader} ${rec.members} ${rec.topic} ${rec.rawLocation} ${roomLabel}`.toLowerCase();
      if (haystack.includes(q)) {
        results.push({ rec, meta, roomLabel });
      }
    });
    return results;
  }, [searchQuery, activeRecords]);

  // 건물 진입 및 층/실 선택 핸들러
  const openBuildingView = (buildingId, preferredFloor, preferredRoomId) => {
    if (buildingId === 'external') {
      setSelectedBuildingId('external');
      setSelectedFloor('교외');
      const targetExternalId =
        preferredRoomId &&
        externalPlaceGroups.some((g) => g.id === preferredRoomId)
          ? preferredRoomId
          : externalPlaceGroups[0]?.id || 'external_empty';
      setSelectedRoomId(targetExternalId);
      setViewMode('building');
      return;
    }

    const b = BUILDINGS[buildingId];
    if (!b) return;
    const floorKeys = Object.keys(b.floors);
    const targetFloor =
      preferredFloor && b.floors[preferredFloor]
        ? preferredFloor
        : floorKeys.find((fk) => floorStats[buildingId]?.[fk]?.hasTeams) ||
          floorKeys[0];

    const floorObj = b.floors[targetFloor];
    const allRoomsOnFloor = [...floorObj.topRooms, ...floorObj.bottomRooms];
    const targetRoom =
      preferredRoomId && allRoomsOnFloor.some((r) => r.id === preferredRoomId)
        ? preferredRoomId
        : allRoomsOnFloor.find((r) => (activitiesByRoom[r.id]?.length || 0) > 0)
            ?.id || allRoomsOnFloor[0]?.id;

    setSelectedBuildingId(buildingId);
    setSelectedFloor(targetFloor);
    if (targetRoom) setSelectedRoomId(targetRoom);
    setViewMode('building');
  };

  const handleSelectFloor = (floorKey) => {
    if (selectedBuildingId === 'external') return;
    setSelectedFloor(floorKey);
    const floorObj = BUILDINGS[selectedBuildingId].floors[floorKey];
    const allRooms = [...floorObj.topRooms, ...floorObj.bottomRooms];
    const firstActive = allRooms.find(
      (r) => (activitiesByRoom[r.id]?.length || 0) > 0
    );
    setSelectedRoomId(firstActive ? firstActive.id : allRooms[0]?.id || '');
  };

  // 붙여넣기 미리보기 파싱
  const previewParsed = useMemo(() => parseGwaguriText(pasteText), [pasteText]);

  const handleApplyPastedData = () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setAdminPasswordError(true);
      return;
    }
    if (previewParsed.length === 0) {
      setPasteStatus('인식된 탐활 내역이 없습니다. 과구리 화면의 텍스트를 그대로 복사해 붙여넣어 주세요.');
      return;
    }
    setRecords(previewParsed);
    const firstDate = previewParsed[0].date;
    if (firstDate) setSelectedDate(firstDate);
    setPasteText('');
    closePasteModal();
    showToast(`탐활 데이터 ${previewParsed.length}건이 지도에 반영되었습니다.`);
  };

  const handleResetDefaultData = () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      setAdminPasswordError(true);
      return;
    }
    setRecords(DEFAULT_RECORDS);
    setSelectedDate(todayStr);
    setPasteText('');
    closePasteModal();
    showToast('기본 과구리 탐활 데이터 27건으로 복원되었습니다.');
  };

  const externalRecords = activitiesByRoom.external || [];
  const isExternalBuilding = selectedBuildingId === 'external';
  const currentBuilding = isExternalBuilding
    ? null
    : BUILDINGS[selectedBuildingId] || BUILDINGS.seongsil;
  const currentFloorObj = isExternalBuilding
    ? null
    : currentBuilding.floors[selectedFloor] ||
      Object.values(currentBuilding.floors)[0];

  const selectedExternalGroup = useMemo(() => {
    if (!isExternalBuilding) return null;
    return (
      externalPlaceGroups.find((g) => g.id === selectedRoomId) ||
      externalPlaceGroups[0] ||
      null
    );
  }, [isExternalBuilding, externalPlaceGroups, selectedRoomId]);

  const selectedRoomMeta = isExternalBuilding
    ? {
        id: selectedExternalGroup?.id || 'external_empty',
        buildingName: '외부 (교외·외부 장소)',
        floor: '교외',
        name: selectedExternalGroup?.name || '교외 활동 장소',
        sub: '대학·연구소·교회·지역시설 등',
      }
    : ROOM_BY_ID[selectedRoomId] || {
        id: selectedRoomId,
        buildingName: '성실관',
        floor: '1F',
        name: '코딩실',
        sub: '구 멀티실',
      };

  const selectedRoomRecords = isExternalBuilding
    ? selectedExternalGroup?.records || []
    : activitiesByRoom[selectedRoomId] || [];

  // 층별 평면도 내 개별 실 카드 렌더링
  const renderRoomCard = (room) => {
    const list = activitiesByRoom[room.id] || [];
    const teamCount = list.length;
    const isSelected = selectedRoomId === room.id;

    let cardColorClass =
      'bg-white border-[#d4d4d4] text-[#111111] hover:border-[#8bc7c0]';
    let statusBadge = (
      <span className="inline-block text-[12px] font-medium px-2.5 py-0.5 rounded-[4px] bg-[#f0f0f0] text-[#6b7280]">
        비어 있음
      </span>
    );

    if (teamCount === 1) {
      cardColorClass =
        'bg-[#eef8f7] border-[#8bc7c0] text-[#183d39] hover:bg-[#e3f4f1]';
      statusBadge = (
        <span className="inline-block text-[12px] font-bold px-2.5 py-0.5 rounded-[4px] bg-[#dff1ef] text-[#2f6861]">
          1팀
        </span>
      );
    } else if (teamCount >= 2) {
      cardColorClass =
        'bg-[#fff7ed] border-[#e08b3e] text-[#7c2d12] hover:bg-[#ffedd5]';
      statusBadge = (
        <span className="inline-block text-[12px] font-bold px-2.5 py-0.5 rounded-[4px] bg-[#fdebd8] text-[#b45309]">
          {teamCount}팀
        </span>
      );
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => setSelectedRoomId(room.id)}
        className={`w-full text-left min-h-[122px] p-4 rounded-[6px] border transition-all flex flex-col justify-between ${cardColorClass} ${
          isSelected ? 'ring-2 ring-[#111111] shadow-xs' : ''
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-2">
            <span className="text-[16px] font-bold leading-snug tracking-tight break-keep">
              {room.name}
            </span>
            <span className="shrink-0">{statusBadge}</span>
          </div>
          {room.sub && (
            <div className="text-[13px] text-[#6b7280] mt-1 leading-tight">
              {room.sub}
            </div>
          )}
        </div>

        <div className="mt-3.5 pt-2.5 border-t border-black/5 text-[13.5px]">
          {teamCount === 0 ? (
            <span className="text-[#9ca3af]">신청 내역 없음</span>
          ) : teamCount === 1 ? (
            <div className="truncate font-medium text-[#222222]">
              {list[0].leader} ({countUniqueStudents(list[0])}명)
            </div>
          ) : (
            <div className="truncate font-medium text-[#7c2d12]">
              {list[0].leader} 외 {teamCount - 1}팀 중복 사용
            </div>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#f5f5f5] text-[#111111]"
      style={{
        fontFamily:
          '"Noto Sans KR", "Malgun Gothic", "맑은 고딕", AppleSDGothicNeo, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* ====================================================================
          1. 공식 과구리(jshsus.kr) 상단 민트 바 (높이 73px, #8bc7c0 순수 민트색)
         ==================================================================== */}
      <header className="w-full h-[73px] bg-[#8bc7c0] border-b border-[#8ac6bf]">
        <div className="max-w-[1340px] h-full mx-auto px-6 flex items-center justify-between">
          {/* 좌측: 공식 과구리 겹침 사각형 로고(38x38px) + 과구리 타이틀 + 소개 | 학생부 전산시스템 */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-3 text-left focus:outline-none"
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 38 38"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="shrink-0 drop-shadow-[0_1px_2px_rgba(0,0,0,0.22)]"
              >
                <rect x="0" y="0" width="38" height="38" rx="3" fill="#424242" />
                <rect x="0" y="0" width="31" height="31" rx="2" fill="#7ea9a4" />
                <rect x="20" y="20" width="18" height="18" rx="1.5" fill="#99b5b3" />
                <rect x="20" y="20" width="11" height="11" fill="#aad3d0" />
              </svg>

              <span
                className="text-[28px] font-bold text-white tracking-[-0.03em] leading-none"
                style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.28)' }}
              >
                과구리
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2.5 ml-4 text-[13.5px] text-white font-normal tracking-[-0.01em]">
              <button
                type="button"
                onClick={() => showToast('전남과학고등학교 학생부 전산시스템 과구리입니다.')}
                className="hover:underline"
              >
                소개
              </button>
              <span className="opacity-80">|</span>
              <span>학생부 전산시스템</span>
            </div>
          </div>

          {/* 우측: 공식 과구리 헤더 버튼 스타일 */}
          <button
            type="button"
            onClick={openPasteModal}
            className="border border-[#4c7a75] bg-transparent hover:bg-white/15 text-[#1e3835] rounded-[3px] px-3 py-1 text-[13px] font-normal transition-colors whitespace-nowrap shrink-0"
          >
            탐활서 데이터 붙여넣기
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. 공식 과구리 2줄 상단 메뉴 바 (실제 과구리와 동일한 조밀한 줄간격)
         ==================================================================== */}
      <nav className="w-full bg-white border-b border-[#d8d8d8]">
        <div className="max-w-[1340px] mx-auto px-6 py-[10px]">
          <div className="flex flex-wrap items-center justify-center gap-x-[64px] gap-y-1 text-[20px] font-bold text-[#111111] tracking-[-0.02em] leading-[22px]">
            {[
              '공지사항',
              '탐활서',
              '자유게시판',
              '청원·제안',
              '상벌점/휴대폰',
              'JBS',
              '분실물',
              '대포',
            ].map((menu) => (
              <button
                key={menu}
                type="button"
                onClick={() => {
                  if (menu === '탐활서') {
                    openPasteModal();
                  } else {
                    showToast(`'${menu}' 메뉴는 기존 과구리(jshsus.kr)에서 제공됩니다.`);
                  }
                }}
                className="hover:text-[#5ea69e] transition-colors py-[2px]"
              >
                {menu}
              </button>
            ))}
          </div>

          <div className="mt-[6px] flex flex-wrap items-center justify-center gap-x-[64px] gap-y-1 text-[20px] font-bold tracking-[-0.02em] leading-[22px]">
            {[
              '기상곡 신청',
              '세특 바이트 계산기',
              '감사챌린지',
              '잔반제로',
              '탐활 현황',
            ].map((menu) => {
              const isActive = menu === '탐활 현황';
              return (
                <button
                  key={menu}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setViewMode('overview');
                    } else {
                      showToast(`'${menu}' 메뉴는 기존 과구리(jshsus.kr)에서 제공됩니다.`);
                    }
                  }}
                  className={`py-[2px] transition-colors ${
                    isActive
                      ? 'text-[#5ea69e] border-b-[2px] border-[#8bc7c0]'
                      : 'text-[#111111] hover:text-[#5ea69e]'
                  }`}
                >
                  {menu}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ====================================================================
          3. 메인 본문 영역 (#f5f5f5 배경 위 직접 배치된 제목 + 1px 검정선 + 카드)
         ==================================================================== */}
      <main className="max-w-[1340px] mx-auto px-6 pt-[36px] pb-14">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-[11px] border-b border-[#000000]">
          <h1 className="text-[34px] font-bold tracking-[-0.03em] text-[#111111] leading-[43px]">
            탐활 현황
          </h1>

          <div className="flex items-center gap-4 text-[13px] text-[#555555] pb-1">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] border border-[#bdbdbd] bg-white inline-block" />
              비어 있음
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] border border-[#8bc7c0] bg-[#eef8f7] inline-block" />
              1팀 사용 중
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] border border-[#e08b3e] bg-[#fff7ed] inline-block" />
              2팀 이상 중복
            </span>
          </div>
        </div>

        {/* 상단 컨트롤 카드 */}
        <div className="mt-[22px] bg-white border border-[#bdbdbd] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e5e7eb]">
            <div className="relative flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
                aria-label="이전 날짜"
                className="w-8 h-8 rounded-[4px] border border-[#bdbdbd] bg-white hover:bg-[#f3f4f6] flex items-center justify-center text-[#374151] font-bold"
              >
                &lt;
              </button>

              <span className="text-[22px] font-bold text-[#111111] tracking-tight px-1">
                {formatKoreanDate(selectedDate)}
              </span>

              <button
                type="button"
                onClick={() => setSelectedDate(todayStr)}
                className={`px-2.5 py-1 rounded-[4px] text-[12px] font-bold border transition-colors ${
                  selectedDate === todayStr
                    ? 'bg-[#eef8f7] text-[#2f6861] border-[#8bc7c0]'
                    : 'bg-white text-[#4b5563] border-[#bdbdbd] hover:bg-[#f3f4f6]'
                }`}
              >
                오늘
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate((prev) => addDays(prev, 1))}
                aria-label="다음 날짜"
                className="w-8 h-8 rounded-full bg-[#d9823b] hover:bg-[#c5702b] text-white flex items-center justify-center font-bold shadow-2xs"
              >
                &gt;
              </button>

              <button
                type="button"
                onClick={() => setIsCalendarOpen((o) => !o)}
                className="ml-1 px-3 py-1.5 rounded-[4px] border border-[#bdbdbd] bg-white hover:bg-[#f3f4f6] text-[13px] font-medium text-[#222222] flex items-center gap-1.5"
              >
                <span>달력</span>
              </button>

              {isCalendarOpen && (
                <MonthCalendarPopover
                  selectedDate={selectedDate}
                  todayStr={todayStr}
                  recordDatesSet={recordDatesSet}
                  onSelectDate={(d) => setSelectedDate(d)}
                  onClose={() => setIsCalendarOpen(false)}
                />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3 text-[14px] text-[#374151]">
                <span>
                  전체 탐활 <strong className="font-bold text-[#111111]">{summaryStats.totalCount}건</strong>
                </span>
                <span className="text-[#d1d5db]">|</span>
                <span>
                  사용 중인 실 <strong className="font-bold text-[#2f6861]">{summaryStats.usedRooms}곳</strong>
                </span>
                <span className="text-[#d1d5db]">|</span>
                <span>
                  중복 사용실 <strong className="font-bold text-[#d9823b]">{summaryStats.conflictRooms}곳</strong>
                </span>
              </div>

              <div className="inline-flex rounded-[4px] border border-[#bdbdbd] overflow-hidden text-[13px]">
                {[
                  { id: 'ALL', label: '전체 시간' },
                  { id: '1면학', label: '1면학' },
                  { id: '2면학', label: '2면학' },
                  { id: '3면학', label: '3면학' },
                ].map((tab, idx) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPeriodFilter(tab.id)}
                    className={`px-3 py-1.5 font-medium transition-colors ${
                      idx > 0 ? 'border-l border-[#bdbdbd]' : ''
                    } ${
                      periodFilter === tab.id
                        ? 'bg-[#8bc7c0] text-white font-bold'
                        : 'bg-white text-[#374151] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-[#4b5563]">
              건물을 클릭하면 층별 평면도와 사용 중인 팀 현황을 확인할 수 있습니다.
            </p>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openBuildingView('external')}
                className={`px-3 py-1.5 rounded-[4px] border text-[13px] font-bold transition-colors shrink-0 ${
                  externalRecords.length > 0
                    ? 'border-[#818cf8] bg-[#eef2ff] hover:bg-[#e0e7ff] text-[#3730a3]'
                    : 'border-[#bdbdbd] bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#334155]'
                }`}
              >
                외부 (교외·외부 장소) ({externalRecords.length}건)
              </button>

              <div className="relative flex-1 sm:w-[290px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="학생 이름, 학번, 실 이름 검색..."
                  className="w-full pl-3.5 pr-8 py-1.5 rounded-[4px] border border-[#bdbdbd] bg-[#fafafa] focus:bg-white focus:border-[#8bc7c0] focus:outline-none text-[13.5px] text-[#111111]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111111] text-[12px]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          {searchQuery.trim() && (
            <div className="mt-4 pt-3.5 border-t border-[#e5e7eb]">
              <div className="text-[13px] font-bold text-[#2f6861] mb-2">
                검색 결과 ({searchResults.length}건)
              </div>
              {searchResults.length === 0 ? (
                <div className="text-[13px] text-[#6b7280]">
                  해당 날짜·시간에 일치하는 탐활 내역이 없습니다.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {searchResults.map(({ rec, meta, roomLabel }) => (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => {
                        if (meta && meta.buildingId !== 'external') {
                          openBuildingView(meta.buildingId, meta.floor, meta.id);
                        } else {
                          openBuildingView(
                            'external',
                            '교외',
                            getExternalPlaceKey(rec.rawLocation)
                          );
                        }
                      }}
                      className="text-left px-3 py-1.5 rounded-[4px] border border-[#8bc7c0] bg-[#eef8f7] hover:bg-[#dff1ef] text-[13px]"
                    >
                      <span className="font-bold text-[#183d39]">{roomLabel}</span>
                      <span className="mx-1.5 text-[#8bc7c0]">|</span>
                      <span className="font-medium text-[#111111]">{rec.leader}</span>
                      <span className="text-[#4b5563] ml-1">({rec.topic})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================================================================
            4. 지도 화면: [전체 캠퍼스 전경 SVG] 또는 [건물 내부 2단 평면도 + 상세 표]
           ================================================================== */}
        {viewMode === 'overview' ? (
          <div className="mt-[20px] bg-white border border-[#bdbdbd] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-5 sm:p-6">
            <div className="w-full overflow-hidden rounded-[4px] border border-[#cccccc] bg-[#e9f4f2]">
              <svg
                viewBox="0 0 1360 390"
                className="w-full h-auto block select-none"
                role="img"
                aria-label="전남과학고등학교 전경 및 교외 외부 지도"
              >
                <defs>
                  <linearGradient id="jshsSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e3f1ef" />
                    <stop offset="68%" stopColor="#f3f9f8" />
                    <stop offset="100%" stopColor="#e8f3ea" />
                  </linearGradient>
                  <linearGradient id="outsideSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e6eaf4" />
                    <stop offset="72%" stopColor="#f4f6fb" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                  <pattern
                    id="dotGrid"
                    width="22"
                    height="22"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1.1" fill="#b9d8d3" />
                  </pattern>
                </defs>

                {/* 교내 배경 (0 ~ 1096) */}
                <rect x="0" y="0" width="1096" height="390" fill="url(#jshsSky)" />
                <rect x="0" y="0" width="1096" height="320" fill="url(#dotGrid)" />

                {/* 교외 외부 배경 (1096 ~ 1360) */}
                <rect x="1096" y="0" width="264" height="390" fill="url(#outsideSky)" />

                <g fill="#ffffff" opacity="0.9">
                  <circle cx="155" cy="52" r="16" />
                  <circle cx="176" cy="48" r="20" />
                  <circle cx="198" cy="53" r="15" />
                  <circle cx="950" cy="46" r="15" />
                  <circle cx="972" cy="42" r="21" />
                  <circle cx="994" cy="48" r="16" />
                  <circle cx="1265" cy="44" r="14" />
                  <circle cx="1285" cy="40" r="18" />
                  <circle cx="1305" cy="45" r="13" />
                </g>

                {/* 교내 운동장 & 잔디 (0 ~ 1096) */}
                <rect x="0" y="314" width="1096" height="76" fill="#dfece0" />
                <polygon points="75,326 1055,326 1085,376 45,376" fill="#5ea343" />
                <polygon
                  points="75,326 1055,326 1085,376 45,376"
                  fill="none"
                  stroke="#498732"
                  strokeWidth="2"
                />
                <line
                  x1="565"
                  y1="326"
                  x2="565"
                  y2="376"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  opacity="0.7"
                />
                <ellipse
                  cx="565"
                  cy="351"
                  rx="42"
                  ry="12"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.8"
                  opacity="0.7"
                />
                <g stroke="#ffffff" strokeWidth="2.5" fill="none">
                  <polyline points="118,358 118,334 146,334 146,358" />
                  <polyline points="984,358 984,334 1012,334 1012,358" />
                </g>

                {[52, 466, 815, 1072].map((tx, i) => (
                  <g key={`tree-${i}`}>
                    <rect x={tx - 3} y="302" width="6" height="18" fill="#6b4423" />
                    <circle cx={tx} cy="292" r="16" fill="#3d8b37" />
                    <circle cx={tx - 8} cy="297" r="11" fill="#4da346" />
                    <circle cx={tx + 8} cy="297" r="11" fill="#2f752a" />
                  </g>
                ))}

                {/* ==========================================================
                    [좌측 건물] 성실관 (본관 · 1~4F)
                   ========================================================== */}
                <g
                  onClick={() => openBuildingView('seongsil')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="224"
                    y="124"
                    width="74"
                    height="16"
                    rx="2"
                    fill="#8f3b32"
                    stroke="#6d2922"
                    strokeWidth="1.5"
                  />

                  <rect
                    x="70"
                    y="130"
                    width="24"
                    height="186"
                    rx="10"
                    fill="#7c3028"
                    stroke="#5e211b"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="77"
                    y="146"
                    width="10"
                    height="152"
                    rx="4"
                    fill="#334155"
                  />

                  <rect
                    x="90"
                    y="138"
                    width="348"
                    height="178"
                    fill="#8f3b32"
                    stroke="#5e211b"
                    strokeWidth="2"
                  />

                  {[146, 184, 222, 260].map((bandY, rIdx) => (
                    <g key={`ss-band-${rIdx}`}>
                      <rect x="90" y={bandY} width="348" height="8" fill="#e8e2d5" />
                      {[108, 142, 176, 210, 300, 334, 368, 402].map((winX, wIdx) => (
                        <rect
                          key={`ss-win-${rIdx}-${wIdx}`}
                          x={winX}
                          y={bandY + 11}
                          width="24"
                          height="20"
                          rx="1"
                          fill="#334155"
                          stroke="#d6cfc2"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  ))}

                  <rect
                    x="240"
                    y="232"
                    width="48"
                    height="84"
                    fill="#f3efe6"
                    stroke="#8f3b32"
                    strokeWidth="1.5"
                  />
                  {[245, 254, 264, 274, 283].map((px, pi) => (
                    <line
                      key={`col-${pi}`}
                      x1={px}
                      y1="234"
                      x2={px}
                      y2="314"
                      stroke="#9ca3af"
                      strokeWidth="2"
                    />
                  ))}
                  <rect x="252" y="290" width="24" height="26" fill="#1e293b" />

                  <rect
                    x="152"
                    y="80"
                    width="224"
                    height="32"
                    rx="16"
                    fill={buildingBadges.seongsil.pillColor}
                  />
                  <text
                    x="264"
                    y="101"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {buildingBadges.seongsil.statusText}
                  </text>

                  <rect x="156" y="330" width="216" height="32" rx="16" fill="#1f2937" />
                  <text
                    x="264"
                    y="351"
                    textAnchor="middle"
                    fontSize="14.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {BUILDINGS.seongsil.mapLabel}
                  </text>
                </g>

                {/* ==========================================================
                    [중앙 건물] 창의관 (실험동 · 1~4F+옥상)
                   ========================================================== */}
                <g
                  onClick={() => openBuildingView('changui')}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 626 126 A 36 32 0 0 1 698 126 Z"
                    fill="#e5e7eb"
                    stroke="#374151"
                    strokeWidth="2"
                  />
                  <line
                    x1="662"
                    y1="94"
                    x2="662"
                    y2="126"
                    stroke="#4b5563"
                    strokeWidth="2"
                  />
                  <text
                    x="662"
                    y="86"
                    textAnchor="middle"
                    fontSize="12.5"
                    fontWeight="700"
                    fill="#1f2937"
                  >
                    옥상 천문대
                  </text>

                  <rect
                    x="494"
                    y="126"
                    width="304"
                    height="190"
                    fill="#8f3b32"
                    stroke="#5e211b"
                    strokeWidth="2"
                  />

                  {[134, 174, 214, 254].map((bandY, rIdx) => (
                    <g key={`cu-band-${rIdx}`}>
                      <rect x="494" y={bandY} width="304" height="7" fill="#e8e2d5" />
                      {[510, 548, 586, 702, 740, 770].map((winX, wIdx) => (
                        <rect
                          key={`cu-win-${rIdx}-${wIdx}`}
                          x={winX}
                          y={bandY + 11}
                          width={wIdx === 5 ? 18 : 26}
                          height="21"
                          rx="1"
                          fill="#334155"
                          stroke="#d6cfc2"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  ))}

                  <rect
                    x="628"
                    y="126"
                    width="68"
                    height="190"
                    fill="#93b8d8"
                    stroke="#475569"
                    strokeWidth="1.5"
                  />
                  {[156, 196, 236, 276].map((gy, gi) => (
                    <line
                      key={`glass-h-${gi}`}
                      x1="628"
                      y1={gy}
                      x2="696"
                      y2={gy}
                      stroke="#e2e8f0"
                      strokeWidth="2"
                    />
                  ))}
                  <line
                    x1="651"
                    y1="126"
                    x2="651"
                    y2="316"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="673"
                    y1="126"
                    x2="673"
                    y2="316"
                    stroke="#e2e8f0"
                    strokeWidth="1.5"
                  />
                  <rect x="650" y="292" width="24" height="24" fill="#1e293b" />

                  <rect
                    x="534"
                    y="38"
                    width="224"
                    height="32"
                    rx="16"
                    fill={buildingBadges.changui.pillColor}
                  />
                  <text
                    x="646"
                    y="59"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {buildingBadges.changui.statusText}
                  </text>

                  <rect x="528" y="330" width="236" height="32" rx="16" fill="#1f2937" />
                  <text
                    x="646"
                    y="351"
                    textAnchor="middle"
                    fontSize="14.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {BUILDINGS.changui.mapLabel}
                  </text>
                </g>

                {/* 2층 연결통로 (성실관·창의관 사이 56px 간격 중앙 배치 + 2줄 배지) */}
                <g>
                  <rect
                    x="438"
                    y="242"
                    width="56"
                    height="22"
                    fill="#dbeafe"
                    stroke="#8f3b32"
                    strokeWidth="2"
                  />
                  <line
                    x1="438"
                    y1="253"
                    x2="494"
                    y2="253"
                    stroke="#64748b"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <rect
                    x="441"
                    y="204"
                    width="50"
                    height="33"
                    rx="4"
                    fill="rgba(255,255,255,0.92)"
                    stroke="#cbd5e1"
                    strokeWidth="0.8"
                  />
                  <text
                    x="466"
                    y="218"
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#334155"
                  >
                    2층
                  </text>
                  <text
                    x="466"
                    y="231"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#334155"
                  >
                    연결통로
                  </text>
                </g>

                {/* ==========================================================
                    [우측 건물] 성취관 (강당 · 1~2F)
                   ========================================================== */}
                <g
                  onClick={() => openBuildingView('seongchui')}
                  className="cursor-pointer group"
                >
                  <rect
                    x="832"
                    y="180"
                    width="224"
                    height="136"
                    fill="#8f3b32"
                    stroke="#5e211b"
                    strokeWidth="2"
                  />
                  <rect x="832" y="188" width="224" height="8" fill="#e8e2d5" />
                  <rect x="832" y="246" width="224" height="7" fill="#e8e2d5" />

                  {[852, 892, 932, 972, 1012].map((wx, wi) => (
                    <g key={`sc-win-${wi}`}>
                      <rect
                        x={wx}
                        y="204"
                        width="22"
                        height="32"
                        rx="1"
                        fill="#334155"
                        stroke="#d6cfc2"
                        strokeWidth="1"
                      />
                      <rect
                        x={wx}
                        y="262"
                        width="22"
                        height="26"
                        rx="1"
                        fill="#334155"
                        stroke="#d6cfc2"
                        strokeWidth="1"
                      />
                    </g>
                  ))}

                  <rect
                    x="844"
                    y="134"
                    width="200"
                    height="32"
                    rx="16"
                    fill={buildingBadges.seongchui.pillColor}
                  />
                  <text
                    x="944"
                    y="155"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {buildingBadges.seongchui.statusText}
                  </text>

                  <rect x="844" y="330" width="200" height="32" rx="16" fill="#1f2937" />
                  <text
                    x="944"
                    y="351"
                    textAnchor="middle"
                    fontSize="14.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {BUILDINGS.seongchui.mapLabel}
                  </text>
                </g>

                {/* ==========================================================
                    [학교 경계 담장 및 교문] 교내와 외부(교외) 공간 구분선
                   ========================================================== */}
                <g>
                  <line
                    x1="1096"
                    y1="24"
                    x2="1096"
                    y2="382"
                    stroke="#94a3b8"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  {/* 벽돌 교문 기둥 */}
                  <rect
                    x="1089"
                    y="238"
                    width="14"
                    height="78"
                    rx="2"
                    fill="#7c3028"
                    stroke="#4a1c17"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="1087"
                    y="233"
                    width="18"
                    height="7"
                    rx="1.5"
                    fill="#e8e2d5"
                    stroke="#5e211b"
                    strokeWidth="1"
                  />
                  {/* 교문 안내 푯말 */}
                  <rect
                    x="1077"
                    y="204"
                    width="38"
                    height="22"
                    rx="4"
                    fill="#ffffff"
                    stroke="#64748b"
                    strokeWidth="1.2"
                  />
                  <text
                    x="1096"
                    y="219"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontWeight="700"
                    fill="#334155"
                  >
                    교문
                  </text>
                </g>

                {/* ==========================================================
                    [교문 바깥 우측 구역] 외부 (교외·외부 장소) 일러스트
                   ========================================================== */}
                <g
                  onClick={() => openBuildingView('external')}
                  className="cursor-pointer group"
                >
                  {/* 교외 인도 및 아스팔트 도로 */}
                  <rect x="1096" y="314" width="264" height="14" fill="#cbd5e1" />
                  <rect x="1096" y="328" width="264" height="62" fill="#64748b" />
                  <line
                    x1="1104"
                    y1="358"
                    x2="1354"
                    y2="358"
                    stroke="#f8fafc"
                    strokeWidth="2"
                    strokeDasharray="12 10"
                    opacity="0.85"
                  />

                  {/* 외부 건물 1: 대학 · 연구기관 (모던 유리·콘크리트 연구동) */}
                  <rect
                    x="1116"
                    y="162"
                    width="96"
                    height="152"
                    rx="2"
                    fill="#475569"
                    stroke="#334155"
                    strokeWidth="1.8"
                  />
                  <rect
                    x="1123"
                    y="150"
                    width="82"
                    height="12"
                    rx="1.5"
                    fill="#334155"
                  />
                  {[174, 206, 238, 270].map((wy, rIdx) => (
                    <g key={`ext-uni-w-${rIdx}`}>
                      {[1126, 1154, 1182].map((wx, cIdx) => (
                        <rect
                          key={`ext-uni-c-${rIdx}-${cIdx}`}
                          x={wx}
                          y={wy}
                          width="20"
                          height="22"
                          rx="1"
                          fill="#bae6fd"
                          stroke="#1e293b"
                          strokeWidth="1"
                        />
                      ))}
                    </g>
                  ))}
                  <rect
                    x="1132"
                    y="166"
                    width="64"
                    height="15"
                    rx="3"
                    fill="#1e293b"
                    opacity="0.92"
                  />
                  <text
                    x="1164"
                    y="177"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#f8fafc"
                  >
                    대학 · 연구소
                  </text>

                  {/* 외부 건물 2: 교회 · 지역시설 (박공지붕 + 종탑/십자가) */}
                  {/* 종탑 & 첨탑 */}
                  <rect
                    x="1273"
                    y="146"
                    width="22"
                    height="46"
                    fill="#f8fafc"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="1269,146 1284,122 1299,146"
                    fill="#b91c1c"
                    stroke="#7f1d1d"
                    strokeWidth="1.5"
                  />
                  {/* 십자가 심볼 */}
                  <line
                    x1="1284"
                    y1="106"
                    x2="1284"
                    y2="122"
                    stroke="#b91c1c"
                    strokeWidth="2.5"
                  />
                  <line
                    x1="1278"
                    y1="112"
                    x2="1290"
                    y2="112"
                    stroke="#b91c1c"
                    strokeWidth="2.5"
                  />
                  {/* 본당 지붕 및 외벽 */}
                  <polygon
                    points="1222,202 1284,166 1346,202"
                    fill="#991b1b"
                    stroke="#7f1d1d"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="1228"
                    y="202"
                    width="112"
                    height="112"
                    fill="#fffbeb"
                    stroke="#94a3b8"
                    strokeWidth="1.8"
                  />
                  {/* 아치형 창문 & 출입문 */}
                  <rect
                    x="1244"
                    y="222"
                    width="20"
                    height="36"
                    rx="10"
                    fill="#93c5fd"
                    stroke="#475569"
                    strokeWidth="1.2"
                  />
                  <rect
                    x="1304"
                    y="222"
                    width="20"
                    height="36"
                    rx="10"
                    fill="#93c5fd"
                    stroke="#475569"
                    strokeWidth="1.2"
                  />
                  <rect
                    x="1272"
                    y="268"
                    width="24"
                    height="46"
                    rx="12"
                    fill="#78350f"
                  />
                  <rect
                    x="1250"
                    y="194"
                    width="68"
                    height="15"
                    rx="3"
                    fill="#7f1d1d"
                  />
                  <text
                    x="1284"
                    y="205"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    교회 · 지역시설
                  </text>

                  {/* 가로수 */}
                  <rect x="1217" y="298" width="5" height="16" fill="#6b4423" />
                  <circle cx="1219.5" cy="290" r="12" fill="#4da346" />

                  {/* 외부 상태 배지 */}
                  <rect
                    x="1132"
                    y="66"
                    width="196"
                    height="32"
                    rx="16"
                    fill={buildingBadges.external.pillColor}
                  />
                  <text
                    x="1230"
                    y="87"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    {buildingBadges.external.statusText}
                  </text>

                  {/* 외부 하단 라벨 배지 */}
                  <rect
                    x="1126"
                    y="330"
                    width="208"
                    height="32"
                    rx="16"
                    fill="#1f2937"
                  />
                  <text
                    x="1230"
                    y="351"
                    textAnchor="middle"
                    fontSize="14.5"
                    fontWeight="700"
                    fill="#ffffff"
                  >
                    외부 (교외·외부 장소)
                  </text>
                </g>
              </svg>
            </div>
          </div>
        ) : (
          /* ==================================================================
             [건물 내부 평면도 뷰] 좌측 2단 블록 그리드 평면도 + 우측 과구리 2열 표 상세 패널
             ================================================================== */
          <div className="mt-[20px] space-y-4">
            <div className="bg-white border border-[#bdbdbd] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="px-3.5 py-1.5 rounded-[4px] border border-[#bdbdbd] bg-white hover:bg-[#f3f4f6] text-[14px] font-bold text-[#111111]"
                >
                  ← 전체 학교 지도로 돌아가기
                </button>

                <span className="text-[#d1d5db] mx-1">|</span>

                {Object.values(BUILDINGS).map((b) => {
                  const st = buildingStats[b.id];
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => openBuildingView(b.id)}
                      className={`px-3.5 py-1.5 rounded-[4px] text-[14px] font-bold border transition-colors flex items-center gap-1.5 ${
                        selectedBuildingId === b.id
                          ? 'bg-[#eef8f7] border-[#8bc7c0] text-[#111111]'
                          : 'bg-[#f3f4f6] border-transparent text-[#374151] hover:bg-[#e5e7eb]'
                      }`}
                    >
                      <span>{b.fullName}</span>
                      {st.teams > 0 && (
                        <span
                          className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                            selectedBuildingId === b.id
                              ? 'bg-[#5ea69e] text-white'
                              : st.conflictRooms > 0
                              ? 'bg-[#d9823b] text-white'
                              : 'bg-[#8bc7c0] text-white'
                          }`}
                        >
                          {st.teams}
                        </span>
                      )}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => openBuildingView('external')}
                  className={`px-3.5 py-1.5 rounded-[4px] text-[14px] font-bold border transition-colors flex items-center gap-1.5 ${
                    isExternalBuilding
                      ? 'bg-[#eef2ff] border-[#818cf8] text-[#1e1b4b]'
                      : 'bg-[#f3f4f6] border-transparent text-[#374151] hover:bg-[#e5e7eb]'
                  }`}
                >
                  <span>외부 (교외·외부 장소)</span>
                  {buildingStats.external.teams > 0 && (
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-[#6366f1] text-white">
                      {buildingStats.external.teams}
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {isExternalBuilding ? (
                  <span className="px-3 py-1.5 rounded-[4px] text-[13px] font-bold bg-[#111111] text-white">
                    교외 전체 ({externalRecords.length}팀)
                  </span>
                ) : (
                  Object.keys(currentBuilding.floors).map((floorKey) => {
                    const fStat = floorStats[selectedBuildingId]?.[floorKey] || {
                      hasTeams: false,
                      hasConflict: false,
                    };

                    return (
                      <button
                        key={floorKey}
                        type="button"
                        onClick={() => handleSelectFloor(floorKey)}
                        className={`px-3 py-1.5 rounded-[4px] text-[13px] font-bold border transition-colors flex items-center gap-1.5 ${
                          selectedFloor === floorKey
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-[#374151] border-[#bdbdbd] hover:bg-[#f3f4f6]'
                        }`}
                      >
                        <span>{floorKey}</span>
                        {fStat.hasTeams && (
                          <span
                            className={`w-2 h-2 rounded-full ${
                              fStat.hasConflict ? 'bg-[#d9823b]' : 'bg-[#8bc7c0]'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측: 2단 블록 그리드 평면도 (또는 외부 장소 카드 목록) */}
              <div className="lg:col-span-8 bg-white border border-[#bdbdbd] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-5">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
                  <h2 className="text-[18px] font-bold text-[#111111]">
                    {isExternalBuilding
                      ? '외부 (교외·외부 장소) 활동 구역'
                      : `${currentBuilding.fullName} · ${currentFloorObj.label} 평면도`}
                  </h2>
                  <span className="text-[12.5px] text-[#6b7280]">
                    {isExternalBuilding
                      ? '교내 건물이 아닌 R&E·교회·기관 등 외부 활동 장소가 자동 분류됩니다.'
                      : '실 카드를 클릭하면 우측에서 신청 상세 표를 볼 수 있습니다.'}
                  </span>
                </div>

                {isExternalBuilding ? (
                  <div className="border border-[#d1d5db] rounded-[5px] bg-[#fafafa] p-4 space-y-3.5">
                    <div className="py-2.5 px-4 rounded-[4px] bg-[#e0e7ff] text-center text-[13px] font-bold text-[#3730a3] tracking-tight">
                      ◀ 전남과학고 교문 바깥 · 대학·연구소·교회·지역시설 외부 구역 ▶
                    </div>

                    {externalPlaceGroups.length === 0 ? (
                      <div className="py-14 text-center bg-white border border-dashed border-[#cbd5e1] rounded-[6px]">
                        <div className="text-[15px] font-bold text-[#4b5563]">
                          현재 등록된 외부(교외) 탐활 내역이 없습니다.
                        </div>
                        <div className="text-[13px] text-[#6b7280] mt-1">
                          탐활서 목록을 붙여넣을 때 대학, 교회, 연구소 등 학교 밖 장소는 이곳으로 자동 분류됩니다.
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {externalPlaceGroups.map((group) => {
                          const teamCount = group.records.length;
                          const isSelected =
                            selectedExternalGroup?.id === group.id;
                          return (
                            <button
                              key={group.id}
                              type="button"
                              onClick={() => setSelectedRoomId(group.id)}
                              className={`w-full text-left min-h-[122px] p-4 rounded-[6px] border transition-all flex flex-col justify-between bg-[#eef2ff] border-[#818cf8] text-[#1e1b4b] hover:bg-[#e0e7ff] ${
                                isSelected
                                  ? 'ring-2 ring-[#111111] shadow-xs'
                                  : ''
                              }`}
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-[16px] font-bold leading-snug tracking-tight break-keep">
                                    {group.name}
                                  </span>
                                  <span className="inline-block text-[12px] font-bold px-2.5 py-0.5 rounded-[4px] bg-[#c7d2fe] text-[#3730a3] shrink-0">
                                    {teamCount}팀
                                  </span>
                                </div>
                                <div className="text-[13px] text-[#4338ca] mt-1 leading-tight">
                                  {group.sub}
                                </div>
                              </div>

                              <div className="mt-3.5 pt-2.5 border-t border-black/5 text-[13.5px]">
                                <div className="truncate font-medium text-[#1e1b4b]">
                                  {group.records[0].leader} (
                                  {countUniqueStudents(group.records[0])}명) ·{' '}
                                  {group.records[0].topic}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-[#d1d5db] rounded-[5px] bg-[#fafafa] p-4 space-y-3.5">
                    {currentFloorObj.topRooms.length > 0 && (
                      <div
                        className={`grid gap-3 ${
                          currentFloorObj.topRooms.length === 1
                            ? 'grid-cols-1'
                            : currentFloorObj.topRooms.length === 2
                            ? 'grid-cols-1 sm:grid-cols-2'
                            : currentFloorObj.topRooms.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-2 sm:grid-cols-4'
                        }`}
                      >
                        {currentFloorObj.topRooms.map(renderRoomCard)}
                      </div>
                    )}

                    <div className="py-2.5 px-4 rounded-[4px] bg-[#e5e7eb] text-center text-[13px] font-bold text-[#374151] tracking-tight">
                      {currentFloorObj.corridor}
                    </div>

                    {currentFloorObj.bottomRooms.length > 0 && (
                      <div
                        className={`grid gap-3 ${
                          currentFloorObj.bottomRooms.length === 1
                            ? 'grid-cols-1'
                            : currentFloorObj.bottomRooms.length === 2
                            ? 'grid-cols-1 sm:grid-cols-2'
                            : currentFloorObj.bottomRooms.length === 3
                            ? 'grid-cols-1 sm:grid-cols-3'
                            : 'grid-cols-2 sm:grid-cols-4'
                        }`}
                      >
                        {currentFloorObj.bottomRooms.map(renderRoomCard)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 우측: 선택한 실 상세 정보 (실제 과구리 2열 표 스타일) */}
              <div className="lg:col-span-4 bg-white border border-[#bdbdbd] rounded-[5px] shadow-[0_2px_4px_rgba(0,0,0,0.08)] p-5">
                <div className="flex items-start justify-between gap-2 pb-3 mb-4 border-b border-[#e5e7eb]">
                  <div>
                    <div className="text-[12.5px] font-medium text-[#6b7280]">
                      {selectedRoomMeta.buildingName} · {selectedRoomMeta.floor}
                    </div>
                    <h3 className="text-[20px] font-bold text-[#111111] mt-0.5">
                      {selectedRoomMeta.name}
                      {selectedRoomMeta.sub && (
                        <span className="ml-2 text-[13px] font-normal text-[#6b7280]">
                          ({selectedRoomMeta.sub})
                        </span>
                      )}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-[4px] text-[12px] font-bold shrink-0 ${
                      selectedRoomRecords.length >= 2
                        ? 'bg-[#fdebd8] text-[#b45309]'
                        : selectedRoomRecords.length === 1
                        ? 'bg-[#dff1ef] text-[#2f6861]'
                        : 'bg-[#f3f4f6] text-[#6b7280]'
                    }`}
                  >
                    {selectedRoomRecords.length >= 2
                      ? `${selectedRoomRecords.length}팀 중복 사용`
                      : selectedRoomRecords.length === 1
                      ? '1팀 사용 중'
                      : '비어 있음'}
                  </span>
                </div>

                {selectedRoomRecords.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-[#d1d5db] rounded-[4px] bg-[#fafafa]">
                    <div className="text-[15px] font-bold text-[#4b5563]">
                      신청된 탐활 내역이 없습니다.
                    </div>
                    <div className="text-[13px] text-[#6b7280] mt-1">
                      {formatKoreanDate(selectedDate)} ({periodFilter === 'ALL' ? '전체 시간' : periodFilter}) 기준 비어 있는 실입니다.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedRoomRecords.map((rec, idx) => (
                      <div
                        key={rec.id}
                        className="border border-[#cccccc] rounded-[4px] overflow-hidden bg-white"
                      >
                        <div className="px-3 py-1.5 bg-[#fafafa] border-b border-[#e5e7eb] flex items-center justify-between text-[12px] text-[#6b7280]">
                          <span className="font-bold text-[#374151]">
                            #{idx + 1}팀 신청 내역
                          </span>
                          <span>{rec.submittedAt}</span>
                        </div>

                        <table className="w-full border-collapse text-[13.5px]">
                          <tbody>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="w-[88px] py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                활동날짜
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111]">
                                {rec.date}
                              </td>
                            </tr>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                활동시간
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111]">
                                {rec.timeText}
                              </td>
                            </tr>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                활동장소
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111]">
                                {rec.rawLocation}
                              </td>
                            </tr>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                활동내용
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111] font-medium">
                                {rec.topic}
                              </td>
                            </tr>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                대표학생
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111] font-bold">
                                {rec.leader}
                              </td>
                            </tr>
                            <tr className="border-b border-[#e5e7eb]">
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                참가학생
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111] leading-relaxed">
                                {rec.members}
                              </td>
                            </tr>
                            <tr>
                              <th className="py-2 px-2.5 bg-[#f2f2f2] text-[#222222] font-bold text-center border-r border-[#e5e7eb]">
                                지도교사
                              </th>
                              <td className="py-2 px-3 bg-white text-[#111111]">
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
      </main>

      {/* ====================================================================
          5. 탐활서 데이터 붙여넣기 모달
         ==================================================================== */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white border border-[#bdbdbd] rounded-[5px] shadow-xl w-full max-w-[740px] max-h-[88vh] flex flex-col">
            <div className="px-5 py-3.5 bg-[#8bc7c0] text-white flex items-center justify-between rounded-t-[4px]">
              <h3 className="text-[17px] font-bold">
                과구리 탐활서 데이터 붙여넣기
              </h3>
              <button
                type="button"
                onClick={closePasteModal}
                className="text-white/90 hover:text-white text-[18px] font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-[14px]">
              <p className="text-[#374151] leading-relaxed">
                과구리(jshsus.kr) <strong>탐활서 확인</strong> 페이지의 내용을 드래그해 복사(Ctrl+C)한 뒤 아래 입력창에 붙여넣으세요(Ctrl+V). 날짜·시간·장소가 자동으로 파싱되어 지도에 반영됩니다.
              </p>

              <textarea
                rows={7}
                value={pasteText}
                onChange={(e) => {
                  setPasteText(e.target.value);
                  setPasteStatus(null);
                }}
                placeholder="여기에 과구리 탐활서 텍스트를 붙여넣으세요..."
                className="w-full p-3 border border-[#bdbdbd] rounded-[4px] text-[13.5px] font-normal text-[#111111] focus:border-[#8bc7c0] focus:outline-none"
              />

              {pasteStatus && (
                <div className="p-3 rounded-[4px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium">
                  {pasteStatus}
                </div>
              )}

              <div className="border border-[#e5e7eb] rounded-[4px] bg-[#fafafa] p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#111111] text-[13.5px]">
                    자동 파싱 미리보기 ({previewParsed.length}건 인식됨)
                  </span>
                  <button
                    type="button"
                    onClick={handleResetDefaultData}
                    className="text-[12.5px] text-[#2f6861] font-bold hover:underline"
                  >
                    기본 데이터(27건)로 초기화
                  </button>
                </div>

                {previewParsed.length === 0 ? (
                  <div className="text-[13px] text-[#6b7280] py-2">
                    텍스트를 붙여넣으면 인식된 날짜·장소·대표학생 목록이 여기에 표시됩니다.
                  </div>
                ) : (
                  <div className="max-h-[180px] overflow-y-auto border border-[#e5e7eb] bg-white rounded-[3px]">
                    <table className="w-full text-left border-collapse text-[12.5px]">
                      <thead>
                        <tr className="bg-[#f2f2f2] border-b border-[#e5e7eb] text-[#222222]">
                          <th className="py-1.5 px-2.5">활동날짜</th>
                          <th className="py-1.5 px-2.5">원본 장소 → 매핑된 실</th>
                          <th className="py-1.5 px-2.5">대표학생</th>
                          <th className="py-1.5 px-2.5">활동내용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewParsed.map((item) => {
                          const meta = ROOM_BY_ID[item.roomId];
                          return (
                            <tr key={item.id} className="border-b border-[#f3f4f6]">
                              <td className="py-1.5 px-2.5 whitespace-nowrap">{item.date}</td>
                              <td className="py-1.5 px-2.5">
                                <span className="text-[#6b7280]">{item.rawLocation}</span>
                                <span className="mx-1">→</span>
                                {item.roomId === 'external' ? (
                                  <span className="inline-block px-1.5 py-0.5 rounded bg-[#eef2ff] text-[#3730a3] font-bold">
                                    외부 (교외·외부 장소)
                                  </span>
                                ) : (
                                  <strong className="text-[#2f6861]">
                                    {meta
                                      ? `${meta.buildingName} ${meta.floor} ${meta.name}`
                                      : '외부'}
                                  </strong>
                                )}
                              </td>
                              <td className="py-1.5 px-2.5 whitespace-nowrap font-bold">
                                {item.leader}
                              </td>
                              <td className="py-1.5 px-2.5 truncate max-w-[180px]">
                                {item.topic}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 관리자 비밀번호 입력 영역 */}
              <div className="border border-[#e5e7eb] rounded-[4px] bg-[#f9fafb] p-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label
                    htmlFor="admin-password-input"
                    className="text-[13.5px] font-bold text-[#111111] shrink-0"
                  >
                    관리자 비밀번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="admin-password-input"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      if (adminPasswordError) setAdminPasswordError(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApplyPastedData();
                      }
                    }}
                    placeholder="관리자 비밀번호 입력"
                    autoComplete="off"
                    className={`w-full sm:w-[260px] px-3 py-1.5 rounded-[4px] border text-[13.5px] focus:outline-none transition-colors ${
                      adminPasswordError
                        ? 'border-red-500 bg-red-50 text-[#111111] focus:border-red-500'
                        : 'border-[#bdbdbd] bg-white text-[#111111] focus:border-[#8bc7c0]'
                    }`}
                  />
                </div>
                {adminPasswordError && (
                  <p className="mt-2 text-[12.5px] font-bold text-red-600">
                    관리자 비밀번호가 올바르지 않습니다.
                  </p>
                )}
              </div>
            </div>

            <div className="px-5 py-3 bg-[#f9fafb] border-t border-[#e5e7eb] flex items-center justify-end gap-2 rounded-b-[4px]">
              <button
                type="button"
                onClick={closePasteModal}
                className="px-4 py-1.5 rounded-[4px] border border-[#bdbdbd] bg-white hover:bg-[#f3f4f6] text-[13.5px] font-medium text-[#374151]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplyPastedData}
                className="px-4 py-1.5 rounded-[4px] bg-[#8bc7c0] hover:bg-[#76b5ae] text-white text-[13.5px] font-bold"
              >
                지도에 반영하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          6. 교외·기타 장소 상세 모달
         ==================================================================== */}
      {isExternalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white border border-[#bdbdbd] rounded-[5px] shadow-xl w-full max-w-[560px] max-h-[82vh] flex flex-col">
            <div className="px-5 py-3.5 bg-[#8bc7c0] text-white flex items-center justify-between rounded-t-[4px]">
              <h3 className="text-[17px] font-bold">
                교외·기타 장소 탐활 내역 ({externalRecords.length}건)
              </h3>
              <button
                type="button"
                onClick={() => setIsExternalModalOpen(false)}
                className="text-white/90 hover:text-white text-[18px] font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              {externalRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="border border-[#cccccc] rounded-[4px] overflow-hidden"
                >
                  <table className="w-full border-collapse text-[13.5px]">
                    <tbody>
                      <tr className="border-b border-[#e5e7eb]">
                        <th className="w-[88px] py-2 px-2.5 bg-[#f2f2f2] font-bold text-center border-r border-[#e5e7eb]">
                          활동장소
                        </th>
                        <td className="py-2 px-3 font-bold text-[#111111]">
                          {rec.rawLocation}
                        </td>
                      </tr>
                      <tr className="border-b border-[#e5e7eb]">
                        <th className="py-2 px-2.5 bg-[#f2f2f2] font-bold text-center border-r border-[#e5e7eb]">
                          활동내용
                        </th>
                        <td className="py-2 px-3">{rec.topic}</td>
                      </tr>
                      <tr className="border-b border-[#e5e7eb]">
                        <th className="py-2 px-2.5 bg-[#f2f2f2] font-bold text-center border-r border-[#e5e7eb]">
                          대표학생
                        </th>
                        <td className="py-2 px-3 font-bold">{rec.leader}</td>
                      </tr>
                      <tr className="border-b border-[#e5e7eb]">
                        <th className="py-2 px-2.5 bg-[#f2f2f2] font-bold text-center border-r border-[#e5e7eb]">
                          참가학생
                        </th>
                        <td className="py-2 px-3">{rec.members}</td>
                      </tr>
                      <tr>
                        <th className="py-2 px-2.5 bg-[#f2f2f2] font-bold text-center border-r border-[#e5e7eb]">
                          지도교사
                        </th>
                        <td className="py-2 px-3">{rec.teacher}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-end rounded-b-[4px]">
              <button
                type="button"
                onClick={() => setIsExternalModalOpen(false)}
                className="px-4 py-1.5 rounded-[4px] border border-[#bdbdbd] bg-white hover:bg-[#f3f4f6] text-[13.5px] font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 안내 토스트 */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#222222] text-white px-4 py-2.5 rounded-[4px] shadow-lg text-[13.5px] font-medium">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
