import { Attributor, Scope } from 'parchment';

const config = {
  scope: Scope.INLINE,
  whitelist: ['true'],
};

const voidDetectAttribute = new Attributor(
  'void-detect',
  'data-void-detect',
  config,
);

export default voidDetectAttribute;
