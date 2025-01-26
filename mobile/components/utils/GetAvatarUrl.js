import { REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS } from '@env';

const getAvatarUrl = (userId) => {
  return `${REACT_APP_CLOUDFRONT_DOMAIN_NAME_AVATARS}${userId}`;
};

export { getAvatarUrl }; 