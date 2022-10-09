const alignCenterJustifyCenter = { justifyContent: 'center', alignItems: 'center' } as const;
const alignStartJudtifyCenter = { justifyContent: 'center', alignItems: 'flex-start' } as const;
const alignCenterJustifyStart = { justifyContent: 'flex-start', alignItems: 'center' } as const;
const alignCenterJustifyEvenly = { justifyContent: 'space-evenly', alignItems: 'center' } as const;

const centerStyle = { display: 'flex', ...alignCenterJustifyCenter } as const;
const centerTopStyleRow = { display: 'flex', ...alignStartJudtifyCenter } as const;
const centerTopStyleCol = { display: 'flex', ...alignCenterJustifyStart } as const;

const flexCol = { height: '100%', display: 'flex', flexDirection: 'column' } as const;

const gridOutline = {
  '--Grid-borderWidth': '1px',
  // borderTop: 'var(--Grid-borderWidth) solid',
  // borderLeft: 'var(--Grid-borderWidth) solid',
  borderColor: 'divider',
  '& > div': {
    // borderRight: 'var(--Grid-borderWidth) solid',
    borderBottom: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider'
  }
} as const;

export {
  alignStartJudtifyCenter,
  centerStyle,
  alignCenterJustifyCenter,
  alignCenterJustifyStart,
  centerTopStyleRow,
  centerTopStyleCol,
  flexCol,
  gridOutline,
  alignCenterJustifyEvenly
};
