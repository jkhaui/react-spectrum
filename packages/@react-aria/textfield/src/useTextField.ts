/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {AriaTextFieldProps} from '@react-types/textfield';
import {
  ChangeEvent,
  InputHTMLAttributes,
  LabelHTMLAttributes,
  RefObject,
  TextareaHTMLAttributes
} from 'react';
import {ElementType} from 'react';
import {filterDOMProps, mergeProps} from '@react-aria/utils';
import {useFocusable} from '@react-aria/focus';
import {useLabel} from '@react-aria/label';

interface TextFieldAria<T> {
  /** Props for the input element. */
  inputProps: T,
  /** Props for the text field's visible label element (if any). */
  labelProps: LabelHTMLAttributes<HTMLLabelElement>
}

interface AriaTextFieldOptions<T> extends AriaTextFieldProps {
  /**
   * The HTML element used to render the input, e.g. 'input', or 'textarea'.
   * It determines whether certain HTML attributes will be included in `inputProps`.
   * For example, [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-type).
   * @default 'input'
   */
  inputElementType?: T
}

function useTextField(props: AriaTextFieldOptions<'input'>, ref: RefObject<HTMLInputElement>): TextFieldAria<InputHTMLAttributes<HTMLInputElement>>;
/* eslint-disable no-redeclare */
function useTextField(props: AriaTextFieldOptions<'textarea'>, ref: RefObject<HTMLTextAreaElement>): TextFieldAria<TextareaHTMLAttributes<HTMLTextAreaElement>>;
/**
 * Provides the behavior and accessibility implementation for a text field.
 * @param props - Props for the text field.
 * @param ref - Ref to the HTML input or textarea element.
 */
function useTextField(
  props: AriaTextFieldOptions<ElementType>,
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement>
): TextFieldAria<InputHTMLAttributes<HTMLInputElement> | TextareaHTMLAttributes<HTMLTextAreaElement>> {
  /* eslint-enable no-redeclare */
  let {
    inputElementType = 'input',
    isDisabled = false,
    isRequired = false,
    isReadOnly = false,
    validationState,
    type = 'text',
    onChange = () => {}
  } = props;
  let {focusableProps} = useFocusable(props, ref);
  let {labelProps, fieldProps} = useLabel(props);
  let domProps = filterDOMProps(props, {labelable: true});

  const inputOnlyProps = {
    type,
    pattern: props.pattern
  };

  return {
    labelProps,
    inputProps: mergeProps(
      domProps,
      inputElementType === 'input' && inputOnlyProps,
      {
        disabled: isDisabled,
        readOnly: isReadOnly,
        'aria-required': isRequired || undefined,
        'aria-invalid': validationState === 'invalid' || undefined,
        'aria-errormessage': props['aria-errormessage'],
        'aria-activedescendant': props['aria-activedescendant'],
        'aria-autocomplete': props['aria-autocomplete'],
        'aria-haspopup': props['aria-haspopup'],
        value: props.value,
        defaultValue: props.value ? undefined : props.defaultValue,
        onChange: (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
        autoComplete: props.autoComplete,
        maxLength: props.maxLength,
        minLength: props.minLength,
        name: props.name,
        placeholder: props.placeholder,
        inputMode: props.inputMode,

        rows: props.rows,
        cols: props.cols,

        // Clipboard events
        onCopy: props.onCopy,
        onCut: props.onCut,
        onPaste: props.onPaste,

        // Composition events
        onCompositionEnd: props.onCompositionEnd,
        onCompositionStart: props.onCompositionStart,
        onCompositionUpdate: props.onCompositionUpdate,

        // Selection events
        onSelect: props.onSelect,

        // Input events
        onBeforeInput: props.onBeforeInput,
        onInput: props.onInput,
        ...focusableProps,
        ...fieldProps
      }
    )
  };
}

export {useTextField};
