import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * 사용자의 현재 시스템 로컬 날짜를 'YYYY-MM-DD' 문자열로 반환합니다.
 * UTC 변환 오차 없이 한국 표준시(로컬 시간) 기준 날짜를 정확히 계산합니다.
 */
function getLocalTodayStr() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 'YYYY-MM-DD' 문자열에 일수(delta)를 더하거나 뺀 새로운 'YYYY-MM-DD' 문자열을 반환합니다.
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
 * 'YYYY-MM-DD' 문자열을 'M월 D일 (요일)' 형식으로 변환합니다.
 */
function formatKoreanDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${m}월 ${d}일 (${weekdays[dt.getDay()]})`;
}

/**
 * 전남과학고등학교 3개 주요 건물 및 층별 2단 블록 그리드 평면도 구조 정의
 * - 모든 층은 '상단 구역(topRooms) · 중앙 복도 바 · 하단 구역(bottomRooms)'으로 구성되어
 *   칸 폭을 확보하고 실 이름의 세로 줄바꿈이나 겹침을 방지합니다.
 */
const BUILDINGS = {
  seongsil: {
    id: 'seongsil',
    name: '성실관',
    subtitle: '본관 · 1~4F',
    floors: {
      '1F': {
        label: '1F',
        corridorNote: '중앙 복도 · 동편 계단 / 서편 둥근 계단탑',
        topRooms: [
          { id: 'seongsil_1f_admin', name: '행정실' },
          { id: 'seongsil_1f_principal', name: '교장실' },
          { id: 'seongsil_1f_health', name: '보건실' },
          { id: 'seongsil_1f_meeting', name: '회의실' },
        ],
        bottomRooms: [
          { id: 'seongsil_1f_lobby', name: '중앙현관' },
          { id: 'seongsil_1f_ai', name: 'AI실' },
          { id: 'seongsil_1f_info', name: '정보실' },
          { id: 'seongsil_1f_coding', name: '코딩실', sub: '구 멀티실' },
          { id: 'seongsil_1f_cafeteria', name: '급식실' },
        ],
      },
      '2F': {
        label: '2F',
        corridorNote: '중앙 복도 · 우측 창의관 2층 연결통로',
        topRooms: [
          { id: 'seongsil_2f_teachers', name: '본교무실' },
          { id: 'seongsil_2f_research', name: '연구부실' },
          { id: 'seongsil_2f_safety', name: '학생안전부' },
          { id: 'seongsil_2f_career', name: '진로진학실' },
        ],
        bottomRooms: [
          { id: 'seongsil_2f_1_1', name: '1-1 교실' },
          { id: 'seongsil_2f_1_2', name: '1-2 교실' },
          { id: 'seongsil_2f_1_3', name: '1-3 교실' },
          { id: 'seongsil_2f_1_4', name: '1-4 교실' },
        ],
      },
      '3F': {
        label: '3F',
        corridorNote: '중앙 복도 · 2학년 학년실 및 면학실 구역',
        topRooms: [
          { id: 'seongsil_3f_grade2', name: '2학년부실' },
          { id: 'seongsil_3f_wee', name: '위클래스' },
          { id: 'seongsil_3f_study1', name: '정독실 1' },
          { id: 'seongsil_3f_study2', name: '정독실 2' },
        ],
        bottomRooms: [
          { id: 'seongsil_3f_2_1', name: '2-1 교실' },
          { id: 'seongsil_3f_2_2', name: '2-2 교실' },
          { id: 'seongsil_3f_2_3', name: '2-3 교실' },
          { id: 'seongsil_3f_2_4', name: '2-4 교실' },
        ],
      },
      '4F': {
        label: '4F',
        corridorNote: '중앙 복도 · 교과 전용실 및 3학년 교실 구역',
        topRooms: [
          { id: 'seongsil_4f_math1', name: '수학1실' },
          { id: 'seongsil_4f_math2', name: '수학2실' },
          { id: 'seongsil_4f_english', name: '영어전용실' },
          { id: 'seongsil_4f_seminar', name: '세미나실' },
        ],
        bottomRooms: [
          { id: 'seongsil_4f_3_1', name: '3-1 교실' },
          { id: 'seongsil_4f_3_2', name: '3-2 교실' },
          { id: 'seongsil_4f_3_3', name: '3-3 교실' },
          { id: 'seongsil_4f_humanities', name: '인문사회실' },
        ],
      },
    },
  },
  changui: {
    id: 'changui',
    name: '창의관',
    subtitle: '실험동 · 1~4F+옥상',
    floors: {
      '1F': {
        label: '1F',
        corridorNote: '중앙 복도 · 지구과학 및 메이커 공작 구역',
        topRooms: [
          { id: 'chang_1f_earth_lab', name: '지구과학실험실' },
          { id: 'chang_1f_planetarium', name: '천체투영실' },
          { id: 'chang_1f_basic_sci', name: '기초과학실' },
          { id: 'chang_1f_prep1', name: '실험준비실 1' },
        ],
        bottomRooms: [
          { id: 'chang_1f_lobby', name: '창의관 로비' },
          { id: 'chang_1f_maker', name: '메이커스페이스' },
          { id: 'chang_1f_3d', name: '3D프린터실' },
          { id: 'chang_1f_craft', name: '공작실' },
        ],
      },
      '2F': {
        label: '2F',
        corridorNote: '중앙 복도 · 좌측 성실관 2층 연결통로',
        topRooms: [
          { id: 'chang_2f_phys_lab', name: '물리실험실' },
          { id: 'chang_2f_phys_re', name: '물리 R&E실' },
          { id: 'chang_2f_optics', name: '광학·전자실' },
          { id: 'chang_2f_phys_prep', name: '물리준비실' },
        ],
        bottomRooms: [
          { id: 'chang_2f_sci_office', name: '과학교사 연구실' },
          { id: 'chang_2f_sem', name: '전자현미경실' },
          { id: 'chang_2f_equip', name: '첨단기자재실' },
          { id: 'chang_2f_seminar_a', name: '세미나실 A' },
        ],
      },
      '3F': {
        label: '3F',
        corridorNote: '중앙 복도 · 화학 및 생명과학 실험 구역',
        topRooms: [
          { id: 'chang_3f_chem_lab', name: '화학실험실' },
          { id: 'chang_3f_chem_re', name: '화학 R&E실' },
          { id: 'chang_3f_analysis', name: '기기분석실' },
          { id: 'chang_3f_chem_prep', name: '화학준비실' },
        ],
        bottomRooms: [
          { id: 'chang_3f_bio_lab', name: '생명과학실험실' },
          { id: 'chang_3f_bio_re', name: '생명 R&E실' },
          { id: 'chang_3f_culture', name: '무균배양실' },
          { id: 'chang_3f_bio_prep', name: '생명준비실' },
        ],
      },
      '4F': {
        label: '4F',
        corridorNote: '중앙 복도 · 도서관 및 융합 탐구 구역',
        topRooms: [
          { id: 'chang_4f_library', name: '도서관 (열람실)' },
          { id: 'chang_4f_media', name: '멀티미디어실' },
          { id: 'chang_4f_study1', name: '그룹스터디실 1' },
          { id: 'chang_4f_study2', name: '그룹스터디실 2' },
        ],
        bottomRooms: [
          { id: 'chang_4f_lecture', name: '대강의실' },
          { id: 'chang_4f_fusion', name: '융합탐구실' },
          { id: 'chang_4f_thesis', name: '논문자료실' },
          { id: 'chang_4f_lounge', name: '휴게라운지' },
        ],
      },
      옥상: {
        label: '옥상',
        corridorNote: '옥상 관측 데크 · 반원형 타워 상부 천문대',
        topRooms: [
          { id: 'chang_rf_dome', name: '주관측실 (천문대 돔)' },
          { id: 'chang_rf_sub_obs', name: '보조관측실' },
        ],
        bottomRooms: [
          { id: 'chang_rf_deck', name: '야외 천체관측 데크' },
          { id: 'chang_rf_weather', name: '기상관측소' },
        ],
      },
    },
  },
  seongchui: {
    id: 'seongchui',
    name: '성취관',
    subtitle: '강당 · 1~2F',
    floors: {
      '1F': {
        label: '1F',
        corridorNote: '중앙 복도 · 실내 체육 및 체력 단련 구역',
        topRooms: [
          { id: 'seongchui_1f_gym', name: '다목적 체육관' },
          { id: 'seongchui_1f_stage', name: '무대·음향실' },
        ],
        bottomRooms: [
          { id: 'seongchui_1f_fitness', name: '체력단련실' },
          { id: 'seongchui_1f_court', name: '탁구·배드민턴장' },
          { id: 'seongchui_1f_locker', name: '탈의·준비실' },
        ],
      },
      '2F': {
        label: '2F',
        corridorNote: '중앙 복도 · 예술 교과 및 동아리 활동 구역',
        topRooms: [
          { id: 'seongchui_2f_auditorium', name: '대강당 관람석' },
          { id: 'seongchui_2f_music', name: '음악실' },
        ],
        bottomRooms: [
          { id: 'seongchui_2f_art', name: '미술실' },
          { id: 'seongchui_2f_club1', name: '동아리 연습실 1' },
          { id: 'seongchui_2f_club2', name: '동아리 연습실 2' },
        ],
      },
    },
  },
};

/**
 * 전체 실 ID -> 메타데이터(건물명, 층, 실 이름) 빠른 조회용 사전 생성
 */
const ROOM_META_MAP = (() => {
  const map = {
    external: {
      id: 'external',
      buildingId: 'external',
      buildingName: '교외 활동',
      floor: '교외',
      name: '교외 지정 장소',
    },
  };
  Object.values(BUILDINGS).forEach((b) => {
    Object.entries(b.floors).forEach(([floorKey, floorObj]) => {
      [...floorObj.topRooms, ...floorObj.bottomRooms].forEach((r) => {
        map[r.id] = {
          ...r,
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
 * 과구리 비정형 장소 문자열을 표준 roomId로 매핑하기 위한 별칭 테이블
 */
const LOCATION_ALIAS_ENTRIES = [
  ['코딩실', 'seongsil_1f_coding'],
  ['멀티실', 'seongsil_1f_coding'],
  ['ai실', 'seongsil_1f_ai'],
  ['인공지능실', 'seongsil_1f_ai'],
  ['정보실', 'seongsil_1f_info'],
  ['중앙현관', 'seongsil_1f_lobby'],
  ['급식실', 'seongsil_1f_cafeteria'],
  ['행정실', 'seongsil_1f_admin'],
  ['보건실', 'seongsil_1f_health'],
  ['본교무실', 'seongsil_2f_teachers'],
  ['진로진학실', 'seongsil_2f_career'],
  ['1-1', 'seongsil_2f_1_1'],
  ['1-2', 'seongsil_2f_1_2'],
  ['1-3', 'seongsil_2f_1_3'],
  ['1-4', 'seongsil_2f_1_4'],
  ['정독실1', 'seongsil_3f_study1'],
  ['정독실2', 'seongsil_3f_study2'],
  ['2-1', 'seongsil_3f_2_1'],
  ['2-2', 'seongsil_3f_2_2'],
  ['2-3', 'seongsil_3f_2_3'],
  ['2-4', 'seongsil_3f_2_4'],
  ['수학1실', 'seongsil_4f_math1'],
  ['수학2실', 'seongsil_4f_math2'],
  ['영어전용실', 'seongsil_4f_english'],
  ['세미나실a', 'chang_2f_seminar_a'],
  ['세미나실', 'seongsil_4f_seminar'],
  ['3-1', 'seongsil_4f_3_1'],
  ['3-2', 'seongsil_4f_3_2'],
  ['3-3', 'seongsil_4f_3_3'],
  ['지구과학실험실', 'chang_1f_earth_lab'],
  ['지구과학실', 'chang_1f_earth_lab'],
  ['천체투영실', 'chang_1f_planetarium'],
  ['메이커스페이스', 'chang_1f_maker'],
  ['3d프린터실', 'chang_1f_3d'],
  ['공작실', 'chang_1f_craft'],
  ['물리r&e', 'chang_2f_phys_re'],
  ['물리실험실', 'chang_2f_phys_lab'],
  ['물리탐구실험', 'chang_2f_phys_lab'],
  ['광학', 'chang_2f_optics'],
  ['전자현미경', 'chang_2f_sem'],
  ['화학r&e', 'chang_3f_chem_re'],
  ['화학실험실', 'chang_3f_chem_lab'],
  ['기기분석실', 'chang_3f_analysis'],
  ['생명r&e', 'chang_3f_bio_re'],
  ['생명과학실험실', 'chang_3f_bio_lab'],
  ['생명과학실', 'chang_3f_bio_lab'],
  ['생물실험실', 'chang_3f_bio_lab'],
  ['무균배양실', 'chang_3f_culture'],
  ['도서관', 'chang_4f_library'],
  ['열람실', 'chang_4f_library'],
  ['멀티미디어실', 'chang_4f_media'],
  ['그룹스터디실1', 'chang_4f_study1'],
  ['그룹스터디실2', 'chang_4f_study2'],
  ['대강의실', 'chang_4f_lecture'],
  ['융합탐구실', 'chang_4f_fusion'],
  ['천문대', 'chang_rf_dome'],
  ['주관측실', 'chang_rf_dome'],
  ['관측데크', 'chang_rf_deck'],
  ['기상관측', 'chang_rf_weather'],
  ['체육관', 'seongchui_1f_gym'],
  ['체력단련실', 'seongchui_1f_fitness'],
  ['음악실', 'seongchui_2f_music'],
  ['미술실', 'seongchui_2f_art'],
  ['동아리연습실1', 'seongchui_2f_club1'],
  ['동아리연습실2', 'seongchui_2f_club2'],
];

/**
 * 장소 원문 텍스트를 표준 roomId로 변환합니다.
 */
function normalizeLocationToRoomId(rawLocation) {
  if (!rawLocation) return 'external';
  const cleaned = rawLocation.replace(/\s+/g, '').toLowerCase();
  if (cleaned.includes('교외') || cleaned.includes('전남대') || cleaned.includes('지스트') || cleaned.includes('gist')) {
    return 'external';
  }
  for (const [alias, roomId] of LOCATION_ALIAS_ENTRIES) {
    if (cleaned.includes(alias)) {
      return roomId;
    }
  }
  return 'external';
}

/**
 * 2026-11-16 ~ 2026-11-23 실제 과구리 탐활 데이터 27건 기본 내장 세트
 */
const INITIAL_RECORDS = [
  {
    id: 'rec-01',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '성실관 1층 코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '교내 탐구활동 공간 시각화 웹 서비스 개발 및 UI 설계',
    leader: '1117 조영우',
    members: '1114 이예지, 1310 서준혁',
    teacher: '김정보',
  },
  {
    id: 'rec-02',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '성실관 1층 코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '딥러닝 기반 음성 감정 인식 모델 경량화 연구',
    leader: '1111 이미엘',
    members: '1105 박지훈, 1208 최수민',
    teacher: '김정보',
  },
  {
    id: 'rec-03',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '초음파 간섭 무늬를 이용한 음속 정밀 측정 실험',
    leader: '2103 강민재',
    members: '2108 김도현, 2115 박서연, 2204 이준호',
    teacher: '최물리',
  },
  {
    id: 'rec-04',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '자기 부상 트랙에서의 와전류 감쇠 계수 분석',
    leader: '2209 윤서진',
    members: '2212 정우성, 2219 한지민, 2302 오태양',
    teacher: '최물리',
  },
  {
    id: 'rec-05',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리 탐구실험',
    roomId: 'chang_2f_phys_lab',
    topic: '편광판을 활용한 설탕물 농도별 선광도 측정',
    leader: '1203 김하늘',
    members: '1207 류지완, 1214 송민서, 1218 임재현',
    teacher: '최물리',
  },
  {
    id: 'rec-06',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '단진자 비선형 진동 주기 보정 모델 검증',
    leader: '2305 배수현',
    members: '2311 신동욱, 2316 유채원, 2320 장현우',
    teacher: '최물리',
  },
  {
    id: 'rec-07',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '열전소자(펠티어) 온도차에 따른 발전 효율 측정',
    leader: '1304 권나연',
    members: '1309 문성빈, 1315 백승우, 1319 조아라',
    teacher: '최물리',
  },
  {
    id: 'rec-08',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '회절 격자를 이용한 레이저 파장 및 미세 슬릿 폭 분석',
    leader: '2111 노진우',
    members: '2117 안소희, 2201 전민규',
    teacher: '최물리',
  },
  {
    id: 'rec-09',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 2층 물리실험실',
    roomId: 'chang_2f_phys_lab',
    topic: '유체 점성에 따른 낙하 구의 종단속도 비교 실험',
    leader: '1102 고은별',
    members: '1109 양시원, 1118 홍준기',
    teacher: '최물리',
  },
  {
    id: 'rec-10',
    date: '2026-11-16',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학',
    rawLocation: '창의관 3층 생명과학실',
    roomId: 'chang_3f_bio_lab',
    topic: '효모 발효 조건에 따른 이산화탄소 발생량 및 대사율 비교',
    leader: '2106 김서현',
    members: '2114 이다은, 2207 정현준',
    teacher: '박생명',
  },
  {
    id: 'rec-11',
    date: '2026-11-16',
    periods: ['2면학', '3면학'],
    timeText: '2026-11-16 (월) 2면학, 3면학',
    rawLocation: '성실관 4층 수학1실',
    roomId: 'seongsil_4f_math1',
    topic: '그래프 이론을 활용한 교내 최단 이동 동선 최적화 모델링',
    leader: '2215 최현서',
    members: '2218 한유진, 2308 김태윤',
    teacher: '이수학',
  },
  {
    id: 'rec-12',
    date: '2026-11-16',
    periods: ['1면학'],
    timeText: '2026-11-16 (월) 1면학',
    rawLocation: '성실관 3층 2-4반 교실',
    roomId: 'seongsil_3f_2_4',
    topic: '기후 데이터 시계열 분석을 통한 전남 지역 폭염 일수 예측',
    leader: '2401 강다인',
    members: '2405 김민준, 2412 박소율, 2417 최원준',
    teacher: '정담임',
  },
  {
    id: 'rec-13',
    date: '2026-11-16',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '2026-11-16 (월) 1면학, 2면학, 3면학',
    rawLocation: '전남대학교 사범대 (교외 활동)',
    roomId: 'external',
    topic: '대학 연계 R&E 위탁 실험: X선 회절 분석기(XRD) 시료 측정',
    leader: '2101 김준서',
    members: '2109 박지민, 2203 이수빈',
    teacher: '최물리',
  },
  {
    id: 'rec-14',
    date: '2026-11-17',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-17 (화) 1면학, 2면학',
    rawLocation: '성실관 1층 코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '과구리 탐활서 비정형 텍스트 정규표현식 파서 구현 및 테스트',
    leader: '1117 조영우',
    members: '1114 이예지, 1310 서준혁',
    teacher: '김정보',
  },
  {
    id: 'rec-15',
    date: '2026-11-17',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-17 (화) 1면학, 2면학',
    rawLocation: '창의관 3층 화학실험실',
    roomId: 'chang_3f_chem_lab',
    topic: '천연 지시약의 pH 구간별 흡광도 스펙트럼 정량 분석',
    leader: '2202 김나현',
    members: '2210 박시우, 2304 이도윤',
    teacher: '한화학',
  },
  {
    id: 'rec-16',
    date: '2026-11-17',
    periods: ['2면학', '3면학'],
    timeText: '2026-11-17 (화) 2면학, 3면학',
    rawLocation: '창의관 3층 화학실험실',
    roomId: 'chang_3f_chem_lab',
    topic: '전기분해 전압 변화에 따른 수소 기체 포집 효율 연구',
    leader: '1205 서지호',
    members: '1211 윤채린, 1216 장민혁',
    teacher: '한화학',
  },
  {
    id: 'rec-17',
    date: '2026-11-18',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-18 (수) 1면학, 2면학',
    rawLocation: '창의관 1층 지구과학실험실',
    roomId: 'chang_1f_earth_lab',
    topic: '편광현미경을 이용한 화성암 박편 광물 조성 판별',
    leader: '2301 강태훈',
    members: '2307 김유나, 2314 박성민',
    teacher: '오지구',
  },
  {
    id: 'rec-18',
    date: '2026-11-18',
    periods: ['2면학', '3면학'],
    timeText: '2026-11-18 (수) 2면학, 3면학',
    rawLocation: '창의관 옥상 주관측실 (천문대 돔)',
    roomId: 'chang_rf_dome',
    topic: 'CCD 카메라를 활용한 변광성 광도 곡선 관측 및 주기 산출',
    leader: '2112 이준혁',
    members: '2119 정서아, 2206 최민재',
    teacher: '오지구',
  },
  {
    id: 'rec-19',
    date: '2026-11-19',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-19 (목) 1면학, 2면학',
    rawLocation: '성실관 1층 AI실',
    roomId: 'seongsil_1f_ai',
    topic: '교내 학습 환경 데이터를 활용한 집중도 예측 머신러닝 실습',
    leader: '1111 이미엘',
    members: '1105 박지훈, 1208 최수민',
    teacher: '김정보',
  },
  {
    id: 'rec-20',
    date: '2026-11-19',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-19 (목) 1면학, 2면학',
    rawLocation: '성실관 1층 AI실',
    roomId: 'seongsil_1f_ai',
    topic: '합성곱 신경망(CNN) 기반 현미경 세포 이미지 자동 분류',
    leader: '2214 신예원',
    members: '2220 안지후, 2309 임수아',
    teacher: '김정보',
  },
  {
    id: 'rec-21',
    date: '2026-11-19',
    periods: ['2면학'],
    timeText: '2026-11-19 (목) 2면학',
    rawLocation: '창의관 4층 도서관 (열람실)',
    roomId: 'chang_4f_library',
    topic: '과학 고전 강독 및 과학기술 윤리 토론 자료 정리',
    leader: '1302 권도윤',
    members: '1308 문하은, 1317 백지훈',
    teacher: '송국어',
  },
  {
    id: 'rec-22',
    date: '2026-11-20',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-20 (금) 1면학, 2면학',
    rawLocation: '창의관 2층 물리 R&E실',
    roomId: 'chang_2f_phys_re',
    topic: '아두이노 자기장 센서를 이용한 솔레노이드 내부 자기장 분포 매핑',
    leader: '2103 강민재',
    members: '2108 김도현, 2115 박서연',
    teacher: '최물리',
  },
  {
    id: 'rec-23',
    date: '2026-11-20',
    periods: ['2면학', '3면학'],
    timeText: '2026-11-20 (금) 2면학, 3면학',
    rawLocation: '성실관 4층 세미나실',
    roomId: 'seongsil_4f_seminar',
    topic: '2026 전곽 SW경진대회 결과보고서 작성 및 발표 자료 구성',
    leader: '2401 강다인',
    members: '2405 김민준, 2412 박소율',
    teacher: '정담임',
  },
  {
    id: 'rec-24',
    date: '2026-11-21',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-21 (토) 1면학, 2면학',
    rawLocation: '창의관 3층 생명과학실험실',
    roomId: 'chang_3f_bio_lab',
    topic: '항생제 디스크 확산법을 이용한 천연 추출물 항균 활성 검증',
    leader: '2106 김서현',
    members: '2114 이다은, 2207 정현준',
    teacher: '박생명',
  },
  {
    id: 'rec-25',
    date: '2026-11-21',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-21 (토) 1면학, 2면학',
    rawLocation: '성취관 2층 음악실',
    roomId: 'seongchui_2f_music',
    topic: '현악기 공명통 재질에 따른 배음 주파수 스펙트럼 비교',
    leader: '1108 김지안',
    members: '1115 박하린, 1202 이서준',
    teacher: '윤예술',
  },
  {
    id: 'rec-26',
    date: '2026-11-22',
    periods: ['1면학', '2면학'],
    timeText: '2026-11-22 (일) 1면학, 2면학',
    rawLocation: '성실관 1층 코딩실',
    roomId: 'seongsil_1f_coding',
    topic: '과구리 탐활 현황 맵 최종 사용자 테스트 및 버그 수정',
    leader: '1117 조영우',
    members: '1114 이예지, 1310 서준혁',
    teacher: '김정보',
  },
  {
    id: 'rec-27',
    date: '2026-11-23',
    periods: ['1면학', '2면학', '3면학'],
    timeText: '2026-11-23 (월) 1면학, 2면학, 3면학',
    rawLocation: '전남대학교 사범대 (교외 활동)',
    roomId: 'external',
    topic: '대학 연계 R&E 최종 결과 세미나 및 시료 데이터 정리',
    leader: '2101 김준서',
    members: '2109 박지민, 2203 이수빈',
    teacher: '최물리',
  },
];

const STORAGE_KEY = 'gwaguri_tamhwal_records_v1';

/**
 * 과구리 '탐활서 확인' 게시판에서 복사한 비정형 텍스트를 파싱하여 레코드 배열로 변환합니다.
 * - 탭 구분 형식('활동시간\t값')과 줄바꿈 구분 형식('활동시간\n값')을 모두 지원합니다.
 */
function parseGwaguriClipboardText(rawText, fallbackDate) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const labelKeys = ['활동시간', '활동장소', '활동내용', '대표학생', '참가학생', '지도교사'];
  const parsedList = [];
  let current = null;
  let pendingLabel = null;

  const flushCurrent = () => {
    if (!current) return;
    if (current.timeText || current.rawLocation || current.leader || current.topic) {
      const dateMatch = (current.timeText || '').match(/(20\d{2})[-./](\d{1,2})[-./](\d{1,2})/);
      const extractedDate = dateMatch
        ? `${dateMatch[1]}-${String(dateMatch[2]).padStart(2, '0')}-${String(dateMatch[3]).padStart(2, '0')}`
        : fallbackDate;

      const periods = [];
      if (/1\s*면학/.test(current.timeText || '')) periods.push('1면학');
      if (/2\s*면학/.test(current.timeText || '')) periods.push('2면학');
      if (/3\s*면학/.test(current.timeText || '')) periods.push('3면학');
      if (periods.length === 0) periods.push('1면학', '2면학');

      const rawLoc = current.rawLocation || '장소 미지정';
      parsedList.push({
        id: `parsed-${Date.now()}-${parsedList.length}`,
        date: extractedDate,
        periods,
        timeText: current.timeText || `${extractedDate} ${periods.join(', ')}`,
        rawLocation: rawLoc,
        roomId: normalizeLocationToRoomId(rawLoc),
        topic: current.topic || '탐구활동 내역',
        leader: current.leader || '미상',
        members: current.members || '없음',
        teacher: current.teacher || '미지정',
      });
    }
    current = null;
    pendingLabel = null;
  };

  for (const line of lines) {
    // 1) "라벨\t값" 또는 "라벨 : 값" 형태 확인
    let matchedInline = false;
    for (const key of labelKeys) {
      const inlineRegex = new RegExp(`^${key}\\s*[:\\t]\\s*(.+)$`);
      const m = line.match(inlineRegex);
      if (m) {
        if (key === '활동시간' && current && (current.timeText || current.leader)) {
          flushCurrent();
        }
        if (!current) current = {};
        const val = m[1].trim();
        if (key === '활동시간') current.timeText = val;
        if (key === '활동장소') current.rawLocation = val;
        if (key === '활동내용') current.topic = val;
        if (key === '대표학생') current.leader = val;
        if (key === '참가학생') current.members = val;
        if (key === '지도교사') current.teacher = val;
        pendingLabel = null;
        matchedInline = true;
        break;
      }
    }
    if (matchedInline) continue;

    // 2) 단독 라벨 줄 ("활동시간" 다음 줄에 값이 나오는 형태)
    if (labelKeys.includes(line)) {
      if (line === '활동시간' && current && (current.timeText || current.leader)) {
        flushCurrent();
      }
      if (!current) current = {};
      pendingLabel = line;
      continue;
    }

    // 3) 직전 단독 라벨의 값 처리
    if (pendingLabel && current) {
      if (pendingLabel === '활동시간') current.timeText = line;
      if (pendingLabel === '활동장소') current.rawLocation = line;
      if (pendingLabel === '활동내용') current.topic = line;
      if (pendingLabel === '대표학생') current.leader = line;
      if (pendingLabel === '참가학생') current.members = line;
      if (pendingLabel === '지도교사') current.teacher = line;
      pendingLabel = null;
    }
  }

  flushCurrent();
  return parsedList;
}

/**
 * 한 팀의 인원 수(대표학생 1명 + 참가학생 수)를 계산합니다.
 */
function countTeamStudents(rec) {
  let count = rec.leader && rec.leader !== '미상' ? 1 : 0;
  if (rec.members && rec.members !== '없음' && rec.members !== '-') {
    const tokens = rec.members
      .split(/[,/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    count += tokens.length;
  }
  return count;
}

export default function App() {
  // 시스템 기준 '오늘' 날짜 상태 및 현재 조회 중인 날짜 상태 (초기값: 오늘 날짜 자동 설정)
  const [todayStr, setTodayStr] = useState(() => getLocalTodayStr());
  const [selectedDate, setSelectedDate] = useState(() => getLocalTodayStr());
  const [midnightNotice, setMidnightNotice] = useState('');

  // 최신 상태 참조용 Ref (자정 타이머 콜백에서 클로저 지연 없이 최신 값 비교)
  const todayRef = useRef(todayStr);
  const selectedDateRef = useRef(selectedDate);
  useEffect(() => {
    todayRef.current = todayStr;
  }, [todayStr]);
  useEffect(() => {
    selectedDateRef.current = selectedDate;
  }, [selectedDate]);

  /**
   * 밤 12시(00:00:00) 자동 다음 날 전환 타이머
   * - 정확한 자정 시각까지 남은 밀리초(ms)를 계산해 setTimeout을 걸고,
   *   브라우저 절전 모드/탭 비활성화 복귀 시에도 놓치지 않도록 15초 보조 폴링을 함께 수행합니다.
   */
  useEffect(() => {
    let midnightTimeoutId = null;

    const handleDayRolloverCheck = () => {
      const latestToday = getLocalTodayStr();
      const prevToday = todayRef.current;
      if (latestToday !== prevToday) {
        setTodayStr(latestToday);
        // 사용자가 기존 '오늘' 날짜를 보고 있었다면 자정 경과 시 자동으로 새 '오늘'로 이동
        if (selectedDateRef.current === prevToday) {
          setSelectedDate(latestToday);
        }
        setMidnightNotice(`자정(00:00)이 지나 날짜가 ${formatKoreanDate(latestToday)}로 자동 전환되었습니다.`);
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
      const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

      midnightTimeoutId = window.setTimeout(() => {
        handleDayRolloverCheck();
        scheduleNextMidnight();
      }, msUntilMidnight);
    };

    scheduleNextMidnight();
    const fallbackIntervalId = window.setInterval(handleDayRolloverCheck, 15000);
    window.addEventListener('focus', handleDayRolloverCheck);

    return () => {
      if (midnightTimeoutId) window.clearTimeout(midnightTimeoutId);
      window.clearInterval(fallbackIntervalId);
      window.removeEventListener('focus', handleDayRolloverCheck);
    };
  }, []);

  // 자정 전환 안내 메시지 6초 후 자동 숨김
  useEffect(() => {
    if (!midnightNotice) return;
    const t = window.setTimeout(() => setMidnightNotice(''), 6000);
    return () => window.clearTimeout(t);
  }, [midnightNotice]);

  // 탐활 데이터 상태 (localStorage 영속 연동)
  const [records, setRecords] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // 스토리지 접근 실패 시 기본 데이터 사용
    }
    return INITIAL_RECORDS;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
      // 스토리지 용량 초과 등 예외 무시
    }
  }, [records]);

  // UI 선택 및 필터 상태
  const [selectedBuildingId, setSelectedBuildingId] = useState('seongsil');
  const [selectedFloor, setSelectedFloor] = useState('1F');
  const [selectedRoomId, setSelectedRoomId] = useState('seongsil_1f_coding');
  const [periodFilter, setPeriodFilter] = useState('ALL'); // 'ALL' | '1면학' | '2면학' | '3면학'
  const [searchQuery, setSearchQuery] = useState('');

  // 월간 달력 팝오버 상태
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const [y, m] = getLocalTodayStr().split('-').map(Number);
    return { year: y, month: m };
  });

  // 클립보드 붙여넣기 모달 상태
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [pasteFeedback, setPasteFeedback] = useState(null);

  // 선택된 날짜가 바뀌면 달력 기준 연·월도 동기화
  useEffect(() => {
    const [y, m] = selectedDate.split('-').map(Number);
    setCalendarMonth({ year: y, month: m });
  }, [selectedDate]);

  // 건물 전환 시 해당 건물의 첫 번째 층으로 자동 맞춤
  const handleSelectBuilding = (bId) => {
    setSelectedBuildingId(bId);
    const floorKeys = Object.keys(BUILDINGS[bId].floors);
    const nextFloor = floorKeys.includes(selectedFloor) ? selectedFloor : floorKeys[0];
    setSelectedFloor(nextFloor);
    const firstRoom =
      BUILDINGS[bId].floors[nextFloor].bottomRooms[0] ||
      BUILDINGS[bId].floors[nextFloor].topRooms[0];
    if (firstRoom) setSelectedRoomId(firstRoom.id);
  };

  // 층 전환 시 해당 층의 대표 실 자동 선택
  const handleSelectFloor = (floorKey) => {
    setSelectedFloor(floorKey);
    const floorObj = BUILDINGS[selectedBuildingId].floors[floorKey];
    if (floorObj) {
      const candidate = floorObj.topRooms[0] || floorObj.bottomRooms[0];
      if (candidate) setSelectedRoomId(candidate.id);
    }
  };

  // 선택된 날짜 + 시간대 필터가 적용된 탐활 목록
  const activeRecords = useMemo(() => {
    return records.filter((rec) => {
      if (rec.date !== selectedDate) return false;
      if (periodFilter !== 'ALL' && !rec.periods.includes(periodFilter)) return false;
      return true;
    });
  }, [records, selectedDate, periodFilter]);

  // 검색어 매칭 ID 집합
  const matchedRecordIds = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set();
    const set = new Set();
    activeRecords.forEach((rec) => {
      const roomMeta = ROOM_META_MAP[rec.roomId];
      const hay = [
        rec.leader,
        rec.members,
        rec.topic,
        rec.teacher,
        rec.rawLocation,
        roomMeta?.name || '',
        roomMeta?.buildingName || '',
      ]
        .join(' ')
        .toLowerCase();
      if (hay.includes(q)) set.add(rec.id);
    });
    return set;
  }, [activeRecords, searchQuery]);

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
    const roomEntries = Object.entries(recordsByRoom);
    const usedRoomCount = roomEntries.length;
    const conflictRoomCount = roomEntries.filter(([, list]) => list.length >= 2).length;
    return {
      totalCount: activeRecords.length,
      usedRoomCount,
      conflictRoomCount,
    };
  }, [activeRecords, recordsByRoom]);

  // 건물별 실시간 상태 요약 배지 계산
  const buildingSummaries = useMemo(() => {
    const result = {};
    Object.keys(BUILDINGS).forEach((bId) => {
      let teamCount = 0;
      let conflictRooms = 0;
      Object.entries(recordsByRoom).forEach(([rId, list]) => {
        const meta = ROOM_META_MAP[rId];
        if (meta && meta.buildingId === bId) {
          teamCount += list.length;
          if (list.length >= 2) conflictRooms += 1;
        }
      });
      result[bId] = { teamCount, conflictRooms };
    });
    return result;
  }, [recordsByRoom]);

  // 날짜별 전체 등록 건수 (달력 점 표시용)
  const countByDate = useMemo(() => {
    const map = {};
    records.forEach((r) => {
      map[r.date] = (map[r.date] || 0) + 1;
    });
    return map;
  }, [records]);

  // 현재 선택된 실의 상세 정보 및 배정 팀 목록
  const selectedRoomMeta = ROOM_META_MAP[selectedRoomId] || {
    id: selectedRoomId,
    buildingName: '성실관',
    floor: '1F',
    name: '코딩실',
  };
  const selectedRoomRecords = recordsByRoom[selectedRoomId] || [];
  const selectedRoomStudentCount = selectedRoomRecords.reduce(
    (acc, r) => acc + countTeamStudents(r),
    0
  );

  // 달력 그리드 생성
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth;
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ day: d, dateStr });
    }
    return cells;
  }, [calendarMonth]);

  // 붙여넣기 실행 핸들러
  const handleApplyPaste = () => {
    const parsed = parseGwaguriClipboardText(pasteInput, selectedDate);
    if (parsed.length === 0) {
      setPasteFeedback({
        type: 'error',
        text: '인식된 탐활 내역이 없습니다. 과구리 [탐활서 확인] 표의 내용을 복사해 붙여넣어 주세요.',
      });
      return;
    }

    setRecords((prev) => [...parsed, ...prev]);
    setSelectedDate(parsed[0].date);
    const firstRoomMeta = ROOM_META_MAP[parsed[0].roomId];
    if (firstRoomMeta && firstRoomMeta.buildingId !== 'external') {
      setSelectedBuildingId(firstRoomMeta.buildingId);
      setSelectedFloor(firstRoomMeta.floor);
      setSelectedRoomId(firstRoomMeta.id);
    } else {
      setSelectedRoomId('external');
    }

    setPasteFeedback({
      type: 'success',
      text: `총 ${parsed.length}건의 탐활 내역을 자동 분석하여 평면도에 반영했습니다.`,
    });
    setPasteInput('');
  };

  // 기본 샘플 27건 복원
  const handleResetDemoData = () => {
    setRecords(INITIAL_RECORDS);
    setPasteFeedback({
      type: 'success',
      text: '기본 과구리 탐활 데이터(27건)로 복원되었습니다.',
    });
  };

  const currentBuilding = BUILDINGS[selectedBuildingId];
  const currentFloorObj = currentBuilding.floors[selectedFloor];
  const externalRecords = recordsByRoom.external || [];

  // 개별 실 카드 렌더링 함수
  const renderRoomCard = (room) => {
    const list = recordsByRoom[room.id] || [];
    const teamCount = list.length;
    const studentSum = list.reduce((sum, item) => sum + countTeamStudents(item), 0);
    const isSelected = selectedRoomId === room.id;
    const hasSearchHit =
      searchQuery.trim() !== '' && list.some((item) => matchedRecordIds.has(item.id));

    let cardStyle = 'bg-white border-[#d8d8d8] text-[#222222] hover:border-[#7ea69b]';
    let badgeNode = (
      <span className="inline-block text-[11px] text-[#888888] bg-[#f5f5f5] px-1.5 py-0.5 rounded">
        비어 있음
      </span>
    );

    if (teamCount === 1) {
      cardStyle = 'bg-[#eef6f4] border-[#7ea69b] text-[#1d3b33] hover:bg-[#e3f1ed]';
      badgeNode = (
        <span className="inline-block text-[11px] font-semibold text-white bg-[#7ea69b] px-1.5 py-0.5 rounded">
          1팀 ({studentSum}명)
        </span>
      );
    } else if (teamCount >= 2) {
      cardStyle = 'bg-[#fff4ec] border-[#d97736] text-[#7c2d12] hover:bg-[#ffeadc]';
      badgeNode = (
        <span className="inline-block text-[11px] font-semibold text-white bg-[#d97736] px-1.5 py-0.5 rounded">
          {teamCount}팀 중복 ({studentSum}명)
        </span>
      );
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => setSelectedRoomId(room.id)}
        className={`w-full text-left border rounded px-3 py-2.5 transition-all flex flex-col justify-between min-h-[76px] ${cardStyle} ${
          isSelected ? 'ring-2 ring-[#222222] shadow-sm' : ''
        } ${hasSearchHit ? 'outline outline-2 outline-offset-1 outline-[#2563eb]' : ''}`}
      >
        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0">
            <div className="text-[13px] font-bold leading-snug whitespace-nowrap truncate">
              {room.name}
            </div>
            {room.sub && (
              <div className="text-[11px] text-[#666666] leading-tight mt-0.5 whitespace-nowrap">
                ({room.sub})
              </div>
            )}
          </div>
          {hasSearchHit && (
            <span className="shrink-0 text-[10px] font-bold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe] px-1 rounded">
              일치
            </span>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between gap-1">
          {badgeNode}
          {teamCount > 0 && (
            <span className="text-[11px] text-[#555555] truncate max-w-[90px]">
              {list[0].leader.split(' ')[1] || list[0].leader}
              {teamCount > 1 ? ` 외 ${teamCount - 1}팀` : ''}
            </span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div
      className="min-h-screen bg-[#f7f8f8] text-[#222222]"
      style={{ fontFamily: "'Noto Sans KR', '맑은 고딕', 'Malgun Gothic', sans-serif" }}
    >
      {/* 1. 과구리 공식 상단 민트 헤더 */}
      <header className="bg-[#7ea69b] text-white border-b border-[#6d9489]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm overflow-hidden">
            <span className="font-bold text-[17px] tracking-tight whitespace-nowrap">
              과구리
            </span>
            <span className="text-white/50">|</span>
            <span className="text-white/90 text-xs sm:text-sm whitespace-nowrap">소개</span>
            <span className="text-white/50 hidden sm:inline">|</span>
            <span className="text-white/95 text-xs sm:text-sm truncate hidden sm:inline">
              학생부 전산시스템 · 공용 탐활 공간 현황
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setPasteFeedback(null);
                setIsPasteModalOpen(true);
              }}
              className="bg-white text-[#2b5449] hover:bg-[#f0f7f5] font-semibold text-xs px-3 py-1.5 rounded border border-[#5e857a] transition-colors whitespace-nowrap"
            >
              + 탐활서 데이터 붙여넣기
            </button>
          </div>
        </div>
      </header>

      {/* 2. 과구리 2줄 GNB 메뉴바 */}
      <nav className="bg-white border-b border-[#dcdcdc]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-2">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-y-1.5 text-center text-[12px] sm:text-[13px]">
            {[
              { label: '공지사항', active: false },
              { label: '급식식단', active: false },
              { label: '학사일정', active: false },
              { label: '탐활서 작성', active: false },
              { label: '탐활서 확인', active: false },
              { label: '탐활 현황 맵', active: true },
              { label: '특별실 안내', active: false },
              { label: '외출·외박', active: false },
              { label: '상벌점 조회', active: false },
              { label: '기숙사 호실', active: false },
            ].map((menu) => (
              <div
                key={menu.label}
                className={`py-1 px-1 rounded whitespace-nowrap ${
                  menu.active
                    ? 'font-bold text-[#2b5449] bg-[#eef6f4] border border-[#b9d4cd]'
                    : 'text-[#555555] hover:text-[#222222]'
                }`}
              >
                {menu.label}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* 메인 콘텐츠 컨테이너 */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5">
        {/* 자정(00:00) 자동 날짜 전환 알림 배너 (자정 경과 시에만 일시 표시) */}
        {midnightNotice && (
          <div className="mb-3 px-3.5 py-2 bg-[#eef6f4] border border-[#7ea69b] text-[#1f3b34] text-xs rounded flex items-center justify-between">
            <span>{midnightNotice}</span>
            <button
              type="button"
              onClick={() => setMidnightNotice('')}
              className="text-[#4a6b62] hover:text-[#222222] font-bold ml-3"
            >
              닫기
            </button>
          </div>
        )}

        {/* 3. 페이지 타이틀 및 굵은 하단 구분선 */}
        <div className="pb-3 mb-4 border-b-2 border-[#222222] flex flex-wrap items-end justify-between gap-2">
          <div>
            <h1 className="text-[20px] sm:text-[22px] font-bold text-[#222222] tracking-tight">
              탐활 현황 맵
            </h1>
            <p className="text-xs text-[#666666] mt-0.5">
              성실관·창의관·성취관 층별 탐구활동 배정 현황을 실시간으로 확인합니다. (자정 00:00 자동 날짜 갱신)
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#444444]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-white border border-[#cccccc] inline-block" />
              비어 있음
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#eef6f4] border border-[#7ea69b] inline-block" />
              1팀 사용 중
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#fff4ec] border border-[#d97736] inline-block" />
              2팀 이상 중복
            </span>
          </div>
        </div>

        {/* 4. 날짜 이동 · 요약 통계 · 시간 필터 · 통합 검색 바 */}
        <section className="bg-white border border-[#d8d8d8] rounded p-3.5 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* 좌측: 날짜 선택기 + 오늘 버튼 + 요약 통계 */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative flex items-center border border-[#cccccc] rounded bg-white">
                <button
                  type="button"
                  aria-label="이전 날짜"
                  onClick={() => setSelectedDate((d) => shiftDateStr(d, -1))}
                  className="px-2.5 py-1.5 text-sm font-bold text-[#444444] hover:bg-[#f2f2f2] border-r border-[#e0e0e0]"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((o) => !o)}
                  className="px-3 py-1.5 text-sm font-bold text-[#222222] hover:bg-[#f9f9f9] flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>{formatKoreanDate(selectedDate)}</span>
                  {selectedDate === todayStr && (
                    <span className="text-[11px] font-semibold text-[#2b5449] bg-[#eef6f4] border border-[#b9d4cd] px-1.5 py-0.2 rounded">
                      오늘
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  aria-label="다음 날짜"
                  onClick={() => setSelectedDate((d) => shiftDateStr(d, 1))}
                  className="px-2.5 py-1.5 text-sm font-bold text-[#444444] hover:bg-[#f2f2f2] border-l border-[#e0e0e0]"
                >
                  &gt;
                </button>

                {/* 월간 달력 팝오버 */}
                {isCalendarOpen && (
                  <div className="absolute left-0 top-full mt-1.5 z-30 w-[272px] bg-white border border-[#bbbbbb] rounded shadow-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarMonth((prev) =>
                            prev.month === 1
                              ? { year: prev.year - 1, month: 12 }
                              : { year: prev.year, month: prev.month - 1 }
                          )
                        }
                        className="px-2 py-0.5 text-xs border border-[#dddddd] rounded hover:bg-[#f5f5f5]"
                      >
                        이전달
                      </button>
                      <span className="text-xs font-bold text-[#222222]">
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
                        className="px-2 py-0.5 text-xs border border-[#dddddd] rounded hover:bg-[#f5f5f5]"
                      >
                        다음달
                      </button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-[11px] text-[#777777] mb-1">
                      <span>일</span>
                      <span>월</span>
                      <span>화</span>
                      <span>수</span>
                      <span>목</span>
                      <span>금</span>
                      <span>토</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                      {calendarDays.map((cell, idx) => {
                        if (!cell) return <div key={`empty-${idx}`} />;
                        const isSel = cell.dateStr === selectedDate;
                        const isTod = cell.dateStr === todayStr;
                        const hasItems = (countByDate[cell.dateStr] || 0) > 0;
                        return (
                          <button
                            key={cell.dateStr}
                            type="button"
                            onClick={() => {
                              setSelectedDate(cell.dateStr);
                              setIsCalendarOpen(false);
                            }}
                            className={`py-1 rounded flex flex-col items-center justify-center ${
                              isSel
                                ? 'bg-[#7ea69b] text-white font-bold'
                                : isTod
                                ? 'border border-[#7ea69b] text-[#2b5449] font-bold'
                                : 'hover:bg-[#f2f2f2] text-[#333333]'
                            }`}
                          >
                            <span>{cell.day}</span>
                            <span
                              className={`w-1 h-1 rounded-full mt-0.5 ${
                                hasItems
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

              <button
                type="button"
                onClick={() => {
                  const latestToday = getLocalTodayStr();
                  setTodayStr(latestToday);
                  setSelectedDate(latestToday);
                  setIsCalendarOpen(false);
                }}
                className="px-2.5 py-1.5 text-xs font-semibold border border-[#cccccc] rounded bg-[#f8f9fa] hover:bg-[#eef6f4] hover:border-[#7ea69b] text-[#333333] whitespace-nowrap"
              >
                오늘
              </button>

              <div className="h-4 w-[1px] bg-[#dddddd] hidden sm:block" />

              {/* 요약 통계 텍스트 */}
              <div className="text-xs sm:text-[13px] text-[#333333] flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>
                  전체 탐활 <strong className="text-[#222222]">{summaryStats.totalCount}건</strong>
                </span>
                <span className="text-[#cccccc]">|</span>
                <span>
                  사용 중인 실{' '}
                  <strong className="text-[#2b5449]">{summaryStats.usedRoomCount}곳</strong>
                </span>
                <span className="text-[#cccccc]">|</span>
                <span>
                  중복 사용실{' '}
                  <strong
                    className={
                      summaryStats.conflictRoomCount > 0 ? 'text-[#d97736]' : 'text-[#222222]'
                    }
                  >
                    {summaryStats.conflictRoomCount}곳
                  </strong>
                </span>
              </div>
            </div>

            {/* 우측: 시간대 필터 + 통합 검색창 */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded border border-[#cccccc] overflow-hidden text-xs">
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
                    className={`px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors ${
                      periodFilter === tab.key
                        ? 'bg-[#7ea69b] text-white font-semibold'
                        : 'bg-white text-[#444444] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 sm:flex-initial min-w-[210px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="학번·이름·주제·실 이름 검색"
                  className="w-full text-xs border border-[#cccccc] rounded px-3 py-1.5 pr-7 focus:outline-none focus:border-[#7ea69b]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#888888] hover:text-[#222222]"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 검색어 입력 시 매칭 결과 빠른 이동 바 */}
          {searchQuery.trim() !== '' && (
            <div className="mt-2.5 pt-2.5 border-t border-[#eeeeee] flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[#2563eb]">
                검색 결과 {matchedRecordIds.size}건:
              </span>
              {matchedRecordIds.size === 0 ? (
                <span className="text-[#777777]">
                  선택된 날짜({formatKoreanDate(selectedDate)})에 일치하는 탐활 내역이 없습니다.
                </span>
              ) : (
                activeRecords
                  .filter((r) => matchedRecordIds.has(r.id))
                  .map((r) => {
                    const meta = ROOM_META_MAP[r.roomId];
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          if (meta && meta.buildingId !== 'external') {
                            setSelectedBuildingId(meta.buildingId);
                            setSelectedFloor(meta.floor);
                            setSelectedRoomId(meta.id);
                          } else {
                            setSelectedRoomId('external');
                          }
                        }}
                        className="px-2 py-0.5 rounded bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] hover:bg-[#dbeafe]"
                      >
                        {r.leader} · {meta ? `${meta.buildingName} ${meta.name}` : r.rawLocation}
                      </button>
                    );
                  })
              )}
            </div>
          )}
        </section>

        {/* 5. 전남과학고등학교 실제 전경 기반 캠퍼스 SVG 지도 */}
        <section className="bg-white border border-[#d8d8d8] rounded p-3.5 mb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#222222]">
                전남과학고등학교 캠퍼스 전경 지도
              </h2>
              <span className="text-xs text-[#666666]">
                (건물을 클릭하면 아래 층별 평면도가 전환됩니다)
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              {Object.values(BUILDINGS).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => handleSelectBuilding(b.id)}
                  className={`px-2.5 py-1 rounded border font-semibold transition-colors ${
                    selectedBuildingId === b.id
                      ? 'bg-[#222222] text-white border-[#222222]'
                      : 'bg-white text-[#444444] border-[#cccccc] hover:bg-[#f4f4f4]'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full overflow-hidden rounded border border-[#e2e8f0] bg-[#eef5f9]">
            <svg
              viewBox="0 0 1120 310"
              className="w-full h-auto block select-none"
              role="img"
              aria-label="전남과학고등학교 성실관, 창의관, 성취관 및 운동장 전경 지도"
            >
              {/* 하늘 및 원경 산세 */}
              <defs>
                <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dfeef7" />
                  <stop offset="100%" stopColor="#f4f8fb" />
                </linearGradient>
                <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#69a85d" />
                  <stop offset="100%" stopColor="#55924a" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="1120" height="225" fill="url(#skyGrad)" />
              <path
                d="M0,185 Q180,125 380,170 T780,150 T1120,175 L1120,225 L0,225 Z"
                fill="#cfe0d5"
                opacity="0.7"
              />

              {/* 전경 도로 및 푸른 잔디 운동장 */}
              <rect x="0" y="218" width="1120" height="18" fill="#d6d9dc" />
              <rect x="40" y="236" width="1040" height="66" rx="14" fill="url(#grassGrad)" />
              {/* 운동장 트랙 및 중앙선 */}
              <rect
                x="62"
                y="243"
                width="996"
                height="52"
                rx="10"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.85"
              />
              <line
                x1="560"
                y1="243"
                x2="560"
                y2="295"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.85"
              />
              <circle
                cx="560"
                cy="269"
                r="14"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                opacity="0.85"
              />
              {/* 좌측 하얀 축구 골대 */}
              <g stroke="#ffffff" strokeWidth="2.5" fill="none">
                <rect x="74" y="258" width="14" height="22" />
                <line x1="74" y1="258" x2="68" y2="262" />
                <line x1="74" y1="280" x2="68" y2="276" />
                <line x1="68" y1="262" x2="68" y2="276" />
              </g>
              {/* 우측 하얀 축구 골대 */}
              <g stroke="#ffffff" strokeWidth="2.5" fill="none">
                <rect x="1032" y="258" width="14" height="22" />
                <line x1="1046" y1="258" x2="1052" y2="262" />
                <line x1="1046" y1="280" x2="1052" y2="276" />
                <line x1="1052" y1="262" x2="1052" y2="276" />
              </g>

              {/* ================= 1. 성실관 (본관 1~4F) ================= */}
              <g
                onClick={() => handleSelectBuilding('seongsil')}
                className="cursor-pointer"
              >
                {/* 선택 외곽선 */}
                {selectedBuildingId === 'seongsil' && (
                  <rect
                    x="56"
                    y="62"
                    width="398"
                    height="160"
                    rx="6"
                    fill="none"
                    stroke="#222222"
                    strokeWidth="3"
                  />
                )}
                {/* 본관 붉은 벽돌 몸체 */}
                <rect x="88" y="70" width="358" height="148" fill="#a84b40" stroke="#7c342b" strokeWidth="1.5" />
                {/* 좌측 둥근 계단탑 */}
                <rect x="64" y="66" width="34" height="152" rx="14" fill="#b9584c" stroke="#7c342b" strokeWidth="1.5" />
                <rect x="73" y="78" width="16" height="126" rx="6" fill="#9bc2d9" stroke="#f4efe6" strokeWidth="1.5" />

                {/* 층별 아이보리 수평띠 (4층~1층) */}
                <rect x="88" y="68" width="358" height="7" fill="#f4efe6" />
                <rect x="88" y="103" width="358" height="6" fill="#f4efe6" />
                <rect x="88" y="138" width="358" height="6" fill="#f4efe6" />
                <rect x="88" y="173" width="358" height="6" fill="#f4efe6" />

                {/* 창문 그리드 */}
                {[78, 113, 148].map((wy, rowIdx) =>
                  [110, 144, 178, 212, 304, 338, 372, 406].map((wx, colIdx) => (
                    <rect
                      key={`ss-w-${rowIdx}-${colIdx}`}
                      x={wx}
                      y={wy}
                      width="24"
                      height="19"
                      rx="1.5"
                      fill="#cfe5f2"
                      stroke="#f4efe6"
                      strokeWidth="1.2"
                    />
                  ))
                )}

                {/* 중앙현관 하얀 기둥 열주 포치 */}
                <rect x="242" y="142" width="54" height="76" fill="#f4efe6" stroke="#c8c2b8" strokeWidth="1.2" />
                <rect x="248" y="150" width="6" height="68" fill="#ffffff" />
                <rect x="260" y="150" width="6" height="68" fill="#ffffff" />
                <rect x="272" y="150" width="6" height="68" fill="#ffffff" />
                <rect x="284" y="150" width="6" height="68" fill="#ffffff" />
                <rect x="256" y="188" width="26" height="30" fill="#4f6d7a" />

                {/* 성실관 상단 상태 배지 */}
                {(() => {
                  const st = buildingSummaries.seongsil;
                  const isConflict = st.conflictRooms > 0;
                  const isUsed = st.teamCount > 0;
                  const badgeBg = isConflict ? '#d97736' : isUsed ? '#7ea69b' : '#4b5563';
                  const badgeText = isConflict
                    ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teamCount}팀`
                    : isUsed
                    ? `${st.teamCount}팀 사용 중`
                    : '현재 비어 있음';
                  return (
                    <g transform="translate(152, 16)">
                      <rect x="0" y="0" width="212" height="40" rx="6" fill="#ffffff" stroke={badgeBg} strokeWidth="2" />
                      <text x="106" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#222222">
                        성실관 (본관 1~4F)
                      </text>
                      <rect x="16" y="21" width="180" height="15" rx="3" fill={badgeBg} />
                      <text x="106" y="32" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ffffff">
                        {badgeText}
                      </text>
                    </g>
                  );
                })()}
              </g>

              {/* ================= 2층 연결통로 (성실관 <-> 창의관) ================= */}
              <g>
                <rect x="446" y="142" width="46" height="26" fill="#dce7ed" stroke="#8fa6b2" strokeWidth="1.5" />
                <line x1="456" y1="142" x2="456" y2="168" stroke="#8fa6b2" strokeWidth="1.2" />
                <line x1="469" y1="142" x2="469" y2="168" stroke="#8fa6b2" strokeWidth="1.2" />
                <line x1="482" y1="142" x2="482" y2="168" stroke="#8fa6b2" strokeWidth="1.2" />
                <text x="469" y="136" textAnchor="middle" fontSize="9.5" fontWeight="600" fill="#475569">
                  2층 연결통로
                </text>
              </g>

              {/* ================= 2. 창의관 (실험동 1~4F + 옥상 천문대 돔) ================= */}
              <g
                onClick={() => handleSelectBuilding('changui')}
                className="cursor-pointer"
              >
                {selectedBuildingId === 'changui' && (
                  <rect
                    x="488"
                    y="32"
                    width="344"
                    height="190"
                    rx="6"
                    fill="none"
                    stroke="#222222"
                    strokeWidth="3"
                  />
                )}

                {/* 옥상 천문대 돔 (반원형 타워 상부) */}
                <path
                  d="M524,68 A26,24 0 0,1 576,68 Z"
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
                <path d="M548,44 L548,68" stroke="#94a3b8" strokeWidth="1.5" />

                {/* 창의관 본체 */}
                <rect x="494" y="68" width="332" height="150" fill="#e5e9ec" stroke="#8c9ba5" strokeWidth="1.5" />

                {/* 좌측 반원형 통유리 타워 */}
                <rect x="514" y="68" width="72" height="150" rx="8" fill="#8bbcd6" stroke="#5c8ca6" strokeWidth="1.5" />
                {[96, 128, 160, 190].map((ly) => (
                  <line key={`gl-${ly}`} x1="514" y1={ly} x2="586" y2={ly} stroke="#e2f1f8" strokeWidth="2" />
                ))}
                <line x1="538" y1="68" x2="538" y2="218" stroke="#e2f1f8" strokeWidth="1.5" />
                <line x1="562" y1="68" x2="562" y2="218" stroke="#e2f1f8" strokeWidth="1.5" />

                {/* 실험동 우측 실험실 창문 그리드 */}
                {[78, 113, 148, 183].map((wy, rIdx) =>
                  [602, 646, 690, 734, 778].map((wx, cIdx) => (
                    <rect
                      key={`cg-w-${rIdx}-${cIdx}`}
                      x={wx}
                      y={wy}
                      width="34"
                      height="21"
                      rx="1.5"
                      fill="#b8d9eb"
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                  ))
                )}

                {/* 창의관 상단 상태 배지 */}
                {(() => {
                  const st = buildingSummaries.changui;
                  const isConflict = st.conflictRooms > 0;
                  const isUsed = st.teamCount > 0;
                  const badgeBg = isConflict ? '#d97736' : isUsed ? '#7ea69b' : '#4b5563';
                  const badgeText = isConflict
                    ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teamCount}팀`
                    : isUsed
                    ? `${st.teamCount}팀 사용 중`
                    : '현재 비어 있음';
                  return (
                    <g transform="translate(592, 16)">
                      <rect x="0" y="0" width="224" height="40" rx="6" fill="#ffffff" stroke={badgeBg} strokeWidth="2" />
                      <text x="112" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#222222">
                        창의관 (실험동 1~4F+옥상)
                      </text>
                      <rect x="16" y="21" width="192" height="15" rx="3" fill={badgeBg} />
                      <text x="112" y="32" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ffffff">
                        {badgeText}
                      </text>
                    </g>
                  );
                })()}
              </g>

              {/* ================= 3. 성취관 (강당 1~2F) ================= */}
              <g
                onClick={() => handleSelectBuilding('seongchui')}
                className="cursor-pointer"
              >
                {selectedBuildingId === 'seongchui' && (
                  <rect
                    x="854"
                    y="92"
                    width="212"
                    height="130"
                    rx="6"
                    fill="none"
                    stroke="#222222"
                    strokeWidth="3"
                  />
                )}
                {/* 박공/단차 지붕 */}
                <polygon
                  points="860,114 960,94 1060,114"
                  fill="#64748b"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                {/* 성취관 외벽 */}
                <rect x="862" y="114" width="196" height="104" fill="#d9cfc1" stroke="#9e9282" strokeWidth="1.5" />
                <rect x="862" y="162" width="196" height="6" fill="#f4efe6" />
                {/* 강당 세로형 대형 창문 */}
                {[882, 916, 950, 984, 1018].map((wx, idx) => (
                  <g key={`sc-w-${idx}`}>
                    <rect x={wx} y="124" width="22" height="30" rx="2" fill="#b8d9eb" stroke="#ffffff" strokeWidth="1.2" />
                    <rect x={wx} y="174" width="22" height="30" rx="2" fill="#b8d9eb" stroke="#ffffff" strokeWidth="1.2" />
                  </g>
                ))}

                {/* 성취관 상단 상태 배지 */}
                {(() => {
                  const st = buildingSummaries.seongchui;
                  const isConflict = st.conflictRooms > 0;
                  const isUsed = st.teamCount > 0;
                  const badgeBg = isConflict ? '#d97736' : isUsed ? '#7ea69b' : '#4b5563';
                  const badgeText = isConflict
                    ? `중복 사용실 ${st.conflictRooms}곳 · ${st.teamCount}팀`
                    : isUsed
                    ? `${st.teamCount}팀 사용 중`
                    : '현재 비어 있음';
                  return (
                    <g transform="translate(860, 42)">
                      <rect x="0" y="0" width="200" height="40" rx="6" fill="#ffffff" stroke={badgeBg} strokeWidth="2" />
                      <text x="100" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="#222222">
                        성취관 (강당 1~2F)
                      </text>
                      <rect x="14" y="21" width="172" height="15" rx="3" fill={badgeBg} />
                      <text x="100" y="32" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#ffffff">
                        {badgeText}
                      </text>
                    </g>
                  );
                })()}
              </g>
            </svg>
          </div>
        </section>

        {/* 6. 좌측 층별 2단 블록 그리드 평면도 + 우측 과구리 표준 2열 상세 테이블 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* 좌측 7컬럼: 건물·층별 2단 블록 그리드 평면도 */}
          <div className="lg:col-span-7 bg-white border border-[#d8d8d8] rounded p-4">
            {/* 건물 탭 & 층 선택 탭 */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#e5e5e5]">
              <div className="flex items-center gap-1.5">
                {Object.values(BUILDINGS).map((b) => {
                  const st = buildingSummaries[b.id];
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleSelectBuilding(b.id)}
                      className={`px-3 py-1.5 rounded text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 ${
                        selectedBuildingId === b.id
                          ? 'bg-[#7ea69b] text-white'
                          : 'bg-[#f3f4f6] text-[#444444] hover:bg-[#e5e7eb]'
                      }`}
                    >
                      <span>{b.name}</span>
                      {st.teamCount > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            selectedBuildingId === b.id
                              ? 'bg-white text-[#2b5449]'
                              : st.conflictRooms > 0
                              ? 'bg-[#d97736] text-white'
                              : 'bg-[#7ea69b] text-white'
                          }`}
                        >
                          {st.teamCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 층 선택 버튼 */}
              <div className="flex items-center gap-1">
                {Object.keys(currentBuilding.floors).map((floorKey) => {
                  const floorObj = currentBuilding.floors[floorKey];
                  const floorRooms = [...floorObj.topRooms, ...floorObj.bottomRooms];
                  const floorTeamCount = floorRooms.reduce(
                    (acc, r) => acc + (recordsByRoom[r.id]?.length || 0),
                    0
                  );
                  const hasFloorConflict = floorRooms.some(
                    (r) => (recordsByRoom[r.id]?.length || 0) >= 2
                  );

                  return (
                    <button
                      key={floorKey}
                      type="button"
                      onClick={() => handleSelectFloor(floorKey)}
                      className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors flex items-center gap-1 ${
                        selectedFloor === floorKey
                          ? 'bg-[#222222] text-white border-[#222222]'
                          : 'bg-white text-[#444444] border-[#cccccc] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <span>{floorKey}</span>
                      {floorTeamCount > 0 && (
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            hasFloorConflict ? 'bg-[#d97736]' : 'bg-[#7ea69b]'
                          }`}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 층 헤더 안내 */}
            <div className="flex items-center justify-between text-xs text-[#555555] mb-3">
              <span className="font-bold text-[#222222] text-sm">
                {currentBuilding.name} {selectedFloor} 평면도
              </span>
              <span>{currentFloorObj.corridorNote}</span>
            </div>

            {/* 2단 블록 그리드: 상단 구역 -> 중앙 복도 바 -> 하단 구역 */}
            <div className="bg-[#f9fafb] border border-[#e2e8f0] rounded p-3">
              <div className="text-[11px] font-semibold text-[#64748b] mb-1.5">▲ 북측 / 상단 구역</div>
              <div
                className={`grid gap-2.5 ${
                  currentFloorObj.topRooms.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : currentFloorObj.topRooms.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : 'grid-cols-2 sm:grid-cols-4'
                }`}
              >
                {currentFloorObj.topRooms.map(renderRoomCard)}
              </div>

              {/* 중앙 복도 바 */}
              <div className="my-3 py-1.5 px-3 rounded bg-[#e9ecef] border border-dashed border-[#adb5bd] flex items-center justify-between text-[11px] font-semibold text-[#495057]">
                <span>◀ 서편 계단</span>
                <span>{currentFloorObj.corridorNote}</span>
                <span>동편 계단 ▶</span>
              </div>

              <div className="text-[11px] font-semibold text-[#64748b] mb-1.5">▼ 남측(운동장 방향) / 하단 구역</div>
              <div
                className={`grid gap-2.5 ${
                  currentFloorObj.bottomRooms.length <= 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : currentFloorObj.bottomRooms.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : currentFloorObj.bottomRooms.length === 5
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'
                    : 'grid-cols-2 sm:grid-cols-4'
                }`}
              >
                {currentFloorObj.bottomRooms.map(renderRoomCard)}
              </div>
            </div>

            {/* 교외 활동 배정 요약 바 */}
            <div className="mt-3 pt-3 border-t border-[#eeeeee] flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-[#555555]">
                <span className="font-semibold text-[#222222]">교외 활동 / 위탁 R&E:</span>{' '}
                {externalRecords.length > 0
                  ? `${externalRecords.length}팀 배정됨 (전남대 등 교외 지정 장소)`
                  : '해당 날짜 교외 활동 없음'}
              </div>
              <button
                type="button"
                onClick={() => setSelectedRoomId('external')}
                className={`text-xs px-2.5 py-1 rounded border font-semibold transition-colors ${
                  selectedRoomId === 'external'
                    ? 'bg-[#222222] text-white border-[#222222]'
                    : 'bg-[#f8f9fa] text-[#333333] border-[#cccccc] hover:bg-[#eef6f4]'
                }`}
              >
                교외 활동 상세 보기 ({externalRecords.length}건)
              </button>
            </div>
          </div>

          {/* 우측 5컬럼: 과구리 표준 2열 상세 테이블 */}
          <div className="lg:col-span-5 bg-white border border-[#d8d8d8] rounded p-4">
            <div className="pb-3 mb-3 border-b border-[#e5e5e5] flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-[#666666]">
                  {selectedRoomMeta.buildingName} · {selectedRoomMeta.floor}
                </div>
                <h3 className="text-base font-bold text-[#222222] mt-0.5 flex items-center gap-1.5">
                  <span>{selectedRoomMeta.name}</span>
                  {selectedRoomMeta.sub && (
                    <span className="text-xs font-normal text-[#666666]">
                      ({selectedRoomMeta.sub})
                    </span>
                  )}
                </h3>
              </div>

              {selectedRoomRecords.length === 0 ? (
                <span className="text-xs font-semibold text-[#666666] bg-[#f3f4f6] px-2.5 py-1 rounded">
                  비어 있음
                </span>
              ) : selectedRoomRecords.length === 1 ? (
                <span className="text-xs font-semibold text-white bg-[#7ea69b] px-2.5 py-1 rounded">
                  1팀 사용 중 ({selectedRoomStudentCount}명)
                </span>
              ) : (
                <span className="text-xs font-semibold text-white bg-[#d97736] px-2.5 py-1 rounded">
                  {selectedRoomRecords.length}팀 중복 ({selectedRoomStudentCount}명)
                </span>
              )}
            </div>

            {/* 중복 경고 안내 */}
            {selectedRoomRecords.length >= 2 && (
              <div className="mb-3 px-3 py-2 rounded bg-[#fff4ec] border border-[#f3c6a5] text-xs text-[#7c2d12]">
                동일 시간대에 <strong>{selectedRoomRecords.length}개 팀(총 {selectedRoomStudentCount}명)</strong>이 배정되어 있습니다. 실험 기자재 및 좌석 사용을 사전에 조율하세요.
              </div>
            )}

            {/* 배정 팀 목록 (실제 과구리 2열 표 형식: 좌측 #f2f2f2 라벨, 우측 #ffffff 내용) */}
            {selectedRoomRecords.length === 0 ? (
              <div className="py-12 px-4 text-center border border-dashed border-[#dcdcdc] rounded bg-[#fafafa]">
                <p className="text-sm font-semibold text-[#444444]">
                  배정된 탐구활동이 없습니다.
                </p>
                <p className="text-xs text-[#777777] mt-1">
                  {formatKoreanDate(selectedDate)} ({periodFilter === 'ALL' ? '전체 면학' : periodFilter}) 기준 현재 비어 있는 공간입니다.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-0.5">
                {selectedRoomRecords.map((rec, idx) => (
                  <div key={rec.id} className="border border-[#cccccc] rounded overflow-hidden">
                    <div className="bg-[#f8f9fa] px-3 py-1.5 border-b border-[#dcdcdc] flex items-center justify-between text-xs">
                      <span className="font-bold text-[#222222]">
                        배정 팀 #{idx + 1} · {rec.leader}
                      </span>
                      <span className="text-[#555555]">
                        총 {countTeamStudents(rec)}명
                      </span>
                    </div>
                    <table className="w-full border-collapse text-xs">
                      <tbody>
                        <tr className="border-b border-[#e5e5e5]">
                          <th className="w-[96px] bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            활동시간
                          </th>
                          <td className="bg-white text-[#222222] px-3 py-2">{rec.timeText}</td>
                        </tr>
                        <tr className="border-b border-[#e5e5e5]">
                          <th className="bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            활동장소
                          </th>
                          <td className="bg-white text-[#222222] px-3 py-2">{rec.rawLocation}</td>
                        </tr>
                        <tr className="border-b border-[#e5e5e5]">
                          <th className="bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            활동내용
                          </th>
                          <td className="bg-white text-[#222222] px-3 py-2 leading-relaxed">
                            {rec.topic}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e5e5e5]">
                          <th className="bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            대표학생
                          </th>
                          <td className="bg-white text-[#222222] font-semibold px-3 py-2">
                            {rec.leader}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e5e5e5]">
                          <th className="bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            참가학생
                          </th>
                          <td className="bg-white text-[#222222] px-3 py-2">{rec.members}</td>
                        </tr>
                        <tr>
                          <th className="bg-[#f2f2f2] text-[#333333] font-semibold text-left px-3 py-2 border-r border-[#e5e5e5]">
                            지도교사
                          </th>
                          <td className="bg-white text-[#222222] px-3 py-2">{rec.teacher}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* 7. 과구리 탐활서 텍스트 자동 파싱 모달 */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4">
          <div className="bg-white border border-[#cccccc] rounded-md shadow-xl max-w-[620px] w-full overflow-hidden">
            <div className="bg-[#7ea69b] text-white px-4 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">과구리 탐활서 확인 데이터 자동 파싱</h3>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="text-white/90 hover:text-white text-base font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-[#444444] leading-relaxed">
                과구리(<strong>jshsus.kr</strong>)의 <strong>[탐활서 확인]</strong> 게시판에서 승인된 내역을 드래그하여 복사(<code>Ctrl+C</code>)한 뒤 아래 입력창에 붙여넣으면, 날짜·면학·장소·학생 정보를 자동으로 분석해 평면도에 반영합니다.
              </p>

              <textarea
                rows={8}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder={`예시:\n활동시간\t2026-11-16 (월) 1면학, 2면학\n활동장소\t성실관 1층 코딩실\n활동내용\t교내 탐구활동 공간 시각화 웹 서비스 개발\n대표학생\t1117 조영우\n참가학생\t1114 이예지, 1310 서준혁\n지도교사\t김정보`}
                className="w-full border border-[#cccccc] rounded p-2.5 text-xs font-mono focus:outline-none focus:border-[#7ea69b]"
              />

              {pasteFeedback && (
                <div
                  className={`px-3 py-2 rounded border ${
                    pasteFeedback.type === 'error'
                      ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                      : 'bg-[#eef6f4] border-[#b9d4cd] text-[#1f3b34]'
                  }`}
                >
                  {pasteFeedback.text}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={handleResetDemoData}
                  className="px-3 py-1.5 rounded border border-[#cccccc] text-[#555555] hover:bg-[#f5f5f5]"
                >
                  기본 데이터 27건 복원
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPasteModalOpen(false)}
                    className="px-3 py-1.5 rounded border border-[#cccccc] text-[#444444] hover:bg-[#f5f5f5]"
                  >
                    닫기
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyPaste}
                    className="px-4 py-1.5 rounded bg-[#7ea69b] hover:bg-[#6d9489] text-white font-semibold"
                  >
                    자동 분석 및 지도에 반영
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
