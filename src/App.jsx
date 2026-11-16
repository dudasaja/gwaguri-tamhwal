import React, { useState, useMemo, useEffect } from 'react';

/**
 * ============================================================================
 * 0. 자체 인라인 SVG 아이콘 컴포넌트 (외부 아이콘 패키지 의존성 제로)
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
 *    - 각 층을 '상단 구역 · 중앙 복도 · 하단 구역'의 3~4열 블록 그리드로 배치해
 *      실 이름과 참여 팀 요약이 세로 줄바꿈 없이 가로로 깔끔하게 표시됨
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
        topLabel: '상단 정보 · AI · 코딩 구역',
        topCols: 3,
        topRooms: [
          { id: 'ss-1-ai', name: 'AI실', type: 'primary' },
          { id: 'ss-1-info', name: '정보실', type: 'primary' },
          { id: 'ss-1-clab', name: '코딩실', subtitle: '구 멀티실', type: 'primary' }
        ],
        corridorLabel: '1층 복도 (서측 계단 ↔ 중앙현관 ↔ 동측 계단)',
        bottomLabel: '하단 행정 · 교직원 · 생활 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'ss-1-health', name: '보건실', type: 'facility' },
          { id: 'ss-1-council', name: '교직원협의실', type: 'facility' },
          { id: 'ss-1-prin', name: '교장실', type: 'facility' },
          { id: 'ss-1-office', name: '행정실', type: 'facility' },
          { id: 'ss-1-lobby', name: '중앙현관', type: 'facility' },
          { id: 'ss-1-print', name: '발간실', type: 'facility' },
          { id: 'ss-1-cafeteria', name: '급식실', type: 'facility' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '1학년 교실 · 역사관 · 방송실 · 교무실',
        topLabel: '상단 1학년 교실 구역',
        topCols: 4,
        topRooms: [
          { id: 'ss-2-101', name: '1-1', subtitle: '1학년 1반 교실', type: 'classroom' },
          { id: 'ss-2-102', name: '1-2', subtitle: '1학년 2반 교실', type: 'classroom' },
          { id: 'ss-2-103', name: '1-3', subtitle: '1학년 3반 교실', type: 'classroom' },
          { id: 'ss-2-104', name: '1-4', subtitle: '1학년 4반 교실', type: 'classroom' }
        ],
        corridorLabel: '2층 복도 · 창의관 2층 연결통로 방면 →',
        hasBridgeToChangui: true,
        bottomLabel: '하단 특별실 · 교무 · 학습 지원 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'ss-2-hist', name: '역사관', type: 'primary' },
          { id: 'ss-2-broad', name: '방송실', type: 'primary' },
          { id: 'ss-2-t1', name: '1학년실', type: 'facility' },
          { id: 'ss-2-vp', name: '교감실', type: 'facility' },
          { id: 'ss-2-staff', name: '교무실', type: 'facility' },
          { id: 'ss-2-adm', name: '입학담당관실', type: 'facility' },
          { id: 'ss-2-sup', name: '사감실', type: 'facility' },
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
        corridorLabel: '3층 복도',
        bottomLabel: '하단 도서관 · 학습 지원 구역',
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
        subject: '3학년 교실 · 학생회의실 · 무한상상실',
        topLabel: '상단 3학년 교실 구역',
        topCols: 4,
        topRooms: [
          { id: 'ss-4-301', name: '3-1', subtitle: '3학년 1반 교실', type: 'classroom' },
          { id: 'ss-4-302', name: '3-2', subtitle: '3학년 2반 교실', type: 'classroom' },
          { id: 'ss-4-303', name: '3-3', subtitle: '3학년 3반 교실', type: 'classroom' },
          { id: 'ss-4-304', name: '3-4', subtitle: '3학년 4반 교실', type: 'classroom' }
        ],
        corridorLabel: '4층 복도',
        bottomLabel: '하단 특별실 · 학생자치 구역',
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
        topLabel: '상단 지구과학 R&E · 연구 · 박편 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-1-rne', name: '지구과학 R&E실', type: 'primary' },
          { id: 'cu-1-res', name: '지구과학 연구실', type: 'primary' },
          { id: 'cu-1-thin', name: '박편 제작실', type: 'primary' }
        ],
        corridorLabel: '1층 지구과학 중앙 복도',
        bottomLabel: '하단 지구과학 실험 · 준비 · 시청각 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-1-lab', name: '지구과학 실험실', type: 'primary' },
          { id: 'cu-1-prep', name: '지구과학 실험 준비실', type: 'facility' },
          { id: 'cu-1-av', name: '시청각실', type: 'primary' }
        ]
      },
      {
        id: '2F',
        label: '2층',
        subject: '물리학 & 수학',
        topLabel: '상단 연결 통로 · 수학실 구역',
        topCols: 4,
        topRooms: [
          {
            id: 'cu-2-bridge',
            name: '본관 연결 통로',
            subtitle: '성실관 2층 바로가기',
            type: 'bridge',
            targetBuildingId: 'seongsil',
            targetFloorId: '2F'
          },
          { id: 'cu-2-parent', name: '학부모회실', type: 'facility' },
          { id: 'cu-2-math1', name: '수학실1', type: 'primary' },
          { id: 'cu-2-math2', name: '수학실2', type: 'primary' }
        ],
        corridorLabel: '2층 물리학 · 수학 중앙 복도',
        bottomLabel: '하단 물리 실험 · R&E · 특수실험 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'cu-2-lab', name: '물리 실험실', type: 'primary' },
          { id: 'cu-2-rne', name: '물리 R&E실', type: 'primary' },
          { id: 'cu-2-res', name: '물리 연구실', type: 'primary' },
          { id: 'cu-2-fluid', name: '유체역학 실험실', type: 'primary' },
          { id: 'cu-2-sem', name: 'SEM실 + 풍동실', type: 'primary' },
          { id: 'cu-2-dark', name: '암실', type: 'primary' },
          { id: 'cu-2-prep', name: '물리 실험 준비실', type: 'facility' }
        ]
      },
      {
        id: '3F',
        label: '3층',
        subject: '생명과학 (Biology)',
        topLabel: '상단 생명과학 R&E · 연구 · 배양 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-3-rne', name: '생명과학 R&E실', type: 'primary' },
          { id: 'cu-3-res', name: '생명과학 연구실', type: 'primary' },
          { id: 'cu-3-cult', name: '미생물 배양실', type: 'primary' }
        ],
        corridorLabel: '3층 생명과학 중앙 복도',
        bottomLabel: '하단 생명과학 실험 · 분자 · 준비 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-3-lab', name: '생명과학 실험실', type: 'primary' },
          { id: 'cu-3-mol', name: '분자실험실', type: 'primary' },
          { id: 'cu-3-prep', name: '생명과학 실험 준비실', type: 'facility' }
        ]
      },
      {
        id: '4F',
        label: '4층',
        subject: '화학 (Chemistry)',
        topLabel: '상단 화학 R&E · 연구 · 기기분석 구역',
        topCols: 3,
        topRooms: [
          { id: 'cu-4-rne', name: '화학 R&E실', type: 'primary' },
          { id: 'cu-4-res', name: '화학 연구실', type: 'primary' },
          { id: 'cu-4-inst', name: '기기분석실', type: 'primary' }
        ],
        corridorLabel: '4층 화학 중앙 복도',
        bottomLabel: '하단 화학 실험 · 시약 · 준비 구역',
        bottomCols: 3,
        bottomRooms: [
          { id: 'cu-4-lab', name: '화학 실험실', type: 'primary' },
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
        corridorLabel: '창의관 옥상 천체관측 데크',
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
        topLabel: '상단 음악 · 미술 구역',
        topCols: 4,
        topRooms: [
          { id: 'sc-1-music', name: '음악실', type: 'primary' },
          { id: 'sc-1-piano', name: '피아노실', type: 'primary' },
          { id: 'sc-1-inst', name: '기악실', type: 'primary' },
          { id: 'sc-1-art', name: '미술실', type: 'primary' }
        ],
        corridorLabel: '성취관 1층 예체능실 복도',
        bottomLabel: '하단 실내 체육 · 연습 구역',
        bottomCols: 4,
        bottomRooms: [
          { id: 'sc-1-pingpong', name: '탁구실', type: 'primary' },
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
        corridorLabel: '성취관 2층 강당 무대 / 단상',
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
      if (r.type === 'bridge') return;
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

  // 창의관 3층 생명과학
  '생명과학실': 'cu-3-lab',
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
  '지구과학실': 'cu-1-lab',
  '지구과학실험실': 'cu-1-lab',
  '지학실험실': 'cu-1-lab',
  '지구과학r&e': 'cu-1-rne',
  '지구과학r&e실': 'cu-1-rne',
  '지구과학연구실': 'cu-1-res',
  '지구과학실험준비실': 'cu-1-prep',
  '박편제작실': 'cu-1-thin',
  '시청각실': 'cu-1-av',
  '천문대': 'cu-rf-obs',

  // 성실관 (본관) 특별실 & 교실
  '코딩실': 'ss-1-clab',
  '멀티실': 'ss-1-clab',
  'clab': 'ss-1-clab',
  'c-lab': 'ss-1-clab',
  '씨랩': 'ss-1-clab',
  'ai실': 'ss-1-ai',
  '정보실': 'ss-1-info',
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
 * 3. 과구리 최신 탐활서 원문 기본 데이터 (총 27건 전체 반영)
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
11월 16일 17시 02분 35초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리실험실
활동내용물리학 실험
대표학생1203김웅
참가학생1203김웅, 1208박제경, 1213이시후, 1219황연준
지도교사강대혁
지원X
11월 16일 17시 21분 34초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소생명과학실
활동내용생명탐구
대표학생1201김슬우
참가학생1315이서진
지도교사김창진
지원X
11월 16일 18시 03분 02초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소코딩실
활동내용소프트웨어경시대회준비
대표학생1111 이미엘
참가학생1111 이미엘, 1409 신승민, 1319 현명원
지도교사진정숙
지원X
11월 16일 18시 12분 25초

활동날짜2026-11-16
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소물리 실험실
활동내용물리 탐구활동
대표학생2111이승찬
참가학생2111 이승찬, 2108 방시우, 2307 김현우
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
11월 16일 17시 22분 09초

활동날짜2026-11-17
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소생명과학실
활동내용생명탐구
대표학생1315이서진
참가학생1102구현준
지도교사김창진
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
11월 16일 17시 22분 42초

활동날짜2026-11-18
활동시간19:10 ~ 20:20, 20:30 ~ 21:30
활동장소생명과학실
활동내용생명탐구
대표학생1102구현준
참가학생.
지도교사김창진
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

const STORAGE_KEY = 'gwaguri_tamhwal_entries_v3';

/**
 * ============================================================================
 * 4. 과구리 게시판 텍스트 전용 자동 파서 (한 줄 & 줄바꿈/탭 복사 형식 모두 완벽 지원)
 * ============================================================================
 */
