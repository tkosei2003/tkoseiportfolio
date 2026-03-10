export type TimelineEventLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type TimelineEvent = {
  date: string;
  title: string;
  detail: string;
  summary: string;
  links?: TimelineEventLink[];
};

export const timelineEvents: TimelineEvent[] = [
  {
    date: '2022.04',
    title: '大阪公立大学入学',
    detail: '大阪公立大学一期生として情報工学科に入学。',
    summary: 'プログラミングに初めて触れる。',
  },
  {
    date: '2022.05',
    title: '英検準一級合格',
    detail: '英検準一級に合格。',
    summary: '',
  },
  {
    date: '2022.11',
    title: 'ITパスポート試験合格',
    detail: 'ITパスポート試験に合格。',
    summary: '',
  },
  {
    date: '2023.10',
    title: '基本情報技術者試験合格',
    detail: '基本情報技術者試験に合格。',
    summary: '',
  },
  {
    date: '2023.11',
    title: '学修奨励賞受賞',
    detail: '大阪公立大学の学部2年次の学生のうち、学科ごとの成績優秀者に贈られる学修奨励賞を受賞。',
    summary: '',
  },
  {
    date: '2024.07',
    title: '応用情報技術者試験合格',
    detail: '応用情報技術者試験に合格。',
    summary: '',
  },
  {
    date: '2024.12',
    title: 'データベーススペシャリスト試験合格',
    detail: 'データベーススペシャリスト試験に合格。',
    summary: '',
  },
  {
    date: '2025.01',
    title: '株式会社Affectifyにてインターン開始',
    detail:
      '株式会社Affectifyにて、ソフトウェアエンジニア・テクニカルサポートとしてインターンを開始。',
    summary: 'チーム開発の経験を現在に至るまで積む。',
    links: [
      { label: '株式会社Affectify 企業HP', href: 'https://affectify.jp/recruit/', external: true },
    ],
  },
  {
    date: '2025.10',
    title: '国際学会にて査読付きポスター論文が2本採択',
    detail:
      '国際学会であるACM SIGACCESS Conference on Computers and Accessibility（ASSETS 2025）にて、査読付きポスター論文が2本採択される。',
    summary: '',
    links: [
      {
        label: '論文ページ（1）',
        href: 'https://dl.acm.org/doi/10.1145/3663547.3759751',
        external: true,
      },
      {
        label: '論文ページ（2）',
        href: 'https://dl.acm.org/doi/10.1145/3663547.3759737',
        external: true,
      },
    ],
  },
  {
    date: '2025.12',
    title: '感覚代行研究奨励賞受賞',
    detail: '感覚代行シンポジウムにて口頭発表を行い、感覚代行研究奨励賞を受賞する。',
    summary: '',
    links: [
      {
        label: '受賞者ページ',
        href: 'https://www.sensory-substitution.gr.jp/award/winner51.html',
        external: true,
      },
    ],
  },
  {
    date: '2026.03',
    title: 'ポートフォリオサイトを公開',
    detail: 'ポートフォリオサイトを公開し、これまでの学びと経験を発信する。',
    summary: '',
  },
];
