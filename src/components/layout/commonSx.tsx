const alignCenterJustifyCenter = {
  alignItems: 'center',
  justifyContent: 'center',
} as const;
const alignStartJustifyCenter = {
  alignItems: 'flex-start',
  justifyContent: 'center',
} as const;
const alignCenterJustifyStart = {
  alignItems: 'center',
  justifyContent: 'flex-start',
} as const;
const alignCenterJustifyEvenly = {
  alignItems: 'center',
  justifyContent: 'space-evenly',
} as const;

const centerStyle = {
  display: 'flex',
  ...alignCenterJustifyCenter,
} as const;
const centerTopStyleRow = {
  display: 'flex',
  ...alignStartJustifyCenter,
} as const;
const centerTopStyleCol = {
  display: 'flex',
  ...alignCenterJustifyStart,
} as const;

const flexCol = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
} as const;

const gridOutline = {
  '& > div': {
    // borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
  },

  '--Grid-borderWidth': '1px',
  // borderTop: 'var(--Grid-borderWidth) solid',
  // borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
} as const;

export {
  alignCenterJustifyCenter,
  alignCenterJustifyEvenly,
  alignCenterJustifyStart,
  alignStartJustifyCenter,
  centerStyle,
  centerTopStyleCol,
  centerTopStyleRow,
  flexCol,
  gridOutline,
};
