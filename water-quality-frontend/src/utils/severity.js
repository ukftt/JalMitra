export const STATUS = {
  OPEN: {
    label: 'Open',
    color: '#C2410C',
    bg: '#FDECE3',
    text: '#9A2D0F',
  },
  ACKNOWLEDGED: {
    label: 'Acknowledged',
    color: '#D97706',
    bg: '#FEF3DC',
    text: '#92400E',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: '#D97706',
    bg: '#FEF3DC',
    text: '#92400E',
  },
  RESOLVED: {
    label: 'Resolved',
    color: '#15803D',
    bg: '#E5F7EB',
    text: '#166534',
  },
};

export const ISSUE_TYPES = [
  { value: 'COLOUR', label: 'Discolouration', icon: '🎨' },
  { value: 'SMELL', label: 'Bad Smell', icon: '👃' },
  { value: 'NO_SUPPLY', label: 'No Supply', icon: '🚱' },
  { value: 'CONTAMINATION', label: 'Contamination', icon: '⚠️' },
  { value: 'LEAKAGE', label: 'Pipeline Leakage', icon: '💧' },
];

export function getStatusMeta(status) {
  return STATUS[status] || STATUS.OPEN;
}

export function getIssueMeta(issueType) {
  return ISSUE_TYPES.find((i) => i.value === issueType) || ISSUE_TYPES[0];
}