import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "旧版标签页",
  needsMeta: true,

  defaults: {
    isLoading: true,
    rows: 1,
    columns: 1,
    widgetName: "Skeleton",
    version: 1,
    animateLoading: false,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
};

export default Widget;
