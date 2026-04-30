import Skeleton from './Skeleton';
import SkeletonButton from './Button';
import SkeletonInput from './Input';
import SkeletonImage from './Image';
import SkeletonAvatar from './Avatar';
import SkeletonTitle from './Title';
export { skeletonProps } from './Skeleton';
Skeleton.Button = SkeletonButton;
Skeleton.Avatar = SkeletonAvatar;
Skeleton.Input = SkeletonInput;
Skeleton.Image = SkeletonImage;
Skeleton.Title = SkeletonTitle;
/* istanbul ignore next */
Skeleton.install = function (app) {
  app.component(Skeleton.name, Skeleton);
  app.component(Skeleton.Button.name, SkeletonButton);
  app.component(Skeleton.Avatar.name, SkeletonAvatar);
  app.component(Skeleton.Input.name, SkeletonInput);
  app.component(Skeleton.Image.name, SkeletonImage);
  app.component(Skeleton.Title.name, SkeletonTitle);
  return app;
};
export { SkeletonButton, SkeletonAvatar, SkeletonInput, SkeletonImage, SkeletonTitle };
export default Skeleton;