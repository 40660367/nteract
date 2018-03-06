// @flow
/* eslint jsx-a11y/no-static-element-interactions: 0 */
/* eslint jsx-a11y/click-events-have-key-events: 0 */
/* eslint jsx-a11y/anchor-is-valid: 0 */

// TODO: Fix up a11y eslint here
// TODO: All the `<li>` below that have role button should just be `<button>` with proper styling

import * as React from "react";

import { connect } from "react-redux";
import * as actions from "../actions";

import {
  DropdownMenu,
  DropdownTrigger,
  DropdownContent
} from "@nteract/dropdown-menu";

import {
  PinOcticon,
  TrashOcticon,
  ChevronDownOcticon,
  TriangleRightOcticon
} from "@nteract/octicons";

export type PureToolbarProps = {|
  type: "markdown" | "code" | "raw",
  executeCell: () => void,
  removeCell: () => void,
  toggleStickyCell: () => void,
  clearOutputs: () => void,
  toggleCellInputVisibility: () => void,
  toggleCellOutputVisibility: () => void,
  toggleOutputExpansion: () => void,
  changeCellType: () => void
|};

export class PureToolbar extends React.Component<PureToolbarProps> {
  clearOutputs: () => void;
  toggleCellInputVisibility: () => void;
  toggleCellOutputVisibility: () => void;
  changeCellType: () => void;
  toggleOutputExpansion: () => void;
  dropdown: any;

  static defaultProps = {
    type: "code"
  };

  constructor(props: PureToolbarProps) {
    super(props);
    this.clearOutputs = this.clearOutputs.bind(this);
    this.toggleCellInputVisibility = this.toggleCellInputVisibility.bind(this);
    this.toggleCellOutputVisibility = this.toggleCellOutputVisibility.bind(
      this
    );
    this.toggleOutputExpansion = this.toggleOutputExpansion.bind(this);
    this.changeCellType = this.changeCellType.bind(this);
  }

  clearOutputs(): void {
    this.props.clearOutputs();
  }

  toggleCellOutputVisibility(): void {
    this.props.toggleCellOutputVisibility();
  }

  toggleCellInputVisibility(): void {
    this.props.toggleCellInputVisibility();
  }

  toggleOutputExpansion(): void {
    this.props.toggleOutputExpansion();
  }

  changeCellType(): void {
    this.props.changeCellType();
  }
  render(): React$Element<any> {
    const { type, executeCell, removeCell, toggleStickyCell } = this.props;

    return (
      <div className="cell-toolbar-mask">
        <div className="cell-toolbar">
          {type !== "markdown" && (
            <button
              onClick={executeCell}
              title="execute cell"
              className="executeButton"
            >
              <span className="octicon">
                <TriangleRightOcticon />
              </span>
            </button>
          )}
          <button
            onClick={toggleStickyCell}
            title="pin cell"
            className="stickyButton"
          >
            <span className="octicon">
              <PinOcticon />
            </span>
          </button>
          <button
            onClick={removeCell}
            title="delete cell"
            className="deleteButton"
          >
            <span className="octicon">
              <TrashOcticon />
            </span>
          </button>
          <DropdownMenu>
            <DropdownTrigger>
              <button title="show additional actions">
                <span className="octicon toggle-menu">
                  <ChevronDownOcticon />
                </span>
              </button>
            </DropdownTrigger>
            {type === "code" ? (
              <DropdownContent>
                <li
                  onClick={() => this.clearOutputs()}
                  className="clearOutput"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Clear Cell Output</a>
                </li>
                <li
                  onClick={() => this.toggleCellInputVisibility()}
                  className="inputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Toggle Input Visibility</a>
                </li>
                <li
                  onClick={() => this.toggleCellOutputVisibility()}
                  className="outputVisibility"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Toggle Output Visibility</a>
                </li>
                <li
                  onClick={() => this.toggleOutputExpansion()}
                  className="outputExpanded"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Toggle Expanded Output</a>
                </li>
                <li
                  onClick={() => this.changeCellType()}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Convert to Markdown Cell</a>
                </li>
              </DropdownContent>
            ) : (
              <DropdownContent>
                <li
                  onClick={() => this.changeCellType()}
                  className="changeType"
                  role="option"
                  aria-selected="false"
                  tabIndex="0"
                >
                  <a>Convert to Code Cell</a>
                </li>
              </DropdownContent>
            )}
          </DropdownMenu>
        </div>

        <style jsx>{`
          .cell-toolbar > div {
            display: inline-block;
          }

          .cell-toolbar {
            background-color: var(--theme-cell-toolbar-bg);
            opacity: 0.4;
            transition: opacity 0.4s;
          }

          .cell-toolbar:hover {
            opacity: 1;
          }

          .cell-toolbar button {
            display: inline-block;

            width: 22px;
            height: 20px;
            padding: 0px 4px;

            text-align: center;

            border: none;
            outline: none;
            background: none;
          }

          .cell-toolbar button span {
            font-size: 15px;
            line-height: 1;
            color: var(--theme-cell-toolbar-fg);
          }

          .cell-toolbar button span:hover {
            color: var(--theme-cell-toolbar-fg-hover);
          }

          .cell-toolbar-mask {
            display: none;
            position: absolute;
            top: 0px;
            right: 0px;
            z-index: 9999;
            height: 34px;

            /* Set the left padding to 50px to give users extra room to move their
              mouse to the toolbar without causing the cell to go out of focus and thus
              hide the toolbar before they get there. */
            padding: 0px 0px 0px 50px;
          }

          .octicon {
            transition: color 0.5s;
          }
        `}</style>
      </div>
    );
  }
}

type ConnectedProps = {
  id: string,
  type: "markdown" | "code" | "raw",
  executeCell: () => void,
  removeCell: () => void,
  toggleStickyCell: () => void,
  clearOutputs: () => void,
  toggleCellOutputVisibility: () => void,
  toggleCellInputVisibility: () => void,
  changeCellType: () => void,
  toggleOutputExpansion: () => void
};

const mapDispatchToProps = (dispatch, { id, type }) => ({
  // TODO: #2618
  toggleStickyCell: () => dispatch(actions.toggleStickyCell({ id })),
  // TODO: #2618
  removeCell: () => dispatch(actions.removeCell({ id })),
  executeCell: () => dispatch(actions.executeCell(id)),
  // TODO: #2618
  clearOutputs: () => dispatch(actions.clearOutputs({ id })),
  toggleCellInputVisibility: () =>
    dispatch(actions.toggleCellInputVisibility(id)),
  toggleCellOutputVisibility: () =>
    dispatch(actions.toggleCellOutputVisibility(id)),
  changeCellType: () =>
    dispatch(
      actions.changeCellType(id, type === "markdown" ? "code" : "markdown")
    ),
  toggleOutputExpansion: () => dispatch(actions.toggleOutputExpansion(id))
});

export default connect(null, mapDispatchToProps)(PureToolbar);
