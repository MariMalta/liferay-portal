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

import ClayButton from '@clayui/button';
import ClayForm from '@clayui/form';
import ClayTabs from '@clayui/tabs';

import 'codemirror/addon/display/autorefresh';

import 'codemirror/addon/edit/closebrackets';

import 'codemirror/addon/edit/closetag';

import 'codemirror/addon/edit/matchbrackets';

import 'codemirror/addon/fold/brace-fold';

import 'codemirror/addon/fold/comment-fold';

import 'codemirror/addon/fold/foldcode';

import 'codemirror/addon/fold/foldgutter.css';

import 'codemirror/addon/fold/foldgutter';

import 'codemirror/addon/fold/indent-fold';

import 'codemirror/addon/fold/xml-fold';

import 'codemirror/addon/hint/show-hint.css';

import 'codemirror/addon/hint/show-hint';

import 'codemirror/addon/hint/xml-hint';

import 'codemirror/lib/codemirror.css';

import 'codemirror/mode/htmlmixed/htmlmixed';

// @ts-ignore

import CodeMirror from 'codemirror';
import React, {useEffect, useState} from 'react';

import InputLocalized from './Form/InputLocalized/InputLocalized';
import Select from './Form/Select';

import './EditObjectField.scss';
import ObjectValidationFormBase from './ObjectValidationFormBase';
import SidePanelContent from './SidePanelContent';

const TABS = [
	{
		Component: BasicInfo,
		label: Liferay.Language.get('basic-info'),
	},
	{
		Component: Conditions,
		label: Liferay.Language.get('conditions'),
	},
];

const defaultLanguageId = Liferay.ThemeDisplay.getDefaultLanguageId() as Locale;
const defaultSymbol = defaultLanguageId.replace('_', '-').toLocaleLowerCase();
const locales: {label: string; symbol: string}[] = [];
const languageLabels: string[] = [];
const languages = Liferay.Language.available as LocalizedValue<string>;

Object.entries(languages).forEach(([languageId, label]) => {
	locales.push({
		label: languageId,
		symbol: languageId.replace('_', '-').toLocaleLowerCase(),
	});

	languageLabels.push(label);
});

const defaultLocale = locales.find(({symbol}) => symbol === defaultSymbol);

function closeSidePanel() {
	const parentWindow = Liferay.Util.getOpener();
	parentWindow.Liferay.fire('close-side-panel');
}

function BasicInfo() {
	const [activeValidation, setActiveValidation] = useState<boolean>(false);
	const [values, setValues] = useState({label: {}});

	const [locale, setSelectedLocale] = useState(
		defaultLocale as {
			label: string;
			symbol: string;
		}
	);

	return (
		<ClayForm className="lfr-objects__edit-object-field">
			<div className="sheet">
				<h2 className="sheet-title">
					{Liferay.Language.get('basic-info')}
				</h2>

				<InputLocalized
					label={Liferay.Language.get('label')}
					locales={locales}
					onSelectedLocaleChange={setSelectedLocale}
					onTranslationsChange={(label) => setValues({label})}
					required
					selectedLocale={locale}
					translations={values.label as LocalizedValue<string>}
				/>

				<ObjectValidationFormBase
					activeValidation={activeValidation}
					objectValidationTypes={[
						{
							label: 'Groovy',
						},
					]}
					setActiveValidation={setActiveValidation}
				/>
			</div>

			<TriggerEventContainer
				eventTypes={[Liferay.Language.get('on-submission')]}
			/>
		</ClayForm>
	);
}

function Conditions({content}: IConditions) {
	const defaultContent = `<#-- Insert a Groovy Script to define your validation. -->`;

	const [values, setValues] = useState({message: {}});

	const [locale, setSelectedLocale] = useState(
		defaultLocale as {
			label: string;
			symbol: string;
		}
	);

	return (
		<ClayForm className="lfr-objects__groovy-field">
			<div className="sheet">
				<h2 className="sheet-title">
					{Liferay.Language.get('groovy')}
				</h2>

				<Editor content={content || defaultContent} />
			</div>

			<div className="mt-4 sheet">
				<h2 className="sheet-title">
					{Liferay.Language.get('error-message')}
				</h2>

				<InputLocalized
					label={Liferay.Language.get('message')}
					locales={locales}
					onSelectedLocaleChange={setSelectedLocale}
					onTranslationsChange={(message) => setValues({message})}
					required
					selectedLocale={locale}
					translations={values.message as LocalizedValue<string>}
				/>
			</div>
		</ClayForm>
	);
}

function Editor({content}: EditorProps) {
	const [editor, setEditor] = useState<any>();
	const [editorWrapper, setEditorWrapper] = useState<any>();
	const [script, setScript] = useState(content);

	useEffect(() => {
		setEditor(
			CodeMirror(editorWrapper, {
				autoCloseTags: true,
				autoRefresh: true,
				foldGutter: true,
				gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
				indentWithTabs: true,
				inputStyle: 'contenteditable',
				lineNumbers: true,
				matchBrackets: true,
				showHint: true,
				tabSize: 2,
				theme: 'blackboard',
				viewportMargin: Infinity,
			})
		);
	}, [editorWrapper]);

	useEffect(() => {
		if (!editor) {
			return;
		}

		const handleChange = () => {
			setScript(editor.getValue());
		};

		editor.on('change', handleChange);

		return () => {
			editor.off('change', handleChange);
		};
	}, [editor, setScript]);

	useEffect(() => {
		if (editor && editor.getValue() !== content) {
			editor.setValue(content);
		}
	}, [content, editor]);

	return (
		<div
			className="lfr-objects__editor__CodeMirrorEditor"
			ref={setEditorWrapper}
		/>
	);
}

interface EditorProps {
	content: string;
}

export default function EditObjectField({script}: any) {
	const [activeIndex, setActiveIndex] = useState<number>(0);

	return (
		<>
			<ClayTabs className="side-panel-iframe__tabs">
				{TABS.map(({label}, index) => (
					<ClayTabs.Item
						active={activeIndex === index}
						key={index}
						onClick={() => setActiveIndex(index)}
					>
						{label}
					</ClayTabs.Item>
				))}
			</ClayTabs>

			<SidePanelContent className="side-panel-content--layout">
				<SidePanelContent.Body>
					<ClayTabs.Content activeIndex={activeIndex} fade>
						{TABS.map(({Component}, index) => (
							<ClayTabs.TabPane key={index}>
								<Component content={script} />
							</ClayTabs.TabPane>
						))}
					</ClayTabs.Content>
				</SidePanelContent.Body>

				<SidePanelContent.Footer>
					<ClayButton.Group spaced>
						<ClayButton
							displayType="secondary"
							onClick={closeSidePanel}
						>
							{Liferay.Language.get('cancel')}
						</ClayButton>

						<ClayButton>{Liferay.Language.get('save')}</ClayButton>
					</ClayButton.Group>
				</SidePanelContent.Footer>
			</SidePanelContent>
		</>
	);
}

function TriggerEventContainer({eventTypes}: ITriggerEventProps) {
	return (
		<div className="mt-4 sheet">
			<h2 className="sheet-title">
				{Liferay.Language.get('trigger-event')}
			</h2>

			<Select
				label={Liferay.Language.get('event')}
				options={eventTypes}
			/>
		</div>
	);
}

interface ITriggerEventProps {
	eventTypes: string[];
}

interface IConditions {
	content: string;
}