const FIELD_LABELS = [
  '활동날짜',
  '활동시간',
  '활동장소',
  '활동내용',
  '대표학생',
  '참가학생',
  '지도교사',
  '지원'
];

const TIMESTAMP_REGEX = /^\d{1,2}월\s*\d{1,2}일\s*\d{1,2}시/;

function matchFieldPrefix(line) {
  for (const label of FIELD_LABELS) {
    if (line.startsWith(label)) {
      const rest = line
        .slice(label.length)
        .replace(/^[\s\t:：-]+/, '')
        .trim();
      return { label, rest };
    }
  }
  return null;
}

function parseGwaguriRawText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const parsedList = [];
  let current = null;
  let lastTimestamp = '';
  let lastActiveField = null;

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

  const assignFieldValue = (label, value) => {
    if (label === '활동날짜') {
      flushCurrent();
      const dateMatch = value.match(/\d{4}[-./]\d{1,2}[-./]\d{1,2}/);
      const normalizedDate = dateMatch
        ? dateMatch[0].replace(/[./]/g, '-')
        : value;
      current = {
        submittedAt: lastTimestamp,
        date: normalizedDate,
        timeSlots: [],
        rawLocation: '',
        content: '',
        leader: '',
        members: [],
        teacher: '',
        support: 'X'
      };
      return;
    }

    if (!current) return;

    if (label === '활동시간') {
      current.timeSlots = value
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (label === '활동장소') {
      current.rawLocation = value;
    } else if (label === '활동내용') {
      current.content = value;
    } else if (label === '대표학생') {
      current.leader = value.replace(/^[.,\s]+|[.,\s]+$/g, '');
    } else if (label === '참가학생') {
      const cleanedStr = value.replace(/^[.,\s]+|[.,\s]+$/g, '');
      const splitMembers = cleanedStr
        .split(',')
        .map((m) => m.replace(/^[.,\s]+|[.,\s]+$/g, '').trim())
        .filter((m) => m && m !== '.' && m !== '-' && m !== '없음');

      if (current.leader && !splitMembers.includes(current.leader)) {
        current.members = [current.leader, ...splitMembers];
      } else {
        current.members = splitMembers;
      }
    } else if (label === '지도교사') {
      current.teacher = value;
    } else if (label === '지원') {
      current.support = value;
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];

    if (TIMESTAMP_REGEX.test(line)) {
      lastTimestamp = line;
      lastActiveField = null;
      continue;
    }

    const fieldMatch = matchFieldPrefix(line);
    if (fieldMatch) {
      let { label, rest } = fieldMatch;

      if (!rest && i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        if (!TIMESTAMP_REGEX.test(nextLine) && !matchFieldPrefix(nextLine)) {
          rest = nextLine;
          i += 1;
        }
      }

      assignFieldValue(label, rest);
      lastActiveField = label;
      continue;
    }

    if (current && lastActiveField === '활동내용') {
      current.content = `${current.content} ${line}`.trim();
    } else if (current && lastActiveField === '참가학생') {
      const extraMembers = line
        .replace(/^[.,\s]+|[.,\s]+$/g, '')
        .split(',')
        .map((m) => m.replace(/^[.,\s]+|[.,\s]+$/g, '').trim())
        .filter((m) => m && m !== '.' && m !== '-' && m !== '없음');
      extraMembers.forEach((m) => {
        if (!current.members.includes(m)) current.members.push(m);
      });
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
 * 6. 월간 날짜 선택 팝오버 컴포넌트 (단정한 사각 테두리 디자인)
 * ============================================================================
 */
function MonthlyCalendarPopover({
  selectedDate,
  todayDate,
  dateCountMap,
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
      className="absolute left-1/2 top-full mt-2 z-50 w-[332px] -translate-x-1/2 rounded-[6px] bg-white p-4 text-[#222222] shadow-lg border border-[#bdbdbd]"
      role="dialog"
      aria-label="날짜 선택 달력"
    >
      {/* 상단 연월 & 월 이동 버튼 */}
      <div className="mb-3 flex items-center justify-between border-b border-[#eeeeee] pb-2.5">
        <span className="text-[15px] font-bold text-[#111111]">
          {viewYear}년 {viewMonth + 1}월
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="이전 달"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] text-[#444444] hover:bg-[#efefef]"
          >
            <ChevronUpIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="다음 달"
            className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] text-[#444444] hover:bg-[#efefef]"
          >
            <ChevronDownIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="mb-1.5 grid grid-cols-7 text-center text-[12px] font-bold text-[#666666]">
        {WEEKDAYS_KO.map((w, idx) => (
          <div
            key={w}
            className={`py-1 ${
              idx === 0 ? 'text-red-600' : idx === 6 ? 'text-blue-600' : ''
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {calendarCells.map((cell) => {
          const isSelected = cell.ymd === selectedDate;
          const isTodayCell = cell.ymd === todayDate;
          const isBeforeToday = cell.ymd < todayDate;
          const count = dateCountMap.get(cell.ymd) || 0;

          return (
            <button
              key={cell.ymd}
              type="button"
              disabled={isBeforeToday}
              onClick={() => {
                onSelectDate(cell.ymd);
                onClose();
              }}
              className={`relative flex h-10 flex-col items-center justify-center rounded-[4px] text-[13px] transition-colors ${
                isSelected
                  ? 'bg-[#5aa396] font-bold text-white'
                  : isTodayCell
                  ? 'border border-[#5aa396] bg-[#eef7f5] font-bold text-[#25574e]'
                  : isBeforeToday
                  ? 'cursor-not-allowed text-[#bbbbbb]'
                  : cell.inCurrentMonth
                  ? 'font-medium text-[#222222] hover:bg-[#f2f2f2]'
                  : 'font-normal text-[#aaaaaa] hover:bg-[#f7f7f7]'
              }`}
            >
              <span className="leading-none">{cell.day}</span>
              {count > 0 && !isBeforeToday && (
                <span
                  className={`mt-1 text-[10px] font-bold leading-none ${
                    isSelected ? 'text-white/95' : 'text-[#5aa396]'
                  }`}
                >
                  {count}건
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 하단 오늘 바로가기 & 닫기 */}
      <div className="mt-3 flex items-center justify-between border-t border-[#eeeeee] pt-2.5 text-[12.5px]">
        <button
          type="button"
          onClick={() => {
            onSelectDate(todayDate);
            onClose();
          }}
          className="font-bold text-[#498d81] hover:underline"
        >
          오늘 ({formatShortKoreanDate(todayDate)})
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[4px] border border-[#dcdcdc] px-2.5 py-1 text-[#555555] hover:bg-[#f5f5f5]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

/**
 * ============================================================================
 * 7. 메인 애플리케이션 컴포넌트 (과구리 탐활 현황 맵)
 * ============================================================================
 */
export default function App() {
  const [entries, setEntries] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore storage errors
    }
    return parseGwaguriRawText(DEFAULT_GWAGURI_RAW_TEXT);
  });

  // 화면 전환 상태: 'overview' (캠퍼스 전체 지도) | 'building' (건물 층별 평면도)
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

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore storage quota errors
    }
  }, [entries]);

  // 날짜별 등록 건수 맵 (달력 표시용)
  const dateCountMap = useMemo(() => {
    const map = new Map();
    entries.forEach((e) => {
      map.set(e.date, (map.get(e.date) || 0) + 1);
    });
    return map;
  }, [entries]);

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

  // 건물별 & 층별 요약 통계
  const buildingStats = useMemo(() => {
    const result = {};
    BUILDINGS.forEach((b) => {
      let teamCount = 0;
      let activeRooms = 0;
      const duplicateRooms = [];
      const floorStats = {};

      b.floors.forEach((f) => {
        const fRooms = ALL_ROOMS.filter(
          (r) => r.buildingId === b.id && r.floorId === f.id
        );
        const fTeams = fRooms.reduce(
          (sum, r) => sum + (entriesByRoom[r.id]?.length || 0),
          0
        );
        const fHasDup = fRooms.some(
          (r) => (entriesByRoom[r.id]?.length || 0) >= 2
        );
        floorStats[f.id] = { teamCount: fTeams, hasDup: fHasDup };
      });

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
        duplicateRooms,
        floorStats
      };
    });
    return result;
  }, [entriesByRoom]);

  // 전체 캠퍼스 요약 통계
  const campusSummary = useMemo(() => {
    const totalCount = filteredEntries.length;
    const activeRoomIds = Object.keys(entriesByRoom);
    const activeRoomsCount = activeRoomIds.length;
    const duplicateRoomsCount = activeRoomIds.filter(
      (id) => entriesByRoom[id].length >= 2
    ).length;

    return {
      totalCount,
      activeRoomsCount,
      duplicateRoomsCount
    };
  }, [filteredEntries, entriesByRoom]);

  // 검색어 정규화 및 매칭 결과
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return {
        matchedRoomIds: new Set(),
        matchedBuildingIds: new Set(),
        matchedItems: []
      };
    }

    const matchedRoomIds = new Set();
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
          matchedBuildingIds.add(room.buildingId);
        }
      }
    });

    const aliasRoom = resolveRoomByName(normalizedQuery);
    ALL_ROOMS.forEach((room) => {
      const nameHit =
        room.name.toLowerCase().includes(normalizedQuery) ||
        (room.subtitle && room.subtitle.toLowerCase().includes(normalizedQuery)) ||
        (aliasRoom && aliasRoom.id === room.id);

      if (nameHit) {
        matchedRoomIds.add(room.id);
        matchedBuildingIds.add(room.buildingId);
      }
    });

    return {
      matchedRoomIds,
      matchedBuildingIds,
      matchedItems
    };
  }, [normalizedQuery, filteredEntries]);

  const navigateToRoom = (room) => {
    if (!room) return;
    setSelectedBuildingId(room.buildingId);
    setSelectedFloorId(room.floorId);
    setSelectedRoomId(room.id);
    setViewMode('building');
  };

  const navigateToFloor = (buildingId, floorId) => {
    setSelectedBuildingId(buildingId);
    setSelectedFloorId(floorId);
    const floorRooms = ALL_ROOMS.filter(
      (r) => r.buildingId === buildingId && r.floorId === floorId
    );
    const activeR = floorRooms.find(
      (r) => (entriesByRoom[r.id]?.length || 0) > 0
    );
    const defaultR = floorRooms.find((r) => r.type !== 'facility');
    setSelectedRoomId(activeR?.id || defaultR?.id || floorRooms[0]?.id || null);
    setViewMode('building');
  };

  const handleEnterBuilding = (buildingId) => {
    const building = BUILDINGS.find((b) => b.id === buildingId);
    if (!building) return;

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

    navigateToFloor(buildingId, bestFloor.id);
  };

  const previewParsedEntries = useMemo(() => {
    return parseGwaguriRawText(pasteInput);
  }, [pasteInput]);

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

  const handleResetToDefaultData = () => {
    const defaultParsed = parseGwaguriRawText(DEFAULT_GWAGURI_RAW_TEXT);
    setEntries(defaultParsed);
    setSelectedDate(TODAY_STR);
    setIsPasteModalOpen(false);
    setPasteInput('');
    showToast(`최신 기본 탐활 데이터 ${defaultParsed.length}건으로 초기화되었습니다.`);
  };

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
   * 평면도 내부 개별 실(Room) 카드 렌더러 (단정한 사각 테두리 + 큰 글씨 + 겹침 제로)
   * ==========================================================================
   */
  const renderRoomTile = (room, minHeightClass = 'min-h-[114px]') => {
    if (room.type === 'bridge') {
      return (
        <button
          key={room.id}
          type="button"
          onClick={() =>
            navigateToFloor(
              room.targetBuildingId || 'seongsil',
              room.targetFloorId || '2F'
            )
          }
          className={`group flex flex-col justify-between rounded-[4px] border border-dashed border-[#5aa396] bg-[#eef7f5] hover:bg-[#e0f1ed] p-3 text-left transition-colors ${minHeightClass}`}
        >
          <div>
            <span className="inline-block rounded-[3px] bg-[#5aa396] px-1.5 py-0.5 text-[11px] font-bold text-white">
              건물 연결통로
            </span>
            <h4 className="mt-1.5 text-[14.5px] font-bold text-[#1d3b36] leading-snug">
              {room.name}
            </h4>
          </div>
          <span className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-bold text-[#25574e] group-hover:underline">
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            <span>{room.subtitle || '성실관 2층 이동'}</span>
          </span>
        </button>
      );
    }

    const roomEntries = entriesByRoom[room.id] || [];
    const count = roomEntries.length;
    const isSelected = selectedRoomId === room.id;
    const isSearchHit = searchResults.matchedRoomIds.has(room.id);
    const isFacility = room.type === 'facility';

    let cardStyle = '';
    if (count >= 2) {
      cardStyle = 'bg-[#fffbeb] border-[#f59e0b] text-[#78350f]';
    } else if (count === 1) {
      cardStyle = 'bg-[#eef8f6] border-[#6cb5a8] text-[#1d3b36]';
    } else if (isFacility) {
      cardStyle = 'bg-[#f5f5f5] border-[#dcdcdc] text-[#666666] hover:bg-[#eeeeee]';
    } else {
      cardStyle =
        'bg-white border-[#d6d6d6] text-[#222222] hover:border-[#6cb5a8] hover:bg-[#f9fcfb]';
    }

    return (
      <button
        key={room.id}
        type="button"
        onClick={() => setSelectedRoomId(room.id)}
        className={`group relative flex flex-col justify-between rounded-[4px] border p-3 text-left transition-colors focus:outline-none ${minHeightClass} ${cardStyle} ${
          isSelected ? 'ring-2 ring-[#498d81] border-[#498d81] z-10' : ''
        } ${isSearchHit ? 'ring-2 ring-[#d97706] border-[#d97706]' : ''}`}
      >
        <div className="flex w-full items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h4
              className={`text-[14.5px] sm:text-[15px] leading-snug break-keep ${
                isFacility && count === 0
                  ? 'font-medium text-[#555555]'
                  : 'font-bold text-[#111111]'
              }`}
            >
              {room.name}
            </h4>
            {room.subtitle && (
              <span className="mt-1 inline-block rounded-[3px] border border-[#dcdcdc] bg-white px-1.5 py-0.5 text-[11px] font-medium text-[#666666]">
                {room.subtitle}
              </span>
            )}
          </div>

          {count >= 2 && (
            <span className="shrink-0 whitespace-nowrap rounded-[3px] border border-[#f59e0b] bg-[#fef3c7] px-1.5 py-0.5 text-[11.5px] font-bold text-[#92400e]">
              {count}팀 중복
            </span>
          )}
          {count === 1 && (
            <span className="shrink-0 whitespace-nowrap rounded-[3px] border border-[#6cb5a8] bg-[#d6efe9] px-1.5 py-0.5 text-[11.5px] font-bold text-[#1f5249]">
              1팀 사용
            </span>
          )}
        </div>

        <div className="mt-2.5 w-full">
          {count > 0 ? (
            <div className="flex flex-col gap-1">
              {roomEntries.map((item) => (
                <div
                  key={item.id}
                  className={`truncate rounded-[3px] px-2 py-1 text-[12.5px] leading-tight ${
                    count >= 2
                      ? 'bg-[#fde68a]/65 text-[#78350f]'
                      : 'bg-[#d6efe9] text-[#1d3b36]'
                  }`}
                  title={`${item.leader} · ${item.content}`}
                >
                  <span className="font-bold">{item.leader}</span>
                  {item.members.length > 1 && (
                    <span className="opacity-80"> 외 {item.members.length - 1}명</span>
                  )}
                  <span className="mx-1 opacity-40">|</span>
                  <span>{item.content}</span>
                </div>
              ))}
            </div>
          ) : (
            <span className="inline-block text-[12px] text-[#888888]">
              {isFacility ? '행정 · 지원 구역' : '비어 있음'}
            </span>
          )}
        </div>
      </button>
    );
  };

  const getGridColsClass = (cols) => {
    if (cols === 1) return 'grid-cols-1';
    if (cols === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (cols === 4) return 'grid-cols-2 sm:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-3';
  };

  return (
    <div
      className="min-h-screen w-full bg-[#efefef] text-[#222222] flex flex-col"
      style={{
        fontFamily:
          "'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif"
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
      `}</style>

      {/* ====================================================================
          1. 과구리 최상단 민트색 그라데이션 헤더 (높이 58px, 24px 굵은 고딕)
         ==================================================================== */}
      <header className="w-full bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] text-white">
        <div className="mx-auto flex h-[58px] max-w-[1280px] items-center justify-between px-5">
          {/* 좌측: 2×2 사각형 모자이크 로고 + 과구리 + 소개 | 학생부 전산시스템 */}
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => setViewMode('overview')}
              className="flex items-center gap-2.5 text-left shrink-0"
              title="과구리 탐활 현황 맵 홈으로"
            >
              <div className="grid h-7 w-7 grid-cols-2 grid-rows-2 overflow-hidden">
                <span className="bg-[#2d3e40]" />
                <span className="bg-[#c3e5de]" />
                <span className="bg-[#95c9be]" />
                <span className="bg-[#58968b]" />
              </div>
              <span className="text-[24px] font-bold tracking-tight text-white leading-none">
                과구리
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2 text-[13.5px] text-white/95 truncate">
              <span>소개</span>
              <span className="opacity-60">|</span>
              <span>학생부 전산시스템</span>
            </div>
          </div>

          {/* 우측: 탐활서 데이터 붙여넣기 버튼 */}
          <button
            type="button"
            onClick={() => setIsPasteModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-white/80 bg-white/15 hover:bg-white/25 px-3 py-1.5 text-[13.5px] font-bold text-white transition-colors"
          >
            <ClipboardPasteIcon className="h-4 w-4" />
            <span>탐활서 데이터 붙여넣기</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          2. 과구리 2단 흰색 상단 메뉴바 (GNB)
         ==================================================================== */}
      <nav
        aria-label="과구리 전체 메뉴"
        className="w-full border-b border-[#dcdcdc] bg-white"
      >
        <div className="mx-auto max-w-[1280px] px-5">
          {/* 1행 */}
          <div className="flex items-center justify-start md:justify-center gap-7 sm:gap-11 overflow-x-auto py-2.5 text-[14.5px] font-bold text-[#222222] border-b border-[#f0f0f0]">
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
          <div className="flex items-center justify-start md:justify-center gap-7 sm:gap-11 overflow-x-auto py-2.5 text-[14.5px] font-bold text-[#222222]">
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
                      ? 'text-[#5aa396]'
                      : 'text-[#222222] hover:text-[#5aa396]'
                  }`}
                >
                  {menu}
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[3px] bg-[#5aa396]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* 알림 토스트 */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-[4px] border border-[#5aa396] bg-[#2d3e40] px-4 py-2.5 text-[13.5px] font-bold text-white shadow-md">
          <CheckCircleIcon className="h-4 w-4 text-[#96cfc4] shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          3. 본문 컨테이너 (max-w-[1280px] mx-auto px-5 py-6)
         ==================================================================== */}
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-5 py-6">
        {/* 실제 과구리 '탐활서 확인' 페이지와 동일한 상단 타이틀 + 굵은 하단 구분선 */}
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2 border-b-2 border-[#222222] pb-3">
          <h1 className="text-[24px] font-bold tracking-tight text-[#111111] leading-none">
            탐활 현황 맵
          </h1>
          <span className="text-[13px] text-[#666666]">
            전남과학고등학교 탐구활동 공간 배정 현황
          </span>
        </div>

        {/* ==================================================================
            [첫 화면: 캠퍼스 전체 맵] 컨트롤 박스 + 실제 학교 전경 SVG 지도
           ================================================================== */}
        {viewMode === 'overview' ? (
          <div className="space-y-4">
            {/* 상단 컨트롤 박스 */}
            <div className="rounded-[6px] border border-[#dcdcdc] bg-white p-5">
              {/* 중앙 날짜 이동기 (< 11월 16일 (월) > + 달력 버튼) */}
              <div className="flex flex-col items-center justify-center border-b border-[#eeeeee] pb-4">
                <div className="relative flex items-center justify-center gap-3">
                  {/* 오늘(2026-11-16)일 때는 왼쪽 '<' 화살표 숨김 */}
                  <button
                    type="button"
                    onClick={handlePrevDay}
                    disabled={isToday}
                    aria-label="이전 날짜"
                    className={`flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] text-[#333333] transition-colors ${
                      isToday ? 'invisible pointer-events-none' : 'visible'
                    }`}
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[21px] sm:text-[23px] font-bold tracking-tight text-[#111111]">
                      {formatShortKoreanDate(selectedDate)}
                    </span>
                    {selectedDate === TODAY_STR && (
                      <span className="rounded-[4px] border border-[#6cb5a8] bg-[#eef8f6] px-2 py-0.5 text-[12px] font-bold text-[#25574e]">
                        오늘
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={handleNextDay}
                    aria-label="다음 날짜"
                    className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] text-[#333333] transition-colors"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen((prev) => !prev)}
                    className={`ml-1 inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[13.5px] font-bold transition-colors ${
                      isCalendarOpen
                        ? 'border-[#5aa396] bg-[#5aa396] text-white'
                        : 'border-[#dcdcdc] bg-white text-[#222222] hover:bg-[#f5f5f5]'
                    }`}
                  >
                    <CalendarIcon
                      className={`h-4 w-4 ${
                        isCalendarOpen ? 'text-white' : 'text-[#5aa396]'
                      }`}
                    />
                    <span>달력</span>
                  </button>

                  {isCalendarOpen && (
                    <MonthlyCalendarPopover
                      selectedDate={selectedDate}
                      todayDate={TODAY_STR}
                      dateCountMap={dateCountMap}
                      onSelectDate={(newDate) => setSelectedDate(newDate)}
                      onClose={() => setIsCalendarOpen(false)}
                    />
                  )}
                </div>

                {/* 요약 통계 (전체 탐활 N건 | 사용 중인 실 N곳 | 중복 사용실 N곳) + 시간 필터 */}
                <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-[14px]">
                  <span className="text-[#555555]">
                    전체 탐활{' '}
                    <strong className="font-bold text-[#111111]">
                      {campusSummary.totalCount}건
                    </strong>
                  </span>
                  <span className="text-[#dcdcdc]">|</span>
                  <span className="text-[#555555]">
                    사용 중인 실{' '}
                    <strong className="font-bold text-[#25574e]">
                      {campusSummary.activeRoomsCount}곳
                    </strong>
                  </span>
                  <span className="text-[#dcdcdc]">|</span>
                  <span className="text-[#555555]">
                    중복 사용실{' '}
                    <strong
                      className={`font-bold ${
                        campusSummary.duplicateRoomsCount > 0
                          ? 'text-[#b45309]'
                          : 'text-[#111111]'
                      }`}
                    >
                      {campusSummary.duplicateRoomsCount}곳
                    </strong>
                  </span>

                  <div className="ml-0 sm:ml-2 flex items-center gap-1">
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
                        className={`rounded-[4px] border px-2.5 py-1 text-[13px] font-bold transition-colors ${
                          selectedTimeFilter === tf.id
                            ? 'border-[#5aa396] bg-[#5aa396] text-white'
                            : 'border-[#dcdcdc] bg-[#fafafa] text-[#444444] hover:bg-[#efefef]'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 안내 문구 & 우측 검색창 & 교외/기타 장소 버튼 */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13.5px] text-[#555555]">
                  건물을 클릭하면 층별 평면도와 사용 중인 팀 현황을 확인할 수 있습니다.
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative w-64 sm:w-72">
                    <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#888888]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="학생 이름, 학번, 실 이름 검색..."
                      className="w-full rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] py-1.5 pl-8 pr-7 text-[13.5px] text-[#222222] placeholder:text-[#999999] focus:border-[#5aa396] focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#222222]"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {offCampusEntries.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsOffCampusOpen(true)}
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#c7d2fe] bg-[#eef2ff] hover:bg-[#e0e7ff] px-3 py-1.5 text-[13.5px] font-bold text-[#3730a3] transition-colors"
                    >
                      <ExternalLinkIcon className="h-3.5 w-3.5" />
                      <span>교외/기타 장소 ({offCampusEntries.length}건)</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 검색 결과 빠른 이동 리스트 */}
              {normalizedQuery && (
                <div className="mt-3.5 rounded-[4px] border border-[#fcd34d] bg-[#fffbeb] p-3">
                  <p className="text-[13px] font-bold text-[#92400e] mb-2">
                    '{searchQuery}' 검색 결과 ({searchResults.matchedItems.length}건)
                  </p>
                  {searchResults.matchedItems.length === 0 ? (
                    <p className="text-[13px] text-[#666666]">
                      선택된 날짜에 일치하는 활동이 없습니다.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {searchResults.matchedItems.map(({ item, room }) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            room ? navigateToRoom(room) : setIsOffCampusOpen(true)
                          }
                          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#dcdcdc] bg-white hover:border-[#5aa396] px-2.5 py-1.5 text-[13px] text-left transition-colors"
                        >
                          <span className="font-bold text-[#25574e]">
                            {room
                              ? `${room.buildingShortName} ${room.floorLabel} ${room.name}`
                              : item.rawLocation}
                          </span>
                          <span className="text-[#444444]">
                            {item.leader} · {item.content}
                          </span>
                          <ArrowRightIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ================================================================
                2. 전남과학고등학교 실제 사진 기반 캠퍼스 전체 지도 (SVG 일러스트)
                   - 붉은 벽돌 외벽 + 아이보리 수평 콘크리트 띠 + 유리창 격자
                   - 전경 푸른 잔디 운동장, 양쪽 하얀 축구 골대, 계단식 스탠드, 조경수
               ================================================================ */}
            <div className="overflow-hidden rounded-[6px] border border-[#dcdcdc] bg-white p-3 sm:p-4">
              <svg
                viewBox="0 0 1120 400"
                className="w-full h-auto select-none"
                role="img"
                aria-label="전남과학고등학교 캠퍼스 전경 지도"
              >
                <defs>
                  <linearGradient id="jshs-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cde6f7" />
                    <stop offset="65%" stopColor="#e8f4fc" />
                    <stop offset="100%" stopColor="#f6fafd" />
                  </linearGradient>
                  <linearGradient id="jshs-turf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5a9e43" />
                    <stop offset="50%" stopColor="#4c8c38" />
                    <stop offset="100%" stopColor="#3f782d" />
                  </linearGradient>
                  <filter id="jshs-hover-glow" x="-6%" y="-6%" width="112%" height="112%">
                    <feDropShadow
                      dx="0"
                      dy="4"
                      stdDeviation="4"
                      floodColor="#1e293b"
                      floodOpacity="0.24"
                    />
                  </filter>
                </defs>

                {/* 하늘 배경 */}
                <rect x="0" y="0" width="1120" height="275" fill="url(#jshs-sky)" />

                {/* 하늘 구름 (사진처럼 부드럽고 절제된 형태) */}
                <g fill="#ffffff" opacity="0.82">
                  <ellipse cx="185" cy="54" rx="52" ry="15" />
                  <ellipse cx="215" cy="48" rx="36" ry="13" />
                  <ellipse cx="565" cy="46" rx="68" ry="18" />
                  <ellipse cx="610" cy="42" rx="44" ry="14" />
                  <ellipse cx="945" cy="52" rx="56" ry="15" />
                </g>

                {/* 원경 녹지 능선 */}
                <path
                  d="M 0 250 Q 280 238 560 245 T 1120 242 L 1120 278 L 0 278 Z"
                  fill="#6c9958"
                />

                {/* ============================================================
                    건물 1: 좌측~중앙 성실관 (본관 · 1~4F)
                    - 좌측 끝 둥근 붉은 벽돌 계단탑(세로 긴 창문)
                    - 4층 붉은 벽돌 외벽 + 아이보리 수평 콘크리트 띠
                    - 중앙 돌출 캐노피와 하얀 기둥 열주(Colonnade) 중앙현관
                   ============================================================ */}
                <g
                  onClick={() => handleEnterBuilding('seongsil')}
                  onMouseEnter={() => setHoveredBuildingId('seongsil')}
                  onMouseLeave={() => setHoveredBuildingId(null)}
                  filter={
                    hoveredBuildingId === 'seongsil'
                      ? 'url(#jshs-hover-glow)'
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  {/* 상단 상태 라벨 & 건물명 라벨 (단정한 사각형) */}
                  <g transform="translate(242, 14)">
                    <rect
                      x="-96"
                      y="0"
                      width="192"
                      height="22"
                      rx="3"
                      fill={
                        buildingStats.seongsil.duplicateRooms.length > 0
                          ? '#b45309'
                          : buildingStats.seongsil.teamCount > 0
                          ? '#498d81'
                          : '#555555'
                      }
                    />
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      {buildingStats.seongsil.duplicateRooms.length > 0
                        ? `중복 ${buildingStats.seongsil.duplicateRooms.length}곳 · ${buildingStats.seongsil.teamCount}팀`
                        : buildingStats.seongsil.teamCount > 0
                        ? `${buildingStats.seongsil.teamCount}팀 사용 중`
                        : '비어 있음'}
                    </text>

                    <rect
                      x="-96"
                      y="25"
                      width="192"
                      height="25"
                      rx="3"
                      fill="#222222"
                    />
                    <text
                      x="0"
                      y="42"
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      성실관 (본관 · 1~4F)
                    </text>
                  </g>

                  {/* 옥상 기계실(옥탑) */}
                  <rect x="255" y="96" width="88" height="16" fill="#752e21" />
                  <rect x="253" y="95" width="92" height="3" fill="#ebe5dc" />

                  {/* 좌측 끝 둥근 벽돌 계단탑 */}
                  <path
                    d="M 32 94 Q 54 88 76 94 L 76 254 L 32 254 Z"
                    fill="#7e3123"
                    stroke="#592016"
                    strokeWidth="1"
                  />
                  {/* 계단탑 세로 긴 창문 */}
                  <path
                    d="M 46 105 A 8 8 0 0 1 62 105 L 62 240 L 46 240 Z"
                    fill="#2b3842"
                    stroke="#ebe5dc"
                    strokeWidth="1.5"
                  />
                  <line x1="54" y1="98" x2="54" y2="240" stroke="#5b6d7a" strokeWidth="1" />
                  {[132, 166, 200].map((wy, i) => (
                    <line
                      key={i}
                      x1="46"
                      y1={wy}
                      x2="62"
                      y2={wy}
                      stroke="#ebe5dc"
                      strokeWidth="1.5"
                    />
                  ))}

                  {/* 본관 좌측~우측 4층 붉은 벽돌 본체 */}
                  <rect x="76" y="112" width="376" height="142" fill="#8b3a2b" />

                  {/* 수평 아이보리/크림색 콘크리트 띠 (옥상 파라펫 + 층간 띠) */}
                  <rect x="76" y="112" width="376" height="5" fill="#ebe5dc" />
                  <rect x="76" y="146" width="376" height="4.5" fill="#ebe5dc" />
                  <rect x="76" y="180" width="376" height="4.5" fill="#ebe5dc" />
                  <rect x="76" y="214" width="376" height="4.5" fill="#ebe5dc" />

                  {/* 본관 좌측 교실 창문 격자 (4개 층) */}
                  {[121, 154, 188, 222].map((wy, rowIdx) => (
                    <g key={rowIdx}>
                      {[86, 108, 130, 152, 174, 196, 218].map((wx, colIdx) => (
                        <g key={colIdx}>
                          <rect
                            x={wx}
                            y={wy}
                            width="17"
                            height="21"
                            fill="#293640"
                          />
                          <line
                            x1={wx + 8.5}
                            y1={wy}
                            x2={wx + 8.5}
                            y2={wy + 21}
                            stroke="#80929e"
                            strokeWidth="0.9"
                          />
                        </g>
                      ))}
                    </g>
                  ))}

                  {/* 본관 우측 연결부 교실 창문 격자 */}
                  {[121, 154, 188, 222].map((wy, rowIdx) => (
                    <g key={rowIdx}>
                      {[376, 398, 420].map((wx, colIdx) => (
                        <g key={colIdx}>
                          <rect
                            x={wx}
                            y={wy}
                            width="17"
                            height="21"
                            fill="#293640"
                          />
                          <line
                            x1={wx + 8.5}
                            y1={wy}
                            x2={wx + 8.5}
                            y2={wy + 21}
                            stroke="#80929e"
                            strokeWidth="0.9"
                          />
                        </g>
                      ))}
                    </g>
                  ))}

                  {/* 중앙 돌출 캐노피 & 하얀 기둥 열주(Colonnade) 중앙현관 입구 */}
                  <g>
                    {/* 돌출 상부 벽돌 매스 */}
                    <rect x="242" y="106" width="126" height="42" fill="#7a2f22" />
                    <rect x="240" y="105" width="130" height="5" fill="#ebe5dc" />
                    <rect x="240" y="125" width="130" height="4.5" fill="#ebe5dc" />
                    <rect x="240" y="144" width="130" height="5" fill="#ebe5dc" />

                    {/* 현관 내부 어두운 홀 & 유리문 */}
                    <rect x="248" y="149" width="114" height="105" fill="#232d35" />
                    <rect x="285" y="156" width="40" height="98" fill="#364854" />
                    <line
                      x1="305"
                      y1="156"
                      x2="305"
                      y2="254"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                    />

                    {/* 하얀색/아이보리 수직 기둥 열주 6개 */}
                    {[248, 269, 290, 315, 336, 357].map((px, idx) => (
                      <rect
                        key={idx}
                        x={px}
                        y="149"
                        width="5.5"
                        height="105"
                        fill="#f3efe8"
                      />
                    ))}
                  </g>

                  {/* 호버/검색 하이라이트 테두리 */}
                  {(hoveredBuildingId === 'seongsil' ||
                    searchResults.matchedBuildingIds.has('seongsil')) && (
                    <rect
                      x="30"
                      y="88"
                      width="422"
                      height="166"
                      fill="none"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongsil')
                          ? '#d97706'
                          : '#5aa396'
                      }
                      strokeWidth="3"
                    />
                  )}
                </g>

                {/* ============================================================
                    건물 2: 중앙 우측 창의관 (실험동 · 1~4F+옥상)
                    - 본관과 L자로 이어지는 4층 붉은 벽돌 실험동
                    - 중앙 반원형 통유리 커튼월 타워 + 옥상 천문대 돔
                   ============================================================ */}
                <g
                  onClick={() => handleEnterBuilding('changui')}
                  onMouseEnter={() => setHoveredBuildingId('changui')}
                  onMouseLeave={() => setHoveredBuildingId(null)}
                  filter={
                    hoveredBuildingId === 'changui'
                      ? 'url(#jshs-hover-glow)'
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  {/* 상단 상태 라벨 & 건물명 라벨 */}
                  <g transform="translate(648, 14)">
                    <rect
                      x="-104"
                      y="0"
                      width="208"
                      height="22"
                      rx="3"
                      fill={
                        buildingStats.changui.duplicateRooms.length > 0
                          ? '#b45309'
                          : buildingStats.changui.teamCount > 0
                          ? '#498d81'
                          : '#555555'
                      }
                    />
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      {buildingStats.changui.duplicateRooms.length > 0
                        ? `중복 ${buildingStats.changui.duplicateRooms.length}곳 · ${buildingStats.changui.teamCount}팀`
                        : buildingStats.changui.teamCount > 0
                        ? `${buildingStats.changui.teamCount}팀 사용 중`
                        : '비어 있음'}
                    </text>

                    <rect
                      x="-104"
                      y="25"
                      width="208"
                      height="25"
                      rx="3"
                      fill="#222222"
                    />
                    <text
                      x="0"
                      y="42"
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      창의관 (실험동 · 1~4F+옥상)
                    </text>
                  </g>

                  {/* 옥상 천문대 돔 & 옥탑 기계실 */}
                  <rect x="692" y="92" width="66" height="18" fill="#68261b" />
                  <path
                    d="M 556 112 A 24 18 0 0 1 604 112 Z"
                    fill="#dce4e8"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="580"
                    y1="94"
                    x2="591"
                    y2="104"
                    stroke="#475569"
                    strokeWidth="2"
                  />

                  {/* 좌측 연결 타워 기둥부 */}
                  <rect x="466" y="116" width="44" height="138" fill="#752e21" />
                  {[128, 160, 192, 224].map((wy, i) => (
                    <rect
                      key={i}
                      x="480"
                      y={wy}
                      width="14"
                      height="18"
                      fill="#293640"
                    />
                  ))}

                  {/* 창의관 메인 4층 붉은 벽돌 본체 */}
                  <rect x="510" y="110" width="322" height="144" fill="#853526" />
                  <rect x="510" y="110" width="322" height="4.5" fill="#ebe5dc" />
                  <rect x="510" y="145" width="322" height="3.5" fill="#ebe5dc" />
                  <rect x="510" y="180" width="322" height="3.5" fill="#ebe5dc" />
                  <rect x="510" y="215" width="322" height="3.5" fill="#ebe5dc" />

                  {/* 창의관 좌측 윙 창문 */}
                  {[121, 155, 190, 224].map((wy, rIdx) => (
                    <g key={rIdx}>
                      {[524, 550, 576].map((wx, cIdx) => (
                        <rect
                          key={cIdx}
                          x={wx}
                          y={wy}
                          width="15"
                          height="18"
                          fill="#293640"
                        />
                      ))}
                    </g>
                  ))}

                  {/* 중앙 반원형 통유리 커튼월 타워 (사진 속 원통형 유리 코어) */}
                  <g>
                    <rect
                      x="606"
                      y="114"
                      width="46"
                      height="140"
                      fill="#31414d"
                      stroke="#cbd5e1"
                      strokeWidth="1.5"
                    />
                    {/* 수직 유리 멀리언 */}
                    <line
                      x1="621"
                      y1="114"
                      x2="621"
                      y2="254"
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="637"
                      y1="114"
                      x2="637"
                      y2="254"
                      stroke="#94a3b8"
                      strokeWidth="1.2"
                    />
                    {/* 수평 스팬드럴(아이보리 띠) */}
                    {[132, 166, 200, 232].map((cy, idx) => (
                      <rect
                        key={idx}
                        x="606"
                        y={cy}
                        width="46"
                        height="5"
                        fill="#e2e8f0"
                      />
                    ))}
                  </g>

                  {/* 창의관 우측 윙 창문 */}
                  {[121, 155, 190, 224].map((wy, rIdx) => (
                    <g key={rIdx}>
                      {[668, 696, 724, 752, 780, 804].map((wx, cIdx) => (
                        <rect
                          key={cIdx}
                          x={wx}
                          y={wy}
                          width="15"
                          height="18"
                          fill="#293640"
                        />
                      ))}
                    </g>
                  ))}

                  {/* 호버/검색 하이라이트 테두리 */}
                  {(hoveredBuildingId === 'changui' ||
                    searchResults.matchedBuildingIds.has('changui')) && (
                    <rect
                      x="466"
                      y="110"
                      width="366"
                      height="144"
                      fill="none"
                      stroke={
                        searchResults.matchedBuildingIds.has('changui')
                          ? '#d97706'
                          : '#5aa396'
                      }
                      strokeWidth="3"
                    />
                  )}
                </g>

                {/* ============================================================
                    건물 3: 우측 성취관 (강당 · 1~2F)
                    - 동일한 붉은 벽돌 + 아이보리 콘크리트 띠 건축 양식
                    - 완만한 아치형 지붕, 2F 체육관 창문, 1F 예체능실 창문
                   ============================================================ */}
                <g
                  onClick={() => handleEnterBuilding('seongchwi')}
                  onMouseEnter={() => setHoveredBuildingId('seongchwi')}
                  onMouseLeave={() => setHoveredBuildingId(null)}
                  filter={
                    hoveredBuildingId === 'seongchwi'
                      ? 'url(#jshs-hover-glow)'
                      : undefined
                  }
                  className="cursor-pointer"
                >
                  {/* 상단 상태 라벨 & 건물명 라벨 */}
                  <g transform="translate(976, 66)">
                    <rect
                      x="-92"
                      y="0"
                      width="184"
                      height="22"
                      rx="3"
                      fill={
                        buildingStats.seongchwi.duplicateRooms.length > 0
                          ? '#b45309'
                          : buildingStats.seongchwi.teamCount > 0
                          ? '#498d81'
                          : '#555555'
                      }
                    />
                    <text
                      x="0"
                      y="15"
                      textAnchor="middle"
                      fontSize="11.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      {buildingStats.seongchwi.duplicateRooms.length > 0
                        ? `중복 ${buildingStats.seongchwi.duplicateRooms.length}곳 · ${buildingStats.seongchwi.teamCount}팀`
                        : buildingStats.seongchwi.teamCount > 0
                        ? `${buildingStats.seongchwi.teamCount}팀 사용 중`
                        : '비어 있음'}
                    </text>

                    <rect
                      x="-92"
                      y="25"
                      width="184"
                      height="25"
                      rx="3"
                      fill="#222222"
                    />
                    <text
                      x="0"
                      y="42"
                      textAnchor="middle"
                      fontSize="12.5"
                      fontWeight="700"
                      fill="#ffffff"
                    >
                      성취관 (강당 · 1~2F)
                    </text>
                  </g>

                  {/* 완만한 아치형 지붕 */}
                  <path
                    d="M 862 154 Q 976 126 1090 154 Z"
                    fill="#5c2419"
                  />
                  <path
                    d="M 862 154 Q 976 126 1090 154"
                    fill="none"
                    stroke="#ebe5dc"
                    strokeWidth="3.5"
                  />

                  {/* 성취관 2층 붉은 벽돌 외벽 */}
                  <rect x="866" y="154" width="220" height="100" fill="#853526" />
                  <rect x="866" y="203" width="220" height="4" fill="#ebe5dc" />

                  {/* 2F 체육관 고창 */}
                  {[884, 916, 948, 980, 1012, 1044].map((wx, idx) => (
                    <rect
                      key={idx}
                      x={wx}
                      y="167"
                      width="22"
                      height="22"
                      fill="#293640"
                    />
                  ))}

                  {/* 1F 예체능실 창문 및 출입구 */}
                  {[884, 916, 1012, 1044].map((wx, idx) => (
                    <rect
                      key={idx}
                      x={wx}
                      y="216"
                      width="22"
                      height="22"
                      fill="#293640"
                    />
                  ))}
                  <rect x="954" y="216" width="44" height="38" fill="#232d35" />
                  <line
                    x1="976"
                    y1="216"
                    x2="976"
                    y2="254"
                    stroke="#ebe5dc"
                    strokeWidth="1.5"
                  />

                  {/* 호버/검색 하이라이트 테두리 */}
                  {(hoveredBuildingId === 'seongchwi' ||
                    searchResults.matchedBuildingIds.has('seongchwi')) && (
                    <rect
                      x="864"
                      y="150"
                      width="224"
                      height="104"
                      fill="none"
                      stroke={
                        searchResults.matchedBuildingIds.has('seongchwi')
                          ? '#d97706'
                          : '#5aa396'
                      }
                      strokeWidth="3"
                    />
                  )}
                </g>

                {/* ============================================================
                    전경: 벽돌 계단식 스탠드 + 조경수 + 푸른 잔디 운동장 + 축구 골대
                   ============================================================ */}
                {/* 건물 앞 붉은 벽돌 계단식 스탠드 */}
                <rect x="95" y="254" width="995" height="13" fill="#8b4232" />
                <line x1="95" y1="258" x2="1090" y2="258" stroke="#662b1f" strokeWidth="1.2" />
                <line x1="95" y1="262" x2="1090" y2="262" stroke="#662b1f" strokeWidth="1.2" />

                {/* 푸른 잔디 운동장 바닥 */}
                <polygon
                  points="135,267 1120,267 1120,400 185,400"
                  fill="url(#jshs-turf)"
                />
                {/* 잔디 깎기 세로 줄무늬 효과 */}
                {[260, 390, 520, 650, 780, 910].map((gx, idx) => (
                  <polygon
                    key={idx}
                    points={`${gx},267 ${gx + 65},267 ${gx + 85},400 ${gx + 20},400`}
                    fill="#ffffff"
                    opacity="0.06"
                  />
                ))}

                {/* 운동장 하얀 라인 */}
                <polygon
                  points="245,278 1065,278 1015,388 315,388"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity="0.75"
                />
                <line
                  x1="655"
                  y1="278"
                  x2="665"
                  y2="388"
                  stroke="#ffffff"
                  strokeWidth="2"
                  opacity="0.75"
                />

                {/* 좌측 & 우측 하얀 축구 골대 (실제 사진의 양쪽 골대 반영) */}
                <g stroke="#ffffff" strokeWidth="2.5" fill="none">
                  {/* 좌측 골대 */}
                  <polygon
                    points="385,295 495,303 495,358 385,346"
                    fill="#ffffff"
                    fillOpacity="0.14"
                  />
                  <polyline points="385,295 362,301 362,348 385,346" strokeWidth="1.5" />

                  {/* 우측 골대 */}
                  <rect
                    x="865"
                    y="246"
                    width="88"
                    height="26"
                    fill="#ffffff"
                    fillOpacity="0.16"
                  />
                </g>

                {/* 좌측 보도블록 산책로 & 조경 관목/수목 */}
                <polygon points="0,275 135,267 185,400 0,400" fill="#dcd7ce" />
                <path
                  d="M 0 288 Q 115 315 165 400"
                  fill="none"
                  stroke="#4d8237"
                  strokeWidth="18"
                />

                {/* 본관 앞 단정하게 전정된 조경수 */}
                {[115, 195, 225, 425, 455, 575, 765, 845, 1045].map((tx, idx) => (
                  <g key={idx} transform={`translate(${tx}, 256)`}>
                    <ellipse cx="0" cy="4" rx="18" ry="10" fill="#3a6b27" />
                    <ellipse cx="-6" cy="2" rx="12" ry="8" fill="#4f8c37" />
                    <ellipse cx="7" cy="3" rx="11" ry="7" fill="#437a2e" />
                  </g>
                ))}
                {/* 좌측 포인트 교목 */}
                <g transform="translate(175, 232)">
                  <rect x="-2" y="14" width="4" height="22" fill="#5c3a21" />
                  <circle cx="0" cy="6" r="16" fill="#3f7829" />
                  <circle cx="-8" cy="11" r="11" fill="#4e8f35" />
                  <circle cx="8" cy="10" r="11" fill="#386b24" />
                </g>
              </svg>
            </div>

            {/* 하단: 3개 건물 요약 카드 + 층별 바로가기 버튼 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BUILDINGS.map((b) => {
                const st = buildingStats[b.id];
                const dupCount = st.duplicateRooms.length;
                return (
                  <div
                    key={b.id}
                    className={`flex flex-col justify-between rounded-[6px] border bg-white p-4 transition-colors ${
                      dupCount > 0 ? 'border-[#f59e0b]' : 'border-[#dcdcdc]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-[16px] font-bold text-[#111111]">
                          {b.name}
                        </h3>
                        <span
                          className={`rounded-[4px] px-2 py-0.5 text-[12px] font-bold ${
                            dupCount > 0
                              ? 'bg-[#fef3c7] text-[#92400e] border border-[#f59e0b]'
                              : st.teamCount > 0
                              ? 'bg-[#eef8f6] text-[#25574e] border border-[#6cb5a8]'
                              : 'bg-[#f4f4f4] text-[#666666]'
                          }`}
                        >
                          {dupCount > 0
                            ? `중복 ${dupCount}곳 · ${st.teamCount}팀`
                            : st.teamCount > 0
                            ? `${st.teamCount}팀 사용 중`
                            : '비어 있음'}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] text-[#666666] leading-relaxed">
                        {b.subtitle}
                      </p>

                      {/* 층별 바로가기 버튼 */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {b.floors.map((f) => {
                          const fStat = st.floorStats[f.id];
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => navigateToFloor(b.id, f.id)}
                              className={`inline-flex items-center gap-1 rounded-[4px] border px-2.5 py-1 text-[12.5px] font-bold transition-colors ${
                                fStat?.hasDup
                                  ? 'border-[#f59e0b] bg-[#fffbeb] text-[#92400e] hover:bg-[#fef3c7]'
                                  : fStat?.teamCount > 0
                                  ? 'border-[#6cb5a8] bg-[#eef8f6] text-[#25574e] hover:bg-[#d6efe9]'
                                  : 'border-[#dcdcdc] bg-[#fafafa] text-[#555555] hover:bg-[#efefef]'
                              }`}
                            >
                              <span>{f.label}</span>
                              {fStat?.teamCount > 0 && (
                                <span>({fStat.teamCount})</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEnterBuilding(b.id)}
                      className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-[4px] bg-[#2d3e40] hover:bg-[#5aa396] py-2 text-[13.5px] font-bold text-white transition-colors"
                    >
                      <span>{b.shortName} 층별 평면도 보기</span>
                      <ArrowRightIcon className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* ==================================================================
             [건물 내부 뷰] 좌측 2단 블록 그리드 평면도 + 우측 과구리 표 상세 패널
             ================================================================== */
          <div className="space-y-4">
            {/* 상단 네비게이션 바: ← 캠퍼스 전체지도 + 건물 전환 탭 + 날짜 이동 */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[6px] border border-[#dcdcdc] bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewMode('overview')}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] px-3 py-1.5 text-[13.5px] font-bold text-[#222222] transition-colors"
                >
                  <ArrowLeftIcon className="h-4 w-4 text-[#5aa396]" />
                  <span>캠퍼스 전체지도</span>
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
                      className={`inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[13.5px] font-bold transition-colors ${
                        isCurrent
                          ? 'border-[#5aa396] bg-[#5aa396] text-white'
                          : 'border-[#dcdcdc] bg-white text-[#444444] hover:bg-[#f5f5f5]'
                      }`}
                    >
                      <span>{b.name}</span>
                      {dupCount > 0 && (
                        <span
                          className={`rounded-[3px] px-1.5 py-0.2 text-[11px] font-bold ${
                            isCurrent
                              ? 'bg-white text-[#92400e]'
                              : 'bg-[#fef3c7] text-[#92400e] border border-[#f59e0b]'
                          }`}
                        >
                          중복 {dupCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 우측: 날짜 전환 */}
              <div className="relative flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevDay}
                  disabled={isToday}
                  aria-label="이전 날짜"
                  className={`flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] text-[#333333] ${
                    isToday ? 'invisible pointer-events-none' : 'visible'
                  }`}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>

                <span className="text-[15px] font-bold text-[#111111]">
                  {formatShortKoreanDate(selectedDate)}
                </span>

                <button
                  type="button"
                  onClick={handleNextDay}
                  aria-label="다음 날짜"
                  className="flex h-7 w-7 items-center justify-center rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] hover:bg-[#efefef] text-[#333333]"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCalendarOpen((prev) => !prev)}
                  className="ml-1 inline-flex items-center gap-1 rounded-[4px] border border-[#dcdcdc] bg-white hover:bg-[#f5f5f5] px-2.5 py-1 text-[13px] font-bold text-[#222222]"
                >
                  <CalendarIcon className="h-3.5 w-3.5 text-[#5aa396]" />
                  <span>달력</span>
                </button>

                {isCalendarOpen && (
                  <MonthlyCalendarPopover
                    selectedDate={selectedDate}
                    todayDate={TODAY_STR}
                    dateCountMap={dateCountMap}
                    onSelectDate={(newDate) => setSelectedDate(newDate)}
                    onClose={() => setIsCalendarOpen(false)}
                  />
                )}
              </div>
            </div>

            {/* 2열 메인 그리드: 좌측(8/12) 2단 블록 평면도 + 우측(4/12) 과구리 표 상세 패널 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* 좌측 영역: 층 선택 + 2단 블록 그리드 평면도 */}
              <div className="lg:col-span-8 rounded-[6px] border border-[#dcdcdc] bg-white p-5 space-y-4">
                {/* 층 선택 탭 & 상태 범례 */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eeeeee] pb-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 pr-1 text-[13.5px] font-bold text-[#555555]">
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
                          onClick={() => navigateToFloor(activeBuilding.id, floor.id)}
                          className={`inline-flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-[13.5px] font-bold transition-colors ${
                            isFloorSelected
                              ? 'border-[#2d3e40] bg-[#2d3e40] text-white'
                              : 'border-[#dcdcdc] bg-[#fafafa] text-[#333333] hover:bg-[#efefef]'
                          }`}
                        >
                          <span>{floor.label}</span>
                          {hasDup ? (
                            <span className="rounded-[3px] bg-[#fbbf24] text-[#78350f] px-1.5 py-0.2 text-[11px] font-bold">
                              {teamCount}팀 중복
                            </span>
                          ) : teamCount > 0 ? (
                            <span
                              className={`rounded-[3px] px-1.5 py-0.2 text-[11px] font-bold ${
                                isFloorSelected
                                  ? 'bg-[#5aa396] text-white'
                                  : 'bg-[#eef8f6] text-[#25574e]'
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
                  <div className="flex flex-wrap items-center gap-3 text-[12.5px]">
                    <span className="inline-flex items-center gap-1.5 text-[#666666]">
                      <span className="h-3 w-3 rounded-[2px] border border-[#cccccc] bg-white" />
                      비어 있음
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#25574e]">
                      <span className="h-3 w-3 rounded-[2px] border border-[#6cb5a8] bg-[#eef8f6]" />
                      1팀 사용 중
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-medium text-[#92400e]">
                      <span className="h-3 w-3 rounded-[2px] border border-[#f59e0b] bg-[#fef3c7]" />
                      2팀 이상 중복
                    </span>
                  </div>
                </div>

                {/* 현재 층 제목 */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] bg-[#5aa396] px-2.5 py-1 text-[12.5px] font-bold text-white">
                      {activeBuilding.shortName} · {activeFloor.label}
                    </span>
                    <h2 className="text-[18px] font-bold text-[#111111]">
                      {activeFloor.subject}
                    </h2>
                  </div>
                  <span className="text-[12.5px] text-[#777777]">
                    실을 클릭하면 우측 패널에 과구리 탐활서 표가 표시됩니다
                  </span>
                </div>

                {/* 2단 블록 그리드 평면도 본문 */}
                <div className="space-y-3.5 rounded-[4px] border border-[#cccccc] bg-[#f7f7f7] p-4">
                  {/* 1. 상단 구역 */}
                  {activeFloor.topRooms && activeFloor.topRooms.length > 0 && (
                    <div className="space-y-2">
                      {activeFloor.topLabel && (
                        <p className="text-[12.5px] font-bold text-[#555555]">
                          ▲ {activeFloor.topLabel}
                        </p>
                      )}
                      <div
                        className={`grid gap-2.5 ${getGridColsClass(
                          activeFloor.topCols || 3
                        )}`}
                      >
                        {activeFloor.topRooms.map((room) =>
                          renderRoomTile(
                            room,
                            activeFloor.topCols === 1 ? 'min-h-[140px]' : 'min-h-[112px]'
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. 중앙 복도 바 */}
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-[#d6d6d6] bg-[#eaeaea] px-3.5 py-2 text-[13px] font-bold text-[#555555]">
                    <span>{activeFloor.corridorLabel}</span>

                    {activeFloor.hasBridgeToChangui && (
                      <button
                        type="button"
                        onClick={() => navigateToFloor('changui', '2F')}
                        className="rounded-[4px] border border-[#5aa396] bg-[#eef8f6] px-2.5 py-1 text-[12.5px] font-bold text-[#25574e] hover:bg-[#d6efe9] transition-colors"
                      >
                        창의관 2층 연결통로 이동 →
                      </button>
                    )}
                  </div>

                  {/* 3. 하단 구역 */}
                  {activeFloor.bottomRooms && activeFloor.bottomRooms.length > 0 && (
                    <div className="space-y-2">
                      {activeFloor.bottomLabel && (
                        <p className="text-[12.5px] font-bold text-[#555555]">
                          ▼ {activeFloor.bottomLabel}
                        </p>
                      )}
                      <div
                        className={`grid gap-2.5 ${getGridColsClass(
                          activeFloor.bottomCols || 3
                        )}`}
                      >
                        {activeFloor.bottomRooms.map((room) =>
                          renderRoomTile(room, 'min-h-[110px]')
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ============================================================
                  우측 영역: 실제 과구리 '탐활서 확인' 2열 테이블 디자인 상세 패널
                 ============================================================ */}
              <aside className="lg:col-span-4 rounded-[6px] border border-[#dcdcdc] bg-white p-5 space-y-4 lg:sticky lg:top-5">
                {activeRoom ? (
                  <>
                    <div className="border-b border-[#eeeeee] pb-3.5 space-y-1.5">
                      <p className="text-[12.5px] font-bold text-[#5aa396]">
                        {activeRoom.buildingName} &gt; {activeRoom.floorLabel}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-[19px] font-bold text-[#111111] leading-tight">
                            {activeRoom.name}
                          </h3>
                          {activeRoom.subtitle && (
                            <p className="mt-0.5 text-[12.5px] text-[#777777]">
                              {activeRoom.subtitle}
                            </p>
                          )}
                        </div>

                        <span
                          className={`rounded-[4px] px-2.5 py-1 text-[12.5px] font-bold ${
                            activeRoomEntries.length >= 2
                              ? 'border border-[#f59e0b] bg-[#fef3c7] text-[#92400e]'
                              : activeRoomEntries.length === 1
                              ? 'border border-[#6cb5a8] bg-[#eef8f6] text-[#25574e]'
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

                    {activeRoomEntries.length >= 2 && (
                      <div className="rounded-[4px] border border-[#fcd34d] bg-[#fffbeb] px-3 py-2 text-[12.5px] leading-relaxed text-[#92400e]">
                        현재 <strong>{activeRoomEntries.length}개 팀</strong>이 함께 배정되어 있습니다.
                      </div>
                    )}

                    {/* 팀 목록 (실제 과구리 탐활서 확인 2열 테이블 스타일) */}
                    {activeRoomEntries.length === 0 ? (
                      <div className="rounded-[4px] border border-dashed border-[#cccccc] bg-[#fafafa] px-4 py-10 text-center">
                        <p className="text-[14px] font-bold text-[#555555]">
                          {formatShortKoreanDate(selectedDate)} 기준
                          <br />
                          배정된 탐활이 없습니다.
                        </p>
                        <p className="mt-1 text-[12.5px] text-[#888888]">
                          현재 비어 있는 공간입니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeRoomEntries.map((item, idx) => (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-[4px] border border-[#cccccc] bg-white"
                          >
                            {/* 과구리 탐활서 상단 바 (팀 번호 / 신청시각) */}
                            <div className="flex items-center justify-between border-b border-[#dcdcdc] bg-[#fafafa] px-3 py-1.5 text-[12px] text-[#777777]">
                              <span className="font-bold text-[#222222]">
                                팀 #{idx + 1}
                              </span>
                              <span>{item.submittedAt || item.date}</span>
                            </div>

                            {/* 과구리 '탐활서 확인' 2열 테이블 (좌측 #f2f2f2 라벨 / 우측 #ffffff 내용) */}
                            <table className="w-full border-collapse text-[13px]">
                              <tbody>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    활동날짜
                                  </th>
                                  <td className="bg-white py-2 px-3 text-[#222222]">
                                    {item.date}
                                  </td>
                                </tr>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    활동시간
                                  </th>
                                  <td className="bg-white py-2 px-3 text-[#222222]">
                                    {item.timeSlots.join(', ')}
                                  </td>
                                </tr>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    활동장소
                                  </th>
                                  <td className="bg-white py-2 px-3 text-[#222222]">
                                    {item.rawLocation}
                                  </td>
                                </tr>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    활동내용
                                  </th>
                                  <td className="bg-white py-2 px-3 font-medium text-[#111111] leading-snug">
                                    {item.content}
                                  </td>
                                </tr>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    대표학생
                                  </th>
                                  <td className="bg-white py-2 px-3 font-bold text-[#111111]">
                                    {item.leader}
                                  </td>
                                </tr>
                                <tr className="border-b border-[#e2e2e2]">
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc] align-top">
                                    참가학생
                                  </th>
                                  <td className="bg-white py-2 px-3 text-[#222222] leading-relaxed break-keep">
                                    {item.members.map((member, mIdx) => {
                                      const isSearchHit =
                                        normalizedQuery &&
                                        member.toLowerCase().includes(normalizedQuery);
                                      return (
                                        <span key={mIdx}>
                                          <span
                                            className={
                                              isSearchHit
                                                ? 'bg-[#fef3c7] font-bold text-[#92400e] px-1'
                                                : ''
                                            }
                                          >
                                            {member}
                                          </span>
                                          {mIdx < item.members.length - 1 ? ', ' : ''}
                                        </span>
                                      );
                                    })}
                                  </td>
                                </tr>
                                <tr>
                                  <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                                    지도교사
                                  </th>
                                  <td className="bg-white py-2 px-3 text-[#222222]">
                                    {item.teacher}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-12 text-center text-[13.5px] text-[#777777]">
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
          <div className="w-full max-w-2xl overflow-hidden rounded-[6px] border border-[#dcdcdc] bg-white shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-3.5 text-white">
              <div>
                <h3 className="text-[16px] font-bold">
                  과구리 탐활서 데이터 붙여넣기 및 관리
                </h3>
                <p className="text-[12.5px] text-white/95">
                  과구리(jshsus.kr) 탐활서 내용을 붙여넣으면 자동 파싱 및 저장됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="p-1 text-white/90 hover:bg-white/20 rounded-[4px]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[82vh] overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-[#bde0d9] bg-[#eef8f6] p-3 text-[13px] text-[#25574e]">
                <div className="flex items-center gap-2">
                  <InfoIcon className="h-4 w-4 text-[#5aa396] shrink-0" />
                  <span>
                    한 줄 형식(<code>활동날짜2026-11-16</code>)과 표 복사 줄바꿈 형식 모두 자동 인식합니다.
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPasteInput(DEFAULT_GWAGURI_RAW_TEXT)}
                    className="rounded-[4px] border border-[#5aa396] bg-white hover:bg-[#e6f5f2] px-2.5 py-1 text-[12.5px] font-bold text-[#25574e]"
                  >
                    기본 27건 편집창 채우기
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToDefaultData}
                    className="inline-flex items-center gap-1 rounded-[4px] bg-[#5aa396] hover:bg-[#498d81] px-2.5 py-1 text-[12.5px] font-bold text-white"
                  >
                    <RotateCcwIcon className="h-3.5 w-3.5" />
                    <span>기본 27건으로 초기화</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={7}
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
                placeholder={`과구리 탐활서 게시판 내용을 그대로 복사(Ctrl+C)하여 여기에 붙여넣으세요(Ctrl+V)...\n\n예시)\n활동날짜2026-11-16\n활동시간19:10 ~ 20:20, 20:30 ~ 21:30\n활동장소물리실험실\n활동내용KYPT 준비 및 실험\n대표학생2304 김민건\n참가학생2304 김민건, 2215 신태민\n지도교사김희웅`}
                className="w-full rounded-[4px] border border-[#dcdcdc] bg-[#fafafa] p-3 text-[13.5px] text-[#222222] placeholder:text-[#999999] focus:border-[#5aa396] focus:bg-white focus:outline-none"
              />

              {previewParsedEntries.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[13.5px] font-bold text-[#222222]">
                    <span>
                      자동 파싱 미리보기: 총{' '}
                      <strong className="text-[#498d81]">
                        {previewParsedEntries.length}건
                      </strong>{' '}
                      인식됨
                    </span>
                    <span className="text-[12.5px] font-normal text-[#666666]">
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

                  <div className="max-h-48 overflow-y-auto rounded-[4px] border border-[#dcdcdc]">
                    <table className="w-full text-left text-[12.5px] border-collapse">
                      <thead className="bg-[#f2f2f2] text-[#222222] font-bold border-b border-[#dcdcdc]">
                        <tr>
                          <th className="px-3 py-2 border-r border-[#e2e2e2]">날짜</th>
                          <th className="px-3 py-2 border-r border-[#e2e2e2]">
                            원본 장소 → 매핑 공간
                          </th>
                          <th className="px-3 py-2 border-r border-[#e2e2e2]">대표학생</th>
                          <th className="px-3 py-2">활동내용</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e2e2e2]">
                        {previewParsedEntries.map((row) => {
                          const mapped = row.normalizedRoomId
                            ? ROOM_BY_ID[row.normalizedRoomId]
                            : null;
                          return (
                            <tr key={row.id}>
                              <td className="px-3 py-2 whitespace-nowrap text-[#555555] border-r border-[#eeeeee]">
                                {row.date}
                              </td>
                              <td className="px-3 py-2 border-r border-[#eeeeee]">
                                <span className="text-[#777777] mr-1">
                                  {row.rawLocation} →
                                </span>
                                {mapped ? (
                                  <span className="font-bold text-[#25574e]">
                                    {mapped.buildingShortName} {mapped.floorLabel}{' '}
                                    {mapped.name}
                                  </span>
                                ) : (
                                  <span className="font-bold text-[#3730a3]">
                                    교외 / 기타 장소
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 font-bold text-[#222222] whitespace-nowrap border-r border-[#eeeeee]">
                                {row.leader}
                              </td>
                              <td className="px-3 py-2 text-[#444444] truncate max-w-[180px]">
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

              <div className="flex justify-end gap-2 pt-3 border-t border-[#eeeeee]">
                <button
                  type="button"
                  onClick={() => setIsPasteModalOpen(false)}
                  className="rounded-[4px] border border-[#dcdcdc] bg-white px-4 py-1.5 text-[13.5px] font-bold text-[#555555] hover:bg-[#f5f5f5]"
                >
                  닫기
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedText}
                  className="rounded-[4px] bg-[#5aa396] hover:bg-[#498d81] px-4 py-1.5 text-[13.5px] font-bold text-white transition-colors"
                >
                  지도에 반영하기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          교외 / 기타 장소 모달 (과구리 탐활서 2열 테이블 적용)
         ==================================================================== */}
      {isOffCampusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg overflow-hidden rounded-[6px] border border-[#dcdcdc] bg-white shadow-xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#76b9ad] to-[#96cfc4] px-5 py-3.5 text-white">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <div>
                  <h3 className="text-[16px] font-bold">
                    교외 / 기타 장소 탐활 내역
                  </h3>
                  <p className="text-[12.5px] text-white/95">
                    {formatShortKoreanDate(selectedDate)} 기준 교외 활동 ({offCampusEntries.length}건)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOffCampusOpen(false)}
                className="p-1 text-white/90 hover:bg-white/20 rounded-[4px]"
              >
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto bg-[#fafafa]">
              {offCampusEntries.length === 0 ? (
                <p className="py-8 text-center text-[13.5px] text-[#777777]">
                  선택된 날짜·시간에 교외/기타 장소 활동이 없습니다.
                </p>
              ) : (
                offCampusEntries.map((item) => (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[4px] border border-[#cccccc] bg-white"
                  >
                    <table className="w-full border-collapse text-[13px]">
                      <tbody>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            활동날짜
                          </th>
                          <td className="bg-white py-2 px-3 text-[#222222]">
                            {item.date}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            활동시간
                          </th>
                          <td className="bg-white py-2 px-3 text-[#222222]">
                            {item.timeSlots.join(', ')}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            활동장소
                          </th>
                          <td className="bg-white py-2 px-3 font-bold text-[#3730a3]">
                            {item.rawLocation}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            활동내용
                          </th>
                          <td className="bg-white py-2 px-3 font-medium text-[#111111]">
                            {item.content}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            대표학생
                          </th>
                          <td className="bg-white py-2 px-3 font-bold text-[#111111]">
                            {item.leader}
                          </td>
                        </tr>
                        <tr className="border-b border-[#e2e2e2]">
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            참가학생
                          </th>
                          <td className="bg-white py-2 px-3 text-[#222222]">
                            {item.members.join(', ')}
                          </td>
                        </tr>
                        <tr>
                          <th className="w-[86px] bg-[#f2f2f2] py-2 px-2 text-center font-bold text-[#222222] border-r border-[#dcdcdc]">
                            지도교사
                          </th>
                          <td className="bg-white py-2 px-3 text-[#222222]">
                            {item.teacher}
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
    </div>
  );
}
