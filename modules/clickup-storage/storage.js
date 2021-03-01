import { filter } from 'lodash';
import Quill from '../../core/quill';
import Module from '../../core/module';

import { ListItem } from '../clickup-table/formats';

export const THE_KEY_FOR_EXPANDED_TOGGLE_LIST = 'Quill_Expanded_Toggle_Lists';
const STORED_KEYS = [THE_KEY_FOR_EXPANDED_TOGGLE_LIST];

const fakeStorage = {
  [THE_KEY_FOR_EXPANDED_TOGGLE_LIST]: '[]',
  getItem(key) {
    return fakeStorage[key];
  },
  setItem(key, value) {
    fakeStorage[key] = value;
  },
  removeItem(key) {
    fakeStorage[key] = '';
  },
  clear() {
    STORED_KEYS.forEach(key => {
      fakeStorage[key] = '';
    });
  },
};

const isSupportLocalStorage = storage => {
  if (storage) {
    try {
      storage.setItem('cu_storage_test', 'test');
      storage.removeItem('cu_storage_test');
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

export default class QuillStorage extends Module {
  constructor(...args) {
    super(...args);
    this.enable = isSupportLocalStorage(window.localStorage);
    if (this.enable) {
      this.storageRef = window.localStorage;
    } else {
      this.storageRef = fakeStorage;
    }

    this.listenExpandToggleList();
  }

  getItem(key) {
    return JSON.parse(this.storageRef.getItem(key));
  }

  setItem(key, val) {
    this.storageRef.setItem(key, JSON.stringify(val));
  }

  addExpandedToggleList(listItemId) {
    const lists = this.getItem(THE_KEY_FOR_EXPANDED_TOGGLE_LIST) || [];
    lists.push({
      id: listItemId,
      time: new Date().getTime(),
    });
    this.setItem(THE_KEY_FOR_EXPANDED_TOGGLE_LIST, lists);
  }

  removeCollapsedToggleList(listItemId) {
    let lists = this.getItem(THE_KEY_FOR_EXPANDED_TOGGLE_LIST) || [];
    lists = filter(lists, item => item.id !== listItemId);
    this.setItem(THE_KEY_FOR_EXPANDED_TOGGLE_LIST, lists);
  }

  listenExpandToggleList() {
    this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
      const flag = mutations.some(mutation => {
        if (['OL', 'UL', 'LI'].includes(mutation.target.tagName)) {
          return true;
        }
        return false;
      });

      if (flag) {
        this.expandToggleListInStorage();
      }
    });
  }

  expandToggleListInStorage() {
    const storageModule = this.quill.getModule('storage');
    this.quill.scroll.descendants(ListItem).forEach(listItem => {
      if (storageModule) {
        const cachedToggleListItems = storageModule.getItem(
          THE_KEY_FOR_EXPANDED_TOGGLE_LIST,
        );
        const format = ListItem.formats(listItem.domNode);
        if (
          listItem.isToggleListItem() &&
          cachedToggleListItems &&
          cachedToggleListItems.length &&
          cachedToggleListItems.length > 0 &&
          cachedToggleListItems.some(item => item.id === format['toggle-id']) &&
          !listItem.isThisItemExpanded()
        ) {
          listItem.expandItem();
        }
      }
    });
    // setTimeout(() => {
    //   this.columnTool && this.columnTool.updateToolCells()
    //   this.columnTool && this.columnTool.activeDropdown && this.columnTool.activeDropdown.destroy()
    //   this.rowTool && this.rowTool.updateToolCells()
    // }, 0)
  }
}
