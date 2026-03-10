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
    date: '2022.4',
    title: '大阪公立大学入学',
    detail: '大阪公立大学一期生として情報工学科に入学。',
    summary: 'プログラミングに初めて触れる。',
  },
  {
    date: '2022.11',
    title: 'プロジェクトA開発開始',
    detail: 'チームで本格開発',
    summary: '役割分担とレビューを通して、品質の基準を言語化。',
  },
  {
    date: '2025.12',
    title: '○○学会での口頭発表（詳細はこちら）',
    detail: '初の学会口頭発表',
    summary: '実装の背景を説明する力を鍛え、研究を外部へ発信。',
  },
  {
    date: '2024.01',
    title: 'インターンシップ参加',
    detail: '実運用環境で開発',
    summary: '速度と品質のバランス、運用視点を実地で習得。',
  },
  {
    date: '2024.02',
    title: '国際会議への論文投稿',
    detail: '研究成果を論文化',
    summary: '検証の習慣と改善サイクルを確立した節目。',
    links: [
      { label: '論文ページ', href: 'https://example.com/paper', external: true },
      { label: '関連記事', href: '/blog/my-post' },
    ],
  },
  {
    date: '2024.04',
    title: '画像処理系の実装強化',
    detail: '評価パイプライン整備',
    summary: '再現性と比較可能性を担保する実験環境を整備。',
  },
];
