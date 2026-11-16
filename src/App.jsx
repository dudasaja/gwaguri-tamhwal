import React, { useState, useMemo } from 'react';

/**
 * ============================================================================
 * 0. 자체 인라인 SVG 아이콘 컴포넌트 (React 18/19 환경 호환성 100% 보장)
 * ============================================================================
 */
function Icon({ children, className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const SearchIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Icon>
);

const MapPinIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);

const RotateCcwIcon = ({ className }) => (
  <Icon className={className}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </Icon>
);

const ArrowLeftIcon = ({ className }) => (
  <Icon className={className}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </Icon>
);

const ArrowRightIcon = ({ className }) => (
  <Icon className={className}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </Icon>
);

const LayersIcon = ({ className }) => (
  <Icon className={className}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </Icon>
);

const ClipboardPasteIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z" />
    <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10" />
    <path d="m17 10 4 4-4 4" />
  </Icon>
);

const InfoIcon = ({ className }) => (
  <Icon className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </Icon>
);

const XIcon = ({ className }) => (
  <Icon className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </Icon>
);

const CalendarIcon = ({ className }) => (
  <Icon className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </Icon>
);

const UserCheckIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <polyline points="17 11 19 13 23 9" />
  </Icon>
);

const GraduationCapIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </Icon>
);

const ExternalLinkIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </Icon>
);

const CheckCircleIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </Icon>
);

const EyeIcon = ({ className }) => (
  <Icon className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

const ChevronLeftIcon = ({ className }) => (
  <Icon className={className}>
    <polyline points="15 18 9 12 15 6" />
  </Icon>
);

const ChevronRightIcon = ({ className }) => (
  <Icon className={className}>
    <polyline points="9 18 15 12 9 6" />
  </Icon>
);

const ChevronUpIcon = ({ className }) => (
  <Icon className={className}>
    <polyline points="18 15 12 9 6 15" />
  </Icon>
);

const ChevronDownIcon = ({ className }) => (
  <Icon className={className}>
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

/**
 * ============================================================================
 * 1. 전남과학고등학교 3개 건물 · 2단 블록 그리드 층별 평면도 데이터 정의
 *    - 모든 층이 '상단 구역 / 중앙 복도 바 / 하단 구역'의 3~4열 블록 배치로
 *      글씨 잘림이나 세로 한 글자 줄바꿈이 발생하지 않도록 체계적으로 설계
 * ============================================================================
 */
const BUILDINGS = [
  {
    id: 'seongsil',
    name: '성실관(본관)',
    shortName: '성실관',
    subtitle: '1~3학년 교실 · AI실 · 코딩실 · 무한상상실 · 학생회의실',
    floors: [
      {
        id: '1F',
        label: '1층',
        subject: 'AI실 · 정보실 · 코딩실 · 행정구역',
        topLabel: '상단 주요 탐구·정보 구역',
        topCols: 3,
        topRooms: [
          { id: 'ss-1-ai', name: 'AI실', type: 'primary' },
          { id: 'ss-1-info', name: '정보실', type: 'primary' },
          { id: 'ss-1-coding', name: '코딩실', subtitle: '구 멀티실', type: 'primary' }
        ],
        corridorLabel: '성실관 1층 중앙 복도 (서측 계단 ↔ 중앙현관 ↔ 동측 계단)',
        bottomLabel: '하단 행정 · 생활 지원 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'ss-1-health', name: '보건실', type: 'facility' },
          { id: 'ss-1-council', name: '교직원협의실', type: 'facility' },
          { id: 'ss-1-prin', name: '교장실', type: 'facility' },
          { id: 'ss-1-office', name: '행정실', type: 'facility' },
          { id: 'ss-1-print', name: '발간실', type: 'facility' },
          { id: 'ss-1-cafeteria', name: '급식실', type: 'facility' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '1학년 교실 · 특별실 · 교무 행정 구역',
        topLabel: '상단 1학년 교실 구역',
        topCols: 4,
        topRooms: [
          { id: 'ss-2-101', name: '1-1', subtitle: '1학년 1반 교실', type: 'classroom' },
          { id: 'ss-2-102', name: '1-2', subtitle: '1학년 2반 교실', type: 'classroom' },
          { id: 'ss-2-103', name: '1-3', subtitle: '1학년 3반 교실', type: 'classroom' },
          { id: 'ss-2-104', name: '1-4', subtitle: '1학년 4반 교실', type: 'classroom' }
        ],
        corridorLabel: '성실관 2층 복도',
        hasBridgeToChangui: true,
        bottomLabel: '하단 특별실 · 교무 행정 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'ss-2-hist', name: '역사관', type: 'primary' },
          { id: 'ss-2-broad', name: '방송실', type: 'primary' },
          { id: 'ss-2-t1', name: '1학년실', type: 'facility' },
          { id: 'ss-2-staff', name: '교무실', type: 'facility' },
          { id: 'ss-2-vp', name: '교감실', type: 'facility' },
          { id: 'ss-2-adm', name: '입학담당관실', type: 'facility' },
          { id: 'ss-2-dorm', name: '사감실', type: 'facility' },
          { id: 'ss-2-study', name: '면학실', type: 'facility' }
        ]
      },
      {
        id: '3F',
        label: '3층',
        subject: '2학년 교실 · 도서관 · 역사관',
        topLabel: '상단 2학년 교실 구역',
        topCols: 4,
        topRooms: [
          { id: 'ss-3-201', name: '2-1', subtitle: '2학년 1반 교실', type: 'classroom' },
          { id: 'ss-3-202', name: '2-2', subtitle: '2학년 2반 교실', type: 'classroom' },
          { id: 'ss-3-203', name: '2-3', subtitle: '2학년 3반 교실', type: 'classroom' },
          { id: 'ss-3-204', name: '2-4', subtitle: '2학년 4반 교실', type: 'classroom' }
        ],
        corridorLabel: '성실관 3층 중앙 복도',
        bottomLabel: '하단 특별실 · 학습 지원 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'ss-3-hist', name: '역사관', type: 'primary' },
          { id: 'ss-3-lib1', name: '도서관', type: 'primary' },
          { id: 'ss-3-lib2', name: '도서실', type: 'primary' },
          { id: 'ss-3-t2', name: '2학년실', type: 'facility' },
          { id: 'ss-3-study', name: '면학실', type: 'facility' }
        ]
      },
      {
        id: '4F',
        label: '4층',
        subject: '3학년 교실 · 무한상상실 · 학생회의실',
        topLabel: '상단 3학년 교실 구역',
        topCols: 4,
        topRooms: [
          { id: 'ss-4-301', name: '3-1', subtitle: '3학년 1반 교실', type: 'classroom' },
          { id: 'ss-4-302', name: '3-2', subtitle: '3학년 2반 교실', type: 'classroom' },
          { id: 'ss-4-303', name: '3-3', subtitle: '3학년 3반 교실', type: 'classroom' },
          { id: 'ss-4-304', name: '3-4', subtitle: '3학년 4반 교실', type: 'classroom' }
        ],
        corridorLabel: '성실관 4층 중앙 복도',
        bottomLabel: '하단 특별실 · 학생자치 · 학습 지원 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'ss-4-council', name: '학생회의실', type: 'primary' },
          { id: 'ss-4-maker', name: '무한상상실', type: 'primary' },
          { id: 'ss-4-math', name: '수학실', type: 'primary' },
          { id: 'ss-4-lang', name: '어학실', type: 'primary' },
          { id: 'ss-4-t3', name: '3학년실', type: 'facility' },
          { id: 'ss-4-study', name: '면학실', type: 'facility' }
        ]
      }
    ]
  },
  {
    id: 'changui',
    name: '창의관(실험동)',
    shortName: '창의관',
    subtitle: '지·물·생·화 실험/R&E실 · 수학실1·2 · 옥상 천문대',
    floors: [
      {
        id: '1F',
        label: '1층',
        subject: '지구과학 & 시청각실',
        topLabel: '상단 지구과학 실험 · 연구 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-1-lab', name: '지구과학 실험실', type: 'primary' },
          { id: 'cu-1-rne', name: '지구과학 R&E실', type: 'primary' },
          { id: 'cu-1-res', name: '지구과학 연구실', type: 'primary' }
        ],
        corridorLabel: '창의관 1층 지구과학 구역 복도 (엘리베이터 · 계단)',
        bottomLabel: '하단 특수실 · 시청각 · 준비 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-1-thin', name: '박편 제작실', type: 'primary' },
          { id: 'cu-1-av', name: '시청각실', type: 'primary' },
          { id: 'cu-1-prep', name: '지구과학 실험 준비실', type: 'facility' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '물리학 & 수학',
        topLabel: '상단 물리 실험 · 수학 구역',
        topCols: 4,
        topRooms: [
          { id: 'cu-2-lab', name: '물리 실험실', type: 'primary' },
          { id: 'cu-2-rne', name: '물리 R&E실', type: 'primary' },
          { id: 'cu-2-math1', name: '수학실1', type: 'primary' },
          { id: 'cu-2-math2', name: '수학실2', type: 'primary' }
        ],
        corridorLabel: '창의관 2층 물리·수학 복도',
        hasBridgeToSeongsil: true,
        bottomLabel: '하단 연구 · 특수실험 · 지원 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-2-res', name: '물리 연구실', type: 'primary' },
          { id: 'cu-2-fluid', name: '유체역학 실험실', type: 'primary' },
          { id: 'cu-2-sem', name: 'SEM실 + 풍동실', type: 'primary' },
          { id: 'cu-2-dark', name: '암실', type: 'primary' },
          { id: 'cu-2-prep', name: '물리 실험 준비실', type: 'facility' },
          { id: 'cu-2-parent', name: '학부모회실', type: 'facility' }
        ]
      },
      {
        id: '3F',
        label: '3층',
        subject: '생물학 (Biology)',
        topLabel: '상단 생명과학 실험 · 연구 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-3-lab', name: '생명과학 실험실', type: 'primary' },
          { id: 'cu-3-rne', name: '생명과학 R&E실', type: 'primary' },
          { id: 'cu-3-res', name: '생명과학 연구실', type: 'primary' }
        ],
        corridorLabel: '창의관 3층 생명과학 구역 복도 (엘리베이터 · 계단)',
        bottomLabel: '하단 특수실험 · 배양 · 준비 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-3-mol', name: '분자실험실', type: 'primary' },
          { id: 'cu-3-cult', name: '미생물 배양실', type: 'primary' },
          { id: 'cu-3-prep', name: '생명과학 실험 준비실', type: 'facility' }
        ]
      },
      {
        id: '4F',
        label: '4층',
        subject: '화학 (Chemistry)',
        topLabel: '상단 화학 실험 · 연구 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-4-lab', name: '화학 실험실', type: 'primary' },
          { id: 'cu-4-rne', name: '화학 R&E실', type: 'primary' },
          { id: 'cu-4-res', name: '화학 연구실', type: 'primary' }
        ],
        corridorLabel: '창의관 4층 화학 구역 복도 (엘리베이터 · 계단)',
        bottomLabel: '하단 기기분석 · 시약 · 준비 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-4-inst', name: '기기분석실', type: 'primary' },
          { id: 'cu-4-reag', name: '기기실 + 시약실', type: 'primary' },
          { id: 'cu-4-prep', name: '화학 실험 준비실', type: 'facility' }
        ]
      },
      {
        id: 'RF',
        label: '옥상',
        subject: '천문대 (관측돔 · 천체관측실)',
        topLabel: '창의관 옥상 천체관측 구역',
        topCols: 1,
        topRooms: [
          {
            id: 'cu-rf-obs',
            name: '천문대',
            subtitle: '관측돔 · 천체관측실',
            type: 'primary'
          }
        ],
        corridorLabel: 'ROOFTOP OBSERVATORY · 옥상 야외 관측 데크',
        bottomCols: 1,
        bottomRooms: []
      }
    ]
  },
  {
    id: 'seongchwi',
    name: '성취관(강당)',
    shortName: '성취관',
    subtitle: '2층 체육관 · 1층 음악/피아노/기악/미술/탁구실 등',
    floors: [
      {
        id: '1F',
        label: '1층',
        subject: '예체능실 (음악·미술·실내체육)',
        topLabel: '상단 음악 · 미술 주요 활용 구역',
        topCols: 4,
        topRooms: [
          { id: 'sc-1-music', name: '음악실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-piano', name: '피아노실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-inst', name: '기악실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-art', name: '미술실', subtitle: '주요 활용', type: 'primary' }
        ],
        corridorLabel: '성취관 1층 예체능실 중앙 복도',
        bottomLabel: '하단 실내 체육 · 연습 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'sc-1-pingpong', name: '탁구실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-yoga', name: '요가실', type: 'secondary' },
          { id: 'sc-1-golf', name: '골프연습실', type: 'secondary' },
          { id: 'sc-1-fitness', name: '체력단련실', type: 'secondary' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '체육관',
        topLabel: '강당 메인 체육 구역',
        topCols: 1,
        topRooms: [
          {
            id: 'sc-2-gym',
            name: '체육관',
            subtitle: '다목적 실내 코트',
            type: 'primary'
          }
        ],
        corridorLabel: '강당 무대 / 단상 (STAGE)',
        bottomCols: 1,
        bottomRooms: []
      }
    ]
  }
];

