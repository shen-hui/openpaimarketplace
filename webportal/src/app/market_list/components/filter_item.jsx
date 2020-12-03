// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { getTheme, Text, Icon } from 'office-ui-fabric-react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { isNil } from 'lodash';

const { spacing, palette } = getTheme();

const Wrapper = styled.div`
  padding: ${spacing.s1};
  color: ${props => props.selected && palette.white};
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.selected && palette.blue};
  cursor: pointer;
  ${props =>
    !props.selected &&
    css`
      &:hover {
        background-color: ${palette.neutralQuaternaryAlt};
        color: ${palette.blue};
      }
    `}
`;

const FilterItem = props => {
  const { text, selected, onChange } = props;

  return (
    <Wrapper
      selected={selected}
      onClick={
        isNil(onChange)
          ? null
          : () => {
              onChange(selected);
            }
      }
    >
      <Text>{text}</Text>
      {selected && <Icon iconName='Cancel' />}
    </Wrapper>
  );
};

FilterItem.propTypes = {
  text: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onChange: PropTypes.func,
};

export default FilterItem;
