// @flow
import * as React from "react";
import Menu, { SubMenu, Divider, MenuItem } from "rc-menu";
import { localCss } from "./styles";
import { connect } from "react-redux";
import * as Immutable from "immutable";
import * as actions from "../../actions";
import { MENU_ITEM_ACTIONS, MENUS } from "./constants";
import * as extraHandlers from "./extra-handlers";
import { MODAL_TYPES } from "../modal-controller";

// To allow actions that can take dynamic arguments (like selecting a kernel
// based on the host's kernelspecs), we have some simple utility functions to
// stringify/parse actions/arguments.
const createActionKey = (action, ...args) => [action, ...args].join(":");
const parseActionKey = key => key.split(":");

type Props = {
  defaultOpenKeys?: Array<string>,
  openKeys?: Array<string>,
  cellFocused: ?string,
  cellMap: Immutable.Map<string, *>,
  cellOrder: Immutable.List<string>,
  saveNotebook: ?() => void,
  executeCell: ?(cellId: ?string) => void,
  cutCell: ?(cellId: ?string) => void,
  copyCell: ?(cellId: ?string) => void,
  mergeCellAfter: ?(cellId: ?string) => void,
  filename: ?string,
  notebook: Immutable.Map<string, *>,
  pasteCell: ?() => void,
  createCodeCell: ?(cellId: ?string) => void,
  createMarkdownCell: ?(cellId: ?string) => void,
  setCellTypeCode: ?(cellId: ?string) => void,
  setCellTypeMarkdown: ?(cellId: ?string) => void,
  setTheme: ?(theme: ?string) => void,
  openAboutModal: ?() => void,
  interruptKernel: ?() => void
};

class PureNotebookMenu extends React.Component<Props> {
  static defaultProps = {
    cellFocused: null,
    cellMap: Immutable.Map(),
    cellOrder: Immutable.List(),
    saveNotebook: null,
    executeCell: null,
    cutCell: null,
    copyCell: null,
    mergeCellAfter: null,
    notebook: null,
    pasteCell: null,
    createCodeCell: null,
    createMarkdownCell: null,
    setCellTypeCode: null,
    setCellTypeMarkdown: null,
    setTheme: null,
    openAboutModal: null,
    interruptKernel: null
  };
  handleClick = ({ key }: { key: string }) => {
    const {
      saveNotebook,
      cellFocused,
      cellMap,
      cellOrder,
      copyCell,
      createCodeCell,
      createMarkdownCell,
      cutCell,
      executeCell,
      filename,
      mergeCellAfter,
      notebook,
      openAboutModal,
      pasteCell,
      setCellTypeCode,
      setCellTypeMarkdown,
      setTheme,
      interruptKernel
    } = this.props;
    const [action, ...args] = parseActionKey(key);
    switch (action) {
      case MENU_ITEM_ACTIONS.SAVE_NOTEBOOK:
        if (saveNotebook) {
          saveNotebook();
        }
        break;
      case MENU_ITEM_ACTIONS.DOWNLOAD_NOTEBOOK:
        // This gets us around a Flow fail on document.body.
        const body = document.body;
        if (body) {
          extraHandlers.downloadNotebook(notebook, filename);
        }
        break;
      case MENU_ITEM_ACTIONS.COPY_CELL:
        if (copyCell) {
          copyCell(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.CUT_CELL:
        if (cutCell) {
          cutCell(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.PASTE_CELL:
        if (pasteCell) {
          pasteCell();
        }
        break;
      case MENU_ITEM_ACTIONS.MERGE_CELL_AFTER:
        if (mergeCellAfter) {
          mergeCellAfter(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.CREATE_CODE_CELL:
        if (createCodeCell) {
          createCodeCell(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.CREATE_MARKDOWN_CELL:
        if (createMarkdownCell) {
          createMarkdownCell(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.SET_CELL_TYPE_CODE:
        if (setCellTypeCode) {
          setCellTypeCode(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.SET_CELL_TYPE_MARKDOWN:
        if (setCellTypeMarkdown) {
          setCellTypeMarkdown(cellFocused);
        }
        break;
      case MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS:
        extraHandlers.executeAllCells(executeCell, cellMap, cellOrder);
        break;
      case MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS_BELOW:
        extraHandlers.executeAllCellsBelow(
          executeCell,
          cellMap,
          cellOrder,
          cellFocused
        );
        break;
      case MENU_ITEM_ACTIONS.SET_THEME_DARK:
        if (setTheme) {
          setTheme("dark");
        }
        break;
      case MENU_ITEM_ACTIONS.SET_THEME_LIGHT:
        if (setTheme) {
          setTheme("light");
        }
        break;
      case MENU_ITEM_ACTIONS.OPEN_ABOUT:
        if (openAboutModal) {
          openAboutModal();
        }
        break;
      case MENU_ITEM_ACTIONS.INTERRUPT_KERNEL:
        if (interruptKernel) {
          interruptKernel();
        }
        break;

      default:
        console.log(`unhandled action: ${action}`);
    }
  };
  render() {
    const { defaultOpenKeys } = this.props;
    return (
      <div>
        <Menu
          mode="horizontal"
          onClick={this.handleClick}
          defaultOpenKeys={defaultOpenKeys}
          selectable={false}
        >
          <SubMenu key={MENUS.FILE} title="File">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.SAVE_NOTEBOOK)}>
              Save
            </MenuItem>
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.DOWNLOAD_NOTEBOOK)}
            >
              Download (.ipynb)
            </MenuItem>
          </SubMenu>
          <SubMenu key={MENUS.EDIT} title="Edit">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.CUT_CELL)}>
              Cut Cell
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.COPY_CELL)}>
              Copy Cell
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.PASTE_CELL)}>
              Paste Cell Below
            </MenuItem>
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.MERGE_CELL_AFTER)}>
              Merge With Cell Below
            </MenuItem>
            <Divider />
            <SubMenu key={MENUS.EDIT_SET_CELL_TYPE} title="Cell Type">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_CELL_TYPE_CODE)}
              >
                Code
              </MenuItem>
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_CELL_TYPE_MARKDOWN)}
              >
                Markdown
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key={MENUS.CELL} title="Cell">
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS)}
            >
              Run All Cells
            </MenuItem>
            <MenuItem
              key={createActionKey(MENU_ITEM_ACTIONS.EXECUTE_ALL_CELLS_BELOW)}
            >
              Run All Cells Below
            </MenuItem>
            <Divider />
            <SubMenu key={MENUS.CELL_CREATE_CELL} title="New Cell">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.CREATE_CODE_CELL)}
              >
                Code
              </MenuItem>
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.CREATE_MARKDOWN_CELL)}
              >
                Markdown
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key={MENUS.VIEW} title="View">
            <SubMenu key={MENUS.VIEW_THEMES} title="themes">
              <MenuItem
                key={createActionKey(MENU_ITEM_ACTIONS.SET_THEME_LIGHT)}
              >
                light
              </MenuItem>
              <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.SET_THEME_DARK)}>
                dark
              </MenuItem>
            </SubMenu>
          </SubMenu>
          <SubMenu key={MENUS.HELP} title="Help">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.OPEN_ABOUT)}>
              About
            </MenuItem>
          </SubMenu>

          <SubMenu key={MENUS.RUNTIME} title="Runtime">
            <MenuItem key={createActionKey(MENU_ITEM_ACTIONS.INTERRUPT_KERNEL)}>
              Interrupt
            </MenuItem>
          </SubMenu>
        </Menu>
        <style global jsx>
          {localCss}
        </style>
        <style jsx>{`
          position: sticky;
          top: 0;
          // TODO: this is getting ridiculous...
          z-index: 10000;
        `}</style>
      </div>
    );
  }
}

