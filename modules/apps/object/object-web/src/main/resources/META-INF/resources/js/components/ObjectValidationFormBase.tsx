/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayForm, {ClayInput, ClayToggle} from '@clayui/form';
import React, {ReactNode} from 'react';

import useForm, {FormError, invalidateRequired} from '../hooks/useForm';
import CustomSelect from './Form/CustomSelect/CustomSelect';

const REQUIRED_MSG = Liferay.Language.get('required');

const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId() as Liferay.Language.Locale;

export default function ObjectValidationFormBase({
	activeValidation,
	children,
	errors,
	objectValidationTypes,
	setActiveValidation,
}: IProps) {
	return (
		<>
			<CustomSelect<ObjectValidationType>
				disabled={true}
				error={errors.validationType}
				label={Liferay.Language.get('type')}
				options={objectValidationTypes}
				value="Groovy"
			/>

			<ClayForm.Group>
				<label htmlFor="description">
					{Liferay.Language.get('description')}
				</label>

				<ClayInput component="textarea" id="description" type="text" />
			</ClayForm.Group>

			{children}
			<ClayToggle
				label={Liferay.Language.get('active-validation')}
				name="required"
				onToggle={(active) => setActiveValidation(active)}
				toggled={activeValidation}
			/>
		</>
	);
}

export function useObjectValidationForm({
	initialValues,
	onSubmit,
}: IUseObjectValidationForm) {
	const validate = (validation: Partial<ObjectValidation>) => {
		const errors: ObjectValidationErrors = {};

		const label = validation.label?.[defaultLanguageId];

		if (invalidateRequired(label)) {
			errors.label = REQUIRED_MSG;
		}

		return errors;
	};

	const {errors, handleChange, handleSubmit, setValues, values} = useForm<
		ObjectValidation
	>({
		initialValues,
		onSubmit,
		validate,
	});

	return {errors, handleChange, handleSubmit, setValues, values};
}

interface IUseObjectValidationForm {
	initialValues: Partial<ObjectValidation>;
	onSubmit: (validation: ObjectValidation) => void;
}

interface IProps {
	activeValidation: boolean;
	children?: ReactNode;
	errors: ObjectValidationErrors;
	objectValidationTypes: ObjectValidationType[];
	setActiveValidation: (active: boolean) => void;
}

export type ObjectValidationErrors = FormError<ObjectValidation>;
