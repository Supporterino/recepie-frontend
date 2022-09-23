const alignCenterJustifyCenter = { justifyContent: 'center', alignItems: 'center' } as const;
const alignStartJudtifyCenter = { justifyContent: 'center', alignItems: 'flex-start' } as const;
const alignCenterJustifyStart = { justifyContent: 'flex-start', alignItems: 'center' } as const;

const centerStyle = { display: 'flex', ...alignCenterJustifyCenter } as const;
const centerTopStyleRow = { display: 'flex', ...alignStartJudtifyCenter } as const;
const centerTopStyleCol = { display: 'flex', ...alignCenterJustifyStart } as const;

const flexCol = { height: '100%', display: 'flex', flexDirection: 'column' } as const;

export { alignStartJudtifyCenter, centerStyle, alignCenterJustifyCenter, alignCenterJustifyStart, centerTopStyleRow, centerTopStyleCol, flexCol };
