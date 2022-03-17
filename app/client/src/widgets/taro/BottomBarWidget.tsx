import React, { ReactNode } from "react";
import { connect } from "react-redux";
import { ReduxActionTypes } from "constants/ReduxActionConstants";
import BaseWidget, { WidgetProps, WidgetState } from "../BaseWidget";
import WidgetFactory from "utils/WidgetFactory";
import { ValidationTypes } from "constants/WidgetValidation";
import BottomBarComponent from "components/designSystems/taro/BottomBarComponent";
import {
  WidgetTypes,
  RenderMode,
  MAIN_CONTAINER_WIDGET_ID,
} from "constants/WidgetConstants";
import { generateClassName } from "utils/generators";
import withMeta, { WithMeta } from "../MetaHOC";
import { AppState } from "reducers";
import { getWidget } from "sagas/selectors";

export class MBottomBarWidget extends BaseWidget<
  MBottomBarWidgetProps,
  WidgetState
> {
  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "height",
            label: "面板高度（不带单位的数字）",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.NUMBER,
              params: { min: 80, max: 200 },
            },
          },
        ],
      },
    ];
  }

  getModalWidth() {
    return this.props.mainContainer.rightColumn;
  }

  renderChildWidget = (childWidgetData: WidgetProps): ReactNode => {
    childWidgetData.parentId = this.props.widgetId;
    childWidgetData.shouldScrollContents = false;
    childWidgetData.canExtend = false;
    childWidgetData.bottomRow = childWidgetData.bottomRow;
    childWidgetData.isVisible = this.props.isVisible;
    childWidgetData.containerStyle = "none";
    childWidgetData.minHeight = this.props.height;
    childWidgetData.rightColumn = this.getModalWidth();
    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  };

  getChildren(): ReactNode {
    if (this.props.children && this.props.children.length > 0) {
      const children = this.props.children.filter(Boolean);
      return children.length > 0 && children.map(this.renderChildWidget);
    }
  }

  makeModalComponent(content: ReactNode) {
    return (
      <BottomBarComponent
        className={`t--modal-widget ${generateClassName(this.props.widgetId)}`}
        height={this.props.height}
      >
        {content}
      </BottomBarComponent>
    );
  }

  getCanvasView() {
    let children = this.getChildren();
    children = this.showWidgetName(children, true);
    return this.makeModalComponent(children);
  }

  getPageView() {
    const children = this.getChildren();
    return this.makeModalComponent(children);
  }

  getWidgetType() {
    return WidgetTypes.TARO_BOTTOM_BAR_WIDGET;
  }
}

export interface MBottomBarWidgetProps extends WidgetProps, WithMeta {
  renderMode: RenderMode;
  children?: WidgetProps[];
  height?: number;
  showPropertyPane: (widgetId?: string) => void;
  mainContainer: WidgetProps;
}

const mapDispatchToProps = (dispatch: any) => ({
  showPropertyPane: (
    widgetId?: string,
    callForDragOrResize?: boolean,
    force = false,
  ) => {
    dispatch({
      type:
        widgetId || callForDragOrResize
          ? ReduxActionTypes.SHOW_PROPERTY_PANE
          : ReduxActionTypes.HIDE_PROPERTY_PANE,
      payload: { widgetId, callForDragOrResize, force },
    });
  },
});

const mapStateToProps = (state: AppState) => {
  const props = {
    mainContainer: getWidget(state, MAIN_CONTAINER_WIDGET_ID),
  };
  return props;
};
export default MBottomBarWidget;
export const MProfiledBottomBarWidget = connect(
  mapStateToProps,
  mapDispatchToProps,
)(withMeta(MBottomBarWidget));
