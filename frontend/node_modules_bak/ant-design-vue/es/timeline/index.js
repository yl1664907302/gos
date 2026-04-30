import Timeline, { timelineProps } from './Timeline';
import TimelineItem, { timelineItemProps } from './TimelineItem';
Timeline.Item = TimelineItem;
/* istanbul ignore next */
Timeline.install = function (app) {
  app.component(Timeline.name, Timeline);
  app.component(TimelineItem.name, TimelineItem);
  return app;
};
export { TimelineItem, timelineProps, timelineItemProps };
export default Timeline;