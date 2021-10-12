import { FC } from 'react';
import { useDrag } from 'react-dnd';
import { IView, ViewRenderer } from './ViewContainer';

interface ViewWrapperProps {
  view: IView;
  render: ViewRenderer;
}

export const ViewWrapper: FC<ViewWrapperProps> = ({ view, render }) => {
  const { viewType, id } = view
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'VIEW',
      item: {viewType, id},
      collect: monitor => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    []
  );

  if (isDragging) {
    return <div ref={drag} />;
  }

  return (
    <div ref={drag} style={{}} className="fill">
      {render(view)}
    </div>
  );
};
