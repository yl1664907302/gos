import Avatar from './Avatar';
import Group from './Group';
export { avatarProps } from './Avatar';
Avatar.Group = Group;
/* istanbul ignore next */
Avatar.install = function (app) {
  app.component(Avatar.name, Avatar);
  app.component(Group.name, Group);
  return app;
};
export { Group as AvatarGroup };
export default Avatar;