import { ResponsiveBehavior } from "utils/autoLayout/constants";
import { BarType } from "./constants";
import IconSVG from "./icon.svg";
import Widget from "./widget";

export const CONFIG = {
  type: Widget.getWidgetType(),
  name: "进度条", // The display name which will be made in uppercase and show in the widgets panel ( can have spaces )
  hideCard: true,
  isDeprecated: true,
  replacement: "PROGRESS_WIDGET",
  iconSVG: IconSVG,
  needsMeta: false, // Defines if this widget adds any meta properties
  isCanvas: false, // Defines if this widget has a canvas within in which we can drop other widgets
  defaults: {
    widgetName: "ProgressBar",
    rows: 4,
    columns: 28,
    isVisible: true,
    showResult: false,
    barType: BarType.INDETERMINATE,
    progress: 50,
    steps: 1,
    version: 1,
    responsiveBehavior: ResponsiveBehavior.Fill,
  },
  properties: {
    derived: Widget.getDerivedPropertiesMap(),
    default: Widget.getDefaultPropertiesMap(),
    meta: Widget.getMetaPropertiesMap(),
    config: Widget.getPropertyPaneConfig(),
    stylesheetConfig: Widget.getStylesheetConfig(),
    autocompleteDefinitions: Widget.getAutocompleteDefinitions(),
  },
};

export default Widget;
