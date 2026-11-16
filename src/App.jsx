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
 * 1. 전남과학고등학교 3개 건물 · 층별 평면도 데이터 정의
 *    (성실관(본관), 창의관(실험동), 성취관(강당))
 * ============================================================================
 */
const BUILDINGS = [
  {
    id: 'seongsil',
    name: '성실관(본관)',
    shortName: '성실관',
    subtitle: '1~3학년 교실 · AI실(코딩실) · C-lab · 무한상상실 · 행정구역',
    floors: [
      {
        id: '1F',
        label: '1층',
        subject: 'AI실 (코딩실) · 정보실 · C-lab',
        corridorLabel: '1층 복도',
        layoutType: 'seongsil-corridor',
        rooms: [
          { id: 'ss-1-wc1', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-1-st1', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-1-health', name: '보건실', type: 'facility', span: 2 },
          { id: 'ss-1-council', name: '교직원협의실', type: 'facility', span: 2 },
          { id: 'ss-1-prin', name: '교장실', type: 'facility', span: 2 },
          { id: 'ss-1-office', name: '행정실', type: 'facility', span: 2 },
          { id: 'ss-1-st2', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-1-lobby', name: '중앙현관', type: 'facility', span: 2 },
          { id: 'ss-1-print', name: '발간실', type: 'facility', span: 1 },
          { id: 'ss-1-ai', name: 'AI실', subtitle: '코딩실', type: 'primary', span: 2 },
          { id: 'ss-1-info', name: '정보실', type: 'primary', span: 2 },
          { id: 'ss-1-clab', name: 'C-lab', subtitle: '구 멀티실', type: 'primary', span: 3 },
          { id: 'ss-1-st3', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-1-wc2', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-1-cafeteria', name: '급식실', type: 'facility', span: 2 }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '1학년 교실 · 교무 행정 구역 · 창의관 연결통로',
        corridorLabel: '2층 복도 (창의관 2층 연결통로 방면 →)',
        layoutType: 'seongsil-corridor',
        hasBridge: true,
        rooms: [
          { id: 'ss-2-wc1', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-2-st1', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-2-101', name: '1-1', type: 'classroom', span: 2 },
          { id: 'ss-2-102', name: '1-2', type: 'classroom', span: 2 },
          { id: 'ss-2-103', name: '1-3', type: 'classroom', span: 2 },
          { id: 'ss-2-104', name: '1-4', type: 'classroom', span: 2 },
          { id: 'ss-2-st2', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-2-hist', name: '역사관', type: 'primary', span: 2 },
          { id: 'ss-2-t1', name: '1학년실', type: 'facility', span: 2 },
          { id: 'ss-2-vp', name: '교감실', type: 'facility', span: 1 },
          { id: 'ss-2-staff', name: '교무실', type: 'facility', span: 2 },
          { id: 'ss-2-adm', name: '입학담당관실', type: 'facility', span: 2 },
          { id: 'ss-2-broad', name: '방송실', type: 'primary', span: 1 },
          { id: 'ss-2-st3', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-2-wc2', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-2-dorm', name: '사감실', type: 'facility', span: 1 },
          { id: 'ss-2-study', name: '면학실', type: 'facility', span: 2 }
        ]
      },
      {
        id: '3F',
        label: '3층',
        subject: '2학년 교실 · 도서관 · 역사관',
        corridorLabel: '3층 복도',
        layoutType: 'seongsil-corridor',
        rooms: [
          { id: 'ss-3-wc1', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-3-st1', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-3-201', name: '2-1', type: 'classroom', span: 2 },
          { id: 'ss-3-202', name: '2-2', type: 'classroom', span: 2 },
          { id: 'ss-3-203', name: '2-3', type: 'classroom', span: 2 },
          { id: 'ss-3-204', name: '2-4', type: 'classroom', span: 2 },
          { id: 'ss-3-st2', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-3-hist', name: '역사관', type: 'primary', span: 2 },
          { id: 'ss-3-t2', name: '2학년실', type: 'facility', span: 2 },
          { id: 'ss-3-lib1', name: '도서관', type: 'primary', span: 3 },
          { id: 'ss-3-lib2', name: '도서실', type: 'primary', span: 3 },
          { id: 'ss-3-st3', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-3-wc2', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-3-study', name: '면학실', type: 'facility', span: 2 }
        ]
      },
      {
        id: '4F',
        label: '4층',
        subject: '3학년 교실 · 무한상상실 · 학생회의실',
        corridorLabel: '4층 복도',
        layoutType: 'seongsil-corridor',
        rooms: [
          { id: 'ss-4-wc1', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-4-st1', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-4-301', name: '3-1', type: 'classroom', span: 2 },
          { id: 'ss-4-302', name: '3-2', type: 'classroom', span: 2 },
          { id: 'ss-4-303', name: '3-3', type: 'classroom', span: 2 },
          { id: 'ss-4-304', name: '3-4', type: 'classroom', span: 2 },
          { id: 'ss-4-council', name: '학생회의실', type: 'primary', span: 2 },
          { id: 'ss-4-maker', name: '무한상상실', type: 'primary', span: 3 },
          { id: 'ss-4-t3', name: '3학년실', type: 'facility', span: 2 },
          { id: 'ss-4-math', name: '수학실', type: 'primary', span: 2 },
          { id: 'ss-4-lang', name: '어학실', type: 'primary', span: 2 },
          { id: 'ss-4-st2', name: '계단', type: 'facility', span: 1 },
          { id: 'ss-4-wc2', name: '화장실', type: 'facility', span: 1 },
          { id: 'ss-4-study', name: '면학실', type: 'facility', span: 2 }
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
        layoutType: 'changui-standard',
        topRooms: [
          { id: 'cu-1-ev', name: '엘리베이터', type: 'facility', colSpan: 1 },
          { id: 'cu-1-cor1', name: '1층 상단 복도', type: 'corridor', colSpan: 4 },
          { id: 'cu-1-thin', name: '박편 제작실', type: 'primary', colSpan: 2 }
        ],
        bottomRooms: [
          { id: 'cu-1-st', name: '계단', type: 'facility', colSpan: 1 },
          { id: 'cu-1-rne', name: '지구과학 R&E실', type: 'primary', colSpan: 1 },
          { id: 'cu-1-res', name: '지구과학 연구실', type: 'primary', colSpan: 1 },
          { id: 'cu-1-lab', name: '지구과학 실험실', type: 'primary', colSpan: 2 },
          { id: 'cu-1-prep', name: '지구과학 실험 준비실', type: 'facility', colSpan: 1 },
          { id: 'cu-1-av', name: '시청각실', type: 'primary', colSpan: 1 }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '물리학 & 수학',
        layoutType: 'changui-2f',
        topRooms: [
          { id: 'cu-2-bridge', name: '본관 연결 통로', type: 'facility', colSpan: 2 },
          { id: 'cu-2-cor-top', name: '연결 복도', type: 'corridor', colSpan: 2 },
          { id: 'cu-2-parent', name: '학부모회실', type: 'facility', colSpan: 1 },
          { id: 'cu-2-math1', name: '수학실1', type: 'primary', colSpan: 1 },
          { id: 'cu-2-math2', name: '수학실2', type: 'primary', colSpan: 1 }
        ],
        midRooms: [
          { id: 'cu-2-ev', name: '엘리베이터', type: 'facility', colSpan: 1 },
          { id: 'cu-2-cor-mid', name: '2층 중앙 복도', type: 'corridor', colSpan: 4 },
          { id: 'cu-2-sem', name: 'SEM실 + 풍동실', type: 'primary', colSpan: 2 }
        ],
        bottomRooms: [
          { id: 'cu-2-st', name: '계단', type: 'facility', colSpan: 1 },
          { id: 'cu-2-rne', name: '물리 R&E실', type: 'primary', colSpan: 1 },
          { id: 'cu-2-res', name: '물리 연구실', type: 'primary', colSpan: 1 },
          { id: 'cu-2-dark', name: '암실', type: 'primary', colSpan: 1 },
          { id: 'cu-2-prep', name: '물리 실험 준비실', type: 'facility', colSpan: 1 },
          { id: 'cu-2-lab', name: '물리 실험실', type: 'primary', colSpan: 1 },
          { id: 'cu-2-fluid', name: '유체역학 실험실', type: 'primary', colSpan: 1 }
        ]
      },
      {
        id: '3F',
        label: '3층',
        subject: '생물학 (Biology)',
        layoutType: 'changui-standard',
        topRooms: [
          { id: 'cu-3-ev', name: '엘리베이터', type: 'facility', colSpan: 1 },
          { id: 'cu-3-cor1', name: '3층 상단 복도', type: 'corridor', colSpan: 4 },
          { id: 'cu-3-cult', name: '미생물 배양실', type: 'primary', colSpan: 2 }
        ],
        bottomRooms: [
          { id: 'cu-3-st', name: '계단', type: 'facility', colSpan: 1 },
          { id: 'cu-3-rne', name: '생명과학 R&E실', type: 'primary', colSpan: 1 },
          { id: 'cu-3-res', name: '생명과학 연구실', type: 'primary', colSpan: 1 },
          { id: 'cu-3-mol', name: '분자실험실', type: 'primary', colSpan: 1 },
          { id: 'cu-3-prep', name: '생명과학 실험 준비실', type: 'facility', colSpan: 1 },
          { id: 'cu-3-lab', name: '생명과학 실험실', type: 'primary', colSpan: 2 }
        ]
      },
      {
        id: '4F',
        label: '4층',
        subject: '화학 (Chemistry)',
        layoutType: 'changui-standard',
        topRooms: [
          { id: 'cu-4-ev', name: '엘리베이터', type: 'facility', colSpan: 1 },
          { id: 'cu-4-cor1', name: '4층 상단 복도', type: 'corridor', colSpan: 4 },
          { id: 'cu-4-inst', name: '기기분석실', type: 'primary', colSpan: 2 }
        ],
        bottomRooms: [
          { id: 'cu-4-st', name: '계단', type: 'facility', colSpan: 1 },
          { id: 'cu-4-rne', name: '화학 R&E실', type: 'primary', colSpan: 1 },
          { id: 'cu-4-res', name: '화학 연구실', type: 'primary', colSpan: 1 },
          { id: 'cu-4-reag', name: '기기실 + 시약실', type: 'primary', colSpan: 1 },
          { id: 'cu-4-prep', name: '화학 실험 준비실', type: 'facility', colSpan: 1 },
          { id: 'cu-4-lab', name: '화학 실험실', type: 'primary', colSpan: 2 }
        ]
      },
      {
        id: 'RF',
        label: '옥상',
        subject: '천문대 (관측돔 · 천체관측실)',
        layoutType: 'changui-roof',
        rooms: [
          {
            id: 'cu-rf-obs',
            name: '천문대',
            subtitle: '관측돔 · 천체관측실',
            type: 'primary'
          }
        ]
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
        subject: '예체능실 (음악·미술·체육)',
        layoutType: 'seongchwi-1f',
        topRooms: [
          { id: 'sc-1-yoga', name: '요가실', type: 'secondary' },
          { id: 'sc-1-art', name: '미술실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-music', name: '음악실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-piano', name: '피아노실', subtitle: '주요 활용', type: 'primary' }
        ],
        bottomRooms: [
          { id: 'sc-1-inst', name: '기악실', subtitle: '주요 활용', type: 'primary' },
          { id: 'sc-1-golf', name: '골프연습실', type: 'secondary' },
          { id: 'sc-1-fitness', name: '체력단련실', type: 'secondary' },
          { id: 'sc-1-pingpong', name: '탁구실', subtitle: '주요 활용', type: 'primary' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '체육관',
        layoutType: 'seongchwi-2f',
        rooms: [
          {
            id: 'sc-2-gym',
            name: '체육관',
            subtitle: '다목적 실내 코트',
            type: 'primary'
          }
        ]
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
    const floorRooms = [
      ...(f.rooms || []),
      ...(f.topRooms || []),
      ...(f.midRooms || []),
      ...(f.bottomRooms || [])
    ].filter((r) => r.type !== 'corridor');

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
  '코딩실': 'ss-1-ai',
  'ai실': 'ss-1-ai',
  '정보실': 'ss-1-info',
  '멀티실': 'ss-1-clab',
  'clab': 'ss-1-clab',
  'c-lab': 'ss-1-clab',
  '씨랩': 'ss-1-clab',
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
      className="absolute left-1/2 top-full mt-2 z-50 w-[308px] -translate-x-1/2 rounded-2xl bg-[#242526] p-4 text-white shadow-2xl border border-[#3a3b3c]"
      role="dialog"
      aria-label="날짜 선택 달력"
    >
      {/* 상단 연월 & 위아래 화살표 */}
      <div className="mb-3.5 flex items-center justify-between px-1">
        <span className="text-[15px] font-bold tracking-tight text-white">
          {viewYear}년 {viewMonth + 1}월
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#b0b3b8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#b0b3b8] hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 (일 월 화 수 목 금 토) */}
      <div className="mb-2 grid grid-cols-7 text-center text-xs font-semibold text-[#e4e6eb]">
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
                className={`relative flex h-9 w-9 flex-col items-center justify-center rounded-full text-[13px] transition-colors ${
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
      <div className="mt-3 flex items-center justify-between border-t border-[#3a3b3c] pt-2.5 px-1 text-[11px]">
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
   * 평면도 내부 개별 실(Room) 타일 렌더러
   * ==========================================================================
   */
  const renderRoomTile = (room, spanCount = 1, minHeightClass = 'min-h-[104px]') => {
    const gridStyle =
      spanCount > 1
        ? { gridColumn: `span ${spanCount} / span ${spanCount}` }
        : undefined;

    if (room.type === 'corridor') {
      return (
        <div
          key={room.id}
          style={gridStyle}
          className="flex items-center justify-center border border-dashed border-[#cccccc] bg-[#f4f4f4] px-3 py-2 text-xs font-medium tracking-wider text-[#888888] select-none"
        >
          {room.name}
        </div>
      );
    }

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
      cardStyle = 'bg-[#f4f4f4] border-[#dcdcdc] text-[#777777] hover:bg-[#ededed]';
    } else {
      cardStyle = 'bg-white border-[#d6d6d6] text-[#222222] hover:border-[#6cb5a8] hover:bg-[#f9fcfb]';
    }

    return (
      <button
        key={room.id}
        type="button"
        style={gridStyle}
        onClick={() => setSelectedRoomId(room.id)}
        className={`group relative flex flex-col justify-between border p-2.5 text-left transition-all duration-150 focus:outline-none ${minHeightClass} ${cardStyle} ${
          isSelected ? 'ring-2 ring-[#5aa396] border-[#5aa396] z-10 shadow-xs' : ''
        } ${isSearchHit ? 'ring-2 ring-[#e87a3d] border-[#e87a3d]' : ''}`}
      >
        {/* 상단: 실 이름 & 상태 배지 */}
        <div className="flex w-full items-start justify-between gap-1.5">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`text-xs sm:text-[13px] font-bold leading-snug break-keep ${
                  isFacility && count === 0 ? 'text-[#777777] font-medium' : ''
                }`}
              >
                {room.name}
              </span>
              {room.subtitle && (
                <span className="border border-[#dcdcdc] bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold text-[#666666]">
                  {room.subtitle}
                </span>
              )}
            </div>
          </div>

          {count >= 2 && (
            <span className="inline-flex shrink-0 items-center bg-amber-500/15 border border-amber-400 px-1.5 py-0.5 text-[10.5px] font-bold text-amber-900">
              {count}팀 중복
            </span>
          )}
          {count === 1 && (
            <span className="inline-flex shrink-0 items-center bg-[#6cb5a8]/20 border border-[#6cb5a8] px-1.5 py-0.5 text-[10.5px] font-bold text-[#25574e]">
              1팀
            </span>
          )}
        </div>

        {/* 하단: 참여 팀 요약 또는 '비어 있음' 표시 */}
        <div className="mt-2 w-full">
          {count > 0 ? (
            <div className="flex flex-col gap-1">
              {roomEntries.map((item) => (
                <div
                  key={item.id}
                  className={`truncate px-2 py-1 text-[11px] font-semibold ${
                    count >= 2
                      ? 'bg-amber-200/65 text-amber-950'
                      : 'bg-[#cdebe5] text-[#1d3b36]'
                  }`}
                  title={`${item.leader} · ${item.content}`}
                >
                  <span className="font-bold">{item.leader}</span>
                  {item.members.length > 1 && (
                    <span className="opacity-75"> 외 {item.members.length - 1}명</span>
                  )}
                  <span className="mx-1 opacity-40">|</span>
                  <span className="font-normal opacity-90">{item.content}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="inline-block text-[11px] font-normal text-[#999999]">
              {isFacility ? '시설·준비 구역' : '비어 있음'}
            </span>
          )}
        </div>
      </button>
    );
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
          1. 과구리 최상단 민트색 그라데이션 헤더 (#76b9ad → #96cfc4)
         ==================================================================== */}
      <header className="w-full bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] text-white">
        <div className="mx-auto flex h-[54px] max-w-[1060px] items-center justify-between px-4 sm:px-6">
          {/* 좌측: 과구리 2x2 사각형 로고 + 브랜드 타이틀 */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2.5 text-left group shrink-0"
              title="과구리 탐활 공간 현황 홈으로"
            >
              <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                <span className="bg-[#2d3e40]" />
                <span className="bg-[#c3e5de]" />
                <span className="bg-[#95c9be]" />
                <span className="bg-[#58968b]" />
              </div>
              <span className="text-[22px] font-extrabold tracking-tight text-white">
                과구리
              </span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/95 truncate">
              <span className="font-medium">소개</span>
              <span className="opacity-60">|</span>
              <span className="font-medium">학생부 전산시스템 · 공용 탐활 공간 현황</span>
            </div>
          </div>

          {/* 우측: 공용 데이터 업데이트 버튼 */}
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="inline-flex items-center gap-1.5 border border-white/70 bg-white/15 hover:bg-white/25 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            <ClipboardPasteIcon className="h-3.5 w-3.5" />
            <span>탐활서 데이터 붙여넣기</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. 과구리 흰색 2줄 상단 메뉴바 (GNB)
         ==================================================================== */}
      <nav
        aria-label="과구리 전체 메뉴"
        className="w-full border-b border-[#dcdcdc] bg-white"
      >
        <div className="mx-auto max-w-[1060px] px-4 sm:px-6">
          {/* 1행 */}
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-9 overflow-x-auto py-2.5 text-xs sm:text-[13.5px] font-bold text-[#222222] border-b border-[#f2f2f2]">
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
          <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-9 overflow-x-auto py-2.5 text-xs sm:text-[13.5px] font-bold text-[#222222]">
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
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2.5px] bg-[#5aa396]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 알림 토스트 */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 border border-[#5aa396] bg-[#2d3e40] px-4 py-2.5 text-xs font-bold text-white shadow-lg">
          <CheckCircleIcon className="h-4 w-4 text-[#96cfc4] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          3. 메인 중앙 컨테이너 (과구리처럼 좌우 여백을 충분히 비운 max-w-[1060px])
         ==================================================================== */}
      <main className="mx-auto w-full max-w-[1060px] flex-1 px-4 sm:px-6 py-6 sm:py-8">
        {/* ==================================================================
            [첫 화면: 심플 센터 뷰] 건물 3개 중심 화면 + 직관적 날짜 선택기
           ================================================================== */}
        {viewMode === 'overview' ? (
          <div className="border border-[#dcdcdc] bg-white p-5 sm:p-8 space-y-6">
            {/* 상단 중앙 날짜 네비게이터 (< 11월 16일 (월) > + 캘린더 버튼) */}
            <div className="flex flex-col items-center justify-center border-b border-[#eeeeee] pb-6">
              <div className="relative flex items-center justify-center gap-3 sm:gap-4">
                {/* 왼쪽 화살표: 오늘(11월 16일)일 때는 숨겨서 오른쪽 방향만 표시 */}
                <button
                  type="button"
                  onClick={handlePrevDay}
                  disabled={isToday}
                  aria-label="이전 날짜"
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-all shadow-2xs ${
                    isToday ? 'invisible pointer-events-none' : 'visible'
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                {/* 중앙 날짜 표시 */}
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#222222]">
                    {formatShortKoreanDate(selectedDate)}
                  </h1>
                  {selectedDate === TODAY_STR && (
                    <span className="border border-[#bde0d9] bg-[#e6f5f2] px-2 py-0.5 text-[11px] font-extrabold text-[#25574e]">
                      오늘
                    </span>
                  )}
                </div>

                {/* 오른쪽 화살표 */}
                <button
                  type="button"
                  onClick={handleNextDay}
                  aria-label="다음 날짜"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors shadow-2xs"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>

                {/* 삼성 캘린더 스타일 달력 팝오버 버튼 */}
                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className={`ml-1 inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-bold transition-colors ${
                    isCalendarOpen
                      ? 'border-[#242526] bg-[#242526] text-white'
                      : 'border-[#dcdcdc] bg-[#fafafa] text-[#333333] hover:border-[#6cb5a8] hover:bg-[#f2faf8]'
                  }`}
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-[#5aa396]" />
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

              {/* 날짜 아래 간결한 한 줄 요약 & 시간대(면학) 필터 */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
                <span className="text-[#666666]">
                  전체 탐활 <strong className="text-[#222222]">{campusSummary.totalCount}건</strong>
                </span>
                <span className="text-[#dcdcdc]">|</span>
                <span className="text-[#666666]">
                  사용 중인 실 <strong className="text-[#25574e]">{campusSummary.activeRoomsCount}곳</strong>
                </span>
                <span className="text-[#dcdcdc]">|</span>
                <span className="text-[#666666]">
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

                <div className="ml-0 sm:ml-3 flex items-center gap-1">
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
                      className={`border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        selectedTimeFilter === tf.id
                          ? 'border-[#5aa396] bg-[#6cb5a8] text-white'
                          : 'border-[#dcdcdc] bg-[#fafafa] text-[#555555] hover:bg-[#efefef]'
                      }`}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 중앙 핵심 영역: 학교 건물 3개 (성실관 · 창의관 · 성취관) */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#666666]">
                <span>건물을 클릭하면 층별 평면도와 사용 중인 팀 현황을 확인할 수 있습니다.</span>

                <div className="flex items-center gap-2">
                  {/* 심플 검색 입력 */}
                  <div className="relative w-52 sm:w-64">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#999999]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="학생 이름, 학번, 실 이름 검색..."
                      className="w-full border border-[#dcdcdc] bg-[#fafafa] py-1.5 pl-8 pr-7 text-xs text-[#222222] placeholder:text-[#999999] focus:border-[#6cb5a8] focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#444444]"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {offCampusEntries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsOffCampusOpen(true)}
                      className="inline-flex items-center gap-1 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-900 transition-colors"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5 text-indigo-600" />
                      <span>교외 활동 ({offCampusEntries.length}건)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 검색 결과 빠른 이동 배너 (검색어 입력 시에만 표시) */}
              {normalizedQuery && (
                <div className="border border-orange-200 bg-orange-50/70 p-3">
                  <p className="text-xs font-extrabold text-orange-950 mb-2">
                    '{searchQuery}' 검색 결과 ({searchResults.matchedItems.length}건)
                  </p>
                  {searchResults.matchedItems.length === 0 ? (
                    <p className="text-xs text-[#666666]">
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
                          className="inline-flex items-center gap-2 border border-orange-300 bg-white hover:bg-orange-100 px-3 py-1.5 text-xs text-left transition-colors"
                        >
                          <span className="font-extrabold text-[#25574e]">
                            {room
                              ? `${room.buildingShortName} ${room.floorLabel} ${room.name}`
                              : item.rawLocation}
                          </span>
                          <span className="text-[#444444]">
                            {item.leader} · {item.content}
                          </span>
                          <ArrowRightIcon className="h-3.5 w-3.5 text-orange-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3개 건물 캠퍼스 맵 SVG */}
              <div className="relative overflow-hidden border border-[#dcdcdc] bg-gradient-to-b from-[#e4f3f0] via-[#f1f8f6] to-[#e9f2ea] p-4 sm:p-6">
                <div
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    backgroundImage: 'radial-gradient(#76b9ad 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />

                <svg
                  viewBox="0 0 1000 460"
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
                    x="18"
                    y="322"
                    width="964"
                    height="122"
                    rx="16"
                    fill="#d5ebd8"
                    opacity="0.85"
                  />
                  <path
                    d="M 75 392 Q 500 370 925 392"
                    stroke="#cbd5e1"
                    strokeWidth="18"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 75 392 Q 500 370 925 392"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeDasharray="10 10"
                    fill="none"
                  />

                  {/* 구름 */}
                  <g fill="#ffffff" opacity="0.88">
                    <circle cx="145" cy="52" r="16" />
                    <circle cx="168" cy="48" r="22" />
                    <circle cx="192" cy="53" r="15" />
                    <circle cx="810" cy="46" r="15" />
                    <circle cx="834" cy="42" r="20" />
                    <circle cx="856" cy="48" r="14" />
                  </g>

                  {/* 조경수 */}
                  {[55, 392, 712, 948].map((tx, idx) => (
                    <g key={idx} transform={`translate(${tx}, 334)`}>
                      <rect x="-4" y="16" width="8" height="20" fill="#854d0e" />
                      <circle cx="0" cy="9" r="16" fill="#15803d" />
                      <circle cx="-7" cy="14" r="10" fill="#22c55e" />
                      <circle cx="7" cy="13" r="11" fill="#16a34a" />
                    </g>
                  ))}

                  {/* 2층 본관-창의관 연결 통로 */}
                  <g>
                    <rect
                      x="355"
                      y="242"
                      width="75"
                      height="22"
                      fill="#e6f5f2"
                      stroke="#5aa396"
                      strokeWidth="2"
                    />
                    <line
                      x1="364"
                      y1="253"
                      x2="421"
                      y2="253"
                      stroke="#5aa396"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="392"
                      y="234"
                      textAnchor="middle"
                      fontSize="11.5"
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
                    <polygon points="75,136 220,100 365,136" fill="#2d3e40" />
                    <rect
                      x="82"
                      y="136"
                      width="276"
                      height="216"
                      fill="#ffffff"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongsil')
                          ? '#e87a3d'
                          : '#58968b'
                      }
                      strokeWidth={searchResults.matchedBuildingIds.has('seongsil') ? '5' : '3'}
                    />

                    {[0, 1, 2, 3].map((idx) => {
                      const y = 148 + idx * 48;
                      const floorLabel = `${4 - idx}F`;
                      return (
                        <g key={idx}>
                          <rect
                            x="94"
                            y={y}
                            width="252"
                            height="38"
                            fill="#f2faf8"
                            stroke="#bde0d9"
                            strokeWidth="1.5"
                          />
                          <text x="110" y={y + 24} fontSize="12.5" fontWeight="800" fill="#2d3e40">
                            {floorLabel}
                          </text>
                          {[145, 180, 215, 250, 285, 315].map((wx, wi) => (
                            <rect
                              key={wi}
                              x={wx}
                              y={y + 9}
                              width="22"
                              height="20"
                              fill="#c3e5de"
                            />
                          ))}
                        </g>
                      );
                    })}

                    <rect x="195" y="328" width="50" height="24" fill="#58968b" />
                    <text
                      x="220"
                      y="344"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      중앙현관
                    </text>

                    <rect x="112" y="64" width="216" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="220"
                      y="83"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      성실관 (본관 · 1~4F)
                    </text>

                    <g transform="translate(220, 36)">
                      <rect
                        x="-95"
                        y="-14"
                        width="190"
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
                        fontSize="12"
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
                      d="M 520 126 A 45 36 0 0 1 610 126 Z"
                      fill="#58968b"
                      stroke="#2d3e40"
                      strokeWidth="2"
                    />
                    <line
                      x1="565"
                      y1="90"
                      x2="585"
                      y2="108"
                      stroke="#c3e5de"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <rect x="440" y="126" width="250" height="14" fill="#2d3e40" />
                    <text
                      x="565"
                      y="136"
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="700"
                      fill="#c3e5de"
                    >
                      옥상 천문대
                    </text>

                    <rect
                      x="430"
                      y="140"
                      width="270"
                      height="212"
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
                      const y = 151 + idx * 48;
                      return (
                        <g key={idx}>
                          <rect
                            x="442"
                            y={y}
                            width="246"
                            height="38"
                            fill={item.color}
                            stroke="#bde0d9"
                            strokeWidth="1.5"
                          />
                          <text x="454" y={y + 24} fontSize="12" fontWeight="800" fill="#2d3e40">
                            {item.floor}
                          </text>
                          {[545, 580, 615, 650].map((wx, wi) => (
                            <rect
                              key={wi}
                              x={wx}
                              y={y + 9}
                              width="24"
                              height="20"
                              fill="#95c9be"
                              opacity="0.75"
                            />
                          ))}
                        </g>
                      );
                    })}

                    <rect x="452" y="50" width="226" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="565"
                      y="69"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      창의관 (실험동 · 1~4F+옥상)
                    </text>

                    <g transform="translate(565, 22)">
                      <rect
                        x="-98"
                        y="-14"
                        width="196"
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
                        fontSize="12"
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
                    <path d="M 735 204 Q 840 156 945 204 Z" fill="#2d3e40" />
                    <rect
                      x="740"
                      y="204"
                      width="200"
                      height="148"
                      fill="#ffffff"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongchwi')
                          ? '#e87a3d'
                          : '#58968b'
                      }
                      strokeWidth={searchResults.matchedBuildingIds.has('seongchwi') ? '5' : '3'}
                    />

                    <rect
                      x="752"
                      y="216"
                      width="176"
                      height="56"
                      fill="#f2faf8"
                      stroke="#bde0d9"
                      strokeWidth="1.5"
                    />
                    <text
                      x="840"
                      y="241"
                      textAnchor="middle"
                      fontSize="13.5"
                      fontWeight="800"
                      fill="#2d3e40"
                    >
                      2F 체육관
                    </text>
                    <text
                      x="840"
                      y="260"
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#58968b"
                    >
                      다목적 실내 코트
                    </text>

                    <rect
                      x="752"
                      y="282"
                      width="176"
                      height="56"
                      fill="#fafafa"
                      stroke="#dcdcdc"
                      strokeWidth="1.5"
                    />
                    <text
                      x="840"
                      y="307"
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="800"
                      fill="#2d3e40"
                    >
                      1F 예체능실
                    </text>
                    <text
                      x="840"
                      y="325"
                      textAnchor="middle"
                      fontSize="10.5"
                      fontWeight="600"
                      fill="#666666"
                    >
                      음악 · 피아노 · 기악 · 미술 · 탁구
                    </text>

                    <rect x="745" y="126" width="190" height="28" rx="14" fill="#2d3e40" />
                    <text
                      x="840"
                      y="145"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill="#ffffff"
                    >
                      성취관 (강당 · 1~2F)
                    </text>

                    <g transform="translate(840, 98)">
                      <rect
                        x="-92"
                        y="-14"
                        width="184"
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
                        fontSize="12"
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

              {/* 하단: 3개 건물 빠른 진입 카드 (여유로운 3열 그리드) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {BUILDINGS.map((b) => {
                  const st = buildingStats[b.id];
                  const dupCount = st.duplicateRooms.length;
                  return (
                    <div
                      key={b.id}
                      className={`flex flex-col justify-between border bg-white p-4 transition-colors ${
                        dupCount > 0 ? 'border-amber-300' : 'border-[#dcdcdc]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-extrabold text-[#222222]">
                            {b.name}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-bold ${
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
                        <p className="mt-1.5 text-xs text-[#666666] leading-relaxed">
                          {b.subtitle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleEnterBuilding(b.id)}
                        className="mt-4 flex w-full items-center justify-center gap-1.5 border border-[#2d3e40] bg-[#2d3e40] hover:bg-[#5aa396] hover:border-[#5aa396] py-2 text-xs font-bold text-white transition-colors"
                      >
                        <span>{b.shortName} 층별 평면도 보기</span>
                        <ArrowRightIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ==================================================================
             [건물 내부 뷰] 층별 평면도(상단) + 선택한 실 상세 정보(하단)
             ================================================================== */
          <div className="space-y-5">
            {/* 상단 네비게이션 바: 캠퍼스 전체로 돌아가기 + 건물 탭 + 날짜 이동 */}
            <div className="flex flex-wrap items-center justify-between gap-3 border border-[#dcdcdc] bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="inline-flex items-center gap-1.5 border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] px-3 py-1.5 text-xs font-extrabold text-[#333333] transition-colors"
                >
                  <ArrowLeftIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                  <span>건물 전체 맵</span>
                </button>

                <div className="h-4 w-px bg-[#dcdcdc] mx-1 hidden sm:block" />

                {BUILDINGS.map((b) => {
                  const isCurrent = selectedBuildingId === b.id;
                  const dupCount = buildingStats[b.id].duplicateRooms.length;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleEnterBuilding(b.id)}
                      className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-extrabold transition-colors ${
                        isCurrent
                          ? 'border-[#5aa396] bg-[#6cb5a8] text-white'
                          : 'border-[#dcdcdc] bg-white text-[#444444] hover:bg-[#f2f2f2]'
                      }`}
                    >
                      <span>{b.name}</span>
                      {dupCount > 0 && (
                        <span
                          className={`px-1.5 py-0.2 text-[10px] font-bold ${
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
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  disabled={isToday}
                  aria-label="이전 날짜"
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors ${
                    isToday ? 'invisible pointer-events-none' : 'visible'
                  }`}
                >
                  <ChevronLeftIcon className="h-3.5 w-3.5" />
                </button>

                <span className="text-xs sm:text-sm font-extrabold text-[#222222]">
                  {formatShortKoreanDate(selectedDate)}
                </span>

                <button
                  type="button"
                  onClick={handleNextDay}
                  aria-label="다음 날짜"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e87a3d] hover:bg-[#d6692d] text-white transition-colors"
                >
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="ml-1 inline-flex items-center gap-1 border border-[#dcdcdc] bg-[#fafafa] hover:border-[#6cb5a8] px-2.5 py-1 text-xs font-bold text-[#333333]"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-[#5aa396]" />
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

            {/* 평면도 카드 */}
            <div className="border border-[#dcdcdc] bg-white p-5 sm:p-6 space-y-4">
              {/* 층 선택 탭 & 상태 범례 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeeee] pb-3.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 pr-1 text-xs font-extrabold text-[#555555]">
                    <LayersIcon className="h-3.5 w-3.5 text-[#5aa396]" />
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
                        className={`inline-flex items-center gap-1.5 border px-3.5 py-1.5 text-xs font-extrabold transition-colors ${
                          isFloorSelected
                            ? 'border-[#2d3e40] bg-[#2d3e40] text-white'
                            : 'border-[#dcdcdc] bg-[#fafafa] text-[#333333] hover:bg-[#efefef]'
                        }`}
                      >
                        <span>{floor.label}</span>
                        {hasDup ? (
                          <span className="bg-amber-400 text-amber-950 px-1.5 py-0.2 text-[10px] font-extrabold">
                            {teamCount}팀 중복
                          </span>
                        ) : teamCount > 0 ? (
                          <span
                            className={`px-1.5 py-0.2 text-[10px] font-bold ${
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

                {/* 범례 */}
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-[#666666]">
                    <span className="h-2.5 w-2.5 border border-[#cccccc] bg-white" />
                    비어 있음
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#25574e]">
                    <span className="h-2.5 w-2.5 border border-[#6cb5a8] bg-[#e6f5f2]" />
                    1팀 사용 중
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-amber-900">
                    <span className="h-2.5 w-2.5 border border-amber-400 bg-amber-100" />
                    2팀 이상 중복
                  </span>
                </div>
              </div>

              {/* 현재 층 제목 */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#5aa396] px-2.5 py-0.5 text-xs font-extrabold text-white">
                    {activeBuilding.shortName} · {activeFloor.label}
                  </span>
                  <h2 className="text-base sm:text-lg font-extrabold text-[#222222]">
                    {activeFloor.subject}
                  </h2>
                </div>
                <span className="text-xs text-[#777777]">
                  아래 평면도에서 실을 클릭하면 상세 내역이 표시됩니다
                </span>
              </div>

              {/* [레이아웃 A] 성실관 (본관) 1F~4F */}
              {activeFloor.layoutType === 'seongsil-corridor' && (
                <div className="overflow-x-auto pb-1">
                  <div className="min-w-[840px] space-y-2.5 border border-[#cccccc] bg-[#f6f6f6] p-3">
                    <div className="flex items-center justify-between border border-[#dcdcdc] bg-[#eaeaea] px-3.5 py-2 text-xs font-bold tracking-wider text-[#555555]">
                      <span>◀ 서측 계단</span>
                      <span>{activeFloor.corridorLabel}</span>
                      {activeFloor.hasBridge ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBuildingId('changui');
                            setSelectedFloorId('2F');
                            setSelectedRoomId('cu-2-lab');
                          }}
                          className="border border-[#5aa396] bg-[#e6f5f2] px-2.5 py-0.5 text-[11px] font-extrabold text-[#25574e] hover:bg-[#cdebe5]"
                        >
                          창의관 2층 연결통로 이동 →
                        </button>
                      ) : (
                        <span>동측 계단 (면학실 방면) ▶</span>
                      )}
                    </div>

                    <div
                      className="grid gap-2"
                      style={{
                        gridTemplateColumns: `repeat(${activeFloor.rooms.reduce(
                          (sum, r) => sum + (r.span || 1),
                          0
                        )}, minmax(0, 1fr))`
                      }}
                    >
                      {activeFloor.rooms.map((room) =>
                        renderRoomTile(room, room.span || 1, 'min-h-[116px]')
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* [레이아웃 B] 창의관 (실험동) 1층, 3층, 4층 */}
              {activeFloor.layoutType === 'changui-standard' && (
                <div className="space-y-2.5 border border-[#cccccc] bg-[#f6f6f6] p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                    {activeFloor.topRooms.map((room) =>
                      renderRoomTile(room, room.colSpan || 1, 'min-h-[88px]')
                    )}
                  </div>

                  <div className="border border-[#dcdcdc] bg-[#eaeaea] py-2 text-center text-xs font-bold tracking-widest text-[#666666]">
                    {activeFloor.label} 실험동 중앙 복도
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                    {activeFloor.bottomRooms.map((room) =>
                      renderRoomTile(room, room.colSpan || 1, 'min-h-[116px]')
                    )}
                  </div>
                </div>
              )}

              {/* [레이아웃 C] 창의관 2층 */}
              {activeFloor.layoutType === 'changui-2f' && (
                <div className="space-y-2.5 border border-[#cccccc] bg-[#f6f6f6] p-3">
                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                    {activeFloor.topRooms.map((room) =>
                      renderRoomTile(room, room.colSpan || 1, 'min-h-[86px]')
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                    {activeFloor.midRooms.map((room) =>
                      renderRoomTile(room, room.colSpan || 1, 'min-h-[82px]')
                    )}
                  </div>

                  <div className="border border-[#dcdcdc] bg-[#eaeaea] py-2 text-center text-xs font-bold tracking-widest text-[#666666]">
                    2층 물리학 · 수학 구역 복도
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
                    {activeFloor.bottomRooms.map((room) =>
                      renderRoomTile(room, room.colSpan || 1, 'min-h-[118px]')
                    )}
                  </div>
                </div>
              )}

              {/* [레이아웃 D] 창의관 옥상 (천문대) */}
              {activeFloor.layoutType === 'changui-roof' && (
                <div className="border border-[#cccccc] bg-[#f6f6f6] p-4">
                  <div className="mb-2.5 flex items-center justify-between text-xs font-bold text-[#666666]">
                    <span>ROOFTOP OBSERVATORY · 창의관 옥상</span>
                    <EyeIcon className="h-4 w-4 text-[#5aa396]" />
                  </div>
                  <div className="grid grid-cols-1">
                    {activeFloor.rooms.map((room) =>
                      renderRoomTile(room, 1, 'min-h-[160px]')
                    )}
                  </div>
                </div>
              )}

              {/* [레이아웃 E] 성취관 (강당) 2층 체육관 */}
              {activeFloor.layoutType === 'seongchwi-2f' && (
                <div className="border border-[#cccccc] bg-[#f6f6f6] p-4">
                  <div className="mb-2.5 border border-[#dcdcdc] bg-[#eaeaea] py-2 text-center text-xs font-bold tracking-widest text-[#666666]">
                    강당 무대 / 단상 (STAGE)
                  </div>
                  <div className="grid grid-cols-1">
                    {activeFloor.rooms.map((room) =>
                      renderRoomTile(room, 1, 'min-h-[180px]')
                    )}
                  </div>
                </div>
              )}

              {/* [레이아웃 F] 성취관 (강당) 1층 예체능실 */}
              {activeFloor.layoutType === 'seongchwi-1f' && (
                <div className="space-y-2.5 border border-[#cccccc] bg-[#f6f6f6] p-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeFloor.topRooms.map((room) =>
                      renderRoomTile(room, 1, 'min-h-[112px]')
                    )}
                  </div>

                  <div className="border border-[#dcdcdc] bg-[#eaeaea] py-2 text-center text-xs font-bold tracking-widest text-[#666666]">
                    성취관 1층 예체능실 복도
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {activeFloor.bottomRooms.map((room) =>
                      renderRoomTile(room, 1, 'min-h-[112px]')
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 하단: 선택한 실(Room) 상세 정보 카드 */}
            {activeRoom && (
              <div className="border border-[#dcdcdc] bg-white p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeeeee] pb-3.5">
                  <div>
                    <p className="text-xs font-bold text-[#5aa396]">
                      {activeRoom.buildingName} &gt; {activeRoom.floorLabel} ({activeRoom.floorSubject})
                    </p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-[#222222]">
                        {activeRoom.name}
                      </h3>
                      {activeRoom.subtitle && (
                        <span className="text-xs font-semibold text-[#777777]">
                          ({activeRoom.subtitle})
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-extrabold ${
                      activeRoomEntries.length >= 2
                        ? 'border border-amber-400 bg-amber-100 text-amber-950'
                        : activeRoomEntries.length === 1
                        ? 'border border-[#6cb5a8] bg-[#e6f5f2] text-[#25574e]'
                        : 'border border-[#dcdcdc] bg-[#fafafa] text-[#777777]'
                    }`}
                  >
                    {activeRoomEntries.length >= 2
                      ? `현재 ${activeRoomEntries.length}팀 중복 사용 중`
                      : activeRoomEntries.length === 1
                      ? '1팀 사용 중'
                      : '비어 있음 (사용 가능)'}
                  </span>
                </div>

                {/* 중복 사용 안내 */}
                {activeRoomEntries.length >= 2 && (
                  <div className="border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-950">
                    현재 <strong>{activeRoomEntries.length}개 팀</strong>이 함께 배정되어 있습니다. 각 팀의 활동시간과 내용을 확인하세요.
                  </div>
                )}

                {activeRoomEntries.length === 0 ? (
                  <div className="border border-dashed border-[#cccccc] bg-[#fafafa] py-8 text-center">
                    <p className="text-sm font-bold text-[#666666]">
                      {formatShortKoreanDate(selectedDate)} 기준 배정된 탐활이 없습니다.
                    </p>
                    <p className="mt-1 text-xs text-[#999999]">
                      현재 비어 있는 공간입니다.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeRoomEntries.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`border bg-[#fcfcfc] p-4 space-y-3 ${
                          activeRoomEntries.length >= 2
                            ? 'border-amber-300'
                            : 'border-[#bde0d9]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeeeee] pb-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-extrabold text-white ${
                              activeRoomEntries.length >= 2
                                ? 'bg-amber-600'
                                : 'bg-[#5aa396]'
                            }`}
                          >
                            팀 #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-[#555555]">
                            {item.timeSlots.join(', ')}
                          </span>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-[#888888]">활동내용</p>
                          <p className="mt-0.5 text-sm font-extrabold text-[#222222]">
                            {item.content}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 border border-[#eeeeee] bg-white p-2.5 text-xs">
                          <div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#888888]">
                              <UserCheckIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                              대표학생
                            </span>
                            <p className="mt-0.5 font-extrabold text-[#222222]">
                              {item.leader}
                            </p>
                          </div>
                          <div>
                            <span className="flex items-center gap-1 text-[11px] font-bold text-[#888888]">
                              <GraduationCapIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                              지도교사
                            </span>
                            <p className="mt-0.5 font-extrabold text-[#222222]">
                              {item.teacher} 선생님
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="mb-1.5 text-[11px] font-bold text-[#888888]">
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
                                  className={`border px-2 py-0.5 text-xs ${
                                    isSearchHit
                                      ? 'border-[#e87a3d] bg-orange-50 font-extrabold text-orange-950'
                                      : 'border-[#dcdcdc] bg-white font-medium text-[#444444]'
                                  }`}
                                >
                                  {member}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-[#eeeeee] pt-2 text-[11px] text-[#999999]">
                          <span>원본 표기: {item.rawLocation}</span>
                          {item.submittedAt && <span>{item.submittedAt}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ====================================================================
          과구리 탐활서 데이터 붙여넣기 모달
         ==================================================================== */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl overflow-hidden border border-[#dcdcdc] bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-3.5 text-white">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold">
                  과구리 탐활서 데이터 붙여넣기
                </h3>
                <p className="text-[11px] text-white/90">
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

            <div className="p-5 space-y-3.5 max-h-[82vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 border border-[#bde0d9] bg-[#f2faf8] p-3 text-xs text-[#25574e]">
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
                  className="inline-flex items-center gap-1 bg-[#5aa396] hover:bg-[#498d81] px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors"
                >
                  <RotateCcwIcon className="h-3 w-3" />
                  기본 샘플 데이터(21건) 불러오기
                </button>
              </div>

              <textarea
                rows={7}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder={`과구리 탐활서 게시판 내용을 그대로 복사(Ctrl+C)하여 여기에 붙여넣으세요(Ctrl+V)...\n\n예시)\n활동날짜2026-11-16\n활동시간19:10 ~ 20:20, 20:30 ~ 21:30\n활동장소물리실험실\n활동내용KYPT 준비 및 실험\n대표학생2304 김민건\n참가학생2304 김민건, 2215 신태민\n지도교사김희웅`}
                className="w-full border border-[#dcdcdc] bg-[#fafafa] p-3 text-xs sm:text-sm text-[#222222] placeholder:text-[#999999] focus:border-[#6cb5a8] focus:bg-white focus:outline-none"
              />

              {previewParsedEntries.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#333333]">
                    <span>
                      자동 파싱 미리보기: 총{' '}
                      <strong className="text-[#5aa396]">
                        {previewParsedEntries.length}건
                      </strong>{' '}
                      인식됨
                    </span>
                    <span className="text-[#777777]">
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

                  <div className="max-h-44 overflow-y-auto border border-[#dcdcdc]">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f4f4f4] text-[#555555] font-bold border-b border-[#dcdcdc]">
                        <tr>
                          <th className="px-3 py-1.5">날짜</th>
                          <th className="px-3 py-1.5">원본 장소 → 매핑 공간</th>
                          <th className="px-3 py-1.5">대표학생</th>
                          <th className="px-3 py-1.5">활동내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eeeeee]">
                        {previewParsedEntries.map((row) => {
                          const mapped = row.normalizedRoomId
                            ? ROOM_BY_ID[row.normalizedRoomId]
                            : null;
                          return (
                            <tr key={row.id}>
                              <td className="px-3 py-1.5 whitespace-nowrap text-[#666666]">
                                {row.date}
                              </td>
                              <td className="px-3 py-1.5">
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
                              <td className="px-3 py-1.5 font-bold text-[#222222] whitespace-nowrap">
                                {row.leader}
                              </td>
                              <td className="px-3 py-1.5 text-[#555555] truncate max-w-[180px]">
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

              <div className="flex justify-end gap-2 pt-2 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="border border-[#dcdcdc] bg-white px-4 py-1.5 text-xs font-bold text-[#555555] hover:bg-[#f4f4f4]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedText}
                  className="bg-[#5aa396] hover:bg-[#498d81] px-5 py-1.5 text-xs font-bold text-white transition-colors"
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
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-3.5 text-white">
              <div className="flex items-center gap-2">
                <ExternalLinkIcon className="h-4 w-4" />
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold">
                    교외 / 기타 장소 탐활 내역
                  </h3>
                  <p className="text-[11px] text-white/90">
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

            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto bg-[#fafafa]">
              {offCampusEntries.length === 0 ? (
                <p className="py-8 text-center text-xs text-[#777777]">
                  선택된 날짜·시간에 교외/기타 장소 활동이 없습니다.
                </p>
              ) : (
                offCampusEntries.map((item) => (
                  <div
                    key={item.id}
                    className="border border-[#dcdcdc] bg-white p-4 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">
                        <MapPinIcon className="h-3 w-3" />
                        {item.rawLocation}
                      </span>
                      <span className="text-xs font-bold text-[#666666]">
                        {item.timeSlots.join(', ')}
                      </span>
                    </div>

                    <p className="text-sm font-extrabold text-[#222222]">
                      {item.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#444444]">
                      <span>
                        <strong>대표학생:</strong> {item.leader}
                      </span>
                      <span>
                        <strong>지도교사:</strong> {item.teacher} 선생님
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {item.members.map((m, idx) => (
                        <span
                          key={idx}
                          className="border border-[#dcdcdc] bg-[#fafafa] px-2 py-0.5 text-[11px] font-medium text-[#444444]"
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
