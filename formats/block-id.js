import { Attributor, Scope } from 'parchment';

const config = {
  scope: Scope.BLOCK,
};

const BlockIdentityAttribute = new Attributor(
  'block-id',
  'data-block-id',
  config,
);

export default BlockIdentityAttribute;
export const BlockIdentityAttributeOptions = { enabled: true };