/**
 * 전체 실(Room) 평탄화 인덱스 생성
 */
const ALL_ROOMS = [];
const ROOM_BY_ID = {};

BUILDINGS.forEach((b) => {
  b.floors.forEach((f) => {
    const floorRooms = [...(f.topRooms || []), ...(f.bottomRooms || [])];
    floorRooms.forEach((r) => {
      const enriched = {
        ...r,
        buildingId: b.id,
        buildingName: b.name,
        buildingShortName: b.shortName,
        floorId: f.id,
        floorLabel: f.label,
        floorSubject: f.subject
      };
      ALL_ROOMS.push(enriched);
      ROOM_BY_ID[enriched.id] = enriched;
    });
  });
});

/**
 * ============================================================================
 * 2. 장소명 정규화 & 별칭 매핑 (과구리 자유입력 장소명 → 교내 평면도 ID)
 * ============================================================================
 */
const ROOM_ALIASES = {
  // 창의관 2층 물리학 & 수학
  '물리실험실': 'cu-2-lab',
  '물리실': 'cu-2-lab',
  '물리탐구실험': 'cu-2-lab',
  '물리r&e': 'cu-2-rne',
  '물리r&e실': 'cu-2-rne',
  '물리연구실': 'cu-2-res',
  '물리실험준비실': 'cu-2-prep',
  '유체역학실험실': 'cu-2-fluid',
  '암실': 'cu-2-dark',
  'sem실': 'cu-2-sem',
  '풍동실': 'cu-2-sem',
  'sem실+풍동실': 'cu-2-sem',
  '수학1실': 'cu-2-math1',
  '수학실1': 'cu-2-math1',
  '수학2실': 'cu-2-math2',
  '수학실2': 'cu-2-math2',

  // 창의관 4층 화학
  '화학실험실': 'cu-4-lab',
  '화학실': 'cu-4-lab',
  '화학r&e': 'cu-4-rne',
  '화학r&e실': 'cu-4-rne',
  '화학연구실': 'cu-4-res',
  '화학실험준비실': 'cu-4-prep',
  '기기분석실': 'cu-4-inst',
  '기기실': 'cu-4-reag',
  '시약실': 'cu-4-reag',
  '기기실+시약실': 'cu-4-reag',

  // 창의관 3층 생물학
  '생명과학실험실': 'cu-3-lab',
  '생물실험실': 'cu-3-lab',
  '생물실': 'cu-3-lab',
  '생명과학r&e': 'cu-3-rne',
  '생명과학r&e실': 'cu-3-rne',
  '생물r&e': 'cu-3-rne',
  '생물r&e실': 'cu-3-rne',
  '생명과학연구실': 'cu-3-res',
  '생물연구실': 'cu-3-res',
  '생명과학실험준비실': 'cu-3-prep',
  '분자실험실': 'cu-3-mol',
  '배양실': 'cu-3-cult',
  '미생물배양실': 'cu-3-cult',

  // 창의관 1층 지구과학 & 옥상 천문대
  '지구과학실험실': 'cu-1-lab',
  '지학실험실': 'cu-1-lab',
  '지구과학실': 'cu-1-lab',
  '지구과학r&e': 'cu-1-rne',
  '지구과학r&e실': 'cu-1-rne',
  '지구과학연구실': 'cu-1-res',
  '지구과학실험준비실': 'cu-1-prep',
  '박편제작실': 'cu-1-thin',
  '시청각실': 'cu-1-av',
  '천문대': 'cu-rf-obs',

  // 성실관 (본관) 특별실 & 교실
  '코딩실': 'ss-1-coding',
  'ai실': 'ss-1-ai',
  '정보실': 'ss-1-info',
  '멀티실': 'ss-1-coding',
  'clab': 'ss-1-coding',
  'c-lab': 'ss-1-coding',
  '씨랩': 'ss-1-coding',
  '학생회의실': 'ss-4-council',
  '학생회실': 'ss-4-council',
  '무한상상실': 'ss-4-maker',
  '수학실': 'ss-4-math',
  '본관수학실': 'ss-4-math',
  '어학실': 'ss-4-lang',
  '도서관': 'ss-3-lib1',
  '도서실': 'ss-3-lib2',
  '방송실': 'ss-2-broad',

  // 교실 매핑 (1-1~1-4, 2-1~2-4, 3-1~3-4)
  '1-1': 'ss-2-101',
  '1-1교실': 'ss-2-101',
  '1-1반교실': 'ss-2-101',
  '1-2': 'ss-2-102',
  '1-2교실': 'ss-2-102',
  '1-2반교실': 'ss-2-102',
  '1-3': 'ss-2-103',
  '1-3교실': 'ss-2-103',
  '1-3반교실': 'ss-2-103',
  '1-4': 'ss-2-104',
  '1-4교실': 'ss-2-104',
  '1-4반교실': 'ss-2-104',

  '2-1': 'ss-3-201',
  '2-1교실': 'ss-3-201',
  '2-1반교실': 'ss-3-201',
  '2-2': 'ss-3-202',
  '2-2교실': 'ss-3-202',
  '2-2반교실': 'ss-3-202',
  '2-3': 'ss-3-203',
  '2-3교실': 'ss-3-203',
  '2-3반교실': 'ss-3-203',
  '2-4': 'ss-3-204',
  '2-4교실': 'ss-3-204',
  '2-4반교실': 'ss-3-204',

  '3-1': 'ss-4-301',
  '3-1교실': 'ss-4-301',
  '3-1반교실': 'ss-4-301',
  '3-2': 'ss-4-302',
  '3-2교실': 'ss-4-302',
  '3-2반교실': 'ss-4-302',
  '3-3': 'ss-4-303',
  '3-3교실': 'ss-4-303',
  '3-3반교실': 'ss-4-303',
  '3-4': 'ss-4-304',
  '3-4교실': 'ss-4-304',
  '3-4반교실': 'ss-4-304',

  // 성취관 (강당)
  '체육관': 'sc-2-gym',
  '강당': 'sc-2-gym',
  '음악실': 'sc-1-music',
  '피아노실': 'sc-1-piano',
  '기악실': 'sc-1-inst',
  '미술실': 'sc-1-art',
  '탁구실': 'sc-1-pingpong',
  '요가실': 'sc-1-yoga',
  '골프연습실': 'sc-1-golf',
  '체력단련실': 'sc-1-fitness'
};

function resolveRoomByName(rawLocation, fallbackContent = '') {
  const normalize = (s) => (s || '').replace(/\s+/g, '').toLowerCase();
  const locKey = normalize(rawLocation);

  if (locKey) {
    if (ROOM_ALIASES[locKey] && ROOM_BY_ID[ROOM_ALIASES[locKey]]) {
      return ROOM_BY_ID[ROOM_ALIASES[locKey]];
    }

    const directRoom = ALL_ROOMS.find(
      (r) =>
        normalize(r.name) === locKey ||
        (r.subtitle && normalize(r.subtitle) === locKey)
    );
    if (directRoom) return directRoom;

    const aliasHitKey = Object.keys(ROOM_ALIASES).find(
      (k) => k.length >= 2 && (locKey.includes(k) || k.includes(locKey))
    );
    if (aliasHitKey && ROOM_BY_ID[ROOM_ALIASES[aliasHitKey]]) {
      return ROOM_BY_ID[ROOM_ALIASES[aliasHitKey]];
    }
  }

  const contentKey = normalize(fallbackContent);
  if (contentKey) {
    const contentAlias = Object.keys(ROOM_ALIASES).find(
      (k) => k.length >= 3 && contentKey.includes(k)
    );
    if (contentAlias && ROOM_BY_ID[ROOM_ALIASES[contentAlias]]) {
      return ROOM_BY_ID[ROOM_ALIASES[contentAlias]];
    }
  }

  return null;
}

/**
 * ============================================================================
 * 3. 과구리 실제 원문 샘플 데이터 (21건)
 * ============================================================================
 */
