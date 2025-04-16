// types.js - Define the settings data structure

/**
 * @typedef {Object} SettingOption
 * @property {string} value - The option value
 * @property {string} label - The display label for the option
 */

/**
 * @typedef {Object} SettingField
 * @property {string} id - Unique identifier for the setting
 * @property {string} label - Display label
 * @property {string} [description] - Optional description text
 * @property {string} type - Field type (text, select, checkbox, toggle, etc.)
 * @property {SettingOption[]} [options] - Options for select fields
 * @property {any} defaultValue - Default value for the field
 * @property {boolean} [required] - Whether the field is required
 * @property {number} [min] - Minimum value for number fields
 * @property {number} [max] - Maximum value for number fields
 * @property {string} [placeholder] - Placeholder text
 */

/**
 * @typedef {Object} SettingGroup
 * @property {string} id - Unique identifier for the group
 * @property {string} title - Display title
 * @property {string} [description] - Optional description
 * @property {string} [icon] - Icon name from Lucide icons
 * @property {string} [color] - Color theme for the icon
 * @property {SettingField[]} fields - Fields in this group
 * @property {SettingField[][]} [columns] - Fields arranged in columns
 */

/**
 * @typedef {Object} SettingsConfig
 * @property {string} title - Page title
 * @property {string} [description] - Page description
 * @property {SettingGroup[]} groups - Setting groups
 */

export {};