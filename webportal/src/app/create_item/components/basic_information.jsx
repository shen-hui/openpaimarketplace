// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DefaultButton,
  Dropdown,
  PrimaryButton,
  Stack,
  TextField,
  FontSizes,
  FontWeights,
} from 'office-ui-fabric-react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { TYPE_ENUM } from 'App/utils/constants';

const BasicInformationArea = styled.div`
  margin-bottom: 50px;
  margin-left: 100px;
  margin-right: 100px;
`;

const BasicInformation = props => {
  const { user, itemObject, setItemObject, setStep } = props;
  const [errorMessage, setErrorMessage] = useState(false);
  const [, updateState] = useState();
  const forceUpdate = () => updateState({});

  const columnProps = {
    tokens: { childrenGap: 'm' },
    styles: {
      root: {
        minWidth: 300,
        fontSize: FontSizes.mediumPlus,
        fontWeight: FontWeights.semibold,
      },
    },
  };

  const textStyles = {
    fieldGroup: { borderRadius: '5px' },
    subComponentStyles: {
      label: {
        root: {
          fontSize: FontSizes.mediumPlus,
          fontWeight: FontWeights.semibold,
        },
      },
    },
  };

  const dropdownStyles = {
    title: { borderRadius: '5px' },
    subComponentStyles: {
      label: {
        root: {
          fontSize: FontSizes.mediumPlus,
          fontWeight: FontWeights.semibold,
        },
      },
    },
  };

  return (
    <BasicInformationArea>
      <Stack {...columnProps}>
        <TextField
          label='标题'
          required
          value={itemObject.name}
          onChange={(event, newValue) => {
            itemObject.name = newValue;
            setItemObject(itemObject);
            forceUpdate();
          }}
          errorMessage={
            errorMessage && isEmpty(itemObject.name)
              ? 'Please enter name here.'
              : undefined
          }
          styles={textStyles}
        />
        <TextField
          label='作者'
          readOnly={true}
          value={user}
          styles={textStyles}
        />
        <Dropdown
          label='类型'
          required={true}
          placeholder='请选择类型'
          options={[{ key: TYPE_ENUM.JOB_TEMPLATE, text: '任务模板' }]}
          onChange={(event, item) => {
            itemObject.type = item.key;
            setItemObject(itemObject);
            forceUpdate();
          }}
          containerBorderRadius='5px'
          styles={dropdownStyles}
          errorMessage={
            errorMessage && isEmpty(itemObject.type)
              ? '请选择类型.'
              : undefined
          }
        />
        <TextField
          label='小结'
          required
          value={itemObject.summary}
          onChange={(event, newValue) => {
            itemObject.summary = newValue;
            setItemObject(itemObject);
            forceUpdate();
          }}
          errorMessage={
            errorMessage && isEmpty(itemObject.summary)
              ? '请输入小结.'
              : undefined
          }
          styles={textStyles}
        />
        <TextField
          label='描述'
          required
          multiline={true}
          rows={9}
          value={itemObject.description}
          onChange={(event, newValue) => {
            itemObject.description = newValue;
            setItemObject(itemObject);
            forceUpdate();
          }}
          errorMessage={
            errorMessage && isEmpty(itemObject.description)
              ? '请输入描述.'
              : undefined
          }
          styles={textStyles}
        />
      </Stack>
      <Stack
        horizontal
        horizontalAlign='end'
        gap='l1'
        styles={{
          root: {
            marginTop: '10px',
          },
        }}
      >
        <DefaultButton
          text='返回'
          onClick={() => {
            setErrorMessage(false);
            setStep('uploadFiles');
          }}
        />
        <PrimaryButton
          text='下一步'
          onClick={() => {
            if (
              isEmpty(itemObject.name) ||
              isEmpty(itemObject.type) ||
              isEmpty(itemObject.summary) ||
              isEmpty(itemObject.description)
            ) {
              setErrorMessage(true);
              alert('请输入所有必填字段.');
            } else {
              setErrorMessage(false);
              setStep('detail');
            }
          }}
        />
      </Stack>
    </BasicInformationArea>
  );
};

BasicInformation.propTypes = {
  user: PropTypes.string,
  itemObject: PropTypes.object,
  setItemObject: PropTypes.func,
  setStep: PropTypes.func,
};

export default BasicInformation;
