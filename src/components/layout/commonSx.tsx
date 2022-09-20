const alignCenter = { justifyContent: 'center', alignItems: 'center' } as const;
const alignCenterTop = { justifyContent: 'center', alignItems: 'flex-start' } as const;

const centerStyle = { display: 'flex', ...alignCenter } as const;
const centerTopStyle = { display: 'flex', ...alignCenterTop } as const;

export { alignCenter, centerStyle, alignCenterTop, centerTopStyle };
