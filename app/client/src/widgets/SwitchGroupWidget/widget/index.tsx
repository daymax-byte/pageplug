import React from "react";
import { Alignment } from "@blueprintjs/core";
import { EventType } from "constants/AppsmithActionConstants/ActionConstants";
import { ValidationTypes } from "constants/WidgetValidation";
import { EvaluationSubstitutionType } from "entities/DataTree/dataTreeFactory";
import { isString, xor } from "lodash";
import type { DerivedPropertiesMap } from "utils/WidgetFactory";
import type { WidgetProps, WidgetState } from "widgets/BaseWidget";
import BaseWidget from "widgets/BaseWidget";

import { LabelPosition } from "components/constants";
import type { TextSize } from "constants/WidgetConstants";
import type { Stylesheet } from "entities/AppTheming";
import { GRID_DENSITY_MIGRATION_V1 } from "widgets/constants";
import { isAutoHeightEnabledForWidget } from "widgets/WidgetUtils";
import type { OptionProps } from "../component";
import SwitchGroupComponent from "../component";
import type { AutocompletionDefinitions } from "widgets/constants";
import { isAutoLayout } from "utils/autoLayout/flexWidgetUtils";

class SwitchGroupWidget extends BaseWidget<
  SwitchGroupWidgetProps,
  WidgetState
