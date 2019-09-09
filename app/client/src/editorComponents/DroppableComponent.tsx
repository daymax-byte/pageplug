import * as React from "react";
import { WidgetProps, WidgetState } from "../widgets/BaseWidget";
import {
  DropTargetConnector,
  DropTargetMonitor,
  DropTarget,
  XYCoord,
} from "react-dnd";
import { ContainerProps } from "./ContainerComponent";
import WidgetFactory from "../utils/WidgetFactory";

export interface DroppableProps extends ContainerProps {
  connectDropTarget: Function;
  isOver?: boolean;
}

class DroppableComponent extends React.Component<DroppableProps, WidgetState> {
  render() {
    return this.props.connectDropTarget(
      <div
        style={{
          position: "absolute",
          left: this.props.style.xPosition + this.props.style.xPositionUnit,
          height: this.props.style.height,
          width: this.props.style.width,
          background: this.props.isOver ? "#f4f4f4" : undefined,
          top: this.props.style.yPosition + this.props.style.yPositionUnit,
        }}
      >
        {this.props.isOver ? undefined : this.props.children}
      </div>,
    );
  }
}

const dropTarget = {
  canDrop() {
    return true;
  },
  drop(props: WidgetProps, monitor: DropTargetMonitor) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);
    return { left: left, top: top };
  },
};

const getDropTypes = () => {
  return WidgetFactory.getWidgetTypes();
};

function collect(connect: DropTargetConnector, monitor: DropTargetMonitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  };
}

export default DropTarget(getDropTypes, dropTarget, collect)(
  DroppableComponent,
);