const DEFAULT_GWAGURI_RAW_TEXT = `10월 12일 07시 07분 29초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
11월 10일 21시 27분 59초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용R&E 보고서 작성 및 회의
대표학생1306김혜안
참가학생1305김재훈, 1306김혜안, 1316장승범, 1402국선우
지도교사김희웅
지원X
11월 13일 16시 06분 38초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리R&E
활동내용시사 역사 골든벨 준비
대표학생2107박세인
참가학생2107박세인,3108신서빈,1105김장현,1305김재훈,1205남도형
지도교사김민기
지원X
11월 16일 13시 34분 30초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 탐구실험
활동내용물리 실험실
대표학생2205 김주호
참가학생2205 김주호
지도교사양용해
지원X
11월 16일 13시 34분 54초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2406 박희재
참가학생2406 박희재, 2410 심재원
지도교사양용해
지원X
11월 16일 14시 25분 32초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소수학1실
활동내용스터디
대표학생2119 최율희
참가학생2102 김정원, 2103 김주하, 2119 최율희, 2405 박상언, 2420 한재은
지도교사박형도
지원X
11월 16일 16시 02분 12초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소코딩실
활동내용소프트웨어 경시대회 준비
대표학생1117 조영우
참가학생1117 조영우, 1114 이예지, 1310 서준혁
지도교사진정숙
지원X
11월 16일 16시 21분 01초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소2-4반 교실
활동내용스터디
대표학생2409 신현승
참가학생2409 신현승, 2416 정민준
지도교사문종한
지원X
11월 16일 16시 21분 07초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2101 김서율
참가학생2101김서율, 2116 정수현, 2115정도연, 2302강다희
지도교사양용해
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-17
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
11월 08일 22시 07분 38초

활동날짜2026-11-17
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소전남대학교 사범대
활동내용알앤이활동
대표학생1117조영우
참가학생, 1119황호준, 1302김동욱, 1418편성인
지도교사유지원
지원X
11월 16일 13시 34분 54초

활동날짜2026-11-17
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2406 박희재
참가학생2406 박희재, 2410 심재원
지도교사양용해
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-18
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
11월 11일 15시 09분 46초

활동날짜2026-11-18
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소1-4 교실
활동내용영어 빌드업반
대표학생1411이도윤
참가학생1102구현준,1109손제연,1205남도형,1215장준우,1302김동욱,1304김승유,1306김혜안,1313윤태린,1317정의찬,1405김유민,1411이도윤
지도교사조솔희
지원X
11월 16일 13시 34분 54초

활동날짜2026-11-18
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2406 박희재
참가학생2406 박희재, 2410 심재원
지도교사양용해
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-19
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
11월 16일 13시 34분 54초

활동날짜2026-11-19
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2406 박희재
참가학생2406 박희재, 2410 심재원
지도교사양용해
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-20
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-21
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-22
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X
10월 12일 07시 07분 29초

활동날짜2026-11-23
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용KYPT 준비 및 실험(3면학까지 요청드립니다.)
대표학생2304 김민건
참가학생2304 김민건, 2215 신태민, 2213 신동헌, 2202 김민찬, 2110 신우진, 2314 이강현, 2313 오정훈, 1218 황선웅, 1316 장승범, 2408 신재민
지도교사김희웅
지원X`;

/**
 * ============================================================================
 * 4. 과구리 게시판 텍스트 전용 자동 파서
 * ============================================================================
 */
function parseGwaguriRawText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedList = [];
  let current = null;
  let lastTimestamp = '';

  const flushCurrent = () => {
    if (!current || !current.date) return;

    const matchedRoom = resolveRoomByName(
      current.rawLocation,
      current.content
    );
    const cleanMembers = current.members.length
      ? current.members
      : current.leader
      ? [current.leader]
      : [];

    parsedList.push({
      id: `gw-${parsedList.length + 1}-${current.date}-${current.leader}`,
      submittedAt: current.submittedAt || '',
      date: current.date,
      timeSlots: current.timeSlots.length
        ? current.timeSlots
        : ['19:10 ~ 20:20, 20:30 ~ 21:30'],
      rawLocation: current.rawLocation || '장소 미기재',
      normalizedRoomId: matchedRoom ? matchedRoom.id : null,
      content: current.content || '탐구활동',
      leader: current.leader || '미기재',
      members: cleanMembers,
      teacher: current.teacher || '미기재',
      support: current.support || 'X'
    });
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    // 신청 시각 줄 (예: 10월 12일 07시 07분 29초)
    if (/^\d{1,2}월\s*\d{1,2}일\s*\d{1,2}시/.test(line)) {
      lastTimestamp = line;
      continue;
    }

    // 활동날짜 (새 블록 시작)
    if (line.startsWith('활동날짜')) {
      flushCurrent();
      const dateVal = line.replace(/^활동날짜\s*:?\s*/, '').trim();
      current = {
        submittedAt: lastTimestamp,
        date: dateVal,
        timeSlots: [],
        rawLocation: '',
        content: '',
        leader: '',
        members: [],
        teacher: '',
        support: 'X'
      };
      continue;
    }

    if (!current) continue;

    if (line.startsWith('활동시간')) {
      const timeVal = line.replace(/^활동시간\s*:?\s*/, '').trim();
      current.timeSlots = timeVal
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (line.startsWith('활동장소')) {
      current.rawLocation = line.replace(/^활동장소\s*:?\s*/, '').trim();
    } else if (line.startsWith('활동내용')) {
      current.content = line.replace(/^활동내용\s*:?\s*/, '').trim();
    } else if (line.startsWith('대표학생')) {
      current.leader = line.replace(/^대표학생\s*:?\s*/, '').trim();
    } else if (line.startsWith('참가학생')) {
      const membersStr = line.replace(/^참가학생\s*:?\s*/, '').trim();
      const splitMembers = membersStr
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      if (current.leader && !splitMembers.includes(current.leader)) {
        current.members = [current.leader, ...splitMembers];
      } else {
        current.members = splitMembers;
      }
    } else if (line.startsWith('지도교사')) {
      current.teacher = line.replace(/^지도교사\s*:?\s*/, '').trim();
    } else if (line.startsWith('지원')) {
      current.support = line.replace(/^지원\s*:?\s*/, '').trim();
    }
  }

  flushCurrent();
  return parsedList;
}

/**
 * ============================================================================
 * 5. 과구리(학생부 전산시스템) 상단 GNB & 날짜 유틸리티
 * ============================================================================
 */
const GNB_ROW_1 = [
  '공지사항',
  '탐활서',
  '자유게시판',
  '청원·제안',
  '상벌점/휴대폰',
  'JBS',
  '분실물',
  '대포'
];

const GNB_ROW_2 = [
  '기상곡 신청',
  '세특 바이트 계산기',
  '감사챌린지',
  '잔반제로',
  '탐활 현황 맵'
];

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];
const TODAY_STR = '2026-11-16';

