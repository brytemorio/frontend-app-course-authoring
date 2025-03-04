import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, Icon } from '@edx/paragon';
import { Check } from '@edx/paragon/icons';
import { isEmpty } from 'lodash';

const LanguageSelect = ({
  value,
  previousSelection,
  options,
  handleSelect,
  placeholderText,
}) => {
  const currentSelection = isEmpty(value) ? placeholderText : options[value];
  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="teritary"
        className="border border-gray-700 justify-content-between"
        style={{ minWidth: '100%' }}
        id={`language-select-dropdown-${currentSelection}`}
        data-testid="language-select-dropdown"
      >
        {currentSelection}
      </Dropdown.Toggle>
      <Dropdown.Menu className="m-0" style={{ height: '300px', overflowY: 'scroll' }}>
        {Object.entries(options).map(([valueKey, text]) => {
          if (valueKey === value) {
            return (
              <Dropdown.Item key={`${valueKey}-item`}>
                <Icon size="inline" src={Check} className="m-n2" /><span className="pl-3">{text}</span>
              </Dropdown.Item>
            );
          }
          if (!previousSelection.includes(valueKey)) {
            return (
              <Dropdown.Item onClick={() => handleSelect(valueKey)} key={`${valueKey}-item`}>
                <span className="pl-3">{text}</span>
              </Dropdown.Item>
            );
          }
          return (
            <Dropdown.Item disabled key={`${valueKey}-item`}>
              <span className="pl-3">{text}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

LanguageSelect.propTypes = {
  value: PropTypes.string.isRequired,
  options: PropTypes.shape({}).isRequired,
  handleSelect: PropTypes.func.isRequired,
  placeholderText: PropTypes.string.isRequired,
  previousSelection: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default LanguageSelect;
