import { displayOrder, transforms, Transforms } from "@nteract/transforms";
import { Map as ImmutableMap } from "immutable";
import * as React from "react";

import Output from "./output";

interface Props {
  displayOrder: string[];
  outputs: any[];
  transforms: Transforms;
  theme: string;
  expanded: boolean;
  isHidden: boolean;
  models: Object;
}

export const DEFAULT_SCROLL_HEIGHT = 600;

export default class Display extends React.PureComponent<Props> {
  static defaultProps = {
    transforms,
    displayOrder,
    isHidden: false,
    expanded: false,
    theme: "light",
    models: ImmutableMap()
  };

  render() {
    const { isHidden, outputs, ...props } = this.props;

    if (!isHidden) {
      return (
        <div
          className="cell_display"
          style={{
            maxHeight: props.expanded ? "100%" : `${DEFAULT_SCROLL_HEIGHT}px`,
            overflowY: "auto"
          }}
        >
          {outputs
            ? outputs.map((output, index) => (
                <Output key={index} index={index} output={output} {...props} />
              ))
            : null}
        </div>
      );
    }
    return null;
  }
}