function parseYMD(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toYMD(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDaysToYMD(dateStr, deltaDays) {
  const d = parseYMD(dateStr);
  d.setDate(d.getDate() + deltaDays);
  return toYMD(d);
}

function formatShortKoreanDate(dateStr) {
  const d = parseYMD(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const weekday = WEEKDAYS_KO[d.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
}

/**
 * ============================================================================
 * 6. 삼성 캘린더(One UI) 스타일 월간 날짜 선택 팝오버 컴포넌트
 * ============================================================================
 */
function SamsungCalendarPopover({
  selectedDate,
  todayDate,
  datesWithData,
  onSelectDate,
  onClose
}) {
  const initialDate = parseYMD(selectedDate || todayDate);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

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

  const calendarCells = useMemo(() => {
    const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells = [];

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1;
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({
        ymd: toYMD(new Date(prevY, prevM, dayNum)),
        day: dayNum,
        inCurrentMonth: false
      });
    }

    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        ymd: toYMD(new Date(viewYear, viewMonth, d)),
        day: d,
        inCurrentMonth: true
      });
    }

    let nextDay = 1;
    while (cells.length < 42) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1;
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({
        ymd: toYMD(new Date(nextY, nextM, nextDay)),
        day: nextDay,
        inCurrentMonth: false
      });
      nextDay += 1;
    }

    return cells;
  }, [viewYear, viewMonth]);

  return (
    <div
      className="absolute left-1/2 top-full mt-2.5 z-50 w-[320px] -translate-x-1/2 rounded-2xl bg-[#242526] p-4 text-white shadow-2xl border border-[#3a3b3c]"
      role="dialog"
      aria-label="날짜 선택 달력"
    >
      {/* 상단 연월 & 위아래 화살표 */}
      <div className="mb-3.5 flex items-center justify-between px-1">
        <span className="text-[16px] font-bold tracking-tight text-white">
          {viewYear}년 {viewMonth + 1}월
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#b0b3b8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#b0b3b8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 (일 월 화 수 목 금 토) */}
      <div className="mb-2 grid grid-cols-7 text-center text-[13px] font-semibold text-[#e4e6eb]">
        {WEEKDAYS_KO.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {calendarCells.map((cell) => {
          const isSelected = cell.ymd === selectedDate;
          const isBeforeToday = cell.ymd < todayDate;
          const hasData = datesWithData.has(cell.ymd);

          return (
            <div key={cell.ymd} className="flex items-center justify-center py-0.5">
              <button
                type="button"
                disabled={isBeforeToday}
                onClick={() => {
                  onSelectDate(cell.ymd);
                  onClose();
                }}
                className={`relative flex h-9 w-9 flex-col items-center justify-center rounded-full text-[14px] transition-colors ${
                  isSelected
                    ? 'bg-[#008cff] font-extrabold text-white shadow-sm'
                    : isBeforeToday
                    ? 'cursor-not-allowed text-[#5c5e62]'
                    : cell.inCurrentMonth
                    ? 'font-medium text-[#f5f6f7] hover:bg-white/15'
                    : 'font-normal text-[#76787d] hover:bg-white/10'
                }`}
              >
                <span>{cell.day}</span>
                {hasData && !isBeforeToday && (
                  <span
                    className={`absolute bottom-1 h-1 w-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-[#76b9ad]'
                    }`}
                  />
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* 하단 오늘 바로가기 & 닫기 */}
      <div className="mt-3 flex items-center justify-between border-t border-[#3a3b3c] pt-2.5 px-1 text-[13px]">
        <button
          type="button"
          onClick={() => {
            onSelectDate(todayDate);
            onClose();
          }}
          className="font-bold text-[#4da6ff] hover:underline"
        >
          오늘 ({formatShortKoreanDate(todayDate)})
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-[#b0b3b8] hover:text-white"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * 7. 메인 애플리케이션 컴포넌트 (공용 과구리 탐활 공간 현황 맵)
 * ============================================================================
 */
export default function App() {
  // 초기 상태: 실제 과구리 21건 데이터 자동 파싱 로드
  const [entries, setEntries] = useState(() =>
    parseGwaguriRawText(DEFAULT_GWAGURI_RAW_TEXT)
  );

  // 화면 전환 상태: 'overview' (건물 3개 센터 화면) | 'building' (건물 층별 평면도)
  const [viewMode, setViewMode] = useState('overview');
  const [selectedBuildingId, setSelectedBuildingId] = useState('changui');
  const [selectedFloorId, setSelectedFloorId] = useState('2F');
  const [selectedRoomId, setSelectedRoomId] = useState('cu-2-lab');

  // 날짜 & 캘린더 팝오버 & 시간대(면학) & 검색 상태
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 모달 & 알림 토스트 상태
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [isOffCampusOpen, setIsOffCampusOpen] = useState(false);
  const [hoveredBuildingId, setHoveredBuildingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // 데이터가 존재하는 날짜 집합 (달력 점 표시용)
  const datesWithData = useMemo(() => {
    const set = new Set();
    entries.forEach((e) => set.add(e.date));
    return set;
  }, [entries]);

  // 오늘 날짜인지 판별 (오늘일 때는 왼쪽 '<' 버튼 숨김)
  const isToday = selectedDate <= TODAY_STR;

  const handlePrevDay = () => {
    if (isToday) return;
    setSelectedDate((prev) => addDaysToYMD(prev, -1));
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => addDaysToYMD(prev, 1));
  };

  // 선택 날짜 + 시간(면학) 필터가 적용된 활동 목록
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (item.date !== selectedDate) return false;

      if (selectedTimeFilter === '1') {
        return item.timeSlots.some(
          (t) => t.includes('19:10') || t.includes('1면학')
        );
      }
      if (selectedTimeFilter === '2') {
        return item.timeSlots.some(
          (t) => t.includes('20:30') || t.includes('2면학')
        );
      }
      if (selectedTimeFilter === '3') {
        const joined = `${item.timeSlots.join(' ')} ${item.content}`;
        return joined.includes('3면학') || joined.includes('21:40');
      }
      return true;
    });
  }, [entries, selectedDate, selectedTimeFilter]);

  // 방 ID별 활동 그룹핑 & 교외/기타 장소 분리
  const { entriesByRoom, offCampusEntries } = useMemo(() => {
    const byRoom = {};
    const offCampus = [];

    filteredEntries.forEach((item) => {
      if (item.normalizedRoomId && ROOM_BY_ID[item.normalizedRoomId]) {
        if (!byRoom[item.normalizedRoomId]) byRoom[item.normalizedRoomId] = [];
        byRoom[item.normalizedRoomId].push(item);
      } else {
        offCampus.push(item);
      }
    });

    return { entriesByRoom: byRoom, offCampusEntries: offCampus };
  }, [filteredEntries]);

  // 건물별 요약 통계
  const buildingStats = useMemo(() => {
    const result = {};
    BUILDINGS.forEach((b) => {
      let teamCount = 0;
      let activeRooms = 0;
      const duplicateRooms = [];

      ALL_ROOMS.filter((r) => r.buildingId === b.id).forEach((room) => {
        const list = entriesByRoom[room.id] || [];
        if (list.length > 0) {
          teamCount += list.length;
          activeRooms += 1;
        }
        if (list.length >= 2) {
          duplicateRooms.push({ ...room, count: list.length, list });
        }
      });

      result[b.id] = {
        teamCount,
        activeRooms,
        duplicateRooms
      };
    });
    return result;
  }, [entriesByRoom]);

  // 전체 캠퍼스 요약 통계
  const campusSummary = useMemo(() => {
    const totalCount = filteredEntries.length;
    const activeRoomIds = Object.keys(entriesByRoom);
    const activeRoomsCount = activeRoomIds.length;
    const duplicateRooms = activeRoomIds
      .filter((id) => entriesByRoom[id].length >= 2)
      .map((id) => ({
        ...ROOM_BY_ID[id],
        count: entriesByRoom[id].length,
        entries: entriesByRoom[id]
      }));

    return {
      totalCount,
      activeRoomsCount,
      duplicateRooms
    };
  }, [filteredEntries, entriesByRoom]);

  // 검색어 정규화 및 매칭 결과 (빠른 점프용)
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return {
        matchedRoomIds: new Set(),
        matchedFloorKeys: new Set(),
        matchedBuildingIds: new Set(),
        matchedItems: []
      };
    }

    const matchedRoomIds = new Set();
    const matchedFloorKeys = new Set();
    const matchedBuildingIds = new Set();
    const matchedItems = [];

    filteredEntries.forEach((item) => {
      const room = item.normalizedRoomId ? ROOM_BY_ID[item.normalizedRoomId] : null;
      const isMatch =
        item.leader.toLowerCase().includes(normalizedQuery) ||
        item.members.some((m) => m.toLowerCase().includes(normalizedQuery)) ||
        item.content.toLowerCase().includes(normalizedQuery) ||
        item.rawLocation.toLowerCase().includes(normalizedQuery) ||
        (room && room.name.toLowerCase().includes(normalizedQuery)) ||
        (room && room.subtitle && room.subtitle.toLowerCase().includes(normalizedQuery));

      if (isMatch) {
        matchedItems.push({ item, room });
        if (room) {
          matchedRoomIds.add(room.id);
          matchedFloorKeys.add(`${room.buildingId}-${room.floorId}`);
          matchedBuildingIds.add(room.buildingId);
        }
      }
    });

    const aliasRoom = resolveRoomByName(normalizedQuery);
    ALL_ROOMS.forEach((room) => {
      if (room.type === 'facility') return;
      const nameHit =
        room.name.toLowerCase().includes(normalizedQuery) ||
        (room.subtitle && room.subtitle.toLowerCase().includes(normalizedQuery)) ||
        (aliasRoom && aliasRoom.id === room.id);

      if (nameHit) {
        matchedRoomIds.add(room.id);
        matchedFloorKeys.add(`${room.buildingId}-${room.floorId}`);
        matchedBuildingIds.add(room.buildingId);
      }
    });

    return {
      matchedRoomIds,
      matchedFloorKeys,
      matchedBuildingIds,
      matchedItems
    };
  }, [normalizedQuery, filteredEntries]);

  // 특정 실로 즉시 네비게이션
  const navigateToRoom = (room) => {
    if (!room) return;
    setSelectedBuildingId(room.buildingId);
    setSelectedFloorId(room.floorId);
    setSelectedRoomId(room.id);
    setViewMode('building');
  };

  // 건물 클릭 진입 핸들러
  const handleEnterBuilding = (buildingId) => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (!building) return;
    setSelectedBuildingId(buildingId);

    const bestFloor =
      building.floors.find((f) =>
        ALL_ROOMS.some(
          (r) =>
            r.buildingId === buildingId &&
            r.floorId === f.id &&
            (entriesByRoom[r.id]?.length || 0) >= 2
        )
      ) ||
      building.floors.find((f) =>
        ALL_ROOMS.some(
          (r) =>
            r.buildingId === buildingId &&
            r.floorId === f.id &&
            (entriesByRoom[r.id]?.length || 0) > 0
        )
      ) ||
      building.floors.find((f) => f.id === '2F') ||
      building.floors[0];

    const floorId = bestFloor.id;
    setSelectedFloorId(floorId);

    const activeOrPrimaryRoom =
      ALL_ROOMS.find(
        (r) =>
          r.buildingId === buildingId &&
          r.floorId === floorId &&
          (entriesByRoom[r.id]?.length || 0) > 0
      ) ||
      ALL_ROOMS.find(
        (r) =>
          r.buildingId === buildingId &&
          r.floorId === floorId &&
          r.type !== 'facility'
      );

    setSelectedRoomId(activeOrPrimaryRoom?.id || null);
    setViewMode('building');
  };

  // 붙여넣기 모달 실시간 파싱 미리보기
  const previewParsedEntries = useMemo(() => {
    return parseGwaguriRawText(pasteInput);
  }, [pasteInput]);

  // 붙여넣은 과구리 데이터 적용
  const handleApplyPastedText = () => {
    if (previewParsedEntries.length === 0) {
      showToast('인식된 탐활 내역이 없습니다. 과구리 탐활서 내용을 그대로 붙여넣어 주세요.');
      return;
    }

    setEntries(previewParsedEntries);
    const firstDate = previewParsedEntries[0].date;
    setSelectedDate(firstDate >= TODAY_STR ? firstDate : TODAY_STR);
    setViewMode('overview');

    setIsPasteModalOpen(false);
    setPasteInput('');
    showToast(`과구리 탐활 데이터 ${previewParsedEntries.length}건이 지도에 반영되었습니다.`);
  };

  // 현재 활성 건물, 층, 실 객체
  const activeBuilding = useMemo(
    () => BUILDINGS.find((b) => b.id === selectedBuildingId) || BUILDINGS[0],
    [selectedBuildingId]
  );
  const activeFloor = useMemo(
    () =>
      activeBuilding.floors.find((f) => f.id === selectedFloorId) ||
      activeBuilding.floors[0],
    [activeBuilding, selectedFloorId]
  );
  const activeRoom = selectedRoomId ? ROOM_BY_ID[selectedRoomId] : null;
  const activeRoomEntries = activeRoom ? entriesByRoom[activeRoom.id] || [] : [];

  /**
   * ==========================================================================
   * 평면도 내부 개별 실(Room) 카드 렌더러 (충분한 카드 폭 + 큰 글씨 + 겹침 제로)
   * ==========================================================================
   */
  const renderRoomTile = (room, minHeightClass = 'min-h-[120px]') => {
    const roomEntries = entriesByRoom[room.id] || [];
    const count = roomEntries.length;
    const isSelected = selectedRoomId === room.id;
    const isSearchHit = searchResults.matchedRoomIds.has(room.id);
    const isFacility = room.type === 'facility';

    let cardStyle = '';
    if (count >= 2) {
      cardStyle = 'bg-amber-50 border-amber-400 text-amber-950';
    } else if (count === 1) {
      cardStyle = 'bg-[#e6f5f2] border-[#6cb5a8] text-[#1d3b36]';
    } else if (isFacility) {
      cardStyle = 'bg-[#f4f4f4] border-[#dcdcdc] text-[#666666] hover:bg-[#ececec]';
    } else {
      cardStyle =
        'bg-white border-[#d6d6d6] text-[#222222] hover:border-[#6cb5a8] hover:bg-[#f9fcfb]';
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => setSelectedRoomId(room.id)}
        className={`group relative flex flex-col justify-between border p-3.5 text-left transition-all duration-150 focus:outline-none ${minHeightClass} ${cardStyle} ${
          isSelected ? 'ring-2 ring-[#5aa396] border-[#5aa396] z-10 shadow-sm' : ''
        } ${isSearchHit ? 'ring-2 ring-[#e87a3d] border-[#e87a3d]' : ''}`}
      >
        {/* 상단: 실 이름(15~16px) & 우측 상단 상태 배지(절대 겹치지 않도록 flex-shrink-0 분리) */}
        <div className="flex w-full items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              className={`text-[15px] sm:text-[16px] leading-snug break-keep ${
                isFacility && count === 0
                  ? 'font-semibold text-[#555555]'
                  : 'font-extrabold text-[#222222]'
              }`}
            >
              {room.name}
            </h4>
            {room.subtitle && (
              <span className="mt-1 inline-block border border-[#dcdcdc] bg-white/90 px-2 py-0.5 text-[12px] font-semibold text-[#555555]">
                {room.subtitle}
              </span>
            )}
          </div>

          {count >= 2 && (
            <span className="shrink-0 whitespace-nowrap border border-amber-400 bg-amber-500/15 px-2 py-0.5 text-[12px] font-extrabold text-amber-900">
              {count}팀 중복
            </span>
          )}
          {count === 1 && (
            <span className="shrink-0 whitespace-nowrap border border-[#6cb5a8] bg-[#6cb5a8]/20 px-2 py-0.5 text-[12px] font-extrabold text-[#25574e]">
              1팀 사용
            </span>
          )}
        </div>

        {/* 하단: 참여 팀 요약(13px) 또는 상태 텍스트 */}
        <div className="mt-3 w-full">
          {count > 0 ? (
            <div className="flex flex-col gap-1.5">
              {roomEntries.map((item) => (
                <div
                  key={item.id}
                  className={`truncate px-2.5 py-1.5 text-[13px] leading-tight ${
                    count >= 2
                      ? 'bg-amber-200/70 text-amber-950'
                      : 'bg-[#cdebe5] text-[#1d3b36]'
                  }`}
                  title={`${item.leader} · ${item.content}`}
                >
                  <span className="font-extrabold">{item.leader}</span>
                  {item.members.length > 1 && (
                    <span className="font-medium opacity-80">
                      {' '}
                      외 {item.members.length - 1}명
                    </span>
                  )}
                  <span className="mx-1.5 opacity-40">|</span>
                  <span className="font-medium opacity-95">{item.content}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="inline-block text-[13px] font-normal text-[#888888]">
              {isFacility ? '행정 · 지원 구역' : '비어 있음'}
            </span>
          )}
        </div>
      </button>
    );
  };

  /**
   * 2단 블록 그리드 컬럼 클래스 매핑 (Tailwind 동적 클래스 누락 방지)
   */
  const getGridColsClass = (cols) => {
    if (cols === 1) return 'grid-cols-1';
    if (cols === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (cols === 4) return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  return (
    <div
      className="min-h-screen w-full bg-[#efefef] text-[#222222] flex flex-col"
      style={{
        fontFamily:
          '"Pretendard Variable", Pretendard, "Noto Sans KR", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
      }}
    >
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ====================================================================
          1. 과구리 최상단 민트색 그라데이션 헤더 (높이 64px, 26px 로고)
         ==================================================================== */}
      <header className="w-full bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] text-white">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between px-4 sm:px-8">
          {/* 좌측: 과구리 2x2 사각형 모자이크 로고 + 26px 타이틀 + 부제 */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-3 text-left group shrink-0"
              title="과구리 탐활 공간 현황 홈으로"
            >
              <div className="grid h-8 w-8 grid-cols-2 grid-rows-2 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                <span className="bg-[#2d3e40]" />
                <span className="bg-[#c3e5de]" />
                <span className="bg-[#95c9be]" />
                <span className="bg-[#58968b]" />
              </div>
              <span className="text-[26px] font-extrabold tracking-tight text-white leading-none">
                과구리
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2.5 text-[14px] text-white/95 truncate">
              <span className="font-medium">소개</span>
              <span className="opacity-60">|</span>
              <span className="font-medium">학생부 전산시스템 · 공용 탐활 공간 현황</span>
            </div>
          </div>

          {/* 우측: 공용 데이터 붙여넣기 버튼 (14px) */}
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="inline-flex items-center gap-2 border border-white/75 bg-white/15 hover:bg-white/25 px-3.5 py-2 text-[14px] font-bold text-white transition-colors"
          >
            <ClipboardPasteIcon className="h-4 w-4" />
            <span>탐활서 데이터 붙여넣기</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. 과구리 2단 흰색 상단 메뉴바 (GNB, 15px 굵은 글씨)
         ==================================================================== */}
      <nav
        aria-label="과구리 전체 메뉴"
        className="w-full border-b border-[#dcdcdc] bg-white"
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          {/* 1행 */}
          <div className="flex items-center justify-start md:justify-center gap-7 sm:gap-11 overflow-x-auto py-3 text-[15px] font-bold text-[#222222] border-b border-[#f0f0f0]">
            {GNB_ROW_1.map((menu) => (
              <button
                key={menu}
                type="button"
                onClick={() => {
                  if (menu === '탐활서') {
                    setIsPasteModalOpen(true);
                  } else {
                    showToast(`과구리 [${menu}] 메뉴 — 현재 '탐활 현황 맵' 화면입니다.`);
                  }
                }}
                className="whitespace-nowrap hover:text-[#5aa396] transition-colors"
              >
                {menu}
              </button>
            ))}
          </div>

          {/* 2행 */}
          <div className="flex items-center justify-start md:justify-center gap-7 sm:gap-11 overflow-x-auto py-3 text-[15px] font-bold text-[#222222]">
            {GNB_ROW_2.map((menu) => {
              const isActive = menu === '탐활 현황 맵';
              return (
                <button
                  key={menu}
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      setViewMode('overview');
                    } else {
                      showToast(`과구리 [${menu}] 메뉴 — 현재 '탐활 현황 맵' 화면입니다.`);
                    }
                  }}
                  className={`relative whitespace-nowrap transition-colors ${
                    isActive
                      ? 'text-[#5aa396] font-extrabold'
                      : 'text-[#222222] hover:text-[#5aa396]'
                  }`}
                >
                  {menu}
                  {isActive && (
                    <span className="absolute -bottom-3 left-0 right-0 h-[3px] bg-[#5aa396]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 알림 토스트 */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 border border-[#5aa396] bg-[#2d3e40] px-4 py-3 text-[14px] font-bold text-white shadow-lg">
          <CheckCircleIcon className="h-4 w-4 text-[#96cfc4] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          3. 메인 중앙 컨테이너 (max-w-[1280px], 여백 축소 + 14~28px 확대 UI)
         ==================================================================== */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 sm:px-8 py-6">
        {/* ==================================================================
            [첫 화면: 캠퍼스 전체 맵] 날짜 선택 + 요약/필터 + 건물 3개 일러스트
           ================================================================== */}
        {viewMode === 'overview' ? (
          <div className="border border-[#dcdcdc] bg-white p-5 sm:p-7 space-y-5">
            {/* 상단 중앙 날짜 네비게이터 (< 11월 16일 (월) > + 달력 버튼) */}
            <div className="flex flex-col items-center justify-center border-b border-[#eeeeee] pb-5">
              <div className="relative flex items-center justify-center gap-3.5 sm:gap-5">
                {/* 왼쪽 화살표: 오늘(2026-11-16)일 때는 숨겨서 오른쪽 방향만 표시 */}
                <button
                  type="button"
                  onClick={handlePrevDay}
                  disabled={isToday}
                  aria-label="이전 날짜"
                  className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-all shadow-xs ${
                    isToday ? 'invisible pointer-events-none' : 'visible'
                  }`}
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>

                {/* 중앙 큰 날짜 표시 (26px~28px) */}
                <div className="flex items-center gap-2.5">
                  <h1 className="text-[26px] sm:text-[28px] font-extrabold tracking-tight text-[#222222] leading-tight">
                    {formatShortKoreanDate(selectedDate)}
                  </h1>
                  {selectedDate === TODAY_STR && (
                    <span className="border border-[#bde0d9] bg-[#e6f5f2] px-2.5 py-0.5 text-[13px] font-extrabold text-[#25574e]">
                      오늘
                    </span>
                  )}
                </div>

                {/* 오른쪽 화살표 */}
                <button
                  type="button"
                  onClick={handleNextDay}
                  aria-label="다음 날짜"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors shadow-xs"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>

                {/* 삼성 캘린더 스타일 달력 팝오버 버튼 */}
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className={`ml-1 inline-flex items-center gap-1.5 border px-3.5 py-2 text-[14px] font-bold transition-colors ${
                    isCalendarOpen
                      ? 'border-[#242526] bg-[#242526] text-white'
                      : 'border-[#dcdcdc] bg-[#fafafa] text-[#333333] hover:border-[#6cb5a8] hover:bg-[#f2faf8]'
                  }`}
                >
                  <CalendarIcon className="h-4 w-4 text-[#5aa396]" />
                  <span>달력</span>
                </button>

                {/* 삼성 캘린더 팝오버 */}
                {isCalendarOpen && (
                  <SamsungCalendarPopover
                    selectedDate={selectedDate}
                    todayDate={TODAY_STR}
                    datesWithData={datesWithData}
                    onSelectDate={(newDate) => setSelectedDate(newDate)}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                )}
              </div>

              {/* 날짜 아래 요약 지표 & 면학 시간대 필터 (14px~15px) */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[14px] sm:text-[15px]">
                <span className="text-[#555555]">
                  전체 탐활 <strong className="text-[#222222]">{campusSummary.totalCount}건</strong>
                </span>
                <span className="text-[#dcdcdc]">|</span>
                <span className="text-[#555555]">
                  사용 중인 실{' '}
                  <strong className="text-[#25574e]">{campusSummary.activeRoomsCount}곳</strong>
                </span>
                <span className="text-[#dcdcdc]">|</span>
                <span className="text-[#555555]">
                  중복 사용실{' '}
                  <strong
                    className={
                      campusSummary.duplicateRooms.length > 0
                        ? 'text-amber-700'
                        : 'text-[#222222]'
                    }
                  >
                    {campusSummary.duplicateRooms.length}곳
                  </strong>
                </span>

                <div className="ml-0 sm:ml-2 flex items-center gap-1.5">
                  {[
                    { id: 'all', label: '전체 시간' },
                    { id: '1', label: '1면학' },
                    { id: '2', label: '2면학' },
                    { id: '3', label: '3면학' }
                  ].map((tf) => (
                    <button
                      key={tf.id}
                      type="button"
                      onClick={() => setSelectedTimeFilter(tf.id)}
                      className={`border px-3 py-1.5 text-[13px] font-bold transition-colors ${
                        selectedTimeFilter === tf.id
                          ? 'border-[#5aa396] bg-[#6cb5a8] text-white'
                          : 'border-[#dcdcdc] bg-[#fafafa] text-[#444444] hover:bg-[#efefef]'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 안내 문구 & 학생 이름/학번/실 검색창 */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] sm:text-[15px] font-medium text-[#555555]">
                  건물을 클릭하면 층별 평면도와 사용 중인 팀 현황을 확인할 수 있습니다.
                </p>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative w-64 sm:w-72">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="학생 이름, 학번, 실 이름 검색..."
                      className="w-full border border-[#dcdcdc] bg-[#fafafa] py-2 pl-9 pr-8 text-[14px] text-[#222222] placeholder:text-[#999999] focus:border-[#6cb5a8] focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#333333]"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {offCampusEntries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsOffCampusOpen(true)}
                      className="inline-flex items-center gap-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 text-[14px] font-bold text-indigo-900 transition-colors"
                    >
                      <ExternalLinkIcon className="h-4 w-4 text-indigo-600" />
                      <span>교외 활동 ({offCampusEntries.length}건)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 검색 결과 빠른 이동 배너 (검색어 입력 시에만 표시) */}
              {normalizedQuery && (
                <div className="border border-orange-200 bg-orange-50/75 p-3.5">
                  <p className="text-[14px] font-extrabold text-orange-950 mb-2">
                    '{searchQuery}' 검색 결과 ({searchResults.matchedItems.length}건)
                  </p>
                  {searchResults.matchedItems.length === 0 ? (
                    <p className="text-[14px] text-[#666666]">
                      선택된 날짜에 일치하는 활동이 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {searchResults.matchedItems.map(({ item, room }) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            room ? navigateToRoom(room) : setIsOffCampusOpen(true)
                          }
                          className="inline-flex items-center gap-2 border border-orange-300 bg-white hover:bg-orange-100 px-3.5 py-2 text-[14px] text-left transition-colors"
                        >
                          <span className="font-extrabold text-[#25574e]">
                            {room
                              ? `${room.buildingShortName} ${room.floorLabel} ${room.name}`
                              : item.rawLocation}
                          </span>
                          <span className="text-[#444444]">
                            {item.leader} · {item.content}
                          </span>
                          <ArrowRightIcon className="h-4 w-4 text-orange-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3개 건물 캠퍼스 맵 SVG (한 화면에 잘림 없이 온전히 들어오는 비율 viewBox 1080x365) */}
              <div className="relative overflow-hidden border border-[#dcdcdc] bg-gradient-to-b from-[#e4f3f0] via-[#f1f8f6] to-[#e9f2ea] p-3 sm:p-5">
                <div
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(#76b9ad 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <svg
                  viewBox="0 0 1080 365"
                  className="relative w-full h-auto select-none"
                  role="img"
                  aria-label="전남과학고등학교 캠퍼스 3개 건물 지도"
                >
                  <defs>
                    <filter id="gwaguri-shadow" x="-15%" y="-15%" width="130%" height="130%">
                      <feDropShadow
                        dx="0"
                        dy="6"
                        stdDeviation="6"
                        floodColor="#2d3e40"
                        floodOpacity="0.18"
                      />
                    </filter>
                  </defs>

                  {/* 캠퍼스 잔디 및 보행로 */}
                  <rect
                    x="16"
                    y="272"
                    width="1048"
                    height="82"
                    rx="14"
                    fill="#d5ebd8"
                    opacity="0.9"
                  />
                  <path
                    d="M 70 326 Q 540 310 1010 326"
                    stroke="#cbd5e1"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 70 326 Q 540 310 1010 326"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    fill="none"
                  />

                  {/* 구름 */}
                  <g fill="#ffffff" opacity="0.9">
                    <circle cx="135" cy="40" r="14" />
                    <circle cx="156" cy="36" r="19" />
                    <circle cx="178" cy="41" r="13" />
                    <circle cx="905" cy="38" r="14" />
                    <circle cx="927" cy="34" r="18" />
                    <circle cx="947" cy="40" r="13" />
                  </g>

                  {/* 조경수 */}
                  {[48, 418, 768, 1032].map((tx, idx) => (
                    <g key={idx} transform={`translate(${tx}, 276)`}>
                      <rect x="-4" y="14" width="8" height="18" fill="#854d0e" />
                      <circle cx="0" cy="8" r="14" fill="#15803d" />
                      <circle cx="-6" cy="12" r="9" fill="#22c55e" />
                      <circle cx="6" cy="11" r="10" fill="#16a34a" />
                    </g>
                  ))}

                  {/* 2층 본관-창의관 연결 통로 */}
                  <g>
                    <rect
                      x="378"
                      y="206"
                      width="80"
                      height="22"
                      fill="#e6f5f2"
                      stroke="#5aa396"
                      strokeWidth="2"
                    />
                    <line
                      x1="386"
                      y1="217"
                      x2="450"
                      y2="217"
                      stroke="#5aa396"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="418"
                      y="198"
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="800"
                      fill="#2d3e40"
                    >
                      2F 연결통로
                    </text>
                  </g>

                  {/* 1) 성실관 (본관) */}
                  <g
                    onClick={() => handleEnterBuilding('seongsil')}
                    onMouseEnter={() => setHoveredBuildingId('seongsil')}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    filter={
                      hoveredBuildingId === 'seongsil' ? 'url(#gwaguri-shadow)' : undefined
                    }
                    className="cursor-pointer transition-transform duration-200"
                    style={{
                      transform:
                        hoveredBuildingId === 'seongsil' ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                  >
                    <polygon points="78,118 230,86 382,118" fill="#2d3e40" />
                    <rect
                      x="86"
                      y="118"
                      width="288"
                      height="182"
                      fill="#ffffff"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongsil')
                          ? '#e87a3d'
                          : '#58968b'
                      }
                      strokeWidth={searchResults.matchedBuildingIds.has('seongsil') ? '5' : '3'}
                    />

                    {[0, 1, 2, 3].map((idx) => {
                      const y = 127 + idx * 38;
                      const floorLabel = `${4 - idx}F`;
                      return (
                        <g key={idx}>
                          <rect
                            x="98"
                            y={y}
                            width="264"
                            height="31"
                            fill="#f2faf8"
                            stroke="#bde0d9"
                            strokeWidth="1.5"
                          />
                          <text x="114" y={y + 20} fontSize="13" fontWeight="800" fill="#2d3e40">
                            {floorLabel}
                          </text>
                          {[152, 188, 224, 260, 296, 330].map((wx, wi) => (
                            <rect
                              key={wi}
                              x={wx}
                              y={y + 6}
                              width="22"
                              height="18"
                              fill="#c3e5de"
                            />
                          ))}
                        </g>
                      );
                    })}

                    <rect x="198" y="280" width="64" height="20" fill="#58968b" />
                    <text
                      x="230"
                      y="294"
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      중앙현관
                    </text>

                    <rect x="118" y="50" width="224" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="230"
                      y="69"
                      textAnchor="middle"
                      fontSize="14.5"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      성실관 (본관 · 1~4F)
                    </text>

                    <g transform="translate(230, 24)">
                      <rect
                        x="-102"
                        y="-14"
                        width="204"
                        height="24"
                        rx="12"
                        fill={
                          buildingStats.seongsil.duplicateRooms.length > 0
                            ? '#d97706'
                            : buildingStats.seongsil.teamCount > 0
                            ? '#5aa396'
                            : '#777777'
                        }
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        {buildingStats.seongsil.duplicateRooms.length > 0
                          ? `중복 사용실 ${buildingStats.seongsil.duplicateRooms.length}곳 · ${buildingStats.seongsil.teamCount}팀`
                          : buildingStats.seongsil.teamCount > 0
                          ? `${buildingStats.seongsil.teamCount}팀 사용 중`
                          : '현재 비어 있음'}
                      </text>
                    </g>
                  </g>

                  {/* 2) 창의관 (실험동) */}
                  <g
                    onClick={() => handleEnterBuilding('changui')}
                    onMouseEnter={() => setHoveredBuildingId('changui')}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    filter={
                      hoveredBuildingId === 'changui' ? 'url(#gwaguri-shadow)' : undefined
                    }
                    className="cursor-pointer transition-transform duration-200"
                    style={{
                      transform:
                        hoveredBuildingId === 'changui' ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                  >
                    <path
                      d="M 558 112 A 44 30 0 0 1 646 112 Z"
                      fill="#58968b"
                      stroke="#2d3e40"
                      strokeWidth="2"
                    />
                    <line
                      x1="602"
                      y1="82"
                      x2="622"
                      y2="98"
                      stroke="#c3e5de"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <rect x="468" y="112" width="268" height="15" fill="#2d3e40" />
                    <text
                      x="602"
                      y="123"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="700"
                      fill="#c3e5de"
                    >
                      옥상 천문대
                    </text>

                    <rect
                      x="458"
                      y="127"
                      width="288"
                      height="173"
                      fill="#ffffff"
                      stroke={
                        searchResults.matchedBuildingIds.has('changui')
                          ? '#e87a3d'
                          : '#58968b'
                      }
                      strokeWidth={searchResults.matchedBuildingIds.has('changui') ? '5' : '3'}
                    />

                    {[
                      { floor: '4F 화학', color: '#f2faf8' },
                      { floor: '3F 생물', color: '#f0fdf4' },
                      { floor: '2F 물리·수학', color: '#e6f5f2' },
                      { floor: '1F 지구과학', color: '#fefce8' }
                    ].map((item, idx) => {
                      const y = 136 + idx * 39;
                      return (
                        <g key={idx}>
                          <rect
                            x="470"
                            y={y}
                            width="264"
                            height="32"
                            fill={item.color}
                            stroke="#bde0d9"
                            strokeWidth="1.5"
                          />
                          <text x="484" y={y + 21} fontSize="13" fontWeight="800" fill="#2d3e40">
                            {item.floor}
                          </text>
                          {[584, 620, 656, 692].map((wx, wi) => (
                            <rect
                              key={wi}
                              x={wx}
                              y={y + 7}
                              width="24"
                              height="18"
                              fill="#95c9be"
                              opacity="0.8"
                            />
                          ))}
                        </g>
                      );
                    })}

                    <rect x="482" y="42" width="240" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="602"
                      y="61"
                      textAnchor="middle"
                      fontSize="14.5"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      창의관 (실험동 · 1~4F+옥상)
                    </text>

                    <g transform="translate(602, 16)">
                      <rect
                        x="-106"
                        y="-14"
                        width="212"
                        height="24"
                        rx="12"
                        fill={
                          buildingStats.changui.duplicateRooms.length > 0
                            ? '#d97706'
                            : buildingStats.changui.teamCount > 0
                            ? '#5aa396'
                            : '#777777'
                        }
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        {buildingStats.changui.duplicateRooms.length > 0
                          ? `중복 사용실 ${buildingStats.changui.duplicateRooms.length}곳 · ${buildingStats.changui.teamCount}팀`
                          : buildingStats.changui.teamCount > 0
                          ? `${buildingStats.changui.teamCount}팀 사용 중`
                          : '현재 비어 있음'}
                      </text>
                    </g>
                  </g>

                  {/* 3) 성취관 (강당) */}
                  <g
                    onClick={() => handleEnterBuilding('seongchwi')}
                    onMouseEnter={() => setHoveredBuildingId('seongchwi')}
                    onMouseLeave={() => setHoveredBuildingId(null)}
                    filter={
                      hoveredBuildingId === 'seongchwi' ? 'url(#gwaguri-shadow)' : undefined
                    }
                    className="cursor-pointer transition-transform duration-200"
                    style={{
                      transform:
                        hoveredBuildingId === 'seongchwi' ? 'translateY(-4px)' : 'translateY(0)'
                    }}
                  >
                    <path d="M 790 170 Q 902 126 1014 170 Z" fill="#2d3e40" />
                    <rect
                      x="796"
                      y="170"
                      width="212"
                      height="130"
                      fill="#ffffff"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongchwi')
                          ? '#e87a3d'
                          : '#58968b'
                      }
                      strokeWidth={searchResults.matchedBuildingIds.has('seongchwi') ? '5' : '3'}
                    />

                    <rect
                      x="808"
                      y="181"
                      width="188"
                      height="49"
                      fill="#f2faf8"
                      stroke="#bde0d9"
                      strokeWidth="1.5"
                    />
                    <text
                      x="902"
                      y="203"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill="#2d3e40"
                    >
                      2F 체육관
                    </text>
                    <text
                      x="902"
                      y="221"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="600"
                      fill="#58968b"
                    >
                      다목적 실내 코트
                    </text>

                    <rect
                      x="808"
                      y="239"
                      width="188"
                      height="50"
                      fill="#fafafa"
                      stroke="#dcdcdc"
                      strokeWidth="1.5"
                    />
                    <text
                      x="902"
                      y="261"
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="800"
                      fill="#2d3e40"
                    >
                      1F 예체능실
                    </text>
                    <text
                      x="902"
                      y="279"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="600"
                      fill="#666666"
                    >
                      음악 · 피아노 · 기악 · 미술 · 탁구
                    </text>

                    <rect x="802" y="96" width="200" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="902"
                      y="115"
                      textAnchor="middle"
                      fontSize="14.5"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      성취관 (강당 · 1~2F)
                    </text>

                    <g transform="translate(902, 70)">
                      <rect
                        x="-98"
                        y="-14"
                        width="196"
                        height="24"
                        rx="12"
                        fill={
                          buildingStats.seongchwi.duplicateRooms.length > 0
                            ? '#d97706'
                            : buildingStats.seongchwi.teamCount > 0
                            ? '#5aa396'
                            : '#777777'
                        }
                      />
                      <text
                        x="0"
                        y="2"
                        textAnchor="middle"
                        fontSize="12.5"
                        fontWeight="700"
                        fill="#ffffff"
                      >
                        {buildingStats.seongchwi.duplicateRooms.length > 0
                          ? `중복 사용실 ${buildingStats.seongchwi.duplicateRooms.length}곳 · ${buildingStats.seongchwi.teamCount}팀`
                          : buildingStats.seongchwi.teamCount > 0
                          ? `${buildingStats.seongchwi.teamCount}팀 사용 중`
                          : '현재 비어 있음'}
                      </text>
                    </g>
                  </g>
                </svg>
              </div>

              {/* 하단: 3개 건물 빠른 진입 카드 (여유로운 3열 그리드, 14~17px) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {BUILDINGS.map((b) => {
                  const st = buildingStats[b.id];
                  const dupCount = st.duplicateRooms.length;
                  return (
                    <div
                      key={b.id}
                      className={`flex flex-col justify-between border bg-white p-4.5 transition-colors ${
                        dupCount > 0 ? 'border-amber-300' : 'border-[#dcdcdc]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-[17px] font-extrabold text-[#222222]">
                            {b.name}
                          </h3>
                          <span
                            className={`px-2.5 py-0.5 text-[12px] font-extrabold ${
                              dupCount > 0
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : st.teamCount > 0
                                ? 'bg-[#e6f5f2] text-[#25574e] border border-[#6cb5a8]'
                                : 'bg-[#f4f4f4] text-[#777777]'
                            }`}
                          >
                            {dupCount > 0
                              ? `중복 ${dupCount}곳`
                              : st.teamCount > 0
                              ? `${st.teamCount}팀 사용 중`
                              : '여유'}
                          </span>
                        </div>
                        <p className="mt-2 text-[14px] text-[#666666] leading-relaxed">
                          {b.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEnterBuilding(b.id)}
                        className="mt-4 flex w-full items-center justify-center gap-1.5 border border-[#2d3e40] bg-[#2d3e40] hover:bg-[#5aa396] hover:border-[#5aa396] py-2.5 text-[14px] font-bold text-white transition-colors"
                      >
                        <span>{b.shortName} 층별 평면도 보기</span>
                        <ArrowRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================
             [건물 내부 뷰] 좌측 2단 블록 그리드 평면도 + 우측 실 상세 정보 패널
             ================================================================== */
          <div className="space-y-5">
            {/* 상단 네비게이션 바: 건물 전체 맵 복귀 + 건물 탭 + 날짜 이동 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[#dcdcdc] bg-white px-4 sm:px-5 py-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="inline-flex items-center gap-1.5 border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] px-3.5 py-2 text-[14px] font-extrabold text-[#333333] transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 text-[#5aa396]" />
                  <span>건물 전체 맵</span>
                </button>

                <div className="h-5 w-px bg-[#dcdcdc] mx-1 hidden sm:block" />

                {BUILDINGS.map((b) => {
                  const isCurrent = selectedBuildingId === b.id;
                  const dupCount = buildingStats[b.id].duplicateRooms.length;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleEnterBuilding(b.id)}
                      className={`inline-flex items-center gap-1.5 border px-3.5 py-2 text-[14px] font-extrabold transition-colors ${
                        isCurrent
                          ? 'border-[#5aa396] bg-[#6cb5a8] text-white'
                          : 'border-[#dcdcdc] bg-white text-[#444444] hover:bg-[#f2f2f2]'
                      }`}
                    >
                      <span>{b.name}</span>
                      {dupCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 text-[11px] font-extrabold ${
                            isCurrent
                              ? 'bg-white text-amber-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-300'
                          }`}
                        >
                          중복 {dupCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 우측: 건물 내부에서도 날짜 전환 가능 */}
              <div className="relative flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  disabled={isToday}
                  aria-label="이전 날짜"
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors ${
                    isToday ? 'invisible pointer-events-none' : 'visible'
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                <span className="text-[15px] sm:text-[16px] font-extrabold text-[#222222]">
                  {formatShortKoreanDate(selectedDate)}
                </span>

                <button
                  type="button"
                  onClick={handleNextDay}
                  aria-label="다음 날짜"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="ml-1 inline-flex items-center gap-1.5 border border-[#dcdcdc] bg-[#fafafa] hover:border-[#6cb5a8] px-3 py-1.5 text-[14px] font-bold text-[#333333]"
                >
                  <CalendarIcon className="h-4 w-4 text-[#5aa396]" />
                  <span>달력</span>
                </button>

                {isCalendarOpen && (
                  <SamsungCalendarPopover
                    selectedDate={selectedDate}
                    todayDate={TODAY_STR}
                    datesWithData={datesWithData}
                    onSelectDate={(newDate) => setSelectedDate(newDate)}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                )}
              </div>
            </div>

            {/* 2열 메인 그리드: 좌측(8/12) 2단 블록 평면도 + 우측(4/12) 상세 패널 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* ============================================================
                  좌측 영역: 층 선택 + 2단 블록 그리드 평면도 (lg:col-span-8)
                 ============================================================ */}
              <div className="lg:col-span-8 border border-[#dcdcdc] bg-white p-5 sm:p-6 space-y-5">
                {/* 층 선택 탭 & 상태 범례 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeeee] pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 pr-1 text-[14px] font-extrabold text-[#555555]">
                      <LayersIcon className="h-4 w-4 text-[#5aa396]" />
                      층 선택:
                    </span>
                    {activeBuilding.floors.map((floor) => {
                      const isFloorSelected = floor.id === activeFloor.id;
                      const floorRooms = ALL_ROOMS.filter(
                        (r) =>
                          r.buildingId === activeBuilding.id &&
                          r.floorId === floor.id
                      );
                      const teamCount = floorRooms.reduce(
                        (sum, r) => sum + (entriesByRoom[r.id]?.length || 0),
                        0
                      );
                      const hasDup = floorRooms.some(
                        (r) => (entriesByRoom[r.id]?.length || 0) >= 2
                      );

                      return (
                        <button
                          key={floor.id}
                          type="button"
                          onClick={() => {
                            setSelectedFloorId(floor.id);
                            const activeR = floorRooms.find(
                              (r) => (entriesByRoom[r.id]?.length || 0) > 0
                            );
                            const defaultR = floorRooms.find(
                              (r) => r.type !== 'facility'
                            );
                            setSelectedRoomId(activeR?.id || defaultR?.id || null);
                          }}
                          className={`inline-flex items-center gap-1.5 border px-3.5 py-2 text-[14px] font-extrabold transition-colors ${
                            isFloorSelected
                              ? 'border-[#2d3e40] bg-[#2d3e40] text-white'
                              : 'border-[#dcdcdc] bg-[#fafafa] text-[#333333] hover:bg-[#efefef]'
                          }`}
                        >
                          <span>{floor.label}</span>
                          {hasDup ? (
                            <span className="bg-amber-400 text-amber-950 px-1.5 py-0.5 text-[11px] font-extrabold">
                              {teamCount}팀 중복
                            </span>
                          ) : teamCount > 0 ? (
                            <span
                              className={`px-1.5 py-0.5 text-[11px] font-bold ${
                                isFloorSelected
                                  ? 'bg-[#6cb5a8] text-white'
                                  : 'bg-[#e6f5f2] text-[#25574e]'
                              }`}
                            >
                              {teamCount}팀
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* 상태 범례 */}
                  <div className="flex flex-wrap items-center gap-3.5 text-[13px]">
                    <span className="inline-flex items-center gap-1.5 text-[#666666]">
                      <span className="h-3 w-3 border border-[#cccccc] bg-white" />
                      비어 있음
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-[#25574e]">
                      <span className="h-3 w-3 border border-[#6cb5a8] bg-[#e6f5f2]" />
                      1팀 사용 중
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
                      <span className="h-3 w-3 border border-amber-400 bg-amber-100" />
                      2팀 이상 중복
                    </span>
                  </div>
                </div>

                {/* 현재 층 제목 */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-[#5aa396] px-3 py-1 text-[13px] font-extrabold text-white">
                      {activeBuilding.shortName} · {activeFloor.label}
                    </span>
                    <h2 className="text-[18px] sm:text-[20px] font-extrabold text-[#222222]">
                      {activeFloor.subject}
                    </h2>
                  </div>
                  <span className="text-[13px] text-[#777777]">
                    실을 클릭하면 우측 패널에 상세 명단이 표시됩니다
                  </span>
                </div>

                {/* 2단 블록 그리드 평면도 본문 (상단 구역 / 중앙 복도 바 / 하단 구역) */}
                <div className="space-y-4 border border-[#cccccc] bg-[#f7f7f7] p-4 sm:p-5">
                  {/* 1. 상단 구역 */}
                  {activeFloor.topRooms && activeFloor.topRooms.length > 0 && (
                    <div className="space-y-2">
                      {activeFloor.topLabel && (
                        <p className="text-[13px] font-extrabold text-[#555555]">
                          ▲ {activeFloor.topLabel}
                        </p>
                      )}
                      <div
                        className={`grid gap-3 ${getGridColsClass(
                          activeFloor.topCols || 3
                        )}`}
                      >
                        {activeFloor.topRooms.map((room) =>
                          renderRoomTile(
                            room,
                            activeFloor.topCols === 1 ? 'min-h-[150px]' : 'min-h-[120px]'
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. 중앙 복도 바 (2층 연결통로 빠른 이동 버튼 포함) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border border-[#d6d6d6] bg-[#eaeaea] px-4 py-2.5 text-[13px] sm:text-[14px] font-bold text-[#555555]">
                    <span className="mx-auto sm:mx-0">{activeFloor.corridorLabel}</span>

                    {activeFloor.hasBridgeToChangui && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBuildingId('changui');
                          setSelectedFloorId('2F');
                          setSelectedRoomId('cu-2-lab');
                        }}
                        className="border border-[#5aa396] bg-[#e6f5f2] px-3 py-1 text-[13px] font-extrabold text-[#25574e] hover:bg-[#cdebe5] transition-colors"
                      >
                        창의관 2층 연결통로 이동 →
                      </button>
                    )}

                    {activeFloor.hasBridgeToSeongsil && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBuildingId('seongsil');
                          setSelectedFloorId('2F');
                          setSelectedRoomId('ss-2-101');
                        }}
                        className="border border-[#5aa396] bg-[#e6f5f2] px-3 py-1 text-[13px] font-extrabold text-[#25574e] hover:bg-[#cdebe5] transition-colors"
                      >
                        ← 성실관 2층 연결통로 이동
                      </button>
                    )}
                  </div>

                  {/* 3. 하단 구역 */}
                  {activeFloor.bottomRooms && activeFloor.bottomRooms.length > 0 && (
                    <div className="space-y-2">
                      {activeFloor.bottomLabel && (
                        <p className="text-[13px] font-extrabold text-[#555555]">
                          ▼ {activeFloor.bottomLabel}
                        </p>
                      )}
                      <div
                        className={`grid gap-3 ${getGridColsClass(
                          activeFloor.bottomCols || 3
                        )}`}
                      >
                        {activeFloor.bottomRooms.map((room) =>
                          renderRoomTile(room, 'min-h-[116px]')
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================
                  우측 영역: 선택한 실(Room) 상세 정보 패널 (lg:col-span-4)
                 ============================================================ */}
              <aside className="lg:col-span-4 border border-[#dcdcdc] bg-white p-5 sm:p-6 space-y-4 lg:sticky lg:top-5">
                {activeRoom ? (
                  <>
                    <div className="border-b border-[#eeeeee] pb-4 space-y-2">
                      <p className="text-[13px] font-bold text-[#5aa396]">
                        {activeRoom.buildingName} &gt; {activeRoom.floorLabel}
                      </p>

                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h3 className="text-[20px] sm:text-[22px] font-extrabold text-[#222222] leading-tight">
                            {activeRoom.name}
                          </h3>
                          {activeRoom.subtitle && (
                            <p className="mt-0.5 text-[13px] font-semibold text-[#777777]">
                              {activeRoom.subtitle}
                            </p>
                          )}
                        </div>

                        <span
                          className={`px-2.5 py-1 text-[13px] font-extrabold ${
                            activeRoomEntries.length >= 2
                              ? 'border border-amber-400 bg-amber-100 text-amber-950'
                              : activeRoomEntries.length === 1
                              ? 'border border-[#6cb5a8] bg-[#e6f5f2] text-[#25574e]'
                              : 'border border-[#dcdcdc] bg-[#fafafa] text-[#777777]'
                          }`}
                        >
                          {activeRoomEntries.length >= 2
                            ? `${activeRoomEntries.length}팀 중복 사용`
                            : activeRoomEntries.length === 1
                            ? '1팀 사용 중'
                            : '비어 있음'}
                        </span>
                      </div>
                    </div>

                    {/* 중복 사용 안내 */}
                    {activeRoomEntries.length >= 2 && (
                      <div className="border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-amber-950">
                        현재 <strong>{activeRoomEntries.length}개 팀</strong>이 함께 배정되어 있습니다. 각 팀의 활동시간과 내용을 확인하세요.
                      </div>
                    )}

                    {/* 팀 목록 또는 빈 공간 안내 */}
                    {activeRoomEntries.length === 0 ? (
                      <div className="border border-dashed border-[#cccccc] bg-[#fafafa] px-4 py-10 text-center">
                        <p className="text-[15px] font-bold text-[#555555]">
                          {formatShortKoreanDate(selectedDate)} 기준
                          <br />
                          배정된 탐활이 없습니다.
                        </p>
                        <p className="mt-1.5 text-[13px] text-[#888888]">
                          현재 비어 있는 공간입니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeRoomEntries.map((item, idx) => (
                          <div
                            key={item.id}
                            className={`border bg-[#fcfcfc] p-4 space-y-3.5 ${
                              activeRoomEntries.length >= 2
                                ? 'border-amber-300'
                                : 'border-[#bde0d9]'
                            }`}
                          >
                            {/* 팀 번호 & 활동시간 */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeeeee] pb-2.5">
                              <span
                                className={`px-2.5 py-0.5 text-[13px] font-extrabold text-white ${
                                  activeRoomEntries.length >= 2
                                    ? 'bg-amber-600'
                                    : 'bg-[#5aa396]'
                                }`}
                              >
                                팀 #{idx + 1}
                              </span>
                              <span className="text-[13px] font-bold text-[#444444]">
                                {item.timeSlots.join(', ')}
                              </span>
                            </div>

                            {/* 활동내용 */}
                            <div>
                              <p className="text-[12px] font-bold text-[#888888]">
                                활동내용
                              </p>
                              <p className="mt-1 text-[15px] font-extrabold text-[#222222] leading-snug">
                                {item.content}
                              </p>
                            </div>

                            {/* 대표학생 & 지도교사 */}
                            <div className="grid grid-cols-2 gap-2.5 border border-[#eeeeee] bg-white p-3 text-[14px]">
                              <div>
                                <span className="flex items-center gap-1 text-[12px] font-bold text-[#888888]">
                                  <UserCheckIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                                  대표학생
                                </span>
                                <p className="mt-0.5 font-extrabold text-[#222222]">
                                  {item.leader}
                                </p>
                              </div>
                              <div>
                                <span className="flex items-center gap-1 text-[12px] font-bold text-[#888888]">
                                  <GraduationCapIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                                  지도교사
                                </span>
                                <p className="mt-0.5 font-extrabold text-[#222222]">
                                  {item.teacher} 선생님
                                </p>
                              </div>
                            </div>

                            {/* 참가학생 명단 칩 */}
                            <div>
                              <p className="mb-1.5 text-[12px] font-bold text-[#888888]">
                                참가학생 ({item.members.length}명)
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {item.members.map((member, mIdx) => {
                                  const isSearchHit =
                                    normalizedQuery &&
                                    member.toLowerCase().includes(normalizedQuery);
                                  return (
                                    <span
                                      key={mIdx}
                                      className={`border px-2.5 py-1 text-[13px] ${
                                        isSearchHit
                                          ? 'border-[#e87a3d] bg-orange-50 font-extrabold text-orange-950'
                                          : 'border-[#dcdcdc] bg-white font-semibold text-[#333333]'
                                      }`}
                                    >
                                      {member}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            {/* 원본 장소 표기 */}
                            <div className="flex items-center justify-between border-t border-[#eeeeee] pt-2 text-[12px] text-[#888888]">
                              <span>원본 표기: {item.rawLocation}</span>
                              {item.submittedAt && <span>{item.submittedAt}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center text-[14px] text-[#777777]">
                    좌측 평면도에서 확인할 실을 클릭해 주세요.
                  </div>
                )}
              </aside>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          과구리 탐활서 데이터 붙여넣기 모달
         ==================================================================== */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden border border-[#dcdcdc] bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-4 text-white">
              <div>
                <h3 className="text-[17px] font-extrabold">
                  과구리 탐활서 데이터 붙여넣기
                </h3>
                <p className="text-[13px] text-white/95">
                  과구리(jshsus.kr) 탐활서 게시판의 승인 내역을 복사해 붙여넣으면 자동 파싱됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="p-1 text-white/90 hover:bg-white/20"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 border border-[#bde0d9] bg-[#f2faf8] p-3.5 text-[13px] text-[#25574e]">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-[#5aa396] shrink-0" />
                  <span>
                    과구리 원문 형식(<code>활동날짜</code>, <code>활동시간</code>,{' '}
                    <code>활동장소</code>, <code>활동내용</code>, <code>대표학생</code>,{' '}
                    <code>참가학생</code>, <code>지도교사</code>)을 자동 인식합니다.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPasteInput(DEFAULT_GWAGURI_RAW_TEXT)}
                  className="inline-flex items-center gap-1.5 bg-[#5aa396] hover:bg-[#498d81] px-3 py-1.5 text-[13px] font-bold text-white transition-colors"
                >
                  <RotateCcwIcon className="h-3.5 w-3.5" />
                  기본 샘플 데이터(21건) 불러오기
                </button>
              </div>

              <textarea
                rows={7}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder={`과구리 탐활서 게시판 내용을 그대로 복사(Ctrl+C)하여 여기에 붙여넣으세요(Ctrl+V)...\n\n예시)\n활동날짜2026-11-16\n활동시간19:10 ~ 20:20, 20:30 ~ 21:30\n활동장소물리실험실\n활동내용KYPT 준비 및 실험\n대표학생2304 김민건\n참가학생2304 김민건, 2215 신태민\n지도교사김희웅`}
                className="w-full border border-[#dcdcdc] bg-[#fafafa] p-3.5 text-[14px] text-[#222222] placeholder:text-[#999999] focus:border-[#6cb5a8] focus:bg-white focus:outline-none"
              />

              {previewParsedEntries.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[14px] font-bold text-[#333333]">
                    <span>
                      자동 파싱 미리보기: 총{' '}
                      <strong className="text-[#5aa396]">
                        {previewParsedEntries.length}건
                      </strong>{' '}
                      인식됨
                    </span>
                    <span className="text-[#666666]">
                      교내 매핑{' '}
                      {
                        previewParsedEntries.filter((e) => e.normalizedRoomId)
                          .length
                      }
                      건 · 교외/기타{' '}
                      {
                        previewParsedEntries.filter((e) => !e.normalizedRoomId)
                          .length
                      }
                      건
                    </span>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-[#dcdcdc]">
                    <table className="w-full text-left text-[13px]">
                      <thead className="bg-[#f4f4f4] text-[#555555] font-bold border-b border-[#dcdcdc]">
                        <tr>
                          <th className="px-3 py-2">날짜</th>
                          <th className="px-3 py-2">원본 장소 → 매핑 공간</th>
                          <th className="px-3 py-2">대표학생</th>
                          <th className="px-3 py-2">활동내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eeeeee]">
                        {previewParsedEntries.map((row) => {
                          const mapped = row.normalizedRoomId
                            ? ROOM_BY_ID[row.normalizedRoomId]
                            : null;
                          return (
                            <tr key={row.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-[#666666]">
                                {row.date}
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-[#888888] mr-1">
                                  {row.rawLocation} →
                                </span>
                                {mapped ? (
                                  <span className="font-bold text-[#2c665c]">
                                    {mapped.buildingShortName} {mapped.floorLabel}{' '}
                                    {mapped.name}
                                  </span>
                                ) : (
                                  <span className="font-semibold text-indigo-700">
                                    교외 / 기타 장소
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 font-bold text-[#222222] whitespace-nowrap">
                                {row.leader}
                              </td>
                              <td className="px-3 py-2 text-[#555555] truncate max-w-[180px]">
                                {row.content}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="border border-[#dcdcdc] bg-white px-4 py-2 text-[14px] font-bold text-[#555555] hover:bg-[#f4f4f4]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedText}
                  className="bg-[#5aa396] hover:bg-[#498d81] px-5 py-2 text-[14px] font-bold text-white transition-colors"
                >
                  지도에 반영하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          교외 / 기타 장소 드로어 모달 (예: 전남대학교 사범대 등)
         ==================================================================== */}
      {isOffCampusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden border border-[#dcdcdc] bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-4 text-white">
              <div className="flex items-center gap-2">
                <ExternalLinkIcon className="h-4 w-4" />
                <div>
                  <h3 className="text-[17px] font-extrabold">
                    교외 / 기타 장소 탐활 내역
                  </h3>
                  <p className="text-[13px] text-white/95">
                    {formatShortKoreanDate(selectedDate)} 기준 교외 연계 활동 ({offCampusEntries.length}건)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffCampusOpen(false)}
                className="p-1 text-white/90 hover:bg-white/20"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto bg-[#fafafa]">
              {offCampusEntries.length === 0 ? (
                <p className="py-8 text-center text-[14px] text-[#777777]">
                  선택된 날짜·시간에 교외/기타 장소 활동이 없습니다.
                </p>
              ) : (
                offCampusEntries.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#dcdcdc] bg-white p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 bg-indigo-600 px-2.5 py-0.5 text-[13px] font-bold text-white">
                        <MapPinIcon className="h-3.5 w-3.5" />
                        {item.rawLocation}
                      </span>
                      <span className="text-[13px] font-bold text-[#666666]">
                        {item.timeSlots.join(', ')}
                      </span>
                    </div>

                    <p className="text-[15px] font-extrabold text-[#222222]">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 text-[14px] text-[#444444]">
                      <span>
                        <strong>대표학생:</strong> {item.leader}
                      </span>
                      <span>
                        <strong>지도교사:</strong> {item.teacher} 선생님
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.members.map((m, idx) => (
                        <span
                          key={idx}
                          className="border border-[#dcdcdc] bg-[#fafafa] px-2.5 py-0.5 text-[13px] font-medium text-[#444444]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