> {
  static getPropertyPaneContentConfig() {
    return [
      {
        sectionName: "数据",
        children: [
          {
            helpText: "选项值唯一的选项数组",
            propertyName: "options",
            label: "选项",
            controlType: "INPUT_TEXT",
            placeholderText: '[{ "label": "选项1", "value": "选项2" }]',
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                children: {
                  type: ValidationTypes.OBJECT,
                  params: {
                    allowedKeys: [
                      {
                        name: "label",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          required: true,
                          unique: true,
                        },
                      },
                      {
                        name: "value",
                        type: ValidationTypes.TEXT,
                        params: {
                          default: "",
                          unique: true,
                        },
                      },
                    ],
                  },
                },
              },
            },
            evaluationSubstitutionType:
              EvaluationSubstitutionType.SMART_SUBSTITUTE,
          },
          {
            helpText: "默认选中项，多选用逗号分隔",
            propertyName: "defaultSelectedValues",
            label: "默认选中值",
            placeholderText: "请输入选中项的值",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: {
              type: ValidationTypes.ARRAY,
              params: {
                default: [],
                children: {
                  type: ValidationTypes.TEXT,
                },
                strict: true,
              },
            },
          },
        ],
      },
      {
        sectionName: "标签",
        children: [
          {
            helpText: "设置组件标签文本",
            propertyName: "labelText",
            label: "文本",
            controlType: "INPUT_TEXT",
            placeholderText: "请输入文本内容",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签位置",
            propertyName: "labelPosition",
            label: "位置",
            controlType: "ICON_TABS",
            fullWidth: true,
            hidden: isAutoLayout,
            options: [
              { label: "自动", value: LabelPosition.Auto },
              { label: "左", value: LabelPosition.Left },
              { label: "上", value: LabelPosition.Top },
            ],
            defaultValue: LabelPosition.Top,
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            helpText: "设置组件标签的对齐方式",
            propertyName: "labelAlignment",
            label: "对齐",
            controlType: "LABEL_ALIGNMENT_OPTIONS",
            options: [
              {
                icon: "LEFT_ALIGN",
                value: Alignment.LEFT,
              },
              {
                icon: "RIGHT_ALIGN",
                value: Alignment.RIGHT,
              },
            ],
            isBindProperty: false,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
            hidden: (props: SwitchGroupWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
          {
            helpText: "设置组件标签占用的列数",
            propertyName: "labelWidth",
            label: "宽度（所占列数）",
            controlType: "NUMERIC_INPUT",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            min: 0,
            validation: {
              type: ValidationTypes.NUMBER,
              params: {
                natural: true,
              },
            },
            hidden: (props: SwitchGroupWidgetProps) =>
              props.labelPosition !== LabelPosition.Left,
            dependencies: ["labelPosition"],
          },
        ],
      },
      {
        sectionName: "校验",
        children: [
          {
            propertyName: "isRequired",
            label: "必填",
            helpText: "强制用户填写",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            helpText: "提示信息",
            propertyName: "labelTooltip",
            label: "提示",
            controlType: "INPUT_TEXT",
            placeholderText: "请至少输入 6 个字符",
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "isVisible",
            helpText: "控制组件的显示/隐藏",
            label: "是否显示",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isDisabled",
            helpText: "让组件不可交互",
            label: "禁用",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "isInline",
            helpText: "是否水平排列",
            label: "行排列",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
          {
            propertyName: "animateLoading",
            label: "加载时显示动画",
            controlType: "SWITCH",
            helpText: "组件依赖的数据加载时显示加载动画",
            defaultValue: true,
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.BOOLEAN },
          },
        ],
      },
      {
        sectionName: "事件",
        children: [
          {
            helpText: "开关变化时触发",
            propertyName: "onSelectionChange",
            label: "onSelectionChange",
            controlType: "ACTION_SELECTOR",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: true,
          },
        ],
      },
    ];
  }

  static getPropertyPaneStyleConfig() {
    return [
      {
        sectionName: "标签样式",
        children: [
          {
            propertyName: "labelTextColor",
            label: "字体颜色",
            helpText: "设置标签字体颜色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelTextSize",
            label: "字体大小",
            helpText: "设置标签字体大小",
            controlType: "DROP_DOWN",
            defaultValue: "0.875rem",
            options: [
              {
                label: "S",
                value: "0.875rem",
                subText: "0.875rem",
              },
              {
                label: "M",
                value: "1rem",
                subText: "1rem",
              },
              {
                label: "L",
                value: "1.25rem",
                subText: "1.25rem",
              },
              {
                label: "XL",
                value: "1.875rem",
                subText: "1.875rem",
              },
              {
                label: "XXL",
                value: "3rem",
                subText: "3rem",
              },
              {
                label: "3XL",
                value: "3.75rem",
                subText: "3.75rem",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
          {
            propertyName: "labelStyle",
            label: "强调",
            helpText: "设置标签字体是否加粗或斜体",
            controlType: "BUTTON_GROUP",
            options: [
              {
                icon: "BOLD_FONT",
                value: "BOLD",
              },
              {
                icon: "ITALICS_FONT",
                value: "ITALIC",
              },
            ],
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
      {
        sectionName: "属性",
        children: [
          {
            propertyName: "alignment",
            helpText: "设置组件对齐方式",
            label: "对齐",
            controlType: "ICON_TABS",
            fullWidth: true,
            isBindProperty: true,
            isTriggerProperty: false,
            options: [
              {
                label: "左对齐",
                value: Alignment.LEFT,
              },
              {
                label: "右对齐",
                value: Alignment.RIGHT,
              },
            ],
          },
        ],
      },
      {
        sectionName: "颜色配置",
        children: [
          {
            propertyName: "accentColor",
            helpText: "设置组件背景颜色",
            label: "强调色",
            controlType: "COLOR_PICKER",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
            validation: { type: ValidationTypes.TEXT },
          },
        ],
      },
    ];
  }

  static getStylesheetConfig(): Stylesheet {
    return {
      accentColor: "{{appsmith.theme.colors.primaryColor}}",
    };
  }

  static getAutocompleteDefinitions(): AutocompletionDefinitions {
    return {
      "!doc":
        "Switch group widget allows users to create many switch components which can easily by used in a form",
      "!url": "https://docs.appsmith.com/widget-reference/switch-group",
      selectedValues: "[string]",
    };
  }

  static getDefaultPropertiesMap(): Record<string, string> {
    return {
      selectedValuesArray: "defaultSelectedValues",
    };
  }

  static getMetaPropertiesMap(): Record<string, any> {
    return {
      selectedValuesArray: undefined,
      isDirty: false,
    };
  }

  static getDerivedPropertiesMap(): DerivedPropertiesMap {
    return {
      isValid: `{{ this.isRequired ? !!this.selectedValues.length : true }}`,
      selectedValues: `{{
        this.selectedValuesArray.filter(
          selectedValue => this.options.map(option => option.value).includes(selectedValue)
        )
      }}`,
      value: `{{this.selectedValues}}`,
    };
  }

  static getWidgetType(): string {
    return "SWITCH_GROUP_WIDGET";
  }

  componentDidUpdate(prevProps: SwitchGroupWidgetProps): void {
    if (
      xor(this.props.defaultSelectedValues, prevProps.defaultSelectedValues)
        .length > 0
    ) {
      if (this.props.isDirty) {
        this.props.updateWidgetMetaProperty("isDirty", false);
      }

      this.props.updateWidgetMetaProperty(
        "selectedValuesArray",
        this.props.defaultSelectedValues,
      );
    }
  }

  getPageView() {
    const {
      accentColor,
      alignment,
      bottomRow,
      isDisabled,
      isInline,
      isRequired,
      isValid,
      labelAlignment,
      labelPosition,
      labelStyle,
      labelText,
      labelTextColor,
      labelTextSize,
      labelTooltip,
      options,
      selectedValues,
      topRow,
      widgetId,
    } = this.props;

    const { componentHeight } = this.getComponentDimensions();

    // TODO(abhinav): Not sure why we have to do this.
    // Check with the App Viewers Pod
    let _options = options;
    if (isString(options)) {
      try {
        _options = JSON.parse(options as string);
      } catch (e) {}
    }

    return (
      <SwitchGroupComponent
        accentColor={accentColor}
        alignment={alignment}
        compactMode={!((bottomRow - topRow) / GRID_DENSITY_MIGRATION_V1 > 1)}
        disabled={isDisabled}
        height={componentHeight}
        inline={isInline}
        isDynamicHeightEnabled={isAutoHeightEnabledForWidget(this.props)}
        labelAlignment={labelAlignment}
        labelPosition={labelPosition}
        labelStyle={labelStyle}
        labelText={labelText}
        labelTextColor={labelTextColor}
        labelTextSize={labelTextSize}
        labelTooltip={labelTooltip}
        labelWidth={this.getLabelWidth()}
        onChange={this.handleSwitchStateChange}
        options={_options}
        required={isRequired}
        selected={selectedValues}
        valid={isValid}
        widgetId={widgetId}
      />
    );
  }

  private handleSwitchStateChange = (value: string) => {
    return (event: React.FormEvent<HTMLElement>) => {
      let { selectedValuesArray } = this.props;
      const isChecked = (event.target as HTMLInputElement).checked;
      if (isChecked) {
        selectedValuesArray = [...selectedValuesArray, value];
      } else {
        selectedValuesArray = selectedValuesArray.filter(
          (item: string) => item !== value,
        );
      }

      if (!this.props.isDirty) {
        this.props.updateWidgetMetaProperty("isDirty", true);
      }

      this.props.updateWidgetMetaProperty(
        "selectedValuesArray",
        selectedValuesArray,
        {
          triggerPropertyName: "onSelectionChange",
          dynamicString: this.props.onSelectionChange,
          event: {
            type: EventType.ON_SWITCH_GROUP_SELECTION_CHANGE,
          },
        },
      );
    };
  };
}

export interface SwitchGroupWidgetProps extends WidgetProps {
  options: OptionProps[];
  defaultSelectedValues: string[];
  selectedValuesArray: string[];
  isInline: boolean;
  isRequired: boolean;
  isValid: boolean;
  isDisabled: boolean;
  alignment: Alignment;
  labelText?: string;
  labelPosition?: LabelPosition;
  labelAlignment?: Alignment;
  labelWidth?: number;
  labelTextColor?: string;
  labelTextSize?: TextSize;
  labelStyle?: string;
  onSelectionChange?: string;
  accentColor: string;
}

export default SwitchGroupWidget;
