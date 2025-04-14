export enum Step {
  'landing',
  'team-select',
  'league-roster',
}

export const getPreviousStep = (step: Step, url: string) => {
  switch (step) {
    case Step['league-roster']:
      return 'team-select';
    case Step['team-select']:
      return 'landing';
    default:
      return 'landing';
  }
};
