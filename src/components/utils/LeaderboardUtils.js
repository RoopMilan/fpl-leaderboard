export const getChipIcon = (chip) => {
  switch (chip) {
    case '3xc': return '🎯 Triple Captain';
    case 'bboost': return '🎯 Bench Boost';
    case 'freehit': return '🎯 Free Hit';
    case 'wildcard': return '🎯 Wildcard';
    default: return chip;
  }
};

export const getCaptainImageUrl = (id) => {
  return `https://resources.premierleague.com/premierleague/photos/players/110x140/p${id}.png`;
};