import type {ReferencesMessages} from "@src/language/references/references-messages/ReferencesMessages";

/**
 * The references page in Korean, **machine translated from the English and not yet read by a native speaker**, so the
 * page says so before anything else; set `translationNotice` to `undefined` once someone has read it. It uses the terms
 * the game does (`docs/localisation.md`). A source's name stays as its author gave it, and where the English says a
 * source is in Korean, this says instead when it is in English.
 */
export const KOREAN_REFERENCES_MESSAGES: ReferencesMessages = {
  translationNotice: {
    statement: "이 페이지는 영어 원문을 기계 번역한 것으로, 오역이나 어색한 표현이 있을 수 있습니다.",
    statementInEnglish: "This page was machine translated from the English original and may contain mistakes.",
    linkToOriginal: "영어 페이지 보기 (Read the English page)",
    label: "기계 번역 안내",
  },
  header: {
    title: "참고 자료 및 출처",
    introduction:
      "오랜 역사를 지닌 게임을 너그러운 공동체 덕분에 이곳에서 즐길 수 있게 되었습니다. 이 게임을 만드는 데 도움을 준 기사와 필자, 오픈 소스 기여자분들께 감사드립니다.",
    repository: "GitHub에서 소스 보기",
    byline: "Neil Armstrong의 장기 · ",
    projectLicence: "MIT 라이선스",
  },
  navigationLabel: "이 페이지에서",
  languageLabel: "언어",
  languageNames: {en: "English", ko: "한국어"},
  licenceOf: licence => `${licence} 라이선스`,
  thanks: "장기에 대한 지식을 나누고 자신의 작업을 다른 사람이 활용할 수 있도록 공개한 모든 분께 감사드립니다.",
  sections: {
    rules: {
      title: "규칙과 대국 방식",
      introduction:
        "장기에는 여러 대국 전통이 있습니다. 이 게임의 일반 방식에서는 빅장을 부르면 무승부로 끝날 수 있고, 점수제 방식에서는 조건이 더해져 점수로 결정됩니다. 이 두 방식은 아래 자료를 저희가 해석한 것이며, 빅장과 반복, 한수쉼에 대한 자료들의 설명이 늘 일치하지는 않습니다.",
    },
    openings: {
      title: "상차림과 변형 규칙",
      introduction:
        "마와 상의 배치 이름은 글쓴이의 시점에 따라 달라질 수 있습니다. 도해와 기보, 한국어 용어를 비교해 이 게임의 상차림 이름과 맞상과 엇상 설명을 정했습니다.",
    },
    opponent: {
      title: "컴퓨터 상대",
      introduction:
        "봇을 움직이는 엔진을 만든 Fabian Fichter와 Fairy-Stockfish, Stockfish 기여자들에게 감사드립니다. 이 게임은 모든 수를 자체 규칙으로 확인한 뒤에 둡니다. 표시되는 봇 실력은 명목상의 Elo로, 장기가 아닌 체스를 기준으로 맞춘 값입니다. 이 부분의 링크는 영어 페이지입니다.",
    },
    tools: {
      title: "오픈 소스 소프트웨어와 도구",
      introduction:
        "이 게임과 개발 도구는 아래 프로젝트와 기여자들의 작업 위에 만들어졌습니다. 관련 패키지는 함께 소개하며, 소스와 라이선스 조건으로 가는 링크를 달았습니다. 링크는 대부분 영어 페이지입니다.",
    },
  },
  descriptions: {
    kja: "협회의 대국 규정은 점수 계산과 반복, 빅장의 30점 조건, 그리고 궁이 말을 잡은 뒤의 예외에 참고가 되었습니다.",
    kojf: "별도의 연맹입니다. 2020년 개정에서 대회의 무승부를 없애 점수 기준 해석의 근거가 되었고, 2022년 개정은 한수쉼과 연속 두 번의 한수쉼 뒤 정산을 명확히 했습니다.",
    wikipedia:
      "영어판과 한국어판 문서로 판, 말의 움직임, 점수, 한의 덤 1.5점, 일상적인 대국 방식을 교차 확인했습니다. 커뮤니티의 설명은 연맹 규정과 다를 때가 있습니다.",
    pychess:
      "실제로 동작하는 장기 구현이자 이해하기 쉬운 게임 설명입니다. 궁성 대각선에서의 포의 움직임, 판정, 상차림 선택을 확인할 때 참고했습니다. 상차림 이름은 판의 방향을 비교할 때 주의가 필요합니다. 영어 자료입니다.",
    rulesResearch:
      "각 말의 움직임을 추적하고, 자료끼리 다른 부분에서 내린 결정을 설명하는 연구 노트입니다. 일반과 점수제의 차이도 다룹니다. 영어 자료입니다.",
    jangHayoung:
      "프로 기사의 칼럼으로, 해설이 달린 기보와 포진 통계, 맞상에 대한 논의를 제공했습니다. 기보 덕분에 어떤 설명이 실제로 어느 쪽 판 방향을 뜻하는지 가릴 수 있었습니다. 칼럼끼리도 일부 이름이 다릅니다.",
    elephantWikipedia:
      "상 문서와 상차림 도해에서 왼상차림의 정확한 배치를 확인했습니다. 영어판 상차림 틀은 위키백과가 양쪽 진영을 어떻게 그리는지 확인하는 데 도움이 되었습니다.",
    hangame:
      "네 가지 상차림의 한국어 이름과 포진 용어, 처음 배치와 전개된 포진의 구분을 참고했습니다. 판의 방향이 늘 명시되어 있지는 않습니다.",
    braintv:
      "다섯 가지 포진과 그 장단점에 대한 설명은 처음 배치와 거기서 이어지는 포진을 연결하는 데 도움이 되었습니다.",
    community:
      "나무위키와 장기 게시판으로 맞상과 엇상의 일상적인 쓰임을 비교했습니다. 조사 당시 검색 요약으로만 볼 수 있었기 때문에, 비교를 뒷받침할 뿐 규칙을 정하지는 않습니다.",
    chessvariants:
      "상차림 순서, 열여섯 가지 조합, 전개된 포진에 대한 추가 배경 자료입니다. The Chess Variant Pages의 글은 보관본으로 봐야 할 수도 있습니다. 위키책을 제외하면 영어 자료입니다.",
    openingsResearch:
      "도해, 번역한 구절, 풀이한 기보, 각 자료의 근거에 대한 평가를 담은 전체 비교입니다. 영어 자료입니다.",
    fairyStockfish:
      "이 오픈 소스 엔진이 봇의 수를 탐색합니다. 엔진에 내장된 장기 변형은 빅장과 반복에서 이 게임과 다르기 때문에, 심판은 이 게임의 자체 엔진이 맡습니다.",
    fairyWasm:
      "WebAssembly 이식판 덕분에 엔진이 브라우저 안에서, 사용자의 기기로 실행됩니다. 배포된 엔진 파일은 라이선스와 제작자 목록과 함께 수정 없이 제공됩니다.",
    coiServiceworker:
      "GitHub Pages 같은 호스팅에서 멀티스레드 WebAssembly를 가능하게 하는 서비스 워커 기법에 대한 감사입니다. 이 게임은 이 라이브러리를 설치하지 않고 같은 방식을 자체 서비스 워커로 구현했습니다.",
    botResearch: "엔진 변형, 수 검증, 명목상의 실력, 설치형 웹 앱에서 엔진을 실행하는 방법에 대한 노트입니다.",
    react: "판과 조작 버튼, 그리고 이 페이지를 그립니다. React Hooks ESLint 플러그인은 훅의 사용 방식을 검사합니다.",
    reduxToolkit: "대국, 환경설정, 결과를 예측 가능한 상태 변화로 관리합니다.",
    reactRedux: "React 화면을 게임에 저장된 상태와 연결합니다.",
    clsx: "선택, 수, 화면 상태를 표시하는 데 쓰는 클래스 이름을 조합합니다.",
    tailwind: "판과 그 주변 화면의 스타일 유틸리티를 제공합니다.",
    vite: "개발 중에 앱을 제공하고, GitHub Pages에 배포할 파일을 빌드합니다.",
    vitePwa: "서비스 워커를 빌드하고 등록하며, 설치형 앱의 매니페스트를 생성합니다.",
    workbox: "빌드, 프리캐싱, 라우팅, 윈도 패키지로 앱을 오프라인에서도 쓸 수 있게 합니다.",
    typescript: "게임, 화면, 테스트가 함께 쓰는 타입을 검사합니다.",
    pnpm: "버전이 고정된 의존성을 설치하고 워크스페이스의 명령을 실행합니다.",
    playwright: "데스크톱과 모바일 화면 크기의 실제 브라우저로 인수 테스트를 실행합니다.",
    vitest: "규칙과 화면 뒤의 판단을 포함한 단위 테스트를 실행합니다.",
    testingLibrary: "React Testing Library, DOM Testing Library, jest-dom은 커스텀 훅 테스트와 그 검증을 돕습니다.",
    fastCheck: "규칙 오류를 찾기 위해 무작위 대국과 국면을 만들고, 실패 사례를 더 작은 예로 줄입니다.",
    jsdom: "Node에서 실행되는 훅 테스트에 브라우저와 비슷한 문서를 제공합니다.",
    eslint: "코드 품질을 검사하고 워크스페이스 패키지 사이의 경계를 지키게 합니다.",
    typescriptEslint: "ESLint가 TypeScript를 이해하고 타입에 따른 규칙을 검사할 수 있게 합니다.",
    eslintReact: "React 컴포넌트가 올바른지 검사합니다.",
    globals: "어떤 전역 이름이 브라우저와 Node에 속하는지 린트 설정에 알려 줍니다.",
    prettier:
      "코드를 일관되게 정리합니다. 서식 규칙과 린트 규칙의 충돌은 eslint-config-prettier 덕분에 생기지 않습니다.",
    definitelytyped: "프로젝트 전반에 쓰이는 React, React DOM, Node의 타입 정의를 관리합니다.",
  },
  linkNames: {
    botResearch: "봇을 이 게임의 규칙에 맞춘 방법",
    braintv: "BrainTV · 포진과 그 장점",
    chessvariantsArchive: "상차림 (보관본)",
    community: "보조 커뮤니티 자료 · 나무위키",
    engineAuthors: "Fairy-Stockfish와 Stockfish 제작자",
    engineLicence: "엔진과 함께 제공되는 라이선스",
    hangame: "한게임 · 장기 용어 사전",
    jangFormations: "대표 포진의 핵심 개념",
    jangHorsesElephants: "초반의 마와 상",
    jangResponse: "쌍마 포진에 대한 대응",
    janggiForum: "장기 커뮤니티 토론",
    kjaMovement: "기물행마법 (보관본)",
    kjaRegulations: "대국 규정 (2013년 보관본)",
    kjaRules: "대국 규칙 (2011년 보관본)",
    kojfPassing: "2022년 규칙 개정",
    namuTerms: "나무위키 용어 문서",
    openingsResearch: "이 게임의 상차림 이름",
    pychessSetups: "상차림 화면 소스 (영어)",
    pychessSource: "장기 설명서 소스 (영어)",
    rulesResearch: "이 게임의 규칙 해석",
    setupTemplate: "영어판 장기 상차림 틀",
    stockfish: "Stockfish 프로젝트",
    tailwind: "Tailwind CSS와 Vite 플러그인",
    viteReact: "React 플러그인 (MIT)",
    wikibooks: "위키책: 초반 포진법",
    wikipediaKorean: "장기 (한국어판)",
    yangSang: "양상 판 도해",
  },
};
