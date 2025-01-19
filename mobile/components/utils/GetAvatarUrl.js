import { REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS } from '@env';

const DEFAULT_AVATAR = `${REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}/c3ht6UxQQHikWiL2r5iQ_rLp2qR0d12L5s3d4`;

const getAvatarUrl = (userId) => {
  if (!userId) return DEFAULT_AVATAR;
  return `${REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}/${userId}`;
};

export { getAvatarUrl, DEFAULT_AVATAR }; 