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

import React from 'react';

import {CollapsableButtonList} from './CollapsableButtonList';

import '../Editor.scss';

export function ElementsSidebarPanel({
	inputChannel,
	objectValidationRuleElements,
}: IElementsSidebarPanel) {
	const onButtonClick = (item: ObjectValidationRuleElementItem) => inputChannel.sendData(item.content);

	return (
		<div className="px-3">
			<h5 className="my-3">{Liferay.Language.get('elements')}</h5>

			{objectValidationRuleElements.map(({items, label}) => (
				<CollapsableButtonList
					items={items}
					key={label}
					label={label}
					onButtonClick={onButtonClick}
				/>
			))}
		</div>
	);
}

interface ObjectValidationRuleElement {
	items: ObjectValidationRuleElementItem[];
	label: string;
}

interface ObjectValidationRuleElementItem {
	content: string;
	label: string;
	tooltip: string;
}

interface IElementsSidebarPanel {
	className?: string;
	inputChannel: inputChannelObject;
	objectValidationRuleElements: ObjectValidationRuleElement[];
}

interface inputChannelObject {
	sendData: Function;
}