// TODO: this forces the menu to re-render on cell focus. The better option is
// to alter how the actions work to just target the currently focused cell.
// That said, we *may* not have a great way of getting around this as we'll need
// information about the current document to decide which menu items are
// available...
const mapStateToProps = state => ({
  cellFocused: state.document.cellFocused,
  cellMap: state.document.getIn(["notebook", "cellMap"]),
  cellOrder: state.document.getIn(["notebook", "cellOrder"]),
  filename: state.document.get("filename"),
  notebook: state.document.get("notebook")
});

const mapDispatchToProps = dispatch => ({
  saveNotebook: () => dispatch(actions.save()),
  executeCell: cellId => dispatch(actions.executeCell(cellId)),
  cutCell: cellId => dispatch(actions.cutCell(cellId)),
  copyCell: cellId => dispatch(actions.copyCell(cellId)),
  pasteCell: () => dispatch(actions.pasteCell()),
  mergeCellAfter: cellId => dispatch(actions.mergeCellAfter(cellId)),
  createCodeCell: cellId => dispatch(actions.createCellAfter("code", cellId)),
  createMarkdownCell: cellId =>
    dispatch(actions.createCellAfter("markdown", cellId)),
  setCellTypeCode: cellId => dispatch(actions.changeCellType(cellId, "code")),
  setCellTypeMarkdown: cellId =>
    dispatch(actions.changeCellType(cellId, "markdown")),
  setTheme: theme => dispatch(actions.setTheme(theme)),
  openAboutModal: () =>
    dispatch(actions.openModal({ modalType: MODAL_TYPES.ABOUT })),
  interruptKernel: () => dispatch(actions.interruptKernel())
});

const NotebookMenu = connect(mapStateToProps, mapDispatchToProps)(
  PureNotebookMenu
);

// We export this for testing purposes.
export { PureNotebookMenu };

export default NotebookMenu;
